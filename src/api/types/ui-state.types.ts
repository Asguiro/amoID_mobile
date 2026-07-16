/** Generic UI states used across enrollment and verification flows. */
export type ServiceUiState =
  | 'IDLE'
  | 'LOADING'
  | 'SUCCESS'
  | 'ERROR_RESEAU'
  | 'ERROR_VALIDATION'
  | 'ERROR_METIER'
  | 'EMPTY';

export type ServiceErrorCode =
  | 'NETWORK'
  | 'VALIDATION'
  | 'BUSINESS'
  | 'NOT_FOUND'
  | 'UNKNOWN';

export interface ServiceError {
  code: ServiceErrorCode;
  message: string;
}
