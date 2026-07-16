import type { FaceCapturePhase } from '../../api/types/face-capture.types';
import type { FaceFrameMetrics } from './faceQuality';
import {
  areEyesClosed,
  areEyesOpen,
  assessFaceQuality,
  hasHeadTurned,
} from './faceQuality';

export type LivenessStep = 'blink' | 'head_turn' | 'hold';

const HOLD_FRAMES_REQUIRED = 12;

export interface LivenessProgress {
  step: LivenessStep;
  baselineYaw: number | null;
  eyesWereClosed: boolean;
  blinkCompleted: boolean;
  headTurnCompleted: boolean;
  holdFrameCount: number;
}

export function createLivenessProgress(): LivenessProgress {
  return {
    step: 'blink',
    baselineYaw: null,
    eyesWereClosed: false,
    blinkCompleted: false,
    headTurnCompleted: false,
    holdFrameCount: 0,
  };
}

export function advanceLiveness(
  progress: LivenessProgress,
  metrics: FaceFrameMetrics,
): { progress: LivenessProgress; phase: FaceCapturePhase } {
  const qualityPhase = assessFaceQuality(metrics);

  if (qualityPhase !== 'detecting') {
    return {
      progress: { ...progress, holdFrameCount: 0 },
      phase: qualityPhase,
    };
  }

  if (progress.step === 'blink') {
    if (!progress.eyesWereClosed && areEyesClosed(metrics)) {
      return {
        progress: { ...progress, eyesWereClosed: true, holdFrameCount: 0 },
        phase: 'liveness_check',
      };
    }

    if (progress.eyesWereClosed && areEyesOpen(metrics)) {
      return {
        progress: {
          ...progress,
          blinkCompleted: true,
          step: 'head_turn',
          baselineYaw: metrics.yawAngle,
          holdFrameCount: 0,
        },
        phase: 'liveness_check',
      };
    }

    return { progress, phase: 'liveness_check' };
  }

  if (progress.step === 'head_turn') {
    const baselineYaw = progress.baselineYaw ?? metrics.yawAngle;

    if (hasHeadTurned(baselineYaw, metrics.yawAngle)) {
      return {
        progress: {
          ...progress,
          headTurnCompleted: true,
          step: 'hold',
          holdFrameCount: 0,
        },
        phase: 'liveness_check',
      };
    }

    return {
      progress: { ...progress, baselineYaw, holdFrameCount: 0 },
      phase: 'liveness_check',
    };
  }

  const nextHoldCount = progress.holdFrameCount + 1;

  if (nextHoldCount >= HOLD_FRAMES_REQUIRED) {
    return { progress, phase: 'capture_ok' };
  }

  return {
    progress: { ...progress, holdFrameCount: nextHoldCount },
    phase: 'liveness_check',
  };
}

export function getLivenessGuidanceKey(step: LivenessStep): string {
  switch (step) {
    case 'blink':
      return 'faceCapture.liveness.blink';
    case 'head_turn':
      return 'faceCapture.liveness.headTurn';
    case 'hold':
      return 'faceCapture.liveness.hold';
    default:
      return 'faceCapture.phases.livenessCheck';
  }
}
