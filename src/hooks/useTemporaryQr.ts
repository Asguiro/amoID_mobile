import { useMutation } from '@tanstack/react-query';
import { temporaryQrService } from '../api/services/temporary-qr.service';
import type {
  TemporaryQrEligibilityRequest,
  TemporaryQrGenerateRequest,
  TemporaryQrSearchRequest,
} from '../api/types/temporary-qr.types';

export const temporaryQrQueryKeys = {
  all: ['temporary-qr'] as const,
  search: ['temporary-qr', 'search'] as const,
  eligibility: ['temporary-qr', 'eligibility'] as const,
  generate: ['temporary-qr', 'generate'] as const,
};

export function useTemporaryQrSearch() {
  return useMutation({
    mutationKey: temporaryQrQueryKeys.search,
    mutationFn: (payload: TemporaryQrSearchRequest) =>
      temporaryQrService.searchBeneficiaries(payload),
  });
}

export function useTemporaryQrEligibility() {
  return useMutation({
    mutationKey: temporaryQrQueryKeys.eligibility,
    mutationFn: (payload: TemporaryQrEligibilityRequest) =>
      temporaryQrService.checkEligibility(payload),
  });
}

export function useTemporaryQrGeneration() {
  return useMutation({
    mutationKey: temporaryQrQueryKeys.generate,
    mutationFn: (payload: TemporaryQrGenerateRequest) =>
      temporaryQrService.generateTemporaryQr(payload),
  });
}
