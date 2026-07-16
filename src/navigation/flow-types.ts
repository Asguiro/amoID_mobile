import type { FaceCaptureMode } from '../api/types/face-capture.types';
import {
  ENROLLMENT_ROUTES,
  IDENTIFICATION_ROUTES,
  TEMPORARY_QR_ROUTES,
  VERIFICATION_ROUTES,
  type EnrollmentRouteName,
  type IdentificationRouteName,
  type TemporaryQrRouteName,
  type VerificationRouteName,
} from '../constants/routes';

export type EnrollmentStackParamList = {
  [ENROLLMENT_ROUTES.HOME]: undefined;
  [ENROLLMENT_ROUTES.IDENTITY_CHECK]: undefined;
  [ENROLLMENT_ROUTES.SEARCH]: undefined;
  [ENROLLMENT_ROUTES.DOSSIER]: { beneficiaryId: string };
  [ENROLLMENT_ROUTES.PROVISIONAL]: undefined;
  [ENROLLMENT_ROUTES.REQUIRED_INFO]: undefined;
  [ENROLLMENT_ROUTES.OPTIONAL_INFO]: undefined;
  [ENROLLMENT_ROUTES.FACE_CAPTURE]: undefined;
  [ENROLLMENT_ROUTES.RECAP]: undefined;
  [ENROLLMENT_ROUTES.SUBMIT]: undefined;
  [ENROLLMENT_ROUTES.CONFIRMATION]: undefined;
};

export type IdentificationStackParamList = {
  [IDENTIFICATION_ROUTES.START]: undefined;
  [IDENTIFICATION_ROUTES.FACE]: undefined;
  [IDENTIFICATION_ROUTES.QR]: undefined;
  [IDENTIFICATION_ROUTES.MANUAL]: undefined;
  [IDENTIFICATION_ROUTES.FACE_CAPTURE]: { mode?: FaceCaptureMode };
  [IDENTIFICATION_ROUTES.MATCH]: undefined;
  [IDENTIFICATION_ROUTES.POSSIBLE_MATCHES]: undefined;
  [IDENTIFICATION_ROUTES.RESULT]: undefined;
  [IDENTIFICATION_ROUTES.MANUAL_CONTROL]: undefined;
  [IDENTIFICATION_ROUTES.AUDIT]: undefined;
  [VERIFICATION_ROUTES.HOME]: undefined;
  [VERIFICATION_ROUTES.IDENTIFY]: undefined;
};

/** @deprecated Use IdentificationStackParamList */
export type VerificationStackParamList = IdentificationStackParamList;

export type TemporaryQrStackParamList = {
  [TEMPORARY_QR_ROUTES.HOME]: undefined;
  [TEMPORARY_QR_ROUTES.SEARCH]: undefined;
  [TEMPORARY_QR_ROUTES.FACE_CAPTURE]: undefined;
  [TEMPORARY_QR_ROUTES.PREVIEW]: undefined;
  [TEMPORARY_QR_ROUTES.CONFIRMATION]: undefined;
};

export type {
  EnrollmentRouteName,
  IdentificationRouteName,
  TemporaryQrRouteName,
  VerificationRouteName,
};
