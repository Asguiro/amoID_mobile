import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AppButton,
  AppCard,
  AppHeader,
  AppScreen,
  AppText,
  EmptyState,
  StatusBadge,
  SuccessState,
} from '../../components/ui';
import { FlowFooter, FlowSection } from '../../components/layout/FlowLayout';
import { MAIN_STACK_ROUTES } from '../../constants/routes';
import { useTranslation } from '../../hooks/useTranslation';
import type { MainStackParamList } from '../../navigation/types';
import {
  getTemporaryQrFlowState,
  resetTemporaryQrFlow,
} from '../../store/temporary-qr-flow.store';
import { formatDisplayDateTimeFull } from '../../utils/formatDate';
import { useTheme } from '../../theme/ThemeProvider';

type MainNavigation = NativeStackNavigationProp<MainStackParamList>;

export function TemporaryQrConfirmationScreen() {
  const mainNavigation = useNavigation<MainNavigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const token = getTemporaryQrFlowState().generatedToken;

  if (!token) {
    return (
      <AppScreen header={<AppHeader title={t('temporaryQr.confirmation.title')} showBack />}>
        <EmptyState
          title={t('temporaryQr.confirmation.missingTitle')}
          description={t('temporaryQr.confirmation.missingDescription')}
        />
      </AppScreen>
    );
  }

  const fullName = `${token.beneficiary.firstName} ${token.beneficiary.lastName}`;

  const handleBackHome = () => {
    resetTemporaryQrFlow();
    mainNavigation.navigate(MAIN_STACK_ROUTES.HOME);
  };

  return (
    <AppScreen
      header={<AppHeader title={t('temporaryQr.confirmation.title')} showBack={false} />}>
      <FlowSection first>
        <SuccessState
          title={t('temporaryQr.confirmation.successTitle')}
          description={t('temporaryQr.confirmation.successDescription')}
        />
      </FlowSection>

      <FlowSection>
        <StatusBadge
          label={t('temporaryQr.confirmation.activeBadge')}
          tone="success"
          showDot
        />
        <AppCard variant="elevated">
          <AppText variant="caption" color={colors.textSecondary}>
            {t('temporaryQr.confirmation.beneficiaryLabel')}
          </AppText>
          <AppText variant="rowTitle">{fullName}</AppText>
          <AppText variant="body" color={colors.textSecondary}>
            {t('temporaryQr.confirmation.validUntil', {
              date: formatDisplayDateTimeFull(token.expiresAt),
            })}
          </AppText>
          <AppText variant="body" color={colors.textSecondary}>
            {t('temporaryQr.confirmation.auditReference', {
              reference: token.auditReference,
            })}
          </AppText>
        </AppCard>
      </FlowSection>

      <FlowSection>
        <AppCard variant="soft">
          <AppText variant="body">{t('temporaryQr.confirmation.reminder')}</AppText>
        </AppCard>
      </FlowSection>

      <FlowFooter>
        <AppButton
          label={t('temporaryQr.confirmation.backHome')}
          fullWidth
          onPress={handleBackHome}
        />
      </FlowFooter>
    </AppScreen>
  );
}
