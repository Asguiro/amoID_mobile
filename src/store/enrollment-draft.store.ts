import { Store } from '@tanstack/store';
import type {
  BeneficiaryDossierDetail,
  EnrollmentHealthFields,
  EnrollmentRequiredFields,
  EnrollmentSubmissionResult,
  ProvisionalIdentityInput,
  BeneficiaryIdentifierType,
} from '../api/types/enrollment.types';
import type { FaceCaptureResult } from '../api/types/face-capture.types';
import {
  EMPTY_ENROLLMENT_HEALTH_FIELDS,
  EMPTY_ENROLLMENT_REQUIRED_FIELDS,
} from '../api/types/enrollment.types';

export interface EnrollmentDraftState {
  searchQuery: string;
  selectedDossier: BeneficiaryDossierDetail | null;
  identifierType: BeneficiaryIdentifierType | null;
  isProvisional: boolean;
  provisionalIdentity: ProvisionalIdentityInput;
  requiredFields: EnrollmentRequiredFields;
  healthFields: EnrollmentHealthFields;
  healthConsentAccepted: boolean;
  faceCaptureResult: FaceCaptureResult | null;
  submissionResult: EnrollmentSubmissionResult | null;
  forceOfflineSubmit: boolean;
}

const initialProvisionalIdentity: ProvisionalIdentityInput = {
  firstName: '',
  lastName: '',
  birthDate: '',
};

const initialState: EnrollmentDraftState = {
  searchQuery: '',
  selectedDossier: null,
  identifierType: null,
  isProvisional: false,
  provisionalIdentity: initialProvisionalIdentity,
  requiredFields: { ...EMPTY_ENROLLMENT_REQUIRED_FIELDS },
  healthFields: { ...EMPTY_ENROLLMENT_HEALTH_FIELDS },
  healthConsentAccepted: false,
  faceCaptureResult: null,
  submissionResult: null,
  forceOfflineSubmit: false,
};

export const enrollmentDraftStore = new Store<EnrollmentDraftState>(initialState);

function parsePhoneParts(phone: string): Pick<
  EnrollmentRequiredFields,
  'phoneCountryCode' | 'phoneNumber'
> {
  const match = phone.trim().match(/^(\+\d+)\s*(.*)$/);

  if (match) {
    return {
      phoneCountryCode: match[1],
      phoneNumber: match[2].trim(),
    };
  }

  return {
    phoneCountryCode: EMPTY_ENROLLMENT_REQUIRED_FIELDS.phoneCountryCode,
    phoneNumber: phone.trim(),
  };
}

export function resetEnrollmentDraft(): void {
  enrollmentDraftStore.setState(() => ({ ...initialState }));
}

export function setEnrollmentSearchQuery(query: string): void {
  enrollmentDraftStore.setState(state => ({
    ...state,
    searchQuery: query,
  }));
}

export function selectEnrollmentDossier(dossier: BeneficiaryDossierDetail): void {
  const phoneParts = parsePhoneParts(dossier.phone);

  enrollmentDraftStore.setState(state => ({
    ...state,
    selectedDossier: dossier,
    isProvisional: false,
    requiredFields: {
      firstName: dossier.firstName,
      lastName: dossier.lastName,
      birthDate: dossier.birthDate,
      sex: '',
      phoneCountryCode: phoneParts.phoneCountryCode,
      phoneNumber: phoneParts.phoneNumber,
      address: dossier.address,
      city: '',
      beneficiaryType: dossier.beneficiaryType,
      nina: dossier.nina,
      biometricCardNumber: dossier.biometricCardNumber,
    },
  }));
}

export function startEnrollmentWithIdentifier(
  identifierType: BeneficiaryIdentifierType,
  identifier: string,
): void {
  enrollmentDraftStore.setState(state => ({
    ...state,
    selectedDossier: null,
    identifierType,
    isProvisional: false,
    provisionalIdentity: initialProvisionalIdentity,
    requiredFields: {
      ...EMPTY_ENROLLMENT_REQUIRED_FIELDS,
      nina: identifierType === 'nina' ? identifier.trim() : '',
      biometricCardNumber:
        identifierType === 'biometric_card' ? identifier.trim() : '',
    },
  }));
}

export function startProvisionalEnrollment(
  identity: ProvisionalIdentityInput,
): void {
  enrollmentDraftStore.setState(state => ({
    ...state,
    selectedDossier: null,
    identifierType: null,
    isProvisional: true,
    provisionalIdentity: identity,
    requiredFields: {
      ...state.requiredFields,
      firstName: identity.firstName,
      lastName: identity.lastName,
      birthDate: identity.birthDate,
    },
  }));
}

export function updateEnrollmentRequiredFields(
  fields: Partial<EnrollmentRequiredFields>,
): void {
  enrollmentDraftStore.setState(state => ({
    ...state,
    requiredFields: {
      ...state.requiredFields,
      ...fields,
    },
  }));
}

export function updateEnrollmentHealthFields(
  fields: Partial<EnrollmentHealthFields>,
): void {
  enrollmentDraftStore.setState(state => ({
    ...state,
    healthFields: {
      ...state.healthFields,
      ...fields,
    },
  }));
}

export function setEnrollmentHealthConsentAccepted(accepted: boolean): void {
  enrollmentDraftStore.setState(state => ({
    ...state,
    healthConsentAccepted: accepted,
  }));
}

export function setEnrollmentFaceCaptureResult(
  result: FaceCaptureResult,
): void {
  enrollmentDraftStore.setState(state => ({
    ...state,
    faceCaptureResult: result,
  }));
}

export function setEnrollmentSubmissionResult(
  result: EnrollmentSubmissionResult,
): void {
  enrollmentDraftStore.setState(state => ({
    ...state,
    submissionResult: result,
  }));
}

export function setForceOfflineSubmit(forceOffline: boolean): void {
  enrollmentDraftStore.setState(state => ({
    ...state,
    forceOfflineSubmit: forceOffline,
  }));
}
