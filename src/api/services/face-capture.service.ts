import type {
  FaceCaptureResult,
  FaceCaptureSession,
  StartFaceCaptureRequest,
} from '../types/face-capture.types';
import { AmoServiceError, delay } from './service.utils';

const sessions = new Map<string, FaceCaptureSession>();

function createSessionId(): string {
  return `fc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const faceCaptureService = {
  async startSession(
    request: StartFaceCaptureRequest,
  ): Promise<FaceCaptureSession> {
    await delay(250);

    const session: FaceCaptureSession = {
      sessionId: createSessionId(),
      mode: request.mode,
      phase: 'idle',
      attemptCount: 0,
      businessStatus: 'pending',
    };

    sessions.set(session.sessionId, session);
    return session;
  },

  async completeValidatedCapture(
    sessionId: string,
    options?: { previewUri?: string },
  ): Promise<FaceCaptureResult> {
    await delay(300);

    const session = sessions.get(sessionId);

    if (!session) {
      throw new AmoServiceError('NOT_FOUND', 'Session de capture introuvable.');
    }

    const validatedSession: FaceCaptureSession = {
      ...session,
      phase: 'capture_ok',
      businessStatus: 'captured',
      qualityLabel: session.attemptCount === 0 ? 'good' : 'acceptable',
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
