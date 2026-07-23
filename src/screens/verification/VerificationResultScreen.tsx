import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ServiceUiState } from '../../api/types/ui-state.types';
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
  SectionTitle,
  StatusBadge,
} from '../../components/ui';
import { FlowFooter, FlowSection } from '../../components/layout/FlowLayout';
import { VERIFICATION_ROUTES } from '../../constants/routes';
import { useSession } from '../../hooks/useSession';
import { useVerificationDecision } from '../../hooks/useVerification';
import { useVerificationFlow } from '../../hooks/useVerificationFlow';
import { useTranslation } from '../../hooks/useTranslation';
import type { VerificationStackParamList } from '../../navigation/flow-types';
import { setVerificationAuditEntry } from '../../store/verification-flow.store';
import { useFlowStyles } from '../../theme/useFlowStyles';
import { useTheme } from '../../theme/ThemeProvider';
import {
  getServiceErrorMessage,
  mapServiceErrorToUiState,
} from '../../utils/serviceError';
import { runAsync } from '../../utils/runAsync';

type Navigation = NativeStackNavigationProp<
  VerificationStackParamList,
  typeof VERIFICATION_ROUTES.RESULT
>;

function getStatusTone(
  status: string,
): 'success' | 'warning' | 'danger' | 'neutral' {
  switch (status) {
    case 'confirmed':
      return 'success';
    case 'doubtful':
      return 'warning';
    case 'failed':
      return 'danger';
    default:
      return 'neutral';
  }
}

export function VerificationResultScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const flow = useFlowStyles();
  const { session } = useSession();
  const flowState = useVerificationFlow();
  const decisionMutation = useVerificationDecision();
  const [uiState, setUiState] = useState<ServiceUiState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const match = flowState.matchResult;

  if (!match) {
    return (
      <AppScreen header={<AppHeader title={t('verification.result.title')} showBack />}>
        <EmptyState
          title={t('verification.result.missing')}
          description={t('verification.result.missingDescription')}
        />
      </AppScreen>
    );
  }

  const recordDecision = async (decision: 'confirm' | 'reject' | 'manual') => {
    if (!session) {
      return;
    }

    if (decision === 'manual') {
      navigation.navigate(VERIFICATION_ROUTES.MANUAL);
      return;
    }

    setUiState('LOADING');
    setErrorMessage(undefined);

    try {
      const auditEntry = await decisionMutation.mutateAsync({
        request: { matchId: match.matchId, decision },
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

  const beneficiarySummary =
    match.beneficiaryId && match.firstName && match.lastName
      ? {
          id: match.beneficiaryId,
          amoNumber: match.amoNumber ?? '—',
          firstName: match.firstName,
          lastName: match.lastName,
          birthDate: '—',
          coverageStatus: match.coverageStatus ?? 'not_found',
          beneficiaryType: match.beneficiaryType ?? 'primary',
          establishmentName: match.establishmentName ?? '—',
          nina: '—',
          biometricCardNumber: '—',
          dossierStatus: 'complete' as const,
        }
      : null;

  return (
    <AppScreen header={<AppHeader title={t('verification.result.title')} showBack />}>
      {uiState === 'LOADING' ? <LoadingState /> : null}
      {uiState === 'ERROR_RESEAU' || uiState === 'ERROR_METIER' ? (
        <ErrorState message={errorMessage} onRetry={() => setUiState('IDLE')} />
      ) : null}

      <FlowSection first>
        <AppCard variant="elevated" style={flow.banner}>
          <StatusBadge
            label={t(`verification.statuses.${match.status}`)}
            tone={getStatusTone(match.status)}
            showDot
          />
          <AppText variant="body" color={colors.textSecondary}>
            {t(`verification.result.banner.${match.status}`)}
          </AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            {t(`verification.result.confidence.${match.confidenceLabel}`)}
          </AppText>
        </AppCard>
      </FlowSection>

      {match.status === 'not_found' ? (
        <FlowSection>
          <EmptyState
            title={t('verification.result.notFoundTitle')}
            description={t('verification.result.notFoundDescription')}
          />
        </FlowSection>
      ) : null}

      {beneficiarySummary ? (
        <FlowSection>
          <SectionTitle title={t('verification.result.beneficiarySection')} />
          <BeneficiaryIdentityCard beneficiary={beneficiarySummary} />
        </FlowSection>
      ) : null}

      {match.primaryHolderName ? (
        <FlowSection>
          <SectionTitle title={t('verification.result.primaryHolder')} />
          <AppCard variant="soft" style={flow.meta}>
            <AppText variant="body">{match.primaryHolderName}</AppText>
            {match.primaryHolderAmoNumber ? (
              <AppText variant="caption" color={colors.textSecondary}>
                {match.primaryHolderAmoNumber}
              </AppText>
            ) : null}
          </AppCard>
        </FlowSection>
      ) : null}

      <FlowFooter>
        <AppButton
          label={t('verification.result.confirm')}
          fullWidth
          onPress={() => { runAsync(() => recordDecision('confirm')); }}
          disabled={match.status === 'not_found' || uiState === 'LOADING'}
        />
        <AppButton
          label={t('verification.result.reject')}
          variant="outline"
          fullWidth
          onPress={() => { runAsync(() => recordDecision('reject')); }}
          disabled={uiState === 'LOADING'}
        />
        <AppButton
          label={t('verification.result.manual')}
          variant="secondary"
          fullWidth
          onPress={() => { runAsync(() => recordDecision('manual')); }}
          disabled={uiState === 'LOADING'}
        />
      </FlowFooter>
    </AppScreen>
  );
}
