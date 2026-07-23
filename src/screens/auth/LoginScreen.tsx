import { useState } from 'react';
import {
  Image,
  Pressable,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  deviceAccessFromAuthCode,
  loginWithApi,
  mapAuthErrorCode,
  requestDeviceRegistrationWithApi,
} from '../../api/services/auth.service';
import { getMobileDeviceId, MobileApiError } from '../../api/client';
import type { LoginCredentials } from '../../api/types/agent.types';
import {
  AppButton,
  AppCard,
  AppScreen,
  AppText,
  AppTextInput,
} from '../../components/ui';
import { FlowFooter } from '../../components/layout/FlowLayout';
import { useSession, useSessionActions } from '../../hooks/useSession';
import { useTranslation } from '../../hooks/useTranslation';
import {
  clearDeviceAccessStatus,
  setDeviceAccessStatus,
  type DeviceAccessStatus,
} from '../../store/session.store';
import { useFlowStyles } from '../../theme/useFlowStyles';
import { useTheme } from '../../theme/ThemeProvider';

const brandLogo = require('../../assets/brand/amo-id-sante-logo-horizontal.png');

interface LoginFormState {
  identifier: string;
  password: string;
}

interface LoginFormErrors {
  identifier?: string;
  password?: string;
}

function SecurityShield({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" accessibilityLabel="">
      <Path
        d="M12 3 20 7v6c0 4.4-3.2 7.8-8 9-4.8-1.2-8-4.6-8-9V7l8-4Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Path
        d="M9.5 12 11 13.5 14.5 10"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function DeviceAccessPanel({
  status,
  deviceId,
  onRequestRegistration,
  onShareId,
  requesting,
  requestSuccess,
}: {
  status: Exclude<DeviceAccessStatus, 'ok'>;
  deviceId: string;
  onRequestRegistration?: () => void;
  onShareId: () => void;
  requesting?: boolean;
  requestSuccess?: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useTheme();
  const tone =
    status === 'revoked'
      ? tokens.colors.danger
      : status === 'pending'
        ? tokens.colors.warning
        : tokens.colors.info;

  const titleKey =
    status === 'revoked'
      ? 'auth.deviceAccess.revokedTitle'
      : status === 'pending'
        ? 'auth.deviceAccess.pendingTitle'
        : 'auth.deviceAccess.unknownTitle';
  const bodyKey =
    status === 'revoked'
      ? 'auth.deviceAccess.revokedBody'
      : status === 'pending'
        ? 'auth.deviceAccess.pendingBody'
        : 'auth.deviceAccess.unknownBody';

  return (
    <View
      style={[
        styles.accessPanel,
        {
          backgroundColor: `${tone}14`,
          borderColor: `${tone}55`,
        },
      ]}
      accessibilityRole="alert">
      <AppText variant="title" color={tone}>
        {t(titleKey)}
      </AppText>
      <AppText variant="body" color={colors.textSecondary} style={styles.accessBody}>
        {t(bodyKey)}
      </AppText>
      <View style={styles.deviceIdRow}>
        <View style={{ flex: 1 }}>
          <AppText variant="caption" color={colors.textSecondary}>
            {t('auth.deviceAccess.deviceIdLabel')}
          </AppText>
          <AppText variant="body" style={styles.deviceIdValue}>
            {deviceId}
          </AppText>
        </View>
        <Pressable
          onPress={onShareId}
          accessibilityRole="button"
          accessibilityLabel={t('auth.deviceAccess.shareId')}>
          <AppText variant="caption" color={tokens.colors.info}>
            {t('auth.deviceAccess.shareId')}
          </AppText>
        </Pressable>
      </View>
      {requestSuccess ? (
        <AppText variant="caption" color={tokens.colors.success} style={styles.accessBody}>
          {t('auth.deviceAccess.requestSent')}
        </AppText>
      ) : null}
      {status === 'unknown' && onRequestRegistration ? (
        <AppButton
          label={
            requesting
              ? t('auth.deviceAccess.requesting')
              : t('auth.deviceAccess.requestCta')
          }
          loading={requesting}
          fullWidth
          onPress={onRequestRegistration}
          containerStyle={{ marginTop: tokens.spacing.md }}
        />
      ) : null}
      {status === 'pending' ? (
        <AppText variant="caption" color={colors.textSecondary} style={styles.accessBody}>
          {t('auth.deviceAccess.pendingHint')}
        </AppText>
      ) : null}
      {status === 'revoked' ? (
        <AppText variant="caption" color={colors.textSecondary} style={styles.accessBody}>
          {t('auth.deviceAccess.revokedHint')}
        </AppText>
      ) : null}
    </View>
  );
}

export function LoginScreen() {
  const { t } = useTranslation();
  const { login } = useSessionActions();
  const { deviceAccessStatus } = useSession();
  const { colors, tokens } = useTheme();
  const flow = useFlowStyles();

  const [form, setForm] = useState<LoginFormState>({
    identifier: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();
  const deviceId = getMobileDeviceId();
  const blocked =
    deviceAccessStatus === 'unknown' ||
    deviceAccessStatus === 'pending' ||
    deviceAccessStatus === 'revoked';

  const updateField = <K extends keyof LoginFormState>(
    key: K,
    value: LoginFormState[K],
  ) => {
    setForm(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: undefined }));
  };

  const validate = (): LoginFormErrors => {
    const nextErrors: LoginFormErrors = {};

    if (!form.identifier.trim()) {
      nextErrors.identifier = t('auth.validation.identifierRequired');
    }

    if (!form.password.trim()) {
      nextErrors.password = t('auth.validation.passwordRequired');
    } else if (form.password.trim().length < 6) {
      nextErrors.password = t('auth.validation.passwordMinLength');
    }

    return nextErrors;
  };

  const handleShareDeviceId = async () => {
    await Share.share({
      message: t('auth.deviceAccess.shareMessage', { deviceId }),
    });
  };

  const handleRequestRegistration = async () => {
    const nextErrors = validate();
    setErrors(nextErrors);
    setSubmitError(undefined);
    if (Object.keys(nextErrors).length > 0) return;

    setIsRequesting(true);
    try {
      const credentials: LoginCredentials = {
        identifier: form.identifier.trim(),
        password: form.password,
      };
      await requestDeviceRegistrationWithApi(credentials);
      setDeviceAccessStatus('pending', 'DEVICE_PENDING');
      setRequestSuccess(true);
    } catch (error) {
      if (error instanceof MobileApiError) {
        const access = deviceAccessFromAuthCode(error.code);
        if (access) setDeviceAccessStatus(access, error.code);
        const key = mapAuthErrorCode(error.code);
        setSubmitError(key ? t(key) : error.message || t('auth.errors.generic'));
      } else {
        setSubmitError(t('auth.errors.generic'));
      }
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSubmit = async () => {
    const nextErrors = validate();
    setErrors(nextErrors);
    setSubmitError(undefined);
    setRequestSuccess(false);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const credentials: LoginCredentials = {
        identifier: form.identifier.trim(),
        password: form.password,
      };
      const session = await loginWithApi(credentials);
      clearDeviceAccessStatus();
      login(session);
    } catch (error) {
      if (error instanceof MobileApiError) {
        const access = deviceAccessFromAuthCode(error.code);
        if (access) setDeviceAccessStatus(access, error.code);
        const key = mapAuthErrorCode(error.code);
        setSubmitError(key ? t(key) : error.message || t('auth.errors.generic'));
      } else {
        setSubmitError(t('auth.errors.generic'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppScreen
      scrollable
      keyboardAvoiding
      withOfflineBanner={false}
      background="alt"
      contentContainerStyle={flow.scrollCenter}>
      <View style={flow.hero}>
        <Image
          source={brandLogo}
          style={flow.logo}
          resizeMode="contain"
          accessibilityLabel={t('common.appName')}
        />
        <AppText variant="h2" accessibilityRole="header">
          {t('auth.title')}
        </AppText>
        <AppText variant="body" color={colors.textSecondary} style={flow.hint}>
          {blocked ? t('auth.deviceAccess.subtitleBlocked') : t('auth.subtitle')}
        </AppText>
      </View>

      {blocked ? (
        <DeviceAccessPanel
          status={deviceAccessStatus}
          deviceId={deviceId}
          onRequestRegistration={
            deviceAccessStatus === 'unknown'
              ? handleRequestRegistration
              : undefined
          }
          onShareId={handleShareDeviceId}
          requesting={isRequesting}
          requestSuccess={requestSuccess}
        />
      ) : null}

      <AppCard variant="elevated">
        <View style={flow.formFields}>
          {submitError && !blocked ? (
            <View
              style={[
                styles.inlineError,
                { backgroundColor: `${tokens.colors.danger}14` },
              ]}
              accessibilityRole="alert">
              <AppText variant="caption" color={tokens.colors.danger}>
                {submitError}
              </AppText>
            </View>
          ) : null}
          {submitError && blocked ? (
            <AppText variant="caption" color={tokens.colors.danger}>
              {submitError}
            </AppText>
          ) : null}
          <AppTextInput
            label={t('auth.identifierLabel')}
            value={form.identifier}
            onChangeText={value => updateField('identifier', value)}
            placeholder={t('auth.identifierPlaceholder')}
            error={errors.identifier}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="username"
            autoComplete="username"
            returnKeyType="next"
            editable={!isSubmitting && !isRequesting}
          />

          <AppTextInput
            label={t('auth.passwordLabel')}
            value={form.password}
            onChangeText={value => updateField('password', value)}
            placeholder={t('auth.passwordPlaceholder')}
            error={errors.password}
            secureTextEntry
            textContentType="password"
            autoComplete="password"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            editable={!isSubmitting && !isRequesting}
          />
        </View>

        <FlowFooter style={{ marginTop: tokens.spacing.lg }}>
          <AppButton
            label={
              isSubmitting
                ? t('auth.submitting')
                : blocked
                  ? t('auth.retryLogin')
                  : t('auth.submit')
            }
            loading={isSubmitting}
            fullWidth
            onPress={handleSubmit}
          />
        </FlowFooter>
      </AppCard>

      <View style={[flow.trustBanner, { backgroundColor: `${tokens.colors.info}10` }]}>
        <SecurityShield color={tokens.colors.info} />
        <AppText variant="caption" color={tokens.colors.info} style={styles.trustText}>
          {t('auth.securityNote')}
        </AppText>
      </View>

      <AppText
        variant="caption"
        color={colors.textSecondary}
        style={flow.devHintCaption}>
        {t('auth.devHint')}
      </AppText>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  trustText: {
    flex: 1,
    lineHeight: 18,
  },
  accessPanel: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 8,
  },
  accessBody: {
    lineHeight: 20,
  },
  deviceIdRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginTop: 4,
  },
  deviceIdValue: {
    fontFamily: 'monospace',
    marginTop: 2,
  },
  inlineError: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
