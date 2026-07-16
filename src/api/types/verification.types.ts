import type {
  BeneficiaryCoverageStatus,
  BeneficiaryType,
} from './beneficiary.types';
import type { FaceCaptureResult } from './face-capture.types';

export type VerificationBusinessStatus =
  | 'confirmed'
  | 'doubtful'
  | 'failed'
  | 'not_found';

export type VerificationConfidenceLabel = 'high' | 'medium' | 'low';

export type VerificationDecision = 'confirm' | 'reject' | 'manual';

export interface VerificationMatchRequest {
  faceCapture: FaceCaptureResult;
  amoNumber?: string;
  forceNoMatch?: boolean;
  forceNetworkError?: boolean;
}

export interface VerificationMatchResult {
  matchId: string;
  status: VerificationBusinessStatus;
  confidenceLabel: VerificationConfidenceLabel;
  beneficiaryId?: string;
  firstName?: string;
  lastName?: string;
  amoNumber?: string;
  coverageStatus?: BeneficiaryCoverageStatus;
  beneficiaryType?: BeneficiaryType;
  establishmentName?: string;
  primaryHolderName?: string;
  primaryHolderAmoNumber?: string;
}

export interface VerificationDecisionRequest {
  matchId: string;
  decision: VerificationDecision;
  manualReason?: string;
  manualReference?: string;
  forceNetworkError?: boolean;
}

export interface VerificationAuditEntry {
  auditId: string;
  matchId: string;
  decision: VerificationDecision;
  resultStatus: VerificationBusinessStatus;
  beneficiaryName: string;
  recordedAt: string;
  agentEstablishment: string;
}
