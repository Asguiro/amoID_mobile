import type { ServiceError } from '../types/ui-state.types';

export class AmoServiceError extends Error {
  readonly code: ServiceError['code'];

  constructor(code: ServiceError['code'], message: string) {
    super(message);
    this.name = 'AmoServiceError';
    this.code = code;
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

export function isNetworkTrigger(value: string): boolean {
  return value.trim().toLowerCase() === '__error_reseau__';
}

export function isValidationTrigger(value: string): boolean {
  return value.trim().toLowerCase() === '__error_validation__';
}

export function isBusinessTrigger(value: string): boolean {
  return value.trim().toLowerCase() === '__error_metier__';
}

export function isNoMatchTrigger(value: string): boolean {
  return value.trim().toLowerCase() === '__no_match__';
}

export function isDuplicateTrigger(value: string): boolean {
  return value.trim().toLowerCase() === '__duplicate__';
}
