import type { Face } from 'react-native-vision-camera-face-detector';
import type { FaceCapturePhase } from '../../api/types/face-capture.types';

export interface FaceFrameMetrics {
  frameWidth: number;
  frameHeight: number;
  faceWidthRatio: number;
  centerOffsetX: number;
  centerOffsetY: number;
  yawAngle: number;
  rollAngle: number;
  leftEyeOpen: number | undefined;
  rightEyeOpen: number | undefined;
}

const MIN_FACE_WIDTH_RATIO = 0.18;
const MAX_FACE_WIDTH_RATIO = 0.68;
const CENTER_TOLERANCE = 0.22;
const MAX_ROLL_ANGLE = 22;

export function extractFaceMetrics(
  face: Face,
  frameWidth: number,
  frameHeight: number,
): FaceFrameMetrics {
  const faceWidthRatio = face.bounds.width / frameWidth;
  const faceCenterX = face.bounds.x + face.bounds.width / 2;
  const faceCenterY = face.bounds.y + face.bounds.height / 2;

  return {
    frameWidth,
    frameHeight,
    faceWidthRatio,
    centerOffsetX: Math.abs(faceCenterX / frameWidth - 0.5),
    centerOffsetY: Math.abs(faceCenterY / frameHeight - 0.5),
    yawAngle: face.yawAngle,
    rollAngle: face.rollAngle,
    leftEyeOpen: face.leftEyeOpenProbability,
    rightEyeOpen: face.rightEyeOpenProbability,
  };
}

export function assessFaceQuality(metrics: FaceFrameMetrics): FaceCapturePhase {
  if (metrics.faceWidthRatio < MIN_FACE_WIDTH_RATIO) {
    return 'too_far';
  }

  if (metrics.faceWidthRatio > MAX_FACE_WIDTH_RATIO) {
    return 'too_close';
  }

  if (
    metrics.centerOffsetX > CENTER_TOLERANCE ||
    metrics.centerOffsetY > CENTER_TOLERANCE
  ) {
    return 'off_center';
  }

  if (Math.abs(metrics.rollAngle) > MAX_ROLL_ANGLE) {
    return 'off_center';
  }

  return 'detecting';
}

export function areEyesClosed(metrics: FaceFrameMetrics): boolean {
  const left = metrics.leftEyeOpen;
  const right = metrics.rightEyeOpen;

  if (left === undefined || right === undefined) {
    return false;
  }

  return left < 0.4 && right < 0.4;
}

export function areEyesOpen(metrics: FaceFrameMetrics): boolean {
  const left = metrics.leftEyeOpen;
  const right = metrics.rightEyeOpen;

  if (left === undefined || right === undefined) {
    return false;
  }

  return left > 0.5 && right > 0.5;
}

export function hasHeadTurned(
  baselineYaw: number,
  currentYaw: number,
  threshold = 10,
): boolean {
  return Math.abs(currentYaw - baselineYaw) >= threshold;
}
