import { useCallback, useEffect, useRef, useState } from 'react';
import type { Face } from 'react-native-vision-camera-face-detector';
import { faceCaptureService } from '../api/services/face-capture.service';
import { AmoServiceError } from '../api/services/service.utils';
import type {
  FaceCaptureMode,
  FaceCapturePhase,
  FaceCaptureResult,
  FaceCaptureSession,
} from '../api/types/face-capture.types';
import type { ServiceUiState } from '../api/types/ui-state.types';
import type { FaceCaptureCameraRef } from '../components/biometric/FaceCaptureCamera';
import { extractFaceMetrics } from '../features/face-capture/faceQuality';
import {
  advanceLiveness,
  createLivenessProgress,
  getLivenessGuidanceKey,
  type LivenessProgress,
} from '../features/face-capture/livenessChallenge';
import { mapPhaseToGuidanceKey } from '../screens/face-capture/faceCapture.utils';
import {
  FaceCapturePhotoError,
  logDevError,
  mapFaceCaptureErrorKind,
  resolveUserFacingMessage,
  type FaceCaptureErrorKind,
} from '../utils/userFacingError';
import { useTranslation } from './useTranslation';
import { runAsync } from '../utils/runAsync';

const MAX_ATTEMPTS = 3;
const FACE_PROCESS_INTERVAL_MS = 120;

interface UseBiometricCaptureOptions {
  mode: FaceCaptureMode;
  onCompleted?: (result: FaceCaptureResult) => void;
}

function mapServiceError(error: unknown): ServiceUiState {
  if (error instanceof AmoServiceError) {
    if (error.code === 'NETWORK') {
      return 'ERROR_RESEAU';
    }
    if (error.code === 'VALIDATION') {
      return 'ERROR_VALIDATION';
    }
    if (error.code === 'BUSINESS') {
      return 'ERROR_METIER';
    }
  }

  return 'ERROR_METIER';
}

export function useBiometricCapture({
  mode,
  onCompleted,
}: UseBiometricCaptureOptions) {
  const { t } = useTranslation();
  const cameraRef = useRef<FaceCaptureCameraRef>(null);
  const sessionRef = useRef<FaceCaptureSession | null>(null);
  const livenessRef = useRef<LivenessProgress>(createLivenessProgress());
  const captureStartedRef = useRef(false);
  const completingRef = useRef(false);
  const lastFaceProcessedAtRef = useRef(0);

  const [session, setSession] = useState<FaceCaptureSession | null>(null);
  const [phase, setPhase] = useState<FaceCapturePhase>('idle');
  const [uiState, setUiState] = useState<ServiceUiState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [guidanceKey, setGuidanceKey] = useState('faceCapture.phases.idle');
  const [isCameraActive, setIsCameraActive] = useState(false);

  const initialize = useCallback(async () => {
    setUiState('LOADING');
    setErrorMessage(undefined);
    setPhase('idle');
    setGuidanceKey('faceCapture.phases.idle');
    setIsCameraActive(false);
    captureStartedRef.current = false;
    completingRef.current = false;
    lastFaceProcessedAtRef.current = 0;
    livenessRef.current = createLivenessProgress();

    try {
      const nextSession = await faceCaptureService.startSession({ mode });
      sessionRef.current = nextSession;
      setSession(nextSession);
      setUiState('IDLE');
    } catch (error) {
      logDevError('useBiometricCapture.initialize', error);
      setUiState(mapServiceError(error));
      setErrorMessage(
        resolveUserFacingMessage(error, t) ?? t('faceCapture.errors.sessionFailed'),
      );
    }
  }, [mode, t]);

  useEffect(() => {
    runAsync(() => initialize());

    return () => {
      if (sessionRef.current) {
        faceCaptureService.resetSession(sessionRef.current.sessionId);
      }
    };
  }, [initialize]);

  const registerFailure = useCallback(
    (userMessage?: string) => {
      if (!sessionRef.current) {
        return;
      }

      const nextAttempt = sessionRef.current.attemptCount + 1;
      const failedSession: FaceCaptureSession = {
        ...sessionRef.current,
        attemptCount: nextAttempt,
        phase: nextAttempt >= MAX_ATTEMPTS ? 'max_attempts' : 'liveness_failed',
        businessStatus: nextAttempt >= MAX_ATTEMPTS ? 'manual_required' : 'failed',
        qualityLabel: 'poor',
      };

      sessionRef.current = failedSession;
      setSession(failedSession);
      livenessRef.current = createLivenessProgress();
      captureStartedRef.current = false;
      completingRef.current = false;
      setIsCameraActive(false);
      setErrorMessage(userMessage ?? t('faceCapture.phases.livenessFailed'));

      if (nextAttempt >= MAX_ATTEMPTS) {
        setPhase('max_attempts');
        setGuidanceKey('faceCapture.phases.maxAttempts');
        setUiState('IDLE');
        return;
      }

      setPhase('liveness_failed');
      setGuidanceKey('faceCapture.phases.livenessFailed');
      setUiState('IDLE');
    },
    [t],
  );

  const finalizeCapture = useCallback(async () => {
    if (!sessionRef.current || completingRef.current) {
      return;
    }

    completingRef.current = true;

    try {
      const previewUri = await cameraRef.current?.takePhoto();

      if (!previewUri) {
        throw new FaceCapturePhotoError();
      }

      setIsCameraActive(false);
      setUiState('LOADING');
      setGuidanceKey('faceCapture.liveness.hold');

      const result = await faceCaptureService.completeValidatedCapture(
        sessionRef.current.sessionId,
        { previewUri },
      );
      setPhase('capture_ok');
      setGuidanceKey('faceCapture.phases.captureOk');
      setUiState('SUCCESS');
      onCompleted?.(result);
    } catch (error) {
      logDevError('useBiometricCapture.finalizeCapture', error);
      registerFailure(
        resolveUserFacingMessage(error, t) ?? t('faceCapture.errors.captureFailed'),
      );
    }
  }, [onCompleted, registerFailure, t]);

  const handleFacesDetected = useCallback(
    (faces: Face[], frameWidth: number, frameHeight: number) => {
      if (!captureStartedRef.current || completingRef.current) {
        return;
      }

      const now = Date.now();
      if (now - lastFaceProcessedAtRef.current < FACE_PROCESS_INTERVAL_MS) {
        return;
      }
      lastFaceProcessedAtRef.current = now;

      if (faces.length === 0) {
        setPhase('detecting');
        setGuidanceKey('faceCapture.phases.detecting');
        return;
      }

      const metrics = extractFaceMetrics(faces[0], frameWidth, frameHeight);
      const { progress, phase: nextPhase } = advanceLiveness(
        livenessRef.current,
        metrics,
      );

      livenessRef.current = progress;

      if (nextPhase === 'capture_ok') {
        runAsync(() => finalizeCapture());
        return;
      }

      setPhase(nextPhase);

      if (nextPhase === 'liveness_check') {
        setGuidanceKey(getLivenessGuidanceKey(progress.step));
        return;
      }

      setGuidanceKey(mapPhaseToGuidanceKey(nextPhase));
    },
    [finalizeCapture],
  );

  const startCapture = useCallback(() => {
    if (!sessionRef.current) {
      return;
    }

    captureStartedRef.current = true;
    completingRef.current = false;
    lastFaceProcessedAtRef.current = 0;
    livenessRef.current = createLivenessProgress();
    setPhase('detecting');
    setGuidanceKey('faceCapture.phases.detecting');
    setErrorMessage(undefined);
    setUiState('IDLE');
    setIsCameraActive(true);
  }, []);

  const retry = useCallback(() => {
    runAsync(() => initialize());
  }, [initialize]);

  const handleCameraError = useCallback(
    (kind: FaceCaptureErrorKind) => {
      if (!captureStartedRef.current) {
        return;
      }

      registerFailure(t(mapFaceCaptureErrorKind(kind)));
    },
    [registerFailure, t],
  );

  const guidance = t(guidanceKey);

  return {
    cameraRef,
    session,
    phase,
    uiState,
    errorMessage,
    guidance,
    isCameraActive,
    startCapture,
    handleFacesDetected,
    handleCameraError,
    retry,
  };
}
