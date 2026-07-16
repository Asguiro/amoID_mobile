import { useMutation } from '@tanstack/react-query';
import { identityService } from '../api/services/identity.service';
import type {
  FaceIdentificationPayload,
  IdentificationResult,
  ManualSearchPayload,
  QrScanPayload,
} from '../api/types/identification.types';

export const identificationQueryKeys = {
  all: ['identification'] as const,
  manual: ['identification', 'manual'] as const,
  qr: ['identification', 'qr'] as const,
  face: ['identification', 'face'] as const,
};

export function useManualIdentification() {
  return useMutation({
    mutationFn: (payload: ManualSearchPayload) =>
      identityService.identifyByManualSearch(payload),
  });
}

export function useQrIdentification() {
  return useMutation({
    mutationFn: (payload: QrScanPayload) => identityService.identifyByQr(payload),
  });
}

export function useFaceIdentification() {
  return useMutation({
    mutationFn: (payload: FaceIdentificationPayload) =>
      identityService.identifyByFace(payload),
  });
}

export type QrScannerPhase = 'idle' | 'scanning' | 'success' | 'error';

interface UseQrScannerOptions {
  onSuccess?: (result: IdentificationResult) => void;
}

export function useQrScanner(options?: UseQrScannerOptions) {
  const identifyMutation = useQrIdentification();

  const simulateScan = async (qrValue?: string) => {
    const resolvedValue = qrValue ?? 'AMO-2024-001284';

    try {
      const result = await identifyMutation.mutateAsync({ qrValue: resolvedValue });
      options?.onSuccess?.(result);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const reset = () => {
    identifyMutation.reset();
  };

  const phase: QrScannerPhase = identifyMutation.isPending
    ? 'scanning'
    : identifyMutation.isError
      ? 'error'
      : identifyMutation.isSuccess
        ? 'success'
        : 'idle';

  return {
    phase,
    result: identifyMutation.data ?? null,
    error: identifyMutation.error,
    isScanning: identifyMutation.isPending,
    simulateScan,
    reset,
  };
}
