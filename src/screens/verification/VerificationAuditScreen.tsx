import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AppButton,
  AppCard,
  AppHeader,
  AppScreen,
  AppText,
  SectionTitle,
  StatusBadge,
  SuccessState,
} from '../../components/ui';
import { FlowFooter, FlowSection } from '../../components/layout/FlowLayout';
import { MAIN_STACK_ROUTES, VERIFICATION_ROUTES } from '../../constants/routes';
import { useVerificationFlow } from '../../hooks/useVerificationFlow';
import { useTranslation } from '../../hooks/useTranslation';
import type { VerificationStackParamList } from '../../navigation/flow-types';
import { resetVerificationFlow } from '../../store/verification-flow.store';
import { useFlowStyles } from '../../theme/useFlowStyles';
import { useTheme } from '../../theme/ThemeProvider';
import { formatDisplayDateTime } from '../../utils/formatDate';

type Navigation = NativeStackNavigationProp<
  VerificationStackParamList,
  typeof VERIFICATION_ROUTES.AUDIT
>;

export function VerificationAuditScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const flow = useFlowStyles();
  const flowState = useVerificationFlow();
  const audit = flowState.auditEntry;

  if (!audit) {
    return (
      <AppScreen header={<AppHeader title={t('verification.audit.title')} showBack />}>
        <AppText variant="body">{t('verification.audit.missing')}</AppText>
      </AppScreen>
    );
  }

  const handleFinish = () => {
    resetVerificationFlow();
    navigation.getParent()?.navigate(MAIN_STACK_ROUTES.HOME);
  };

  const handleNewVerification = () => {
    resetVerificationFlow();
    navigation.navigate(VERIFICATION_ROUTES.HOME);
  };

  return (
    <AppScreen header={<AppHeader title={t('verification.audit.title')} showBack={false} />}>
      <SuccessState
        title={t('verification.audit.successTitle')}
        description={t('verification.audit.successDescription')}
      />

      <FlowSection first>
        <SectionTitle title={t('verification.audit.recordSection')} />
        <AppCard variant="elevated">
          <View style={flow.meta}>
            <AppText variant="bodyStrong">{audit.beneficiaryName}</AppText>
            <StatusBadge
              label={t(`verification.decisions.${audit.decision}`)}
              tone={audit.decision === 'confirm' ? 'success' : 'warning'}
              showDot
            />
            <AppText variant="caption" color={colors.textSecondary}>
              {t('verification.audit.recordedAt', {
                date: formatDisplayDateTime(audit.recordedAt),
              })}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              {t('verification.audit.establishment', {
                name: audit.agentEstablishment,
              })}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              {t('verification.audit.auditId', { id: audit.auditId })}
            </AppText>
          </View>
        </AppCard>
      </FlowSection>

      <FlowFooter>
        <AppButton
          label={t('verification.audit.newVerification')}
          fullWidth
          onPress={handleNewVerification}
        />
        <AppButton
          label={t('verification.audit.backHome')}
          variant="outline"
          fullWidth
          onPress={handleFinish}
        />
      </FlowFooter>
    </AppScreen>
  );
}
