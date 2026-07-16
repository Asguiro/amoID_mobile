import type { EnrollmentRequiredFields } from '../../api/types/enrollment.types';

export type RequiredFieldErrors = Partial<
  Record<keyof EnrollmentRequiredFields, string>
>;

export function validateRequiredFields(
  fields: EnrollmentRequiredFields,
): RequiredFieldErrors {
  const errors: RequiredFieldErrors = {};

  if (!fields.firstName.trim()) {
    errors.firstName = 'enrollment.mandatory.errors.firstName';
  }
  if (!fields.lastName.trim()) {
    errors.lastName = 'enrollment.mandatory.errors.lastName';
  }
  if (!fields.birthDate.trim()) {
    errors.birthDate = 'enrollment.mandatory.errors.birthDate';
  }
  if (!fields.sex) {
    errors.sex = 'enrollment.mandatory.errors.sex';
  }
  if (!fields.phoneNumber.trim()) {
    errors.phoneNumber = 'enrollment.mandatory.errors.phone';
  }
  if (!fields.address.trim()) {
    errors.address = 'enrollment.mandatory.errors.address';
  }
  if (!fields.beneficiaryType) {
    errors.beneficiaryType = 'enrollment.mandatory.errors.beneficiaryType';
  }

  return errors;
}

export function validateProvisionalIdentity(fields: {
  firstName: string;
  lastName: string;
  birthDate: string;
}): RequiredFieldErrors {
  const errors: RequiredFieldErrors = {};

  if (!fields.firstName.trim()) {
    errors.firstName = 'enrollment.provisional.errors.firstName';
  }
  if (!fields.lastName.trim()) {
    errors.lastName = 'enrollment.provisional.errors.lastName';
  }
  if (!fields.birthDate.trim()) {
    errors.birthDate = 'enrollment.provisional.errors.birthDate';
  }

  return errors;
}

export function formatEnrollmentPhone(fields: EnrollmentRequiredFields): string {
  const local = fields.phoneNumber.trim();

  if (!local) {
    return '';
  }

  return `${fields.phoneCountryCode} ${local}`;
}
