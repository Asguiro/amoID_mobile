import type { BeneficiaryCoverageStatus, BeneficiaryType } from './beneficiary.types';
import type { FaceCaptureResult } from './face-capture.types';
import type {
  VerificationBusinessStatus,
  VerificationConfidenceLabel,
} from './verification.types';

export type IdentificationMethod = 'face' | 'qr' | 'manual';

export type ManualSearchType = 'nina' | 'biometricCard' | 'amoNumber';

export type IdentificationGlobalStatus =
  | 'identified'
  | 'not_found'
  | 'multiple_matches'
  | 'needs_face_verification'
  | 'blocked'
  | 'expired_rights'
  | 'active_rights';

export interface IdentificationBeneficiarySummary {
  id: string;
  firstName: string;
  lastName: string;
  amoNumber: string;
  nina: string;
  biometricCardNumber: string;
  birthDate: string;
  coverageStatus: BeneficiaryCoverageStatus;
  beneficiaryType: BeneficiaryType;
  establishmentName: string;
  lastVerifiedAt?: string;
}

export interface IdentificationMatchCandidate {
  matchId: string;
  status: VerificationBusinessStatus;
  confidenceLabel: VerificationConfidenceLabel;
  beneficiary: IdentificationBeneficiarySummary;
  primaryHolderName?: string;
  primaryHolderAmoNumber?: string;
}

export interface IdentificationResult {
  identificationId: string;
  method: IdentificationMethod;
  globalStatus: IdentificationGlobalStatus;
  status: VerificationBusinessStatus;
  confidenceLabel: VerificationConfidenceLabel;
  requiresFaceVerification: boolean;
  beneficiary?: IdentificationBeneficiarySummary;
  matches?: IdentificationMatchCandidate[];
  primaryHolderName?: string;
  primaryHolderAmoNumber?: string;
}

export interface ManualSearchPayload {
  searchType: ManualSearchType;
  searchValue: string;
  forceNetworkError?: boolean;
  forceNoMatch?: boolean;
  forceMultipleMatches?: boolean;
}

export interface QrScanPayload {
  qrValue: string;
  forceNetworkError?: boolean;
  forceNoMatch?: boolean;
}

export interface FaceIdentificationPayload {
  faceCapture: FaceCaptureResult;
  amoNumber?: string;
  forceNetworkError?: boolean;
  forceNoMatch?: boolean;
  forceMultipleMatches?: boolean;
}
