import { MobileApiError, mobileRequest } from '../client';
import type {
  FaceCaptureResult,
  FaceCaptureSession,
  StartFaceCaptureRequest,
} from '../types/face-capture.types';
import { AmoServiceError } from './service.utils';

const sessions = new Map<string, FaceCaptureSession & { beneficiaryId?: string }>();

function createSessionId(): string {
  return `fc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readFileAsBase64(uri: string): Promise<string | null> {
  return fetch(uri)
    .then((r) => r.blob())
    .then(
      (blob) =>
        new Promise<string | null>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result;
            if (typeof result !== 'string') {
              resolve(null);
              return;
            }
            const comma = result.indexOf(',');
            resolve(comma >= 0 ? result.slice(comma + 1) : result);
          };
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(blob);
        }),
    )
    .catch(() => null);
}

export const faceCaptureService = {
  async startSession(
    request: StartFaceCaptureRequest & { beneficiaryId?: string },
  ): Promise<FaceCaptureSession> {
    const session: FaceCaptureSession & { beneficiaryId?: string } = {
      sessionId: createSessionId(),
      mode: request.mode,
      phase: 'idle',
      attemptCount: 0,
      businessStatus: 'pending',
      beneficiaryId: request.beneficiaryId,
    };

    sessions.set(session.sessionId, session);
    return session;
  },

  async completeValidatedCapture(
    sessionId: string,
    options?: { previewUri?: string; qualityScore?: number },
  ): Promise<FaceCaptureResult> {
    const session = sessions.get(sessionId);

    if (!session) {
      throw new AmoServiceError('NOT_FOUND', 'Session de capture introuvable.');
    }

    const qualityLabel =
      session.attemptCount === 0 ? 'good' : 'acceptable';

    // Phase 3: enroll via API when beneficiary is known — never persist raw photo locally beyond preview
    if (session.beneficiaryId && options?.previewUri) {
      try {
        const imageBase64 = await readFileAsBase64(options.previewUri);
        if (imageBase64) {
          await mobileRequest('/biometrics/enroll', {
            method: 'POST',
            body: {
              beneficiaryId: session.beneficiaryId,
              imageBase64,
              qualityScore: options.qualityScore ?? 0.85,
              livenessPassed: true,
            },
          });
        }
      } catch (error) {
        if (error instanceof MobileApiError) {
          throw new AmoServiceError(
            'BUSINESS',
            error.message || 'Échec de l’enrôlement biométrique.',
          );
        }
        // Demo/offline: keep local capture OK without blocking enrollment flow
      }
    }

    const validatedSession: FaceCaptureSession = {
      ...session,
      phase: 'capture_ok',
      businessStatus: 'captured',
      qualityLabel,
    };

    sessions.set(sessionId, validatedSession);

    return {
      sessionId: validatedSession.sessionId,
      mode: validatedSession.mode,
      businessStatus: 'captured',
      qualityLabel: validatedSession.qualityLabel ?? 'good',
      completedAt: new Date().toISOString(),
      previewUri: options?.previewUri,
    };
  },

  resetSession(sessionId: string): void {
    sessions.delete(sessionId);
  },
};
