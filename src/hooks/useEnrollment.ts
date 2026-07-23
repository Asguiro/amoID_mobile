import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enrollmentService } from '../api/services/enrollment.service';
import type {
  BeneficiaryIdentifierCheckRequest,
  BeneficiarySearchRequest,
  EnrollmentSubmitRequest,
} from '../api/types/enrollment.types';
import { beneficiaryQueryKeys } from './useBeneficiaries';

export const enrollmentQueryKeys = {
  all: ['enrollment'] as const,
  dossier: (id: string) => [...enrollmentQueryKeys.all, 'dossier', id] as const,
  mine: () => [...enrollmentQueryKeys.all, 'mine'] as const,
};

export function useBeneficiaryDossier(beneficiaryId: string | undefined) {
  return useQuery({
    queryKey: enrollmentQueryKeys.dossier(beneficiaryId ?? 'unknown'),
    queryFn: () => enrollmentService.getBeneficiaryDossier(beneficiaryId ?? ''),
    enabled: Boolean(beneficiaryId),
  });
}

export function useMyEnrollments() {
  return useQuery({
    queryKey: enrollmentQueryKeys.mine(),
    queryFn: () => enrollmentService.listMyEnrollments(),
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: EnrollmentSubmitRequest) =>
      enrollmentService.submitEnrollment(request),
    onSuccess: async result => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: beneficiaryQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: enrollmentQueryKeys.all }),
        result.dossierId
          ? queryClient.invalidateQueries({
              queryKey: enrollmentQueryKeys.dossier(result.dossierId),
            })
          : Promise.resolve(),
      ]);
    },
  });
}
