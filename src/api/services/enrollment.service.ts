import { mockBeneficiaries } from '../mocks/beneficiaries.mock';
import type {
  BeneficiaryDossierDetail,
  BeneficiaryIdentifierCheckRequest,
  BeneficiaryIdentifierCheckResponse,
  BeneficiarySearchRequest,
  BeneficiarySearchResponse,
  EnrollmentSubmitRequest,
  EnrollmentSubmissionResult,
} from '../types/enrollment.types';
import type { ServiceError } from '../types/ui-state.types';
import {
  AmoServiceError,
  delay,
  isBusinessTrigger,
  isDuplicateTrigger,
  isNetworkTrigger,
  isValidationTrigger,
} from './service.utils';

const MOCK_DOSSIERS: BeneficiaryDossierDetail[] = mockBeneficiaries.map(
  (beneficiary, index) => ({
    id: beneficiary.id,
    amoNumber: beneficiary.amoNumber,
    nina: beneficiary.nina,
    biometricCardNumber: beneficiary.biometricCardNumber,
    firstName: beneficiary.firstName,
    lastName: beneficiary.lastName,
    birthDate: beneficiary.birthDate,
    phone: index === 0 ? '+223 76 12 34 56' : '+223 65 98 76 54',
    address: index === 0 ? 'Hippodrome, Bamako' : 'Quartier Médine, Bamako',
    coverageStatus: beneficiary.coverageStatus,
    beneficiaryType: beneficiary.beneficiaryType,
    establishmentName: beneficiary.establishmentName,
    dossierStatus: beneficiary.dossierStatus,
    hasBiometrics: beneficiary.dossierStatus === 'complete' && index !== 1,
    hasHealthInfo: index === 0,
    lastVerifiedAt: beneficiary.lastVerifiedAt,
  }),
);

function normalizeIdentifier(value: string): string {
  return value.trim().toLowerCase();
}

function filterDossiers(query: string): BeneficiaryDossierDetail[] {
  const normalizedQuery = normalizeIdentifier(query);

  if (!normalizedQuery) {
    return MOCK_DOSSIERS;
  }

  return MOCK_DOSSIERS.filter(dossier => {
    const haystack = [
      dossier.firstName,
      dossier.lastName,
      dossier.amoNumber,
      dossier.phone,
      dossier.nina,
      dossier.biometricCardNumber,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

function findByIdentifier(
  identifierType: BeneficiaryIdentifierCheckRequest['identifierType'],
  identifier: string,
): BeneficiaryDossierDetail | undefined {
  const normalized = normalizeIdentifier(identifier);

  return MOCK_DOSSIERS.find(dossier => {
    if (identifierType === 'nina') {
      return normalizeIdentifier(dossier.nina) === normalized;
    }

    return normalizeIdentifier(dossier.biometricCardNumber) === normalized;
  });
}

function findPossibleDuplicates(
  identifierType: BeneficiaryIdentifierCheckRequest['identifierType'],
  identifier: string,
): BeneficiaryDossierDetail[] {
  const normalized = normalizeIdentifier(identifier);
  const partial = normalized.replace(/[^a-z0-9]/g, '').slice(0, 6);

  if (!partial) {
    return MOCK_DOSSIERS.slice(0, 2);
  }

  return MOCK_DOSSIERS.filter(dossier => {
    const values =
      identifierType === 'nina'
        ? [dossier.nina, dossier.lastName]
        : [dossier.biometricCardNumber, dossier.lastName];

    return values.some(value =>
      normalizeIdentifier(value).replace(/[^a-z0-9]/g, '').includes(partial),
    );
  });
}

function validateRequiredFields(
  request: EnrollmentSubmitRequest,
): ServiceError | null {
  const { requiredFields } = request;

  if (!requiredFields.firstName.trim()) {
    return { code: 'VALIDATION', message: 'Le prénom est obligatoire.' };
  }
  if (!requiredFields.lastName.trim()) {
    return { code: 'VALIDATION', message: 'Le nom est obligatoire.' };
  }
  if (!requiredFields.birthDate.trim()) {
    return { code: 'VALIDATION', message: 'La date de naissance est obligatoire.' };
  }
  if (!requiredFields.phoneNumber.trim()) {
    return { code: 'VALIDATION', message: 'Le téléphone est obligatoire.' };
  }
  if (!requiredFields.address.trim()) {
    return { code: 'VALIDATION', message: 'L’adresse est obligatoire.' };
  }
  if (!requiredFields.beneficiaryType) {
    return { code: 'VALIDATION', message: 'Le type de bénéficiaire est obligatoire.' };
  }

  return null;
}

export const enrollmentService = {
  async checkBeneficiaryIdentifier(
    request: BeneficiaryIdentifierCheckRequest,
  ): Promise<BeneficiaryIdentifierCheckResponse> {
    await delay(600);

    if (isNetworkTrigger(request.identifier)) {
      throw new AmoServiceError(
        'NETWORK',
        'Connexion impossible. Vérifiez le réseau.',
      );
    }

    if (!request.identifier.trim()) {
      throw new AmoServiceError(
        'VALIDATION',
        'Saisissez un NINA ou un numéro de carte biométrique.',
      );
    }

    if (isDuplicateTrigger(request.identifier)) {
      return {
        status: 'possible_duplicate',
        possibleMatches: findPossibleDuplicates(
          request.identifierType,
          request.identifier,
        ),
      };
    }

    const beneficiary = findByIdentifier(request.identifierType, request.identifier);

    if (!beneficiary) {
      return { status: 'not_found' };
    }

    return { status: 'existing', beneficiary };
  },

  async searchBeneficiaries(
    request: BeneficiarySearchRequest,
  ): Promise<BeneficiarySearchResponse> {
    await delay(700);

    if (isNetworkTrigger(request.query)) {
      throw new AmoServiceError(
        'NETWORK',
        'Connexion impossible. Vérifiez le réseau.',
      );
    }

    return {
      results: filterDossiers(request.query),
    };
  },

  async getBeneficiaryDossier(
    beneficiaryId: string,
  ): Promise<BeneficiaryDossierDetail> {
    await delay(400);

    const dossier = MOCK_DOSSIERS.find(item => item.id === beneficiaryId);

    if (!dossier) {
      throw new AmoServiceError('NOT_FOUND', 'Dossier introuvable.');
    }

    return dossier;
  },

  async submitEnrollment(
    request: EnrollmentSubmitRequest,
  ): Promise<EnrollmentSubmissionResult> {
    await delay(900);

    if (request.forceOffline || isNetworkTrigger(request.requiredFields.phoneNumber)) {
      throw new AmoServiceError(
        'NETWORK',
        'Soumission impossible hors ligne. Le dossier sera mis en file d’attente.',
      );
    }

    if (isValidationTrigger(request.requiredFields.firstName)) {
      throw new AmoServiceError(
        'VALIDATION',
        'Certaines informations obligatoires sont invalides.',
      );
    }

    if (isBusinessTrigger(request.requiredFields.lastName)) {
      throw new AmoServiceError(
        'BUSINESS',
        'Ce dossier ne peut pas être soumis dans l’état actuel.',
      );
    }

    const validationError = validateRequiredFields(request);
    if (validationError) {
      throw new AmoServiceError(validationError.code, validationError.message);
    }

    if (request.faceCapture.businessStatus !== 'captured') {
      throw new AmoServiceError(
        'VALIDATION',
        'La capture faciale doit être validée avant soumission.',
      );
    }

    const dossierId = request.beneficiaryId ?? `draft-${Date.now()}`;
    const status: EnrollmentSubmissionResult['status'] =
      request.isProvisional ? 'validation_pending' : 'synced';

    return {
      dossierId,
      status,
      submittedAt: new Date().toISOString(),
    };
  },
};
