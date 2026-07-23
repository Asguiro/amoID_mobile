import {
  errorCodes,
  isErrorWithCode,
  keepLocalCopy,
  pick,
  types,
} from '@react-native-documents/picker';
import type { EnrollmentIdDocumentAttachment } from '../api/types/enrollment.types';

export class DocumentPickCancelledError extends Error {
  constructor() {
    super('Document pick cancelled');
    this.name = 'DocumentPickCancelledError';
  }
}

async function uriToBase64(uri: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Impossible de lire le document.'));
        return;
      }
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64 ?? '');
    };
    reader.onerror = () => reject(new Error('Impossible de lire le document.'));
    reader.readAsDataURL(blob);
  });
}

export async function pickIdDocumentAttachment(): Promise<EnrollmentIdDocumentAttachment> {
  try {
    const [file] = await pick({
      type: [types.images, types.pdf],
      allowMultiSelection: false,
    });

    const fileName = file.name ?? `id-document-${Date.now()}`;
    const mimeType = file.type ?? 'application/octet-stream';

    const [copyResult] = await keepLocalCopy({
      files: [{ uri: file.uri, fileName }],
      destination: 'cachesDirectory',
    });

    const localUri =
      copyResult.status === 'success' ? copyResult.localUri : file.uri;

    const contentBase64 = await uriToBase64(localUri);

    return {
      uri: localUri,
      fileName,
      mimeType,
      contentBase64,
      label: 'Pièce d’identité',
    };
  } catch (error) {
    if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) {
      throw new DocumentPickCancelledError();
    }
    throw error;
  }
}
