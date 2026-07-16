import { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ServiceUiState } from '../../api/types/ui-state.types';
import {
  AppButton,
  AppHeader,
  AppScreen,
  AppTextInput,
  ErrorState,
  LoadingState,
  SectionTitle,
} from '../../components/ui';
import { FlowFooter, FlowIntro, FlowSection } from '../../components/layout/FlowLayout';
import { VERIFICATION_ROUTES } from '../../constants/routes';
import { useSession } from '../../hooks/useSession';
import { useVerificationDecision } from '../../hooks/useVerification';
import { useVerificationFlow } from '../../hooks/useVerificationFlow';
import { useTranslation } from '../../hooks/useTranslation';
import type { VerificationStackParamList } from '../../navigation/flow-types';
import { setVerificationAuditEntry } from '../../store/verification-flow.store';
import { useFlowStyles } from '../../theme/useFlowStyles';
import {
  getServiceErrorMessage,
  mapServiceErrorToUiState,
} from '../../utils/serviceError';

type Navigation = NativeStackNavigationProp<
  VerificationStackParamList,
  typeof VERIFICATION_ROUTES.MANUAL
>;

export function VerificationManualScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const flow = useFlowStyles();
  const { session } = useSession();
  const flowState = useVerificationFlow();
  const decisionMutation = useVerificationDecision();
  const [reason, setReason] = useState('');
  const [reference, setReference] = useState('');
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [uiState, setUiState] = useState<ServiceUiState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const match = flowState.matchResult ?? {
    matchId: `manual-${Date.now()}`,
    status: 'doubtful' as const,
    confidenceLabel: 'low' as const,
  };

  const handleSubmit = async () => {
    if (!session) {
      return;
    }

    if (!reason.trim()) {
      setFieldError(t('verification.manual.reasonRequired'));
      setUiState('ERROR_VALIDATION');
      return;
    }

    setUiState('LOADING');
    setFieldError(undefined);
    setErrorMessage(undefined);

    try {
      const auditEntry = await decisionMutation.mutateAsync({
        request: {
          matchId: match.matchId,
          decision: 'manual',
          manualReason: reason,
          manualReference: reference || undefined,
        },
        match,
        establishmentName: session.establishmentName,
      });
      setVerificationAuditEntry(auditEntry);
      navigation.navigate(VERIFICATION_ROUTES.AUDIT);
    } catch (error) {
      setUiState(mapServiceErrorToUiState(error));
      setErrorMessage(getServiceErrorMessage(error));
    }
  };

  return (
    <AppScreen
      header={<AppHeader title={t('verification.manual.title')} showBack />}
      keyboardAvoiding>
      {uiState === 'LOADING' ? <LoadingState /> : null}

      {uiState === 'ERROR_RESEAU' || uiState === 'ERROR_METIER' ? (
        <ErrorState message={errorMessage} onRetry={() => setUiState('IDLE')} />
      ) : null}

      <FlowIntro>{t('verification.manual.description')}</FlowIntro>

      <FlowSection first>
        <SectionTitle title={t('verification.manual.formSection')} />
        <View style={flow.cardGap}>
          <AppTextInput
            label={t('verification.manual.reason')}
            value={reason}
            onChangeText={setReason}
            error={fieldError}
            multiline
          />
          <AppTextInput
            label={t('verification.manual.reference')}
            value={reference}
            onChangeText={setReference}
            placeholder={t('verification.manual.referencePlaceholder')}
          />
        </View>
      </FlowSection>

      <FlowFooter>
        <AppButton
          label={t('verification.manual.submit')}
          fullWidth
          onPress={() => void handleSubmit()}
          disabled={uiState === 'LOADING'}
        />
      </FlowFooter>
    </AppScreen>
  );
}
