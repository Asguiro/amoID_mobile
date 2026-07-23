import { useState } from 'react';
import { Image, Pressable, Share, StyleSheet, View } from 'react-native';
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

function DeviceAccessBanner({
  status,
  onShareId,
  requestSuccess,
}: {
  status: Exclude<DeviceAccessStatus, 'ok'>;
  onShareId: () => void;
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
        styles.accessBanner,
        { backgroundColor: `${tone}12`, borderColor: `${tone}40` },
      ]}
      accessibilityRole="alert">
      <AppText variant="title" color={tone}>
        {t(titleKey)}
      </AppText>
      <AppText variant="body" color={colors.textSecondary} style={styles.accessBody}>
        {requestSuccess ? t('auth.deviceAccess.requestSent') : t(bodyKey)}
      </AppText>
      <Pressable
        onPress={onShareId}
        accessibilityRole="button"
        accessibilityLabel={t('auth.deviceAccess.shareId')}
        hitSlop={8}>
        <AppText variant="caption" color={tokens.colors.info}>
          {t('auth.deviceAccess.shareId')}
        </AppText>
      </Pressable>
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
  const canRequest = deviceAccessStatus === 'unknown';

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

  const credentials = (): LoginCredentials => ({
    identifier: form.identifier.trim(),
    password: form.password,
  });

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
      await requestDeviceRegistrationWithApi(credentials());
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
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const session = await loginWithApi(credentials());
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
      <View style={styles.hero}>
        <Image
          source={brandLogo}
          style={flow.logo}
          resizeMode="contain"
          accessibilityLabel={t('common.appName')}
        />
        <AppText variant="h2" accessibilityRole="header">
          {t('auth.title')}
        </AppText>
      </View>

      {blocked ? (
        <DeviceAccessBanner
          status={deviceAccessStatus}
          onShareId={handleShareDeviceId}
          requestSuccess={requestSuccess}
        />
      ) : null}

      <AppCard variant="elevated">
        <View style={flow.formFields}>
          {submitError ? (
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
            onSubmitEditing={canRequest ? handleRequestRegistration : handleSubmit}
            editable={!isSubmitting && !isRequesting}
          />
        </View>

        <FlowFooter style={{ marginTop: tokens.spacing.lg, gap: tokens.spacing.sm }}>
          {canRequest ? (
            <AppButton
              label={
                isRequesting
                  ? t('auth.deviceAccess.requesting')
                  : t('auth.deviceAccess.requestCta')
              }
              loading={isRequesting}
              fullWidth
              onPress={handleRequestRegistration}
            />
          ) : (
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
          )}
          {canRequest ? (
            <Pressable
              onPress={handleSubmit}
              disabled={isSubmitting || isRequesting}
              accessibilityRole="button">
              <AppText
                variant="caption"
                color={colors.textSecondary}
                style={styles.secondaryAction}>
                {isSubmitting ? t('auth.submitting') : t('auth.retryLogin')}
              </AppText>
            </Pressable>
          ) : null}
        </FlowFooter>
      </AppCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 20,
  },
  accessBanner: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    gap: 6,
  },
  accessBody: {
    lineHeight: 20,
  },
  secondaryAction: {
    textAlign: 'center',
    paddingVertical: 8,
  },
});
