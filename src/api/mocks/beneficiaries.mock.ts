import type { BeneficiarySummary } from '../types/beneficiary.types';

export const mockBeneficiaries: BeneficiarySummary[] = [
  {
    id: 'ben-001',
    amoNumber: 'AMO-2024-001284',
    nina: 'NINA-001284',
    biometricCardNumber: 'BIO-2024-001284',
    firstName: 'Mariam',
    lastName: 'Coulibaly',
    birthDate: '1988-03-14',
    coverageStatus: 'active',
    beneficiaryType: 'primary',
    establishmentName: 'Antenne CANAM Bamako Centre',
    dossierStatus: 'complete',
    lastVerifiedAt: '2026-06-28T09:15:00Z',
  },
  {
    id: 'ben-002',
    amoNumber: 'AMO-2024-009871',
    nina: 'NINA-009871',
    biometricCardNumber: 'BIO-2024-009871',
    firstName: 'Ousmane',
    lastName: 'Diallo',
    birthDate: '1975-11-02',
    coverageStatus: 'update_required',
    beneficiaryType: 'primary',
    establishmentName: 'Antenne CANAM Bamako Centre',
    dossierStatus: 'incomplete',
  },
  {
    id: 'ben-003',
    amoNumber: 'AMO-2024-004512',
    nina: 'NINA-004512',
    biometricCardNumber: 'BIO-2024-004512',
    firstName: 'Aïssata',
    lastName: 'Koné',
    birthDate: '2012-07-21',
    coverageStatus: 'active',
    beneficiaryType: 'dependent',
    establishmentName: 'Antenne CANAM Bamako Centre',
    dossierStatus: 'complete',
    lastVerifiedAt: '2026-06-30T14:40:00Z',
  },
  {
    id: 'ben-004',
    amoNumber: 'AMO-2023-018902',
    nina: 'NINA-018902',
    biometricCardNumber: 'BIO-2023-018902',
    firstName: 'Sekou',
    lastName: 'Touré',
    birthDate: '1963-01-09',
    coverageStatus: 'suspended',
    beneficiaryType: 'primary',
    establishmentName: 'Antenne CANAM Sikasso',
    dossierStatus: 'incomplete',
  },
];

export async function fetchMockBeneficiaries(): Promise<BeneficiarySummary[]> {
  await delay(500);
  return mockBeneficiaries;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
