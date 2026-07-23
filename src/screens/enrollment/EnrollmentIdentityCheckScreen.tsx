import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type {
  BeneficiaryDossierDetail,
  BeneficiaryIdentifierCheckStatus,
  BeneficiaryIdentifierType,
} from '../../api/types/enrollment.types';
import type { ServiceUiState } from '../../api/types/ui-state.types';
import {
  AppButton,
  AppCard,
  AppHeader,
  AppScreen,
  AppText,
  AppTextInput,
  BeneficiaryIdentityCard,
  ErrorState,
  LoadingState,
  SectionTitle,
} from '../../components/ui';
import { FlowFooter, FlowIntro, FlowSection } from '../../components/layout/FlowLayout';
import { ENROLLMENT_ROUTES } from '../../constants/routes';
import { useEnrollmentIdentifierCheck } from '../../hooks/useEnrollment';
import { useTranslation } from '../../hooks/useTranslation';
import type { EnrollmentStackParamList } from '../../navigation/flow-types';
import {
  selectEnrollmentDossier,
  startEnrollmentWithIdentifier,
} from '../../store/enrollment-draft.store';
import { useFlowStyles } from '../../theme/useFlowStyles';
import { useTheme } from '../../theme/ThemeProvider';
import {
  getServiceErrorMessage,
  mapServiceErrorToUiState,
} from '../../utils/serviceError';
import { runAsync } from '../../utils/runAsync';

type Navigation = NativeStackNavigationProp<
  EnrollmentStackParamList,
  typeof ENROLLMENT_ROUTES.IDENTITY_CHECK
>;

const IDENTIFIER_TYPES: BeneficiaryIdentifierType[] = ['nina', 'biometric_card'];

const VERIFY_STEP_KEYS = [
  'enrollment.identityCheck.verifyingStep1',
  'enrollment.identityCheck.verifyingStep2',
  'enrollment.identityCheck.verifyingStep3',
] as const;

export function EnrollmentIdentityCheckScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const flow = useFlowStyles();
  const checkMutation = useEnrollmentIdentifierCheck();
  const [identifierType, setIdentifierType] =
    useState<BeneficiaryIdentifierType>('nina');
  const [identifier, setIdentifier] = useState('');
  const [checkStatus, setCheckStatus] =
    useState<BeneficiaryIdentifierCheckStatus | null>(null);
  const [existingBeneficiary, setExistingBeneficiary] =
    useState<BeneficiaryDossierDetail | null>(null);
  const [possibleMatches, setPossibleMatches] = useState<BeneficiaryDossierDetail[]>(
    [],
  );
  const [uiState, setUiState] = useState<ServiceUiState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [verifyStepIndex, setVerifyStepIndex] = useState(0);

  const isVerifying = checkMutation.isPending || uiState === 'LOADING';

  useEffect(() => {
    if (!isVerifying) {
      setVerifyStepIndex(0);
      return;
    }

    const timer = setInterval(() => {
      setVerifyStepIndex(current => (current + 1) % VERIFY_STEP_KEYS.length);
    }, 1400);

    return () => clearInterval(timer);
  }, [isVerifying]);

  const resetResult = () => {
    setCheckStatus(null);
    setExistingBeneficiary(null);
    setPossibleMatches([]);
    setErrorMessage(undefined);
  };

  const handleVerify = async () => {
    if (!identifier.trim()) {
      return;
    }

    setUiState('LOADING');
    resetResult();

    try {
      const response = await checkMutation.mutateAsync({ identifierType, identifier });

      setCheckStatus(response.status);

      if (response.status === 'existing' && response.beneficiary) {
        setExistingBeneficiary(response.beneficiary);
      }

      if (response.status === 'possible_duplicate' && response.possibleMatches) {
        setPossibleMatches(response.possibleMatches);
      }

      setUiState('SUCCESS');
    } catch (error) {
      setUiState(mapServiceErrorToUiState(error));
      setErrorMessage(getServiceErrorMessage(error));
    }
  };

  const handleCreateNewDossier = () => {
    startEnrollmentWithIdentifier(identifierType, identifier);
    navigation.navigate(ENROLLMENT_ROUTES.REQUIRED_INFO);
  };

  const handleCompleteDossier = () => {
    if (!existingBeneficiary) {
      return;
    }

    selectEnrollmentDossier(existingBeneficiary);
    navigation.navigate(ENROLLMENT_ROUTES.REQUIRED_INFO);
  };

  const handleViewDossier = () => {
    if (!existingBeneficiary) {
      return;
    }

    navigation.navigate(ENROLLMENT_ROUTES.DOSSIER, {
      beneficiaryId: existingBeneficiary.id,
    });
  };

  const handleCompareMatch = (dossier: BeneficiaryDossierDetail) => {
    navigation.navigate(ENROLLMENT_ROUTES.DOSSIER, {
      beneficiaryId: dossier.id,
    });
  };

  const handleProvisional = () => {
    navigation.navigate(ENROLLMENT_ROUTES.PROVISIONAL);
  };

  const handleOpenSearch = () => {
    navigation.navigate(ENROLLMENT_ROUTES.SEARCH);
  };

  const canVerify = identifier.trim().length > 0;

  return (
    <AppScreen
      header={<AppHeader title={t('enrollment.identityCheck.title')} showBack />}
      keyboardAvoiding>
      <FlowIntro>{t('enrollment.identityCheck.description')}</FlowIntro>

      <FlowSection first>
        <SectionTitle title={t('enrollment.identityCheck.typeSection')} />
        <View style={flow.chipRow}>
          {IDENTIFIER_TYPES.map(type => {
            const isActive = identifierType === type;

            return (
              <Pressable
                key={type}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                disabled={isVerifying}
                onPress={() => {
                  setIdentifierType(type);
                  resetResult();
                  setUiState('IDLE');
                }}
                style={[
                  flow.typeChip,
                  {
                    borderColor: isActive ? colors.primary : colors.border,
                    backgroundColor: isActive ? colors.cardSoft : colors.card,
                  },
                  isVerifying && styles.dimmed,
                ]}>
                <AppText
                  variant="bodyStrong"
                  color={isActive ? colors.primary : colors.textSecondary}>
                  {t(`enrollment.identityCheck.types.${type}`)}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        <AppTextInput
          label={t(`enrollment.identityCheck.label.${identifierType}`)}
          value={identifier}
          onChangeText={value => {
            setIdentifier(value);
            resetResult();
            setUiState('IDLE');
          }}
          placeholder={t(`enrollment.identityCheck.placeholder.${identifierType}`)}
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="done"
          editable={!isVerifying}
          onSubmitEditing={() => { runAsync(() => handleVerify()); }}
        />
      </FlowSection>

      {isVerifying ? (
        <FlowSection>
          <AppCard variant="elevated">
            <LoadingState label={t('enrollment.identityCheck.verifying')} />
            <AppText variant="body" color={colors.textSecondary} style={flow.sectionHint}>
              {t(VERIFY_STEP_KEYS[verifyStepIndex])}
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              {t('enrollment.identityCheck.verifyingHint')}
            </AppText>
          </AppCard>
        </FlowSection>
      ) : null}

      <FlowFooter>
        <AppButton
          label={t('enrollment.identityCheck.verify')}
          fullWidth
          loading={isVerifying}
          disabled={!canVerify}
          onPress={() => { runAsync(() => handleVerify()); }}
        />
        <AppButton
          label={t('enrollment.identityCheck.openSearch')}
          variant="outline"
          fullWidth
          disabled={isVerifying}
          onPress={handleOpenSearch}
        />
      </FlowFooter>

      {uiState === 'ERROR_RESEAU' ||
      uiState === 'ERROR_METIER' ||
      uiState === 'ERROR_VALIDATION' ? (
        <FlowSection>
          <SectionTitle title={t('enrollment.identityCheck.networkTitle')} />
          <ErrorState message={errorMessage} onRetry={() => { runAsync(() => handleVerify()); }} />
          {uiState === 'ERROR_RESEAU' ? (
            <AppButton
              label={t('enrollment.identityCheck.createProvisional')}
              variant="outline"
              fullWidth
              onPress={handleProvisional}
            />
          ) : null}
        </FlowSection>
      ) : null}

      {checkStatus === 'existing' && existingBeneficiary ? (
        <FlowSection>
          <SectionTitle title={t('enrollment.identityCheck.existingTitle')} />
          <AppCard variant="soft">
            <AppText variant="body" color={colors.textSecondary}>
              {t('enrollment.identityCheck.existingDescription')}
            </AppText>
          </AppCard>
          <BeneficiaryIdentityCard beneficiary={existingBeneficiary} />
          <AppButton
            label={t('enrollment.identityCheck.completeDossier')}
            fullWidth
            onPress={handleCompleteDossier}
          />
          <AppButton
            label={t('enrollment.identityCheck.viewDossier')}
            variant="outline"
            fullWidth
            onPress={handleViewDossier}
          />
        </FlowSection>
      ) : null}

      {checkStatus === 'not_found' ? (
        <FlowSection>
          <SectionTitle title={t('enrollment.identityCheck.notFoundTitle')} />
          <AppCard variant="soft">
            <AppText variant="body" color={colors.textSecondary}>
              {t('enrollment.identityCheck.notFoundDescription')}
            </AppText>
          </AppCard>
          <AppButton
            label={t('enrollment.identityCheck.createNew')}
            fullWidth
            onPress={handleCreateNewDossier}
          />
        </FlowSection>
      ) : null}

      {checkStatus === 'possible_duplicate' && possibleMatches.length > 0 ? (
        <FlowSection>
          <SectionTitle title={t('enrollment.identityCheck.duplicateTitle')} />
          <AppCard variant="soft">
            <AppText variant="body" color={colors.textSecondary}>
              {t('enrollment.identityCheck.duplicateDescription')}
            </AppText>
          </AppCard>
          {possibleMatches.map(match => (
            <View key={match.id} style={flow.cardGap}>
              <BeneficiaryIdentityCard beneficiary={match} />
              <AppButton
                label={t('enrollment.identityCheck.viewDossier')}
                variant="outline"
                fullWidth
                onPress={() => handleCompareMatch(match)}
              />
            </View>
          ))}
          <AppButton
            label={t('enrollment.identityCheck.createNew')}
            fullWidth
            onPress={handleCreateNewDossier}
          />
        </FlowSection>
      ) : null}

      {uiState === 'IDLE' && !checkStatus ? (
        <FlowSection>
          <AppCard variant="soft">
            <AppText variant="body">{t('enrollment.identityCheck.hint')}</AppText>
          </AppCard>
        </FlowSection>
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  dimmed: {
    opacity: 0.6,
  },
});
