import { mockBeneficiaries } from '../mocks/beneficiaries.mock';
import type {
  VerificationAuditEntry,
  VerificationDecisionRequest,
  VerificationMatchRequest,
  VerificationMatchResult,
} from '../types/verification.types';
import {
  AmoServiceError,
  delay,
  isBusinessTrigger,
  isNetworkTrigger,
  isNoMatchTrigger,
} from './service.utils';

const auditLog: VerificationAuditEntry[] = [];

function buildMatchFromBeneficiary(
  beneficiaryId: string,
): VerificationMatchResult {
  const beneficiary = mockBeneficiaries.find(item => item.id === beneficiaryId);

  if (!beneficiary) {
    return {
      matchId: `match-${Date.now()}`,
      status: 'not_found',
      confidenceLabel: 'low',
    };
  }

  const isDependent = beneficiary.beneficiaryType === 'dependent';
  const primaryHolder = isDependent
    ? mockBeneficiaries.find(item => item.beneficiaryType === 'primary')
    : undefined;

  let status: VerificationMatchResult['status'] = 'confirmed';
  let confidenceLabel: VerificationMatchResult['confidenceLabel'] = 'high';

  if (beneficiary.coverageStatus === 'suspended') {
    status = 'doubtful';
    confidenceLabel = 'medium';
  }

  if (beneficiary.coverageStatus === 'update_required') {
    status = 'doubtful';
    confidenceLabel = 'medium';
  }

  return {
    matchId: `match-${beneficiary.id}-${Date.now()}`,
    status,
    confidenceLabel,
    beneficiaryId: beneficiary.id,
    firstName: beneficiary.firstName,
    lastName: beneficiary.lastName,
    amoNumber: beneficiary.amoNumber,
    coverageStatus: beneficiary.coverageStatus,
    beneficiaryType: beneficiary.beneficiaryType,
    establishmentName: beneficiary.establishmentName,
    primaryHolderName: primaryHolder
      ? `${primaryHolder.firstName} ${primaryHolder.lastName}`
      : undefined,
    primaryHolderAmoNumber: primaryHolder?.amoNumber,
  };
}

export const verificationService = {
  async matchBeneficiary(
    request: VerificationMatchRequest,
  ): Promise<VerificationMatchResult> {
    await delay(900);

    if (request.forceNetworkError || isNetworkTrigger(request.amoNumber ?? '')) {
      throw new AmoServiceError(
        'NETWORK',
        'Impossible de rechercher une correspondance. Réessayez ou utilisez le numéro AMO.',
      );
    }

    if (request.forceNoMatch || isNoMatchTrigger(request.amoNumber ?? '')) {
      return {
        matchId: `match-none-${Date.now()}`,
        status: 'not_found',
        confidenceLabel: 'low',
      };
    }

    if (isBusinessTrigger(request.amoNumber ?? '')) {
      throw new AmoServiceError(
        'BUSINESS',
        'La vérification est temporairement indisponible pour cet établissement.',
      );
    }

    if (request.faceCapture.businessStatus !== 'captured') {
      throw new AmoServiceError(
        'VALIDATION',
        'Une capture faciale valide est requise.',
      );
    }

    const matchedBeneficiary =
      mockBeneficiaries.find(
        item =>
          request.amoNumber &&
          item.amoNumber.toLowerCase() === request.amoNumber.toLowerCase(),
      ) ?? mockBeneficiaries[0];

    return buildMatchFromBeneficiary(matchedBeneficiary.id);
  },

  async recordDecision(
    request: VerificationDecisionRequest,
    match: VerificationMatchResult,
    establishmentName: string,
  ): Promise<VerificationAuditEntry> {
    await delay(600);

    if (request.forceNetworkError) {
      throw new AmoServiceError(
        'NETWORK',
        'Journalisation impossible. Réessayez.',
      );
    }

    if (request.decision === 'manual' && !request.manualReason?.trim()) {
      throw new AmoServiceError(
        'VALIDATION',
        'Le motif du contrôle manuel est obligatoire.',
      );
    }

    const beneficiaryName =
      match.firstName && match.lastName
        ? `${match.firstName} ${match.lastName}`
        : 'Non identifié';

    const entry: VerificationAuditEntry = {
      auditId: `audit-${Date.now()}`,
      matchId: request.matchId,
      decision: request.decision,
      resultStatus: match.status,
      beneficiaryName,
      recordedAt: new Date().toISOString(),
      agentEstablishment: establishmentName,
    };

    auditLog.unshift(entry);
    return entry;
  },

  async listRecentAuditEntries(): Promise<VerificationAuditEntry[]> {
    await delay(300);
    return auditLog.slice(0, 10);
  },
};
