import { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ServiceUiState } from '../../api/types/ui-state.types';
import type { IdentificationGlobalStatus } from '../../api/types/identification.types';
import {
  AppButton,
  AppCard,
  AppHeader,
  AppScreen,
  AppText,
  BeneficiaryIdentityCard,
  EmptyState,
  ErrorState,
  LoadingState,
  SensitiveInfoNotice,
  StatusBadge,
} from '../../components/ui';
import type { StatusBadgeTone } from '../../components/ui/StatusBadge';
import { FlowFooter, FlowSection } from '../../components/layout/FlowLayout';
import {
  IDENTIFICATION_ROUTES,
  MAIN_STACK_ROUTES,
  VERIFICATION_ROUTES,
} from '../../constants/routes';
import { useSession } from '../../hooks/useSession';
import { useVerificationDecision } from '../../hooks/useVerification';
import { useVerificationFlow } from '../../hooks/useVerificationFlow';
import { useTranslation } from '../../hooks/useTranslation';
import type { IdentificationStackParamList } from '../../navigation/flow-types';
import { setVerificationAuditEntry } from '../../store/verification-flow.store';
import { useFlowStyles } from '../../theme/useFlowStyles';
import { useTheme } from '../../theme/ThemeProvider';
import { formatDisplayDate, formatDisplayDateTime } from '../../utils/formatDate';
import { maskNina } from '../../utils/maskSensitive';
import {
  getServiceErrorMessage,
  mapServiceErrorToUiState,
} from '../../utils/serviceError';
import { runAsync } from '../../utils/runAsync';

type Navigation = NativeStackNavigationProp<
  IdentificationStackParamList,
  typeof IDENTIFICATION_ROUTES.RESULT
>;

function getGlobalStatusTone(status: IdentificationGlobalStatus): StatusBadgeTone {
  switch (status) {
    case 'identified':
    case 'active_rights':
      return 'success';
    case 'needs_face_verification':
    case 'multiple_matches':
      return 'warning';
    case 'blocked':
    case 'expired_rights':
      return 'danger';
    default:
      return 'neutral';
  }
}

export function IdentificationResultScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const flowStyles = useFlowStyles();
  const { session } = useSession();
  const verificationFlow = useVerificationFlow();
  const decisionMutation = useVerificationDecision();
  const [uiState, setUiState] = useState<ServiceUiState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const result = verificationFlow.identificationResult;
  const match = verificationFlow.matchResult;
  const beneficiary = result?.beneficiary;

  if (!result) {
    return (
      <AppScreen header={<AppHeader title={t('identification.result.title')} showBack />}>
        <EmptyState
          title={t('identification.result.missingTitle')}
          description={t('identification.result.missingDescription')}
        />
      </AppScreen>
    );
  }

  const beneficiarySummary = beneficiary
    ? {
        ...beneficiary,
        dossierStatus: 'complete' as const,
      }
    : null;

  const handleVerifyFace = () => {
    navigation.navigate(IDENTIFICATION_ROUTES.FACE_CAPTURE, {
      mode: 'verification',
    });
  };

  const handleViewAuthorizedInfo = () => {
    if (!beneficiary?.id) {
      return;
    }

    navigation.getParent()?.navigate(MAIN_STACK_ROUTES.BENEFICIARY_DETAIL, {
      beneficiaryId: beneficiary.id,
    });
  };

  const handleLogCare = async () => {
    if (!session || !match) {
      return;
    }

    setUiState('LOADING');
    setErrorMessage(undefined);

    try {
      const auditEntry = await decisionMutation.mutateAsync({
        request: { matchId: match.matchId, decision: 'confirm' },
        match,
        establishmentName: session.establishmentName,
      });
      setVerificationAuditEntry(auditEntry);
      setUiState('SUCCESS');
      navigation.navigate(VERIFICATION_ROUTES.AUDIT);
    } catch (error) {
      setUiState(mapServiceErrorToUiState(error));
      setErrorMessage(getServiceErrorMessage(error));
    }
  };

  const handleStartEnrollment = () => {
    navigation.getParent()?.navigate(MAIN_STACK_ROUTES.ENROLLMENT);
  };

  return (
    <AppScreen header={<AppHeader title={t('identification.result.title')} showBack />}>
      {uiState === 'LOADING' ? <LoadingState /> : null}
      {uiState === 'ERROR_RESEAU' || uiState === 'ERROR_METIER' ? (
        <ErrorState message={errorMessage} onRetry={() => setUiState('IDLE')} />
      ) : null}

      <FlowSection first>
        <AppCard variant="elevated" style={flowStyles.banner}>
        <StatusBadge
          label={t(`identification.result.globalStatus.${result.globalStatus}`)}
          tone={getGlobalStatusTone(result.globalStatus)}
          showDot
        />
        <AppText variant="body" color={colors.textSecondary}>
          {t(`identification.result.banner.${result.globalStatus}`)}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          {t(`verification.result.confidence.${result.confidenceLabel}`)}
        </AppText>
        </AppCard>
      </FlowSection>

      {result.globalStatus === 'not_found' ? (
        <FlowSection>
          <EmptyState
            title={t('identification.result.notFoundTitle')}
            description={t('identification.result.notFoundDescription')}
          />
        </FlowSection>
      ) : null}

      {beneficiarySummary && beneficiary ? (
        <FlowSection>
          <BeneficiaryIdentityCard beneficiary={beneficiarySummary} />
          <AppCard variant="soft" style={flowStyles.listMd}>
            <View style={flowStyles.rowTight}>
              <AppText variant="caption" color={colors.textSecondary}>
                {t('identification.result.ninaLabel')}
              </AppText>
              <AppText variant="bodyStrong">{maskNina(beneficiary.nina)}</AppText>
            </View>
            <View style={flowStyles.rowTight}>
              <AppText variant="caption" color={colors.textSecondary}>
                {t('beneficiaries.birthDateLabel')}
              </AppText>
              <AppText variant="body">{formatDisplayDate(beneficiary.birthDate)}</AppText>
            </View>
            {beneficiary.lastVerifiedAt ? (
              <View style={flowStyles.rowTight}>
                <AppText variant="caption" color={colors.textSecondary}>
                  {t('beneficiaries.lastVerifiedLabel')}
                </AppText>
                <AppText variant="body">
                  {formatDisplayDateTime(beneficiary.lastVerifiedAt)}
                </AppText>
              </View>
            ) : null}
          </AppCard>
        </FlowSection>
      ) : null}

      {result.primaryHolderName ? (
        <FlowSection>
          <AppCard variant="soft" style={flowStyles.meta}>
            <AppText variant="bodyStrong">{t('verification.result.primaryHolder')}</AppText>
            <AppText variant="body">{result.primaryHolderName}</AppText>
            {result.primaryHolderAmoNumber ? (
              <AppText variant="caption" color={colors.textSecondary}>
                {result.primaryHolderAmoNumber}
              </AppText>
            ) : null}
          </AppCard>
        </FlowSection>
      ) : null}

      {result.requiresFaceVerification ? (
        <FlowSection>
          <SensitiveInfoNotice
            title={t('identification.qr.faceRequiredTitle')}
            message={t('identification.qr.faceRequiredNotice')}
          />
        </FlowSection>
      ) : null}

      <FlowFooter>
        {result.globalStatus === 'not_found' ? (
          <>
            <AppButton
              label={t('identification.result.startEnrollment')}
              fullWidth
              onPress={handleStartEnrollment}
            />
            <AppButton
              label={t('identification.result.retryManual')}
              variant="outline"
              fullWidth
              onPress={() => navigation.navigate(IDENTIFICATION_ROUTES.MANUAL)}
            />
          </>
        ) : null}

        {beneficiary && result.globalStatus !== 'not_found' ? (
          <>
            {result.requiresFaceVerification ? (
              <AppButton
                label={t('identification.result.verifyFace')}
                fullWidth
                onPress={handleVerifyFace}
              />
            ) : null}
            <AppButton
              label={t('identification.result.viewAuthorizedInfo')}
              variant={result.requiresFaceVerification ? 'outline' : 'primary'}
              fullWidth
              onPress={handleViewAuthorizedInfo}
            />
            {!result.requiresFaceVerification ? (
              <AppButton
                label={t('identification.result.logCare')}
                variant="secondary"
                fullWidth
                onPress={() => {
                  runAsync(() => handleLogCare());
                }}
                disabled={uiState === 'LOADING'}
              />
            ) : null}
          </>
        ) : null}
      </FlowFooter>
    </AppScreen>
  );
}
