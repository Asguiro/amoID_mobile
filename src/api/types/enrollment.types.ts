import type {
  BeneficiaryCoverageStatus,
  BeneficiaryType,
  DossierCompletenessStatus,
} from './beneficiary.types';
import type { FaceCaptureResult } from './face-capture.types';

export type BeneficiarySex = 'female' | 'male';

export interface EnrollmentRequiredFields {
  firstName: string;
  lastName: string;
  birthDate: string;
  sex: BeneficiarySex | '';
  phoneCountryCode: string;
  phoneNumber: string;
  address: string;
  city: string;
  beneficiaryType: BeneficiaryType | '';
  nina: string;
  biometricCardNumber: string;
}

export interface EnrollmentHealthFields {
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  emergencyContactAuthorized: boolean;
  bloodGroup: string;
  allergies: string;
  chronicConditions: string;
  currentTreatments: string;
  specialAttention: string;
  medicalNotes: string;
  followUpEstablishment: string;
  referringDoctor: string;
  externalDossierNumber: string;
}

export interface BeneficiaryDossierDetail {
  id: string;
  amoNumber: string;
  nina: string;
  biometricCardNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  address: string;
  coverageStatus: BeneficiaryCoverageStatus;
  beneficiaryType: BeneficiaryType;
  establishmentName: string;
  dossierStatus: DossierCompletenessStatus;
  hasBiometrics: boolean;
  hasHealthInfo: boolean;
  lastVerifiedAt?: string;
}

export interface BeneficiarySearchRequest {
  query: string;
}

export interface BeneficiarySearchResponse {
  results: BeneficiaryDossierDetail[];
}

export type BeneficiaryIdentifierType = 'nina' | 'biometric_card';

export type BeneficiaryIdentifierCheckStatus =
  | 'existing'
  | 'not_found'
  | 'possible_duplicate';

export interface BeneficiaryIdentifierCheckRequest {
  identifierType: BeneficiaryIdentifierType;
  identifier: string;
}

export interface BeneficiaryIdentifierCheckResponse {
  status: BeneficiaryIdentifierCheckStatus;
  beneficiary?: BeneficiaryDossierDetail;
  possibleMatches?: BeneficiaryDossierDetail[];
}

export interface ProvisionalIdentityInput {
  firstName: string;
  lastName: string;
  birthDate: string;
}

export type EnrollmentSubmissionStatus =
  | 'synced'
  | 'pending_sync'
  | 'validation_pending';

export interface EnrollmentSubmitRequest {
  beneficiaryId?: string;
  isProvisional: boolean;
  provisionalIdentity?: ProvisionalIdentityInput;
  requiredFields: EnrollmentRequiredFields;
  healthFields: EnrollmentHealthFields;
  healthConsentAccepted: boolean;
  faceCapture: FaceCaptureResult;
  forceOffline?: boolean;
}

export interface EnrollmentSubmissionResult {
  dossierId: string;
  status: EnrollmentSubmissionStatus;
  submittedAt: string;
}

export interface PendingEnrollmentSummary {
  id: string;
  beneficiaryName: string;
  createdAt: string;
  status: EnrollmentSubmissionStatus;
}

export const DEFAULT_PHONE_COUNTRY_CODE = '+223';

export const EMPTY_ENROLLMENT_REQUIRED_FIELDS: EnrollmentRequiredFields = {
  firstName: '',
  lastName: '',
  birthDate: '',
  sex: '',
  phoneCountryCode: DEFAULT_PHONE_COUNTRY_CODE,
  phoneNumber: '',
  address: '',
  city: '',
  beneficiaryType: '',
  nina: '',
  biometricCardNumber: '',
};

export const EMPTY_ENROLLMENT_HEALTH_FIELDS: EnrollmentHealthFields = {
  emergencyContactName: '',
  emergencyContactRelationship: '',
  emergencyContactPhone: '',
  emergencyContactAuthorized: false,
  bloodGroup: '',
  allergies: '',
  chronicConditions: '',
  currentTreatments: '',
  specialAttention: '',
  medicalNotes: '',
  followUpEstablishment: '',
  referringDoctor: '',
  externalDossierNumber: '',
};
