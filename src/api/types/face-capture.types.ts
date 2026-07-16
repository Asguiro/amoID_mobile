export type FaceCaptureMode = 'enrollment' | 'verification';

export type FaceCapturePhase =
  | 'idle'
  | 'detecting'
  | 'too_far'
  | 'too_close'
  | 'bad_light'
  | 'blur'
  | 'off_center'
  | 'liveness_check'
  | 'liveness_failed'
  | 'capture_ok'
  | 'max_attempts';

export type FaceCaptureBusinessStatus =
  | 'pending'
  | 'captured'
  | 'failed'
  | 'manual_required';

export type FaceCaptureQualityLabel = 'good' | 'acceptable' | 'poor';

export interface FaceCaptureSession {
  sessionId: string;
  mode: FaceCaptureMode;
  phase: FaceCapturePhase;
  attemptCount: number;
  businessStatus: FaceCaptureBusinessStatus;
  qualityLabel?: FaceCaptureQualityLabel;
}

export interface FaceCaptureResult {
  sessionId: string;
  mode: FaceCaptureMode;
  businessStatus: FaceCaptureBusinessStatus;
  qualityLabel: FaceCaptureQualityLabel;
  completedAt: string;
  /** Ephemeral local preview URI for recap UI — never persisted after submit. */
  previewUri?: string;
}

export interface StartFaceCaptureRequest {
  mode: FaceCaptureMode;
}
