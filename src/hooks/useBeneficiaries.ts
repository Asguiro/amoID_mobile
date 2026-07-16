import { useQuery } from '@tanstack/react-query';
import { fetchMockBeneficiaries } from '../api/mocks/beneficiaries.mock';

export const beneficiaryQueryKeys = {
  all: ['beneficiaries'] as const,
  list: () => [...beneficiaryQueryKeys.all, 'list'] as const,
};

export function useBeneficiaries() {
  return useQuery({
    queryKey: beneficiaryQueryKeys.list(),
    queryFn: fetchMockBeneficiaries,
  });
}
