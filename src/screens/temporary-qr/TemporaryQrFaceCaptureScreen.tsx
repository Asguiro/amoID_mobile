import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
import { TEMPORARY_QR_ROUTES } from '../../constants/routes';
import { useBiometricCapture } from '../../hooks/useBiometricCapture';
import { useTemporaryQrGeneration } from '../../hooks/useTemporaryQr';
import { useTranslation } from '../../hooks/useTranslation';
import type { TemporaryQrStackParamList } from '../../navigation/flow-types';
import {
  getTemporaryQrFlowState,
  setTemporaryQrFaceCaptureResult,
  setTemporaryQrGeneratedToken,
} from '../../store/temporary-qr-flow.store';
import { useFlowStyles } from '../../theme/useFlowStyles';
import { useTheme } from '../../theme/ThemeProvider';
import { getServiceErrorMessage } from '../../utils/serviceError';
import {
  mapPhaseToScanStatus,
  mapPhaseToStatusLabelKey,
} from '../face-capture/faceCapture.utils';
import { runAsync } from '../../utils/runAsync';

type Navigation = NativeStackNavigationProp<
  TemporaryQrStackParamList,
  typeof TEMPORARY_QR_ROUTES.FACE_CAPTURE
>;

export function TemporaryQrFaceCaptureScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const flow = useFlowStyles();
  const generateMutation = useTemporaryQrGeneration();
  const [generationError, setGenerationError] = useState<string | undefined>();

  const handleCompleted = useCallback(
    async (result: Parameters<typeof setTemporaryQrFaceCaptureResult>[0]) => {
      const flowState = getTemporaryQrFlowState();

      if (!flowState.beneficiary) {
        navigation.goBack();
        return;
      }

      setTemporaryQrFaceCaptureResult(result);
      setGenerationError(undefined);

      try {
        const token = await generateMutation.mutateAsync({
          beneficiaryId: flowState.beneficiary.id,
          reason: flowState.reason,
          duration: flowState.duration,
          faceCaptureSessionId: result.sessionId,
        });

        setTemporaryQrGeneratedToken(token);
        navigation.navigate(TEMPORARY_QR_ROUTES.PREVIEW);
      } catch (error) {
        setGenerationError(getServiceErrorMessage(error));
      }
    },
    [generateMutation, navigation],
  );

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
    mode: 'verification',
    onCompleted: result => {
      runAsync(() => handleCompleted(result));
    },
  });

  const statusLabelKey = mapPhaseToStatusLabelKey(phase);
  const isInitializing = uiState === 'LOADING' && phase === 'idle';
  const isSessionError =
    uiState === 'ERROR_RESEAU' ||
    uiState === 'ERROR_VALIDATION' ||
    (uiState === 'ERROR_METIER' && phase === 'idle');
  const canStart = uiState === 'IDLE' && phase === 'idle' && !generateMutation.isPending;
  const canRetry =
    uiState === 'IDLE' &&
    (phase === 'liveness_failed' || (phase === 'idle' && Boolean(errorMessage)));
  const showManualAction = phase === 'max_attempts';
  const combinedError = generationError ?? errorMessage;

  if (isInitializing) {
    return (
      <AppScreen header={<AppHeader title={t('temporaryQr.faceCapture.title')} showBack />}>
        <LoadingState label={t('faceCapture.initializing')} />
      </AppScreen>
    );
  }

  if (isSessionError) {
    return (
      <AppScreen header={<AppHeader title={t('temporaryQr.faceCapture.title')} showBack />}>
        <ErrorState message={combinedError} onRetry={retry} />
      </AppScreen>
    );
  }

  return (
    <AppScreen header={<AppHeader title={t('temporaryQr.faceCapture.title')} showBack />}>
      <FlowIntro>{t('temporaryQr.faceCapture.subtitle')}</FlowIntro>

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

      {combinedError && phase !== 'max_attempts' ? (
        <FlowSection>
          <AppCard variant="soft">
            <AppText variant="body" color={colors.accent}>
              {combinedError}
            </AppText>
          </AppCard>
        </FlowSection>
      ) : null}

      {generateMutation.isPending ? (
        <FlowSection>
          <LoadingState label={t('temporaryQr.faceCapture.generating')} />
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
            label={t('common.cancel')}
            variant="outline"
            fullWidth
            onPress={() => navigation.goBack()}
          />
        ) : null}
      </FlowFooter>
    </AppScreen>
  );
}
