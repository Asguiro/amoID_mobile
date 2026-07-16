import { mockBeneficiaries } from '../mocks/beneficiaries.mock';
import type { BeneficiarySummary } from '../types/beneficiary.types';
import type {
  FaceIdentificationPayload,
  IdentificationBeneficiarySummary,
  IdentificationGlobalStatus,
  IdentificationMatchCandidate,
  IdentificationResult,
  ManualSearchPayload,
  QrScanPayload,
} from '../types/identification.types';
import type {
  VerificationBusinessStatus,
  VerificationConfidenceLabel,
} from '../types/verification.types';
import {
  AmoServiceError,
  delay,
  isBusinessTrigger,
  isNetworkTrigger,
  isNoMatchTrigger,
} from './service.utils';
import { temporaryQrService } from './temporary-qr.service';

const MULTIPLE_MATCH_TRIGGER = '__multiple__';

function toIdentificationBeneficiary(
  beneficiary: BeneficiarySummary,
): IdentificationBeneficiarySummary {
  return {
    id: beneficiary.id,
    firstName: beneficiary.firstName,
    lastName: beneficiary.lastName,
    amoNumber: beneficiary.amoNumber,
    nina: beneficiary.nina,
    biometricCardNumber: beneficiary.biometricCardNumber,
    birthDate: beneficiary.birthDate,
    coverageStatus: beneficiary.coverageStatus,
    beneficiaryType: beneficiary.beneficiaryType,
    establishmentName: beneficiary.establishmentName,
    lastVerifiedAt: beneficiary.lastVerifiedAt,
  };
}

function getPrimaryHolder(
  beneficiary: BeneficiarySummary,
): BeneficiarySummary | undefined {
  if (beneficiary.beneficiaryType !== 'dependent') {
    return undefined;
  }

  return mockBeneficiaries.find(item => item.beneficiaryType === 'primary');
}

function resolveGlobalStatusFromCoverage(
  coverageStatus: BeneficiarySummary['coverageStatus'],
): IdentificationGlobalStatus {
  if (coverageStatus === 'suspended') {
    return 'blocked';
  }

  if (coverageStatus === 'update_required') {
    return 'needs_face_verification';
  }

  return 'identified';
}

function resolveMatchStatus(
  beneficiary: BeneficiarySummary,
): {
  status: VerificationBusinessStatus;
  confidenceLabel: VerificationConfidenceLabel;
  globalStatus: IdentificationGlobalStatus;
} {
  if (beneficiary.coverageStatus === 'suspended') {
    return {
      status: 'doubtful',
      confidenceLabel: 'medium',
      globalStatus: 'blocked',
    };
  }

  if (beneficiary.coverageStatus === 'update_required') {
    return {
      status: 'doubtful',
      confidenceLabel: 'medium',
      globalStatus: 'needs_face_verification',
    };
  }

  return {
    status: 'confirmed',
    confidenceLabel: 'high',
    globalStatus: 'identified',
  };
}

function buildCandidate(beneficiary: BeneficiarySummary): IdentificationMatchCandidate {
  const primaryHolder = getPrimaryHolder(beneficiary);
  const { status, confidenceLabel } = resolveMatchStatus(beneficiary);

  return {
    matchId: `match-${beneficiary.id}-${Date.now()}`,
    status,
    confidenceLabel,
    beneficiary: toIdentificationBeneficiary(beneficiary),
    primaryHolderName: primaryHolder
      ? `${primaryHolder.firstName} ${primaryHolder.lastName}`
      : undefined,
    primaryHolderAmoNumber: primaryHolder?.amoNumber,
  };
}

function buildIdentificationResult(
  method: IdentificationResult['method'],
  beneficiary: BeneficiarySummary | undefined,
  options?: {
    requiresFaceVerification?: boolean;
    matches?: IdentificationMatchCandidate[];
    globalStatus?: IdentificationGlobalStatus;
  },
): IdentificationResult {
  if (!beneficiary && !options?.matches?.length) {
    return {
      identificationId: `id-none-${Date.now()}`,
      method,
      globalStatus: 'not_found',
      status: 'not_found',
      confidenceLabel: 'low',
      requiresFaceVerification: false,
    };
  }

  if (options?.matches && options.matches.length > 1) {
    return {
      identificationId: `id-multi-${Date.now()}`,
      method,
      globalStatus: 'multiple_matches',
      status: 'doubtful',
      confidenceLabel: 'medium',
      requiresFaceVerification: method === 'qr',
      matches: options.matches,
    };
  }

  const candidate =
    options?.matches?.[0] ?? (beneficiary ? buildCandidate(beneficiary) : undefined);

  if (!candidate) {
    return {
      identificationId: `id-none-${Date.now()}`,
      method,
      globalStatus: 'not_found',
      status: 'not_found',
      confidenceLabel: 'low',
      requiresFaceVerification: false,
    };
  }

  const globalStatus =
    options?.globalStatus ??
    (options?.requiresFaceVerification
      ? 'needs_face_verification'
      : resolveGlobalStatusFromCoverage(candidate.beneficiary.coverageStatus));

  return {
    identificationId: `id-${candidate.beneficiary.id}-${Date.now()}`,
    method,
    globalStatus,
    status: candidate.status,
    confidenceLabel: candidate.confidenceLabel,
    requiresFaceVerification: options?.requiresFaceVerification ?? false,
    beneficiary: candidate.beneficiary,
    primaryHolderName: candidate.primaryHolderName,
    primaryHolderAmoNumber: candidate.primaryHolderAmoNumber,
    matches: options?.matches,
  };
}

function normalizeSearchValue(value: string): string {
  return value.trim().toLowerCase();
}

function findBeneficiaryByManualSearch(
  payload: ManualSearchPayload,
): BeneficiarySummary | undefined {
  const value = normalizeSearchValue(payload.searchValue);

  return mockBeneficiaries.find(beneficiary => {
    switch (payload.searchType) {
      case 'nina':
        return (
          normalizeSearchValue(beneficiary.nina) === value ||
          normalizeSearchValue(beneficiary.nina).includes(value) ||
          value.includes(normalizeSearchValue(beneficiary.nina).replace('nina-', ''))
        );
      case 'biometricCard':
        return normalizeSearchValue(beneficiary.biometricCardNumber) === value;
      case 'amoNumber':
        return normalizeSearchValue(beneficiary.amoNumber) === value;
      default:
        return false;
    }
  });
}

function findBeneficiaryByQrValue(qrValue: string): BeneficiarySummary | undefined {
  const normalized = qrValue.trim().toLowerCase();
  const temporaryQrBeneficiaryId =
    temporaryQrService.resolveBeneficiaryIdFromQr(qrValue);

  if (temporaryQrBeneficiaryId) {
    return mockBeneficiaries.find(
      beneficiary => beneficiary.id === temporaryQrBeneficiaryId,
    );
  }

  return (
    mockBeneficiaries.find(
      beneficiary =>
        beneficiary.amoNumber.toLowerCase() === normalized ||
        beneficiary.biometricCardNumber.toLowerCase() === normalized ||
        beneficiary.nina.toLowerCase() === normalized ||
        normalized.includes(beneficiary.amoNumber.toLowerCase()),
    ) ?? mockBeneficiaries[0]
  );
}

function assertCommonTriggers(value: string, payload: {
  forceNetworkError?: boolean;
  forceNoMatch?: boolean;
}): void {
  if (payload.forceNetworkError || isNetworkTrigger(value)) {
    throw new AmoServiceError(
      'NETWORK',
      'Impossible d’identifier l’assuré pour le moment. Réessayez.',
    );
  }

  if (isBusinessTrigger(value)) {
    throw new AmoServiceError(
      'BUSINESS',
      'L’identification est temporairement indisponible pour cet établissement.',
    );
  }

  if (payload.forceNoMatch || isNoMatchTrigger(value)) {
    return;
  }
}

function shouldSimulateMultipleMatches(value: string, force?: boolean): boolean {
  return force === true || value.trim().toLowerCase() === MULTIPLE_MATCH_TRIGGER;
}

export const identityService = {
  async identifyByManualSearch(
    payload: ManualSearchPayload,
  ): Promise<IdentificationResult> {
    await delay(850);

    assertCommonTriggers(payload.searchValue, payload);

    if (payload.forceNoMatch || isNoMatchTrigger(payload.searchValue)) {
      return buildIdentificationResult('manual', undefined);
    }

    if (shouldSimulateMultipleMatches(payload.searchValue, payload.forceMultipleMatches)) {
      const matches = mockBeneficiaries.slice(0, 3).map(buildCandidate);
      return buildIdentificationResult('manual', undefined, { matches });
    }

    const beneficiary = findBeneficiaryByManualSearch(payload);
    return buildIdentificationResult('manual', beneficiary);
  },

  async identifyByQr(payload: QrScanPayload): Promise<IdentificationResult> {
    await delay(1100);

    assertCommonTriggers(payload.qrValue, payload);

    if (payload.forceNoMatch || isNoMatchTrigger(payload.qrValue)) {
      return buildIdentificationResult('qr', undefined);
    }

    const beneficiary = findBeneficiaryByQrValue(payload.qrValue);

    return buildIdentificationResult('qr', beneficiary, {
      requiresFaceVerification: true,
      globalStatus: 'needs_face_verification',
    });
  },

  async identifyByFace(
    payload: FaceIdentificationPayload,
  ): Promise<IdentificationResult> {
    await delay(950);

    const triggerValue = payload.amoNumber ?? payload.faceCapture.sessionId;
    assertCommonTriggers(triggerValue, payload);

    if (payload.faceCapture.businessStatus !== 'captured') {
      throw new AmoServiceError(
        'VALIDATION',
        'Une capture faciale valide est requise.',
      );
    }

    if (payload.forceNoMatch || isNoMatchTrigger(triggerValue)) {
      return buildIdentificationResult('face', undefined);
    }

    if (shouldSimulateMultipleMatches(triggerValue, payload.forceMultipleMatches)) {
      const matches = mockBeneficiaries.slice(0, 3).map(buildCandidate);
      return buildIdentificationResult('face', undefined, { matches });
    }

    const beneficiary =
      payload.amoNumber
        ? mockBeneficiaries.find(
            item =>
              item.amoNumber.toLowerCase() === payload.amoNumber?.toLowerCase(),
          )
        : mockBeneficiaries[0];

    return buildIdentificationResult('face', beneficiary ?? mockBeneficiaries[0]);
  },
};
