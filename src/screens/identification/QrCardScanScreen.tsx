import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ServiceUiState } from '../../api/types/ui-state.types';
import type { IdentificationBeneficiarySummary } from '../../api/types/identification.types';
import {
  ActionGroupCard,
  ActionRow,
  AppButton,
  AppHeader,
  AppScreen,
  AppText,
  BeneficiaryIdentityCard,
  CircleIcon,
  EmptyState,
  ErrorState,
  QRScanCard,
  SectionTitle,
  SensitiveInfoNotice,
  StatusBadge,
} from '../../components/ui';
import { FlowFooter, FlowIntro, FlowSection } from '../../components/layout/FlowLayout';
import {
  IdentityGlyph,
} from '../../components/ui/icons/UiGlyphs';
import {
  IDENTIFICATION_ROUTES,
  MAIN_STACK_ROUTES,
} from '../../constants/routes';
import { useQrScanner } from '../../hooks/useIdentification';
import { useTranslation } from '../../hooks/useTranslation';
import type { IdentificationStackParamList } from '../../navigation/flow-types';
import {
  setIdentificationMethod,
  setIdentificationResult,
  setVerificationAmoNumber,
} from '../../store/verification-flow.store';
import { useFlowStyles } from '../../theme/useFlowStyles';
import { useTheme } from '../../theme/ThemeProvider';
import {
  getServiceErrorMessage,
  mapServiceErrorToUiState,
} from '../../utils/serviceError';
import { runAsync } from '../../utils/runAsync';

type Navigation = NativeStackNavigationProp<
  IdentificationStackParamList,
  typeof IDENTIFICATION_ROUTES.QR
>;

function toBeneficiarySummary(beneficiary: IdentificationBeneficiarySummary) {
  return {
    ...beneficiary,
    dossierStatus: 'complete' as const,
  };
}

export function QrCardScanScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const flow = useFlowStyles();
  const [uiState, setUiState] = useState<ServiceUiState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleScanSuccess = useCallback(
    (result: Parameters<typeof setIdentificationResult>[0]) => {
      setIdentificationMethod('qr');
      setIdentificationResult(result);
      setUiState('SUCCESS');
    },
    [],
  );

  const { phase, result, simulateScan, reset, isScanning } = useQrScanner({
    onSuccess: handleScanSuccess,
  });

  const handleSimulateScan = async () => {
    setUiState('LOADING');
    setErrorMessage(undefined);

    try {
      await simulateScan();
    } catch (error) {
      setUiState(mapServiceErrorToUiState(error));
      setErrorMessage(getServiceErrorMessage(error));
    }
  };

  const handleRetry = () => {
    reset();
    setUiState('IDLE');
    setErrorMessage(undefined);
  };

  const handleViewDossier = () => {
    const beneficiaryId = result?.beneficiary?.id;
    if (!beneficiaryId) {
      return;
    }

    navigation.getParent()?.navigate(MAIN_STACK_ROUTES.BENEFICIARY_DETAIL, {
      beneficiaryId,
    });
  };

  const handleVerifyFace = () => {
    if (result?.beneficiary?.amoNumber) {
      setVerificationAmoNumber(result.beneficiary.amoNumber);
    }

    navigation.navigate(IDENTIFICATION_ROUTES.FACE_CAPTURE, {
      mode: 'verification',
    });
  };

  const showPostScan = phase === 'success' && result?.beneficiary;
  const showNotFound = phase === 'success' && result?.globalStatus === 'not_found';
  const showError = uiState === 'ERROR_RESEAU' || uiState === 'ERROR_METIER';
  const showScanPhase = !showPostScan && !showNotFound;

  return (
    <AppScreen header={<AppHeader title={t('identification.qr.title')} showBack />}>
      {showScanPhase ? (
        <>
          <FlowIntro>{t('identification.qr.subtitle')}</FlowIntro>

          <FlowSection first>
            <QRScanCard
              securityNote={t('identification.qr.securityNote')}
              scanState={phase}
              actionLabel={t('identification.qr.simulateScan')}
              onAction={() => {
                runAsync(() => handleSimulateScan());
              }}
              disabled={isScanning}
            />

            {__DEV__ ? (
              <AppText variant="caption" color={colors.textSecondary} style={flow.devHint}>
                {t('identification.qr.devHint')}
              </AppText>
            ) : null}
          </FlowSection>

          {showError ? (
            <FlowSection>
              <ErrorState message={errorMessage} onRetry={handleRetry} />
            </FlowSection>
          ) : null}
        </>
      ) : null}

      {showNotFound ? (
        <FlowSection first>
          <EmptyState
            title={t('identification.result.notFoundTitle')}
            description={t('identification.result.notFoundDescription')}
          />
          <FlowFooter style={styles.footerFlush}>
            <AppButton
              label={t('identification.manual.title')}
              fullWidth
              onPress={() => navigation.navigate(IDENTIFICATION_ROUTES.MANUAL)}
            />
            <AppButton
              label={t('common.cancel')}
              variant="outline"
              fullWidth
              onPress={() => navigation.goBack()}
            />
          </FlowFooter>
        </FlowSection>
      ) : null}

      {showPostScan && result.beneficiary ? (
        <>
          <FlowIntro>{t('identification.qr.foundSubtitle')}</FlowIntro>

          <FlowSection first>
            <StatusBadge
              label={t('identification.qr.foundBadge')}
              tone="warning"
              showDot
            />
            <BeneficiaryIdentityCard
              beneficiary={toBeneficiarySummary(result.beneficiary)}
            />
            <SensitiveInfoNotice
              title={t('identification.qr.faceRequiredTitle')}
              message={t('identification.qr.faceRequiredNotice')}
            />
          </FlowSection>

          <FlowSection>
            <SectionTitle title={t('identification.qr.nextStepsTitle')} />
            <ActionGroupCard>
              <ActionRow
                title={t('identification.qr.actions.viewDossier')}
                subtitle={t('identification.qr.actions.viewDossierDescription')}
                icon={
                  <CircleIcon>
                    <IdentityGlyph color={colors.icon} />
                  </CircleIcon>
                }
                onPress={handleViewDossier}
                isLast
              />
            </ActionGroupCard>
          </FlowSection>

          <FlowFooter>
            <AppButton
              label={t('identification.qr.actions.verifyFace')}
              fullWidth
              onPress={handleVerifyFace}
            />
          </FlowFooter>
        </>
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  footerFlush: {
    marginTop: 0,
  },
});
