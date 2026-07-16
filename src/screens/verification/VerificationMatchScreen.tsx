import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ServiceUiState } from '../../api/types/ui-state.types';
import {
  AppButton,
  AppCard,
  AppHeader,
  AppScreen,
  AppText,
  ErrorState,
  LoadingState,
} from '../../components/ui';
import { FlowFooter } from '../../components/layout/FlowLayout';
import { IDENTIFICATION_ROUTES } from '../../constants/routes';
import { useFaceIdentification } from '../../hooks/useIdentification';
import { useVerificationFlow } from '../../hooks/useVerificationFlow';
import { useTranslation } from '../../hooks/useTranslation';
import type { IdentificationStackParamList } from '../../navigation/flow-types';
import {
  setIdentificationMethod,
  setIdentificationResult,
} from '../../store/verification-flow.store';
import { useTheme } from '../../theme/ThemeProvider';
import {
  getServiceErrorMessage,
  mapServiceErrorToUiState,
} from '../../utils/serviceError';

type Navigation = NativeStackNavigationProp<
  IdentificationStackParamList,
  typeof IDENTIFICATION_ROUTES.MATCH
>;

export function VerificationMatchScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const flowState = useVerificationFlow();
  const identifyMutation = useFaceIdentification();
  const [uiState, setUiState] = useState<ServiceUiState>('LOADING');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const runMatch = async () => {
    if (!flowState.faceCaptureResult) {
      setUiState('ERROR_VALIDATION');
      setErrorMessage(t('verification.match.captureRequired'));
      return;
    }

    setUiState('LOADING');
    setErrorMessage(undefined);
    setIdentificationMethod('face');

    try {
      const result = await identifyMutation.mutateAsync({
        faceCapture: flowState.faceCaptureResult,
        amoNumber: flowState.amoNumber || undefined,
      });

      setIdentificationResult(result);

      if (result.globalStatus === 'multiple_matches') {
        setUiState('SUCCESS');
        navigation.navigate(IDENTIFICATION_ROUTES.POSSIBLE_MATCHES);
        return;
      }

      setUiState(result.globalStatus === 'not_found' ? 'EMPTY' : 'SUCCESS');
      navigation.navigate(IDENTIFICATION_ROUTES.RESULT);
    } catch (error) {
      setUiState(mapServiceErrorToUiState(error));
      setErrorMessage(getServiceErrorMessage(error));
    }
  };

  useEffect(() => {
    void runMatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppScreen header={<AppHeader title={t('verification.match.title')} showBack />}>
      {uiState === 'LOADING' ? (
        <LoadingState label={t('verification.match.loading')} />
      ) : null}

      {uiState === 'ERROR_RESEAU' || uiState === 'ERROR_METIER' ? (
        <>
          <ErrorState message={errorMessage} onRetry={() => void runMatch()} />
          <FlowFooter>
            <AppButton
              label={t('verification.match.fallbackSearch')}
              variant="outline"
              fullWidth
              onPress={() => navigation.navigate(IDENTIFICATION_ROUTES.MANUAL)}
            />
          </FlowFooter>
        </>
      ) : null}

      {uiState === 'ERROR_VALIDATION' && errorMessage ? (
        <AppCard variant="soft">
          <AppText variant="body" color={colors.textSecondary}>
            {errorMessage}
          </AppText>
        </AppCard>
      ) : null}
    </AppScreen>
  );
}
