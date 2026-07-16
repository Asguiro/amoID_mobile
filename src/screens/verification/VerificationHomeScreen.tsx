import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActionGroupCard,
  ActionRow,
  AppButton,
  AppCard,
  AppHeader,
  AppScreen,
  AppText,
  CircleIcon,
  SectionTitle,
} from '../../components/ui';
import { FlowSection } from '../../components/layout/FlowLayout';
import { VERIFICATION_ROUTES } from '../../constants/routes';
import { useTranslation } from '../../hooks/useTranslation';
import type { VerificationStackParamList } from '../../navigation/flow-types';
import { resetVerificationFlow } from '../../store/verification-flow.store';
import { useFlowStyles } from '../../theme/useFlowStyles';
import { useTheme } from '../../theme/ThemeProvider';

type Navigation = NativeStackNavigationProp<
  VerificationStackParamList,
  typeof VERIFICATION_ROUTES.HOME
>;

const STEP_KEYS = [
  'verification.home.steps.identify',
  'verification.home.steps.capture',
  'verification.home.steps.match',
  'verification.home.steps.decision',
] as const;

export function VerificationHomeScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const flow = useFlowStyles();

  const handleStart = () => {
    resetVerificationFlow();
    navigation.navigate(VERIFICATION_ROUTES.IDENTIFY);
  };

  return (
    <AppScreen header={<AppHeader title={t('verification.title')} showBack />}>
      <FlowSection first>
        <AppCard variant="elevated" style={flow.heroCard}>
          <AppText variant="title">{t('verification.home.headline')}</AppText>
          <AppText variant="body" color={colors.textSecondary}>
            {t('verification.subtitle')}
          </AppText>
          <AppButton
            label={t('verification.home.start')}
            fullWidth
            onPress={handleStart}
          />
        </AppCard>
      </FlowSection>

      <FlowSection>
        <SectionTitle title={t('verification.stepsTitle')} />
        <ActionGroupCard>
          {STEP_KEYS.map((stepKey, index) => (
            <ActionRow
              key={stepKey}
              title={t(stepKey)}
              icon={
                <CircleIcon>
                  <AppText variant="bodyStrong" color={colors.primary}>
                    {`${index + 1}`}
                  </AppText>
                </CircleIcon>
              }
              isLast={index === STEP_KEYS.length - 1}
            />
          ))}
        </ActionGroupCard>
      </FlowSection>

      <FlowSection>
        <SectionTitle title={t('verification.qrSectionTitle')} />
        <AppCard variant="soft">
          <AppText variant="body">{t('verification.qrHint')}</AppText>
        </AppCard>
      </FlowSection>
    </AppScreen>
  );
}
