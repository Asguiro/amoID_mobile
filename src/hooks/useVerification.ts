import { useMutation } from '@tanstack/react-query';
import { verificationService } from '../api/services/verification.service';
import type {
  VerificationDecisionRequest,
  VerificationMatchRequest,
  VerificationMatchResult,
} from '../api/types/verification.types';

export const verificationQueryKeys = {
  all: ['verification'] as const,
};

interface RecordDecisionVariables {
  request: VerificationDecisionRequest;
  match: VerificationMatchResult;
  establishmentName: string;
}

export function useVerificationMatch() {
  return useMutation({
    mutationFn: (request: VerificationMatchRequest) =>
      verificationService.matchBeneficiary(request),
  });
}

export function useVerificationDecision() {
  return useMutation({
    mutationFn: ({ request, match, establishmentName }: RecordDecisionVariables) =>
      verificationService.recordDecision(request, match, establishmentName),
  });
}
