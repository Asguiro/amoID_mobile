import { useState } from 'react';
import { Image, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { mockLogin } from '../../api/mocks/session.mock';
import type { LoginCredentials } from '../../api/types/agent.types';
import {
  AppButton,
  AppCard,
  AppScreen,
  AppText,
  AppTextInput,
} from '../../components/ui';
import { FlowFooter } from '../../components/layout/FlowLayout';
import { useSessionActions } from '../../hooks/useSession';
import { useTranslation } from '../../hooks/useTranslation';
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

export function LoginScreen() {
  const { t } = useTranslation();
  const { login } = useSessionActions();
  const { colors, tokens } = useTheme();
  const flow = useFlowStyles();

  const [form, setForm] = useState<LoginFormState>({
    identifier: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const credentials: LoginCredentials = {
        identifier: form.identifier.trim(),
        password: form.password,
      };
      const session = await mockLogin(credentials);
      login(session);
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
          {t('auth.subtitle')}
        </AppText>
      </View>

      <AppCard variant="elevated">
        <View style={flow.formFields}>
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
            editable={!isSubmitting}
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
            editable={!isSubmitting}
          />
        </View>

        <FlowFooter style={{ marginTop: tokens.spacing.lg }}>
          <AppButton
            label={isSubmitting ? t('auth.submitting') : t('auth.submit')}
            loading={isSubmitting}
            fullWidth
            onPress={handleSubmit}
          />
        </FlowFooter>
      </AppCard>

      <View style={[flow.trustBanner, { backgroundColor: `${tokens.colors.info}10` }]}>
        <SecurityShield color={tokens.colors.info} />
        <AppText variant="caption" color={tokens.colors.info} style={{ flex: 1, lineHeight: 18 }}>
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
