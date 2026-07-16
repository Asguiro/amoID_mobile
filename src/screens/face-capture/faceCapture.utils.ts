import type { FaceCapturePhase } from '../../api/types/face-capture.types';
import type { BiometricScanStatus } from '../../components/ui/cards/BiometricScanCard';

const PHASE_MESSAGE_KEY: Record<FaceCapturePhase, string> = {
  idle: 'faceCapture.phases.idle',
  detecting: 'faceCapture.phases.detecting',
  too_far: 'faceCapture.phases.tooFar',
  too_close: 'faceCapture.phases.tooClose',
  bad_light: 'faceCapture.phases.badLight',
  blur: 'faceCapture.phases.blur',
  off_center: 'faceCapture.phases.offCenter',
  liveness_check: 'faceCapture.phases.livenessCheck',
  liveness_failed: 'faceCapture.phases.livenessFailed',
  capture_ok: 'faceCapture.phases.captureOk',
  max_attempts: 'faceCapture.phases.maxAttempts',
};

export function getFaceCaptureMessageKey(phase: FaceCapturePhase): string {
  return PHASE_MESSAGE_KEY[phase];
}

export function mapPhaseToScanStatus(phase: FaceCapturePhase): BiometricScanStatus {
  switch (phase) {
    case 'capture_ok':
      return 'success';
    case 'liveness_failed':
    case 'max_attempts':
      return 'failed';
    case 'too_far':
    case 'too_close':
    case 'bad_light':
    case 'blur':
    case 'off_center':
      return 'warning';
    case 'detecting':
    case 'liveness_check':
      return 'scanning';
    default:
      return 'idle';
  }
}

export function mapPhaseToStatusLabelKey(phase: FaceCapturePhase): string | undefined {
  if (phase === 'capture_ok') {
    return 'faceCapture.status.captured';
  }
  if (phase === 'max_attempts') {
    return 'faceCapture.status.manualRequired';
  }
  if (phase === 'liveness_failed') {
    return 'faceCapture.status.retry';
  }
  if (phase === 'detecting' || phase === 'liveness_check') {
    return 'faceCapture.status.scanning';
  }
  return undefined;
}

export function mapPhaseToGuidanceKey(phase: FaceCapturePhase): string {
  return getFaceCaptureMessageKey(phase);
}
