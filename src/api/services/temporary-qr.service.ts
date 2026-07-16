import { mockBeneficiaries } from '../mocks/beneficiaries.mock';
import {
  findTemporaryQrToken,
  registerTemporaryQrToken,
} from '../mocks/temporary-qr.mock';
import type {
  TemporaryQrBeneficiaryRef,
  TemporaryQrDuration,
  TemporaryQrEligibilityRequest,
  TemporaryQrEligibilityResult,
  TemporaryQrGenerateRequest,
  TemporaryQrSearchRequest,
  TemporaryQrSearchResult,
  TemporaryQrToken,
} from '../types/temporary-qr.types';
import {
  AmoServiceError,
  delay,
  isBusinessTrigger,
  isNetworkTrigger,
} from './service.utils';

const DURATION_HOURS: Record<TemporaryQrDuration, number> = {
  '24h': 24,
  '72h': 72,
  '7d': 168,
};

function toBeneficiaryRef(
  beneficiary: (typeof mockBeneficiaries)[number],
): TemporaryQrBeneficiaryRef {
  return {
    id: beneficiary.id,
    firstName: beneficiary.firstName,
    lastName: beneficiary.lastName,
    amoNumber: beneficiary.amoNumber,
    coverageStatus: beneficiary.coverageStatus,
  };
}

function findBeneficiaryById(
  beneficiaryId: string,
): TemporaryQrBeneficiaryRef | undefined {
  const beneficiary = mockBeneficiaries.find(item => item.id === beneficiaryId);
  return beneficiary ? toBeneficiaryRef(beneficiary) : undefined;
}

function normalizeQuery(value: string): string {
  return value.trim().toLowerCase();
}

function buildMockQrValue(tokenId: string, beneficiaryId: string): string {
  const signatureStub = tokenId.replace(/-/g, '').slice(0, 12);
  return `amoqr.mock.${beneficiaryId}.${signatureStub}`;
}

function assertRequestTriggers(
  triggerValue: string,
  payload: { forceNetworkError?: boolean; forceBusinessError?: boolean },
): void {
  if (payload.forceNetworkError || isNetworkTrigger(triggerValue)) {
    throw new AmoServiceError(
      'NETWORK',
      'Impossible de traiter la demande pour le moment. Réessayez.',
    );
  }

  if (payload.forceBusinessError || isBusinessTrigger(triggerValue)) {
    throw new AmoServiceError(
      'BUSINESS',
      'La génération de QR temporaire est indisponible pour cet établissement.',
    );
  }
}

export const temporaryQrService = {
  async searchBeneficiaries(
    payload: TemporaryQrSearchRequest,
  ): Promise<TemporaryQrSearchResult> {
    await delay(650);

    assertRequestTriggers(payload.query, payload);

    const normalizedQuery = normalizeQuery(payload.query);

    const results = mockBeneficiaries
      .filter(beneficiary => {
        if (!normalizedQuery) {
          return true;
        }

        const haystack = [
          beneficiary.firstName,
          beneficiary.lastName,
          beneficiary.amoNumber,
          beneficiary.nina,
          beneficiary.biometricCardNumber,
        ]
          .join(' ')
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      })
      .map(toBeneficiaryRef);

    return { results };
  },

  async checkEligibility(
    payload: TemporaryQrEligibilityRequest,
  ): Promise<TemporaryQrEligibilityResult> {
    await delay(500);

    assertRequestTriggers(payload.beneficiaryId, payload);

    const beneficiary = findBeneficiaryById(payload.beneficiaryId);

    if (!beneficiary) {
      return {
        eligible: false,
        beneficiary: {
          id: payload.beneficiaryId,
          firstName: '',
          lastName: '',
          amoNumber: '',
          coverageStatus: 'not_found',
        },
        reasonCode: 'not_found',
        message: 'Aucun dossier correspondant.',
      };
    }

    if (beneficiary.coverageStatus === 'suspended') {
      return {
        eligible: false,
        beneficiary,
        reasonCode: 'suspended',
        message: 'Les droits AMO sont suspendus. QR temporaire impossible.',
      };
    }

    const dossier = mockBeneficiaries.find(item => item.id === beneficiary.id);

    if (dossier?.dossierStatus !== 'complete') {
      return {
        eligible: false,
        beneficiary,
        reasonCode: 'no_biometrics',
        message: 'Le dossier doit être complet avec biométrie avant un QR temporaire.',
      };
    }

    return {
      eligible: true,
      beneficiary,
    };
  },

  async generateTemporaryQr(
    payload: TemporaryQrGenerateRequest,
  ): Promise<TemporaryQrToken> {
    await delay(900);

    assertRequestTriggers(payload.beneficiaryId, payload);

    const eligibility = await temporaryQrService.checkEligibility({
      beneficiaryId: payload.beneficiaryId,
    });

    if (!eligibility.eligible) {
      throw new AmoServiceError(
        'BUSINESS',
        eligibility.message ?? 'Génération de QR temporaire refusée.',
      );
    }

    if (!payload.faceCaptureSessionId.trim()) {
      throw new AmoServiceError(
        'VALIDATION',
        'Une capture faciale valide est requise avant la génération.',
      );
    }

    const issuedAt = new Date();
    const expiresAt = new Date(
      issuedAt.getTime() + DURATION_HOURS[payload.duration] * 60 * 60 * 1000,
    );
    const tokenId = `tqr-${payload.beneficiaryId}-${issuedAt.getTime()}`;
    const qrValue = buildMockQrValue(tokenId, payload.beneficiaryId);

    const token: TemporaryQrToken = {
      tokenId,
      qrValue,
      issuedAt: issuedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      duration: payload.duration,
      reason: payload.reason,
      beneficiary: eligibility.beneficiary,
      auditReference: `AUD-TQR-${issuedAt.getTime()}`,
      printReference: `ATT-${tokenId.slice(-8).toUpperCase()}`,
    };

    registerTemporaryQrToken(token);

    return token;
  },

  resolveBeneficiaryIdFromQr(qrValue: string): string | undefined {
    const token = findTemporaryQrToken(qrValue);
    return token?.beneficiary.id;
  },
};
