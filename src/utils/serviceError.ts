import type { ServiceUiState } from '../api/types/ui-state.types';
import { AmoServiceError } from '../api/services/service.utils';

export function mapServiceErrorToUiState(error: unknown): ServiceUiState {
  if (error instanceof AmoServiceError) {
    switch (error.code) {
      case 'NETWORK':
        return 'ERROR_RESEAU';
      case 'VALIDATION':
        return 'ERROR_VALIDATION';
      case 'BUSINESS':
        return 'ERROR_METIER';
      case 'NOT_FOUND':
        return 'EMPTY';
      default:
        return 'ERROR_METIER';
    }
  }

  return 'ERROR_METIER';
}

export function getServiceErrorMessage(error: unknown): string | undefined {
  if (error instanceof AmoServiceError) {
    return error.message;
  }

  return undefined;
}
