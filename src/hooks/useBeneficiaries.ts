import { useQuery } from '@tanstack/react-query';
import { enrollmentService } from '../api/services/enrollment.service';
import type { BeneficiarySummary } from '../api/types/beneficiary.types';

export const beneficiaryQueryKeys = {
  all: ['beneficiaries'] as const,
  list: () => [...beneficiaryQueryKeys.all, 'list'] as const,
};

function toSummary(
  dossier: Awaited<ReturnType<typeof enrollmentService.listBeneficiaries>>[number],
): BeneficiarySummary {
  return {
    id: dossier.id,
    amoNumber: dossier.amoNumber,
    nina: dossier.nina,
    biometricCardNumber: dossier.biometricCardNumber,
    firstName: dossier.firstName,
    lastName: dossier.lastName,
    birthDate: dossier.birthDate,
    coverageStatus: dossier.coverageStatus,
    beneficiaryType: dossier.beneficiaryType,
    establishmentName: dossier.establishmentName,
    dossierStatus: dossier.dossierStatus,
    lastVerifiedAt: dossier.lastVerifiedAt,
  };
}

export function useBeneficiaries() {
  return useQuery({
    queryKey: beneficiaryQueryKeys.list(),
    queryFn: async () => {
      const dossiers = await enrollmentService.listBeneficiaries();
      return dossiers.map(toSummary);
    },
  });
}
