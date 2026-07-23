import { useEffect } from 'react';
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
import { ENROLLMENT_ROUTES, MAIN_STACK_ROUTES } from '../../constants/routes';
import { useEnrollmentDraft } from '../../hooks/useEnrollmentDraft';
import { useTranslation } from '../../hooks/useTranslation';
import type { EnrollmentStackParamList } from '../../navigation/flow-types';
import {
  clearEnrollmentFaceCapturePreview,
  resetEnrollmentDraft,
} from '../../store/enrollment-draft.store';
import { useFlowStyles } from '../../theme/useFlowStyles';
import { formatDisplayDateTime } from '../../utils/formatDate';

type Navigation = NativeStackNavigationProp<
  EnrollmentStackParamList,
  typeof ENROLLMENT_ROUTES.CONFIRMATION
>;

export function EnrollmentConfirmationScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const flow = useFlowStyles();
  const draft = useEnrollmentDraft();
  const result = draft.submissionResult;

  useEffect(() => {
    clearEnrollmentFaceCapturePreview();
  }, []);

  if (!result) {
    return (
      <AppScreen header={<AppHeader title={t('enrollment.confirmation.title')} showBack />}>
        <AppText variant="body">{t('enrollment.confirmation.missing')}</AppText>
      </AppScreen>
    );
  }

  const statusKey = `enrollment.confirmation.status.${result.status}`;

  const handleFinish = () => {
    resetEnrollmentDraft();
    navigation.getParent()?.navigate(MAIN_STACK_ROUTES.HOME);
  };

  const handleNewEnrollment = () => {
    resetEnrollmentDraft();
    navigation.navigate(ENROLLMENT_ROUTES.HOME);
  };

  return (
    <AppScreen header={<AppHeader title={t('enrollment.confirmation.title')} showBack={false} />}>
      <SuccessState
        title={t(statusKey)}
        description={t('enrollment.confirmation.description', {
          date: formatDisplayDateTime(result.submittedAt),
        })}
      />

      <FlowSection first>
        <SectionTitle title={t('enrollment.confirmation.dossierSection')} />
        <AppCard variant="soft">
          <View style={flow.meta}>
            <AppText variant="bodyStrong">{t('enrollment.confirmation.dossierId')}</AppText>
            <AppText variant="body">{result.dossierId}</AppText>
            <StatusBadge
              label={t(statusKey)}
              tone={result.status === 'synced' ? 'success' : 'warning'}
              showDot
            />
          </View>
        </AppCard>
      </FlowSection>

      <FlowFooter>
        <AppButton
          label={t('enrollment.confirmation.newEnrollment')}
          fullWidth
          onPress={handleNewEnrollment}
        />
        <AppButton
          label={t('enrollment.confirmation.backHome')}
          variant="outline"
          fullWidth
          onPress={handleFinish}
        />
      </FlowFooter>
    </AppScreen>
  );
}
