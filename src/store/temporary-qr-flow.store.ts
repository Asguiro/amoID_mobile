import { Store } from '@tanstack/store';
import type { FaceCaptureResult } from '../api/types/face-capture.types';
import type {
  TemporaryQrBeneficiaryRef,
  TemporaryQrDuration,
  TemporaryQrReason,
  TemporaryQrToken,
} from '../api/types/temporary-qr.types';

export interface TemporaryQrFlowState {
  beneficiary: TemporaryQrBeneficiaryRef | null;
  reason: TemporaryQrReason;
  duration: TemporaryQrDuration;
  faceCaptureResult: FaceCaptureResult | null;
  generatedToken: TemporaryQrToken | null;
}

const initialState: TemporaryQrFlowState = {
  beneficiary: null,
  reason: 'lost_card',
  duration: '72h',
  faceCaptureResult: null,
  generatedToken: null,
};

export const temporaryQrFlowStore = new Store<TemporaryQrFlowState>(initialState);

export function resetTemporaryQrFlow(): void {
  temporaryQrFlowStore.setState(() => ({ ...initialState }));
}

export function setTemporaryQrBeneficiary(
  beneficiary: TemporaryQrBeneficiaryRef,
): void {
  temporaryQrFlowStore.setState(state => ({
    ...state,
    beneficiary,
  }));
}

export function setTemporaryQrReason(reason: TemporaryQrReason): void {
  temporaryQrFlowStore.setState(state => ({
    ...state,
    reason,
  }));
}

export function setTemporaryQrDuration(duration: TemporaryQrDuration): void {
  temporaryQrFlowStore.setState(state => ({
    ...state,
    duration,
  }));
}

export function setTemporaryQrFaceCaptureResult(
  result: FaceCaptureResult,
): void {
  temporaryQrFlowStore.setState(state => ({
    ...state,
    faceCaptureResult: result,
  }));
}

export function setTemporaryQrGeneratedToken(token: TemporaryQrToken): void {
  temporaryQrFlowStore.setState(state => ({
    ...state,
    generatedToken: token,
  }));
}

export function getTemporaryQrFlowState(): TemporaryQrFlowState {
  return temporaryQrFlowStore.state;
}
