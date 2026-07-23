import { MobileApiError, mobileRequest } from '../client';
import {
  buildBeneficiaryWriteBody,
  buildRequiredFieldsSnapshot,
  mapEnrollmentSubmissionStatus,
  mapListItemToDossier,
  mapMobileDossierToDetail,
  mapFaceQualityToApi,
  type ApiBeneficiaryListItem,
  type ApiEnrollmentDto,
  type ApiIdentifierCheckResponse,
  type ApiMobileDossier,
} from '../mappers/beneficiary.mapper';
import type {
  BeneficiaryDossierDetail,
  BeneficiaryIdentifierCheckRequest,
  BeneficiaryIdentifierCheckResponse,
  BeneficiarySearchRequest,
  BeneficiarySearchResponse,
  EnrollmentIdDocumentAttachment,
  EnrollmentSubmitRequest,
  EnrollmentSubmissionResult,
  PendingEnrollmentSummary,
} from '../types/enrollment.types';
import { AmoServiceError } from './service.utils';

function mapApiError(error: unknown): never {
  if (error instanceof AmoServiceError) {
    throw error;
  }

  if (error instanceof MobileApiError) {
    if (error.status === 0 || error.code.startsWith('HTTP_5')) {
      throw new AmoServiceError('NETWORK', error.message);
    }
    if (error.status === 400 || error.status === 422) {
      throw new AmoServiceError('VALIDATION', error.message);
    }
    if (error.status === 404) {
      throw new AmoServiceError('NOT_FOUND', error.message);
    }
    throw new AmoServiceError('BUSINESS', error.message);
  }

  if (error instanceof TypeError) {
    throw new AmoServiceError(
      'NETWORK',
      'Connexion impossible. Vérifiez le réseau.',
    );
  }

  throw new AmoServiceError(
    'BUSINESS',
    error instanceof Error ? error.message : 'Erreur inattendue.',
  );
}

async function resolveBase64(
  attachment: EnrollmentIdDocumentAttachment,
): Promise<string> {
  if (attachment.contentBase64) {
    return attachment.contentBase64;
  }

  const response = await fetch(attachment.uri);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Lecture du document impossible.'));
        return;
      }
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64 ?? '');
    };
    reader.onerror = () => reject(new Error('Lecture du document impossible.'));
    reader.readAsDataURL(blob);
  });
}

async function fetchDossierOrThrow(
  beneficiaryId: string,
): Promise<BeneficiaryDossierDetail> {
  const dossier = await mobileRequest<ApiMobileDossier>(
    `/mobile/beneficiaries/${beneficiaryId}`,
  );
  return mapMobileDossierToDetail(dossier);
}

async function checkViaIdentifierApi(
  request: BeneficiaryIdentifierCheckRequest,
): Promise<BeneficiaryIdentifierCheckResponse> {
  const body =
    request.identifierType === 'nina'
      ? { nina: request.identifier.trim() }
      : { amoNumber: request.identifier.trim() };

  const response = await mobileRequest<ApiIdentifierCheckResponse>(
    '/mobile/beneficiaries/identifier-check',
    { method: 'POST', body },
  );

  if (!response.exists || response.matches.length === 0) {
    return { status: 'not_found' };
  }

  const dossiers = await Promise.all(
    response.matches.slice(0, 5).map(match => fetchDossierOrThrow(match.id)),
  );

  if (dossiers.length === 1) {
    return { status: 'existing', beneficiary: dossiers[0] };
  }

  return { status: 'possible_duplicate', possibleMatches: dossiers };
}

async function checkViaSearch(
  identifier: string,
): Promise<BeneficiaryIdentifierCheckResponse> {
  const rows = await mobileRequest<ApiBeneficiaryListItem[]>(
    `/mobile/beneficiaries/search?q=${encodeURIComponent(identifier.trim())}`,
  );

  if (!rows.length) {
    return { status: 'not_found' };
  }

  const dossiers = await Promise.all(
    rows.slice(0, 5).map(row => fetchDossierOrThrow(row.id)),
  );

  if (dossiers.length === 1) {
    return { status: 'existing', beneficiary: dossiers[0] };
  }

  return { status: 'possible_duplicate', possibleMatches: dossiers };
}

async function uploadIdDocument(
  beneficiaryId: string,
  attachment: EnrollmentIdDocumentAttachment,
): Promise<void> {
  const contentBase64 = await resolveBase64(attachment);

  await mobileRequest(`/mobile/beneficiaries/${beneficiaryId}/media`, {
    method: 'POST',
    body: {
      kind: 'ID_DOCUMENT',
      label: attachment.label ?? 'Pièce d’identité',
      contentBase64,
      mimeType: attachment.mimeType,
      fileName: attachment.fileName,
    },
  });
}

export const enrollmentService = {
  async checkBeneficiaryIdentifier(
    request: BeneficiaryIdentifierCheckRequest,
  ): Promise<BeneficiaryIdentifierCheckResponse> {
    try {
      if (!request.identifier.trim()) {
        throw new AmoServiceError(
          'VALIDATION',
          'Saisissez un NINA ou un numéro de carte biométrique.',
        );
      }

      // L’API identifier-check couvre NINA / AMO / téléphone.
      // Pour la carte biométrique, on bascule sur la recherche textuelle.
      if (request.identifierType === 'biometric_card') {
        return await checkViaSearch(request.identifier);
      }

      return await checkViaIdentifierApi(request);
    } catch (error) {
      mapApiError(error);
    }
  },

  async searchBeneficiaries(
    request: BeneficiarySearchRequest,
  ): Promise<BeneficiarySearchResponse> {
    try {
      const query = request.query.trim();
      const path = query
        ? `/mobile/beneficiaries/search?q=${encodeURIComponent(query)}`
        : '/mobile/beneficiaries/search';
      const rows = await mobileRequest<ApiBeneficiaryListItem[]>(path);
      return { results: rows.map(mapListItemToDossier) };
    } catch (error) {
      mapApiError(error);
    }
  },

  async listBeneficiaries(): Promise<BeneficiaryDossierDetail[]> {
    try {
      const rows = await mobileRequest<ApiBeneficiaryListItem[]>(
        '/mobile/beneficiaries/search',
      );
      return rows.map(mapListItemToDossier);
    } catch (error) {
      mapApiError(error);
    }
  },

  async getBeneficiaryDossier(
    beneficiaryId: string,
  ): Promise<BeneficiaryDossierDetail> {
    try {
      if (!beneficiaryId) {
        throw new AmoServiceError('NOT_FOUND', 'Dossier introuvable.');
      }
      return await fetchDossierOrThrow(beneficiaryId);
    } catch (error) {
      mapApiError(error);
    }
  },

  async listMyEnrollments(): Promise<PendingEnrollmentSummary[]> {
    try {
      const response = await mobileRequest<{
        items?: ApiEnrollmentDto[];
      }>('/mobile/enrollments/mine');

      return (response.items ?? []).map(item => ({
        id: item.id,
        beneficiaryName: item.beneficiaryName ?? '',
        createdAt: item.submittedAt ?? new Date().toISOString(),
        status: mapEnrollmentSubmissionStatus(item),
      }));
    } catch (error) {
      mapApiError(error);
    }
  },

  async submitEnrollment(
    request: EnrollmentSubmitRequest,
  ): Promise<EnrollmentSubmissionResult> {
    try {
      if (request.forceOffline) {
        throw new AmoServiceError(
          'NETWORK',
          'Démo hors ligne : soumission simulée en échec réseau.',
        );
      }

      if (request.faceCapture.businessStatus !== 'captured') {
        throw new AmoServiceError(
          'VALIDATION',
          'La capture faciale doit être validée avant soumission.',
        );
      }

      const writeBody = buildBeneficiaryWriteBody(
        request.requiredFields,
        request.healthFields,
        request.healthConsentAccepted,
      );

      let beneficiaryId = request.beneficiaryId;

      if (beneficiaryId) {
        await mobileRequest<ApiMobileDossier>(
          `/mobile/beneficiaries/${beneficiaryId}`,
          { method: 'PATCH', body: writeBody },
        );
      } else {
        const created = await mobileRequest<ApiMobileDossier>(
          '/mobile/beneficiaries',
          { method: 'POST', body: writeBody },
        );
        beneficiaryId = created.id;
      }

      if (request.idDocument) {
        await uploadIdDocument(beneficiaryId, request.idDocument);
      }

      const enrollment = await mobileRequest<ApiEnrollmentDto>(
        '/mobile/enrollments',
        {
          method: 'POST',
          body: {
            beneficiaryId,
            biometricsMissing: true,
            faceCaptureSessionId: request.faceCapture.sessionId || undefined,
            faceQualityLabel: mapFaceQualityToApi(
              request.faceCapture.qualityLabel,
            ),
            healthConsentAccepted: request.healthConsentAccepted,
            requiredFields: buildRequiredFieldsSnapshot(request.requiredFields),
            isProvisional: request.isProvisional,
          },
        },
      );

      return {
        dossierId: enrollment.beneficiaryId || beneficiaryId,
        enrollmentId: enrollment.id,
        status: mapEnrollmentSubmissionStatus(enrollment),
        submittedAt: enrollment.submittedAt ?? new Date().toISOString(),
      };
    } catch (error) {
      mapApiError(error);
    }
  },
};
