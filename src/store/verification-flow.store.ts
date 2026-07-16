import { Store } from '@tanstack/store';
import type { FaceCaptureResult } from '../api/types/face-capture.types';
import type {
  IdentificationMethod,
  IdentificationResult,
  ManualSearchType,
} from '../api/types/identification.types';
import type {
  VerificationAuditEntry,
  VerificationMatchResult,
} from '../api/types/verification.types';

export interface VerificationFlowState {
  method: IdentificationMethod | null;
  amoNumber: string;
  manualSearchType: ManualSearchType | null;
  manualSearchValue: string;
  faceCaptureResult: FaceCaptureResult | null;
  identificationResult: IdentificationResult | null;
  matchResult: VerificationMatchResult | null;
  auditEntry: VerificationAuditEntry | null;
}

const initialState: VerificationFlowState = {
  method: null,
  amoNumber: '',
  manualSearchType: null,
  manualSearchValue: '',
  faceCaptureResult: null,
  identificationResult: null,
  matchResult: null,
  auditEntry: null,
};

export const verificationFlowStore = new Store<VerificationFlowState>(initialState);

export function resetVerificationFlow(): void {
  verificationFlowStore.setState(() => ({ ...initialState }));
}

export function setIdentificationMethod(method: IdentificationMethod): void {
  verificationFlowStore.setState(state => ({
    ...state,
    method,
  }));
}

export function setIdentificationResult(result: IdentificationResult): void {
  verificationFlowStore.setState(state => ({
    ...state,
    identificationResult: result,
    matchResult: identificationResultToMatchResult(result),
  }));
}

export function setManualSearchPayload(
  searchType: ManualSearchType,
  searchValue: string,
): void {
  verificationFlowStore.setState(state => ({
    ...state,
    manualSearchType: searchType,
    manualSearchValue: searchValue,
  }));
}

export function setVerificationAmoNumber(amoNumber: string): void {
  verificationFlowStore.setState(state => ({
    ...state,
    amoNumber,
  }));
}

function identificationResultToMatchResult(
  result: IdentificationResult,
): VerificationMatchResult | null {
  const beneficiary = result.beneficiary ?? result.matches?.[0]?.beneficiary;

  if (!beneficiary && result.globalStatus === 'not_found') {
    return {
      matchId: result.identificationId,
      status: 'not_found',
      confidenceLabel: result.confidenceLabel,
    };
  }

  if (!beneficiary) {
    return null;
  }

  const candidate = result.matches?.[0];

  return {
    matchId: candidate?.matchId ?? result.identificationId,
    status: result.status,
    confidenceLabel: result.confidenceLabel,
    beneficiaryId: beneficiary.id,
    firstName: beneficiary.firstName,
    lastName: beneficiary.lastName,
    amoNumber: beneficiary.amoNumber,
    coverageStatus: beneficiary.coverageStatus,
    beneficiaryType: beneficiary.beneficiaryType,
    establishmentName: beneficiary.establishmentName,
    primaryHolderName: result.primaryHolderName ?? candidate?.primaryHolderName,
    primaryHolderAmoNumber:
      result.primaryHolderAmoNumber ?? candidate?.primaryHolderAmoNumber,
  };
}

export function setVerificationFaceCaptureResult(
  result: FaceCaptureResult,
): void {
  verificationFlowStore.setState(state => ({
    ...state,
    faceCaptureResult: result,
  }));
}

export function setVerificationMatchResult(
  result: VerificationMatchResult,
): void {
  verificationFlowStore.setState(state => ({
    ...state,
    matchResult: result,
  }));
}

export function setVerificationAuditEntry(
  entry: VerificationAuditEntry,
): void {
  verificationFlowStore.setState(state => ({
    ...state,
    auditEntry: entry,
  }));
}
