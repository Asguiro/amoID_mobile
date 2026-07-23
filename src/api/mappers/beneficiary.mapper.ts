import type {
  BeneficiaryCoverageStatus,
  BeneficiaryType,
  DossierCompletenessStatus,
} from '../types/beneficiary.types';
import type {
  BeneficiaryDossierDetail,
  BeneficiarySex,
  EnrollmentHealthFields,
  EnrollmentRequiredFields,
  EnrollmentSubmissionStatus,
  FaceCaptureQualityLabelApi,
} from '../types/enrollment.types';
import type { FaceCaptureQualityLabel } from '../types/face-capture.types';

type ApiEnumLike = string | null | undefined;

export type ApiBeneficiaryListItem = {
  id: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  birthDate?: string;
  phone?: string;
  address?: string;
  city?: string;
  nina?: string;
  amoNumber?: string;
  biometricCardNumber?: string;
  ninaMasked?: string;
  amoNumberMasked?: string;
  biometricCardNumberMasked?: string;
  coverageStatus?: string;
  beneficiaryType?: string;
  establishmentName?: string;
  dossierStatus?: string;
  hasBiometrics?: boolean;
  hasHealthInfo?: boolean;
  lastVerifiedAt?: string;
  healthSummary?: { consentAccepted?: boolean } | null;
  sex?: string;
  isProvisional?: boolean;
};

export type ApiMobileDossier = ApiBeneficiaryListItem & {
  health?: {
    bloodGroup?: string;
    allergies?: string;
    chronicConditions?: string;
    treatments?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    consentAccepted?: boolean;
  } | null;
};

export type ApiIdentifierCheckResponse = {
  exists: boolean;
  matches: Array<{
    id: string;
    displayName: string;
    establishmentName: string;
    matchedOn: string[];
  }>;
};

export type ApiEnrollmentDto = {
  id: string;
  beneficiaryId: string;
  beneficiaryName?: string;
  status?: string;
  syncStatus?: string;
  isProvisional?: boolean;
  submittedAt?: string;
};

function splitDisplayName(displayName?: string): {
  firstName: string;
  lastName: string;
} {
  const trimmed = displayName?.trim() ?? '';
  if (!trimmed) {
    return { firstName: '', lastName: '' };
  }

  const [firstName, ...rest] = trimmed.split(/\s+/);
  return {
    firstName: firstName ?? '',
    lastName: rest.join(' '),
  };
}

export function mapDossierStatus(
  value: ApiEnumLike,
): DossierCompletenessStatus {
  return value?.toUpperCase() === 'COMPLETE' ? 'complete' : 'incomplete';
}

export function mapCoverageStatus(
  value: ApiEnumLike,
): BeneficiaryCoverageStatus {
  switch (value?.toUpperCase()) {
    case 'ACTIVE':
      return 'active';
    case 'SUSPENDED':
      return 'suspended';
    case 'UPDATE_REQUIRED':
      return 'update_required';
    case 'NOT_FOUND':
      return 'not_found';
    default:
      return 'not_found';
  }
}

export function mapBeneficiaryType(value: ApiEnumLike): BeneficiaryType {
  return value?.toUpperCase() === 'DEPENDENT' ? 'dependent' : 'primary';
}

export function mapSexFromApi(value: ApiEnumLike): BeneficiarySex | '' {
  switch (value?.toUpperCase()) {
    case 'FEMALE':
      return 'female';
    case 'MALE':
      return 'male';
    default:
      return '';
  }
}

export function mapSexToApi(
  value: BeneficiarySex | '',
): 'FEMALE' | 'MALE' | undefined {
  if (value === 'female') return 'FEMALE';
  if (value === 'male') return 'MALE';
  return undefined;
}

export function mapBeneficiaryTypeToApi(
  value: BeneficiaryType | '',
): 'PRIMARY' | 'DEPENDENT' | undefined {
  if (value === 'primary') return 'PRIMARY';
  if (value === 'dependent') return 'DEPENDENT';
  return undefined;
}

export function mapFaceQualityToApi(
  value: FaceCaptureQualityLabel,
): FaceCaptureQualityLabelApi {
  switch (value) {
    case 'good':
      return 'GOOD';
    case 'acceptable':
      return 'ACCEPTABLE';
    default:
      return 'POOR';
  }
}

export function mapEnrollmentSubmissionStatus(
  enrollment: ApiEnrollmentDto,
): EnrollmentSubmissionStatus {
  if (enrollment.syncStatus?.toUpperCase() === 'PENDING_SYNC') {
    return 'pending_sync';
  }

  if (
    enrollment.isProvisional ||
    enrollment.status?.toUpperCase() === 'PENDING_VALIDATION'
  ) {
    return 'validation_pending';
  }

  return 'synced';
}

export function mapListItemToDossier(
  item: ApiBeneficiaryListItem,
): BeneficiaryDossierDetail {
  const names =
    item.firstName || item.lastName
      ? {
          firstName: item.firstName ?? '',
          lastName: item.lastName ?? '',
        }
      : splitDisplayName(item.displayName);

  return {
    id: item.id,
    amoNumber: item.amoNumber ?? item.amoNumberMasked ?? '',
    nina: item.nina ?? item.ninaMasked ?? '',
    biometricCardNumber:
      item.biometricCardNumber ?? item.biometricCardNumberMasked ?? '',
    firstName: names.firstName,
    lastName: names.lastName,
    birthDate: item.dateOfBirth ?? item.birthDate ?? '',
    phone: item.phone ?? '',
    address: item.address ?? '',
    city: item.city ?? '',
    sex: mapSexFromApi(item.sex),
    coverageStatus: mapCoverageStatus(item.coverageStatus),
    beneficiaryType: mapBeneficiaryType(item.beneficiaryType),
    establishmentName: item.establishmentName ?? '',
    dossierStatus: mapDossierStatus(item.dossierStatus),
    hasBiometrics: Boolean(item.hasBiometrics),
    hasHealthInfo: Boolean(
      item.hasHealthInfo ??
        item.healthSummary ??
        (item as ApiMobileDossier).health,
    ),
    lastVerifiedAt: item.lastVerifiedAt,
    isProvisional: item.isProvisional,
  };
}

export function mapMobileDossierToDetail(
  dossier: ApiMobileDossier,
): BeneficiaryDossierDetail {
  return mapListItemToDossier(dossier);
}

export function buildPhone(
  fields: Pick<EnrollmentRequiredFields, 'phoneCountryCode' | 'phoneNumber'>,
): string {
  const code = fields.phoneCountryCode.trim();
  const number = fields.phoneNumber.trim();
  if (!number) return '';
  return code ? `${code} ${number}` : number;
}

export function buildBeneficiaryWriteBody(
  fields: EnrollmentRequiredFields,
  healthFields: EnrollmentHealthFields,
  healthConsentAccepted: boolean,
): Record<string, unknown> {
  const healthPayload = {
    bloodGroup: healthFields.bloodGroup.trim() || undefined,
    allergies: healthFields.allergies.trim() || undefined,
    chronicConditions: healthFields.chronicConditions.trim() || undefined,
    treatments: healthFields.currentTreatments.trim() || undefined,
    emergencyContactName: healthFields.emergencyContactName.trim() || undefined,
    emergencyContactPhone:
      healthFields.emergencyContactPhone.trim() || undefined,
    consentAccepted: healthConsentAccepted,
  };

  const hasHealth = Object.values(healthPayload).some(
    value => value !== undefined && value !== false,
  );

  return {
    firstName: fields.firstName.trim(),
    lastName: fields.lastName.trim(),
    dateOfBirth: fields.birthDate.trim() || undefined,
    sex: mapSexToApi(fields.sex),
    phone: buildPhone(fields) || undefined,
    address: fields.address.trim() || undefined,
    city: fields.city.trim() || undefined,
    nina: fields.nina.trim() || undefined,
    biometricCardNumber: fields.biometricCardNumber.trim() || undefined,
    beneficiaryType: mapBeneficiaryTypeToApi(fields.beneficiaryType),
    ...(hasHealth || healthConsentAccepted ? { health: healthPayload } : {}),
  };
}

export function buildRequiredFieldsSnapshot(
  fields: EnrollmentRequiredFields,
): Record<string, unknown> {
  return {
    firstName: fields.firstName,
    lastName: fields.lastName,
    birthDate: fields.birthDate,
    sex: mapSexToApi(fields.sex) ?? '',
    phoneCountryCode: fields.phoneCountryCode,
    phoneNumber: fields.phoneNumber,
    address: fields.address,
    city: fields.city,
    beneficiaryType: mapBeneficiaryTypeToApi(fields.beneficiaryType) ?? '',
    ninaMasked: fields.nina ? `NINA-••••-${fields.nina.slice(-4)}` : '',
    biometricCardNumberMasked: fields.biometricCardNumber
      ? `CB-••••-${fields.biometricCardNumber.slice(-4)}`
      : '',
  };
}
