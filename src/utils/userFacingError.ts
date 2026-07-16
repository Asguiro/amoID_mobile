import { AmoServiceError } from '../api/services/service.utils';

export type FaceCaptureErrorKind = 'camera' | 'capture' | 'detector';

export class FaceCapturePhotoError extends Error {
  constructor() {
    super('FaceCapturePhotoError');
    this.name = 'FaceCapturePhotoError';
  }
}

export function logDevError(scope: string, error: unknown): void {
  if (__DEV__) {
    console.error(`[${scope}]`, error);
  }
}

export function mapFaceCaptureErrorKind(kind: FaceCaptureErrorKind): string {
  switch (kind) {
    case 'camera':
      return 'faceCapture.errors.camera';
    case 'capture':
      return 'faceCapture.errors.captureFailed';
    case 'detector':
      return 'faceCapture.errors.detector';
  }
}

export function resolveUserFacingErrorKey(error: unknown): string | undefined {
  if (error instanceof AmoServiceError) {
    return undefined;
  }

  if (error instanceof FaceCapturePhotoError) {
    return 'faceCapture.errors.captureFailed';
  }

  return 'common.errorGeneric';
}

export function resolveUserFacingMessage(
  error: unknown,
  translate: (key: string) => string,
): string | undefined {
  if (error instanceof AmoServiceError) {
    return error.message;
  }

  const key = resolveUserFacingErrorKey(error);
  return key ? translate(key) : undefined;
}
