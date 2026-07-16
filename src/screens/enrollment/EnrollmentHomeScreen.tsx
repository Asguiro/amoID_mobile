import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AppButton,
  AppCard,
  AppHeader,
  AppScreen,
  AppText,
  SectionTitle,
} from '../../components/ui';
import { FlowSection } from '../../components/layout/FlowLayout';
import { ENROLLMENT_ROUTES } from '../../constants/routes';
import { useTranslation } from '../../hooks/useTranslation';
import type { EnrollmentStackParamList } from '../../navigation/flow-types';
import { resetEnrollmentDraft } from '../../store/enrollment-draft.store';
import { useFlowStyles } from '../../theme/useFlowStyles';
import { useTheme } from '../../theme/ThemeProvider';

type Navigation = NativeStackNavigationProp<
  EnrollmentStackParamList,
  typeof ENROLLMENT_ROUTES.HOME
>;

export function EnrollmentHomeScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const flow = useFlowStyles();

  const handleStartEnrollment = () => {
    resetEnrollmentDraft();
    navigation.navigate(ENROLLMENT_ROUTES.IDENTITY_CHECK);
  };

  return (
    <AppScreen header={<AppHeader title={t('enrollment.title')} showBack />}>
      <FlowSection first>
        <AppCard variant="elevated" style={flow.heroCard}>
          <AppText variant="title">{t('enrollment.home.headline')}</AppText>
          <AppText variant="body" color={colors.textSecondary}>
            {t('enrollment.home.description')}
          </AppText>
          <AppButton
            label={t('enrollment.home.start')}
            fullWidth
            onPress={handleStartEnrollment}
          />
        </AppCard>
      </FlowSection>

      <FlowSection>
        <SectionTitle title={t('enrollment.home.offlineSection')} />
        <AppCard variant="soft">
          <AppText variant="body">{t('enrollment.home.offlineHint')}</AppText>
        </AppCard>
      </FlowSection>
    </AppScreen>
  );
}
