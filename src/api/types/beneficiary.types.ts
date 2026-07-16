export type BeneficiaryCoverageStatus =
  | 'active'
  | 'suspended'
  | 'update_required'
  | 'not_found';

export type BeneficiaryType = 'primary' | 'dependent';

export type DossierCompletenessStatus = 'complete' | 'incomplete';

export interface BeneficiarySummary {
  id: string;
  amoNumber: string;
  nina: string;
  biometricCardNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  coverageStatus: BeneficiaryCoverageStatus;
  beneficiaryType: BeneficiaryType;
  establishmentName: string;
  dossierStatus: DossierCompletenessStatus;
  lastVerifiedAt?: string;
}
