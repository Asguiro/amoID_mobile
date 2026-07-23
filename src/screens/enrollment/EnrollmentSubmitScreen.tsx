import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ServiceUiState } from '../../api/types/ui-state.types';
import {
  AppButton,
  AppCard,
  AppHeader,
  AppScreen,
  AppSwitchRow,
  AppText,
  ErrorState,
  LoadingState,
  SuccessState,
} from '../../components/ui';
import { FlowFooter, FlowSection } from '../../components/layout/FlowLayout';
import { ENROLLMENT_ROUTES } from '../../constants/routes';
import { useEnrollmentSubmit } from '../../hooks/useEnrollment';
import { useEnrollmentDraft } from '../../hooks/useEnrollmentDraft';
import { useTranslation } from '../../hooks/useTranslation';
import type { EnrollmentStackParamList } from '../../navigation/flow-types';
import {
  setEnrollmentSubmissionResult,
  setForceOfflineSubmit,
} from '../../store/enrollment-draft.store';
import { useTheme } from '../../theme/ThemeProvider';
import {
  getServiceErrorMessage,
  mapServiceErrorToUiState,
} from '../../utils/serviceError';
import { runAsync } from '../../utils/runAsync';

type Navigation = NativeStackNavigationProp<
  EnrollmentStackParamList,
  typeof ENROLLMENT_ROUTES.SUBMIT
>;

export function EnrollmentSubmitScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const draft = useEnrollmentDraft();
  const submitMutation = useEnrollmentSubmit();
  const [uiState, setUiState] = useState<ServiceUiState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async () => {
    if (!draft.faceCaptureResult) {
      setUiState('ERROR_VALIDATION');
      setErrorMessage(t('enrollment.submit.captureRequired'));
      return;
    }

    setUiState('LOADING');
    setErrorMessage(undefined);

    try {
      const result = await submitMutation.mutateAsync({
        beneficiaryId: draft.selectedDossier?.id,
        isProvisional: draft.isProvisional,
        provisionalIdentity: draft.isProvisional
          ? draft.provisionalIdentity
          : undefined,
        requiredFields: draft.requiredFields,
        healthFields: draft.healthFields,
        healthConsentAccepted: draft.healthConsentAccepted,
        faceCapture: draft.faceCaptureResult,
        idDocument: draft.idDocument,
        forceOffline: draft.forceOfflineSubmit,
      });

      setEnrollmentSubmissionResult(result);
      setUiState('SUCCESS');
      navigation.navigate(ENROLLMENT_ROUTES.CONFIRMATION);
    } catch (error) {
      const nextState = mapServiceErrorToUiState(error);

      if (nextState === 'ERROR_RESEAU') {
        setEnrollmentSubmissionResult({
          dossierId: draft.selectedDossier?.id ?? `local-${Date.now()}`,
          status: 'pending_sync',
          submittedAt: new Date().toISOString(),
        });
        navigation.navigate(ENROLLMENT_ROUTES.CONFIRMATION);
        return;
      }

      setUiState(nextState);
      setErrorMessage(getServiceErrorMessage(error));
    }
  };

  return (
    <AppScreen header={<AppHeader title={t('enrollment.submit.title')} showBack />}>
      {uiState === 'LOADING' ? (
        <LoadingState label={t('enrollment.submit.loading')} />
      ) : null}

      {uiState === 'ERROR_VALIDATION' || uiState === 'ERROR_METIER' ? (
        <ErrorState
          message={errorMessage}
          onRetry={() => setUiState('IDLE')}
        />
      ) : null}

      {uiState === 'IDLE' || uiState === 'ERROR_RESEAU' ? (
        <>
          <FlowSection first>
            <AppCard variant="soft">
              <AppText variant="body">{t('enrollment.submit.description')}</AppText>
            </AppCard>

            <AppCard variant="elevated">
              <AppSwitchRow
                title={t('enrollment.submit.simulateOffline')}
                subtitle={t('enrollment.submit.simulateOfflineHint')}
                value={draft.forceOfflineSubmit}
                onValueChange={setForceOfflineSubmit}
                isLast
              />
            </AppCard>

            {uiState === 'ERROR_RESEAU' && errorMessage ? (
              <AppText variant="caption" color={colors.textSecondary}>
                {errorMessage}
              </AppText>
            ) : null}
          </FlowSection>

          <FlowFooter>
            <AppButton
              label={t('enrollment.submit.confirm')}
              fullWidth
              onPress={() => { runAsync(() => handleSubmit()); }}
            />
          </FlowFooter>
        </>
      ) : null}

      {uiState === 'SUCCESS' ? (
        <SuccessState
          title={t('enrollment.submit.successTitle')}
          description={t('enrollment.submit.successDescription')}
        />
      ) : null}
    </AppScreen>
  );
}
