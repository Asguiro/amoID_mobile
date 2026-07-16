import type { BeneficiaryCoverageStatus } from './beneficiary.types';

export type TemporaryQrReason =
  | 'lost_card'
  | 'damaged_card'
  | 'renewal_pending'
  | 'operational';

export type TemporaryQrDuration = '24h' | '72h' | '7d';

export interface TemporaryQrBeneficiaryRef {
  id: string;
  firstName: string;
  lastName: string;
  amoNumber: string;
  coverageStatus: BeneficiaryCoverageStatus;
}

export interface TemporaryQrEligibilityRequest {
  beneficiaryId: string;
  forceNetworkError?: boolean;
  forceBusinessError?: boolean;
}

export interface TemporaryQrEligibilityResult {
  eligible: boolean;
  beneficiary: TemporaryQrBeneficiaryRef;
  reasonCode?: 'suspended' | 'not_found' | 'no_biometrics';
  message?: string;
}

export interface TemporaryQrGenerateRequest {
  beneficiaryId: string;
  reason: TemporaryQrReason;
  duration: TemporaryQrDuration;
  faceCaptureSessionId: string;
  forceNetworkError?: boolean;
  forceBusinessError?: boolean;
}

export interface TemporaryQrToken {
  tokenId: string;
  /** Opaque signed token encoded in the QR — no medical or biometric data. */
  qrValue: string;
  expiresAt: string;
  duration: TemporaryQrDuration;
  issuedAt: string;
  reason: TemporaryQrReason;
  beneficiary: TemporaryQrBeneficiaryRef;
  auditReference: string;
  printReference: string;
}

export interface TemporaryQrSearchRequest {
  query: string;
  forceNetworkError?: boolean;
}

export interface TemporaryQrSearchResult {
  results: TemporaryQrBeneficiaryRef[];
}
