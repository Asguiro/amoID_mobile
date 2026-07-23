import type { ServiceUiState } from '../api/types/ui-state.types';
import { MobileApiError } from '../api/client';
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

  if (error instanceof MobileApiError) {
    if (error.status === 0 || error.status >= 500) {
      return 'ERROR_RESEAU';
    }
    if (error.status === 400 || error.status === 422) {
      return 'ERROR_VALIDATION';
    }
    if (error.status === 404) {
      return 'EMPTY';
    }
    return 'ERROR_METIER';
  }

  if (error instanceof TypeError) {
    return 'ERROR_RESEAU';
  }

  return 'ERROR_METIER';
}

export function getServiceErrorMessage(error: unknown): string | undefined {
  if (error instanceof AmoServiceError || error instanceof MobileApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return undefined;
}
