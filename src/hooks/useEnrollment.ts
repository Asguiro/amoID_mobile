import { useMutation, useQuery } from '@tanstack/react-query';
import { enrollmentService } from '../api/services/enrollment.service';
import type {
  BeneficiaryIdentifierCheckRequest,
  BeneficiarySearchRequest,
  EnrollmentSubmitRequest,
} from '../api/types/enrollment.types';

export const enrollmentQueryKeys = {
  all: ['enrollment'] as const,
  dossier: (id: string) => [...enrollmentQueryKeys.all, 'dossier', id] as const,
};

export function useBeneficiaryDossier(beneficiaryId: string | undefined) {
  return useQuery({
    queryKey: enrollmentQueryKeys.dossier(beneficiaryId ?? 'unknown'),
    queryFn: () => enrollmentService.getBeneficiaryDossier(beneficiaryId ?? ''),
    enabled: Boolean(beneficiaryId),
  });
}

export function useEnrollmentIdentifierCheck() {
  return useMutation({
    mutationFn: (request: BeneficiaryIdentifierCheckRequest) =>
      enrollmentService.checkBeneficiaryIdentifier(request),
  });
}

export function useEnrollmentSearch() {
  return useMutation({
    mutationFn: (request: BeneficiarySearchRequest) =>
      enrollmentService.searchBeneficiaries(request),
  });
}

export function useEnrollmentSubmit() {
  return useMutation({
    mutationFn: (request: EnrollmentSubmitRequest) =>
      enrollmentService.submitEnrollment(request),
  });
}
