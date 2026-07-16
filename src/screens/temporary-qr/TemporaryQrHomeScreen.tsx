import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AppButton,
  AppCard,
  AppHeader,
  AppScreen,
  AppText,
  SectionTitle,
  SensitiveInfoNotice,
} from '../../components/ui';
import { FlowFooter, FlowSection } from '../../components/layout/FlowLayout';
import { TEMPORARY_QR_ROUTES } from '../../constants/routes';
import { useTranslation } from '../../hooks/useTranslation';
import type { TemporaryQrStackParamList } from '../../navigation/flow-types';
import { resetTemporaryQrFlow } from '../../store/temporary-qr-flow.store';
import { useFlowStyles } from '../../theme/useFlowStyles';
import { useTheme } from '../../theme/ThemeProvider';

type Navigation = NativeStackNavigationProp<
  TemporaryQrStackParamList,
  typeof TEMPORARY_QR_ROUTES.HOME
>;

export function TemporaryQrHomeScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const flow = useFlowStyles();

  const handleStart = () => {
    resetTemporaryQrFlow();
    navigation.navigate(TEMPORARY_QR_ROUTES.SEARCH);
  };

  return (
    <AppScreen header={<AppHeader title={t('temporaryQr.home.title')} showBack />}>
      <FlowSection first>
        <AppCard variant="elevated" style={flow.heroCard}>
          <AppText variant="title">{t('temporaryQr.home.headline')}</AppText>
          <AppText variant="body" color={colors.textSecondary}>
            {t('temporaryQr.home.description')}
          </AppText>
        </AppCard>
      </FlowSection>

      <FlowSection>
        <SectionTitle title={t('temporaryQr.home.useCasesTitle')} />
        <AppCard variant="soft">
          <AppText variant="body">{t('temporaryQr.home.useCases')}</AppText>
        </AppCard>
      </FlowSection>

      <FlowSection>
        <SensitiveInfoNotice
          title={t('temporaryQr.home.securityTitle')}
          message={t('temporaryQr.home.securityNotice')}
        />
      </FlowSection>

      <FlowFooter>
        <AppButton
          label={t('temporaryQr.home.start')}
          fullWidth
          onPress={handleStart}
        />
      </FlowFooter>
    </AppScreen>
  );
}
