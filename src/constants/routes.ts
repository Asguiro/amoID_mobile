export const AUTH_ROUTES = {
  LOGIN: 'Login',
} as const;

export const MAIN_STACK_ROUTES = {
  HOME: 'Home',
  BENEFICIARIES: 'Beneficiaries',
  BENEFICIARY_DETAIL: 'BeneficiaryDetail',
  VERIFICATION: 'Verification',
  ENROLLMENT: 'Enrollment',
  TEMPORARY_QR: 'TemporaryQr',
  AUDIT: 'Audit',
  PROFILE: 'Profile',
} as const;

export const TEMPORARY_QR_ROUTES = {
  HOME: 'TemporaryQrHome',
  SEARCH: 'TemporaryQrSearch',
  FACE_CAPTURE: 'TemporaryQrFaceCapture',
  PREVIEW: 'TemporaryQrPreview',
  CONFIRMATION: 'TemporaryQrConfirmation',
} as const;

export const ENROLLMENT_ROUTES = {
  HOME: 'EnrollmentHome',
  SEARCH: 'EnrollmentSearch',
  DOSSIER: 'EnrollmentDossier',
  IDENTITY_CHECK: 'EnrollmentIdentityCheck',
  PROVISIONAL: 'EnrollmentProvisional',
  REQUIRED_INFO: 'EnrollmentMandatoryInfo',
  OPTIONAL_INFO: 'EnrollmentHealthEmergency',
  FACE_CAPTURE: 'EnrollmentFaceCapture',
  RECAP: 'EnrollmentRecap',
  SUBMIT: 'EnrollmentSubmit',
  CONFIRMATION: 'EnrollmentConfirmation',
} as const;

export const IDENTIFICATION_ROUTES = {
  START: 'IdentificationStart',
  FACE: 'FaceIdentification',
  QR: 'QrCardScan',
  MANUAL: 'ManualIdentification',
  FACE_CAPTURE: 'VerificationFaceCapture',
  MATCH: 'VerificationMatch',
  POSSIBLE_MATCHES: 'PossibleMatches',
  RESULT: 'IdentificationResult',
  MANUAL_CONTROL: 'VerificationManual',
  AUDIT: 'VerificationAudit',
} as const;

/** @deprecated Prefer IDENTIFICATION_ROUTES — kept for gradual migration */
export const VERIFICATION_ROUTES = {
  HOME: 'VerificationHome',
  IDENTIFY: 'VerificationIdentify',
  FACE_CAPTURE: IDENTIFICATION_ROUTES.FACE_CAPTURE,
  MATCH: IDENTIFICATION_ROUTES.MATCH,
  RESULT: IDENTIFICATION_ROUTES.RESULT,
  MANUAL: IDENTIFICATION_ROUTES.MANUAL_CONTROL,
  AUDIT: IDENTIFICATION_ROUTES.AUDIT,
} as const;

export const ROOT_ROUTES = {
  AUTH: 'Auth',
  MAIN: 'Main',
} as const;

export type AuthRouteName = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];
export type MainStackRouteName =
  (typeof MAIN_STACK_ROUTES)[keyof typeof MAIN_STACK_ROUTES];
export type EnrollmentRouteName =
  (typeof ENROLLMENT_ROUTES)[keyof typeof ENROLLMENT_ROUTES];
export type IdentificationRouteName =
  (typeof IDENTIFICATION_ROUTES)[keyof typeof IDENTIFICATION_ROUTES];
export type VerificationRouteName =
  (typeof VERIFICATION_ROUTES)[keyof typeof VERIFICATION_ROUTES];
export type TemporaryQrRouteName =
  (typeof TEMPORARY_QR_ROUTES)[keyof typeof TEMPORARY_QR_ROUTES];
export type RootRouteName = (typeof ROOT_ROUTES)[keyof typeof ROOT_ROUTES];
