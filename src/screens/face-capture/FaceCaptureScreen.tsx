import { useCallback } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { FaceCaptureMode } from '../../api/types/face-capture.types';
import { FaceCaptureCamera } from '../../components/biometric/FaceCaptureCamera';
import {
  AppButton,
  AppCard,
  AppHeader,
  AppScreen,
  AppText,
  ErrorState,
  LoadingState,
  SectionTitle,
  StatusBadge,
} from '../../components/ui';
import { FlowFooter, FlowIntro, FlowSection } from '../../components/layout/FlowLayout';
import { ENROLLMENT_ROUTES, IDENTIFICATION_ROUTES } from '../../constants/routes';
import { useBiometricCapture } from '../../hooks/useBiometricCapture';
import { useTranslation } from '../../hooks/useTranslation';
import type { EnrollmentStackParamList } from '../../navigation/flow-types';
import type { VerificationStackParamList } from '../../navigation/flow-types';
import {
  setEnrollmentFaceCaptureResult,
} from '../../store/enrollment-draft.store';
import {
  setVerificationFaceCaptureResult,
} from '../../store/verification-flow.store';
import { useFlowStyles } from '../../theme/useFlowStyles';
import { useTheme } from '../../theme/ThemeProvider';
import {
  mapPhaseToScanStatus,
  mapPhaseToStatusLabelKey,
} from './faceCapture.utils';

type EnrollmentNav = NativeStackNavigationProp<
  EnrollmentStackParamList,
  typeof ENROLLMENT_ROUTES.FACE_CAPTURE
>;

type VerificationNav = NativeStackNavigationProp<
  VerificationStackParamList,
  typeof IDENTIFICATION_ROUTES.FACE_CAPTURE
>;

export interface FaceCaptureScreenProps {
  mode: FaceCaptureMode;
}

export function FaceCaptureScreen({ mode }: FaceCaptureScreenProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const flow = useFlowStyles();
  const enrollmentNavigation = useNavigation<EnrollmentNav>();
  const verificationNavigation = useNavigation<VerificationNav>();

  const handleCompleted = useCallback(
    (result: Parameters<typeof setEnrollmentFaceCaptureResult>[0]) => {
      if (mode === 'enrollment') {
        setEnrollmentFaceCaptureResult(result);
        enrollmentNavigation.navigate(ENROLLMENT_ROUTES.RECAP);
        return;
      }

      setVerificationFaceCaptureResult(result);
      verificationNavigation.navigate(IDENTIFICATION_ROUTES.MATCH);
    },
    [enrollmentNavigation, mode, verificationNavigation],
  );

  const handleManualRequired = useCallback(() => {
    if (mode === 'enrollment') {
      enrollmentNavigation.navigate(ENROLLMENT_ROUTES.RECAP);
      return;
    }

    verificationNavigation.navigate(IDENTIFICATION_ROUTES.MANUAL);
  }, [enrollmentNavigation, mode, verificationNavigation]);

  const {
    cameraRef,
    phase,
    uiState,
    errorMessage,
    guidance,
    isCameraActive,
    startCapture,
    handleFacesDetected,
    handleCameraError,
    retry,
  } = useBiometricCapture({
    mode,
    onCompleted: handleCompleted,
  });

  const statusLabelKey = mapPhaseToStatusLabelKey(phase);
  const isInitializing = uiState === 'LOADING' && phase === 'idle';
  const isSessionError =
    uiState === 'ERROR_RESEAU' ||
    uiState === 'ERROR_VALIDATION' ||
    (uiState === 'ERROR_METIER' && phase === 'idle');
  const canStart = uiState === 'IDLE' && phase === 'idle';
  const canRetry =
    uiState === 'IDLE' &&
    (phase === 'liveness_failed' || (phase === 'idle' && Boolean(errorMessage)));
  const showManualAction = phase === 'max_attempts';

  if (isInitializing) {
    return (
      <AppScreen header={<AppHeader title={t('faceCapture.title')} showBack />}>
        <LoadingState label={t('faceCapture.initializing')} />
      </AppScreen>
    );
  }

  if (isSessionError) {
    return (
      <AppScreen header={<AppHeader title={t('faceCapture.title')} showBack />}>
        <ErrorState message={errorMessage} onRetry={retry} />
      </AppScreen>
    );
  }

  return (
    <AppScreen header={<AppHeader title={t('faceCapture.title')} showBack />}>
      <FlowIntro>{t('faceCapture.hint')}</FlowIntro>

      <FlowSection first>
        <SectionTitle title={t('faceCapture.scanTitle')} />
        <AppCard variant="elevated" style={flow.cameraCard}>
          <View style={flow.headerRow}>
            {statusLabelKey ? (
              <StatusBadge
                label={t(statusLabelKey)}
                tone={
                  mapPhaseToScanStatus(phase) === 'success'
                    ? 'success'
                    : mapPhaseToScanStatus(phase) === 'failed'
                      ? 'danger'
                      : mapPhaseToScanStatus(phase) === 'warning'
                        ? 'warning'
                        : 'info'
                }
                showDot
              />
            ) : null}
          </View>

          <FaceCaptureCamera
            cameraRef={cameraRef}
            isActive={isCameraActive}
            guidance={guidance}
            onFacesDetected={handleFacesDetected}
            onCameraError={handleCameraError}
          />
        </AppCard>
      </FlowSection>

      {errorMessage && phase !== 'max_attempts' ? (
        <FlowSection>
          <AppCard variant="soft">
            <AppText variant="body" color={colors.accent}>
              {errorMessage}
            </AppText>
          </AppCard>
        </FlowSection>
      ) : null}

      <FlowFooter>
        {canStart ? (
          <AppButton
            label={t('faceCapture.start')}
            fullWidth
            onPress={startCapture}
          />
        ) : null}
        {canRetry ? (
          <AppButton
            label={t('faceCapture.retry')}
            fullWidth
            onPress={startCapture}
          />
        ) : null}
        {showManualAction ? (
          <AppButton
            label={t('faceCapture.procedureAlternative')}
            variant="outline"
            fullWidth
            onPress={handleManualRequired}
          />
        ) : null}
      </FlowFooter>
    </AppScreen>
  );
}
