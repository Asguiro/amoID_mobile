import { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ServiceUiState } from '../../api/types/ui-state.types';
import type {
  TemporaryQrBeneficiaryRef,
  TemporaryQrDuration,
  TemporaryQrReason,
} from '../../api/types/temporary-qr.types';
import {
  AppButton,
  AppCard,
  AppHeader,
  AppScreen,
  AppText,
  AppTextInput,
  ActionRow,
  CircleIcon,
  EmptyState,
  ErrorState,
  SectionTitle,
  SegmentedControl,
} from '../../components/ui';
import { FlowFooter, FlowIntro, FlowSection } from '../../components/layout/FlowLayout';
import { IdentityGlyph } from '../../components/ui/icons/UiGlyphs';
import { TEMPORARY_QR_ROUTES } from '../../constants/routes';
import {
  useTemporaryQrEligibility,
  useTemporaryQrSearch,
} from '../../hooks/useTemporaryQr';
import { useTranslation } from '../../hooks/useTranslation';
import type { TemporaryQrStackParamList } from '../../navigation/flow-types';
import {
  setTemporaryQrBeneficiary,
  setTemporaryQrDuration,
  setTemporaryQrReason,
} from '../../store/temporary-qr-flow.store';
import { useFlowStyles } from '../../theme/useFlowStyles';
import { useTheme } from '../../theme/ThemeProvider';
import {
  getServiceErrorMessage,
  mapServiceErrorToUiState,
} from '../../utils/serviceError';

type Navigation = NativeStackNavigationProp<
  TemporaryQrStackParamList,
  typeof TEMPORARY_QR_ROUTES.SEARCH
>;

export function TemporaryQrSearchScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const flow = useFlowStyles();
  const searchMutation = useTemporaryQrSearch();
  const eligibilityMutation = useTemporaryQrEligibility();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TemporaryQrBeneficiaryRef[]>([]);
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<TemporaryQrBeneficiaryRef | null>(null);
  const [reason, setReason] = useState<TemporaryQrReason>('lost_card');
  const [duration, setDuration] = useState<TemporaryQrDuration>('72h');
  const [uiState, setUiState] = useState<ServiceUiState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const reasonOptions = useMemo(
    () =>
      [
        { value: 'lost_card' as const, label: t('temporaryQr.search.reasons.lostCard') },
        {
          value: 'damaged_card' as const,
          label: t('temporaryQr.search.reasons.damagedCard'),
        },
        {
          value: 'renewal_pending' as const,
          label: t('temporaryQr.search.reasons.renewalPending'),
        },
        {
          value: 'operational' as const,
          label: t('temporaryQr.search.reasons.operational'),
        },
      ] as const,
    [t],
  );

  const durationOptions = useMemo(
    () =>
      [
        { value: '24h' as const, label: t('temporaryQr.search.durations.24h') },
        { value: '72h' as const, label: t('temporaryQr.search.durations.72h') },
        { value: '7d' as const, label: t('temporaryQr.search.durations.7d') },
      ] as const,
    [t],
  );

  const handleSearch = async () => {
    setUiState('LOADING');
    setErrorMessage(undefined);
    setSelectedBeneficiary(null);

    try {
      const response = await searchMutation.mutateAsync({ query });
      setResults(response.results);
      setUiState(response.results.length === 0 ? 'EMPTY' : 'SUCCESS');
    } catch (error) {
      setUiState(mapServiceErrorToUiState(error));
      setErrorMessage(getServiceErrorMessage(error));
    }
  };

  const handleContinue = async () => {
    if (!selectedBeneficiary) {
      return;
    }

    setUiState('LOADING');
    setErrorMessage(undefined);

    try {
      const eligibility = await eligibilityMutation.mutateAsync({
        beneficiaryId: selectedBeneficiary.id,
      });

      if (!eligibility.eligible) {
        setUiState('ERROR_METIER');
        setErrorMessage(
          eligibility.message ?? t('temporaryQr.search.ineligibleDefault'),
        );
        return;
      }

      setTemporaryQrBeneficiary(selectedBeneficiary);
      setTemporaryQrReason(reason);
      setTemporaryQrDuration(duration);
      navigation.navigate(TEMPORARY_QR_ROUTES.FACE_CAPTURE);
    } catch (error) {
      setUiState(mapServiceErrorToUiState(error));
      setErrorMessage(getServiceErrorMessage(error));
    }
  };

  return (
    <AppScreen
      header={<AppHeader title={t('temporaryQr.search.title')} showBack />}
      keyboardAvoiding>
      <FlowIntro>{t('temporaryQr.search.subtitle')}</FlowIntro>

      <FlowSection first>
        <AppTextInput
          label={t('temporaryQr.search.queryLabel')}
          placeholder={t('temporaryQr.search.queryPlaceholder')}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={() => {
            void handleSearch();
          }}
        />
        <AppButton
          label={
            searchMutation.isPending
              ? t('temporaryQr.search.searching')
              : t('temporaryQr.search.search')
          }
          fullWidth
          onPress={() => {
            void handleSearch();
          }}
          disabled={searchMutation.isPending}
        />
        {__DEV__ ? (
          <AppText variant="caption" color={colors.textSecondary} style={flow.devHint}>
            {t('temporaryQr.search.devHint')}
          </AppText>
        ) : null}
      </FlowSection>

      {uiState === 'ERROR_RESEAU' || uiState === 'ERROR_METIER' ? (
        <FlowSection>
          <ErrorState
            message={errorMessage}
            onRetry={() => {
              if (selectedBeneficiary) {
                void handleContinue();
                return;
              }

              void handleSearch();
            }}
          />
        </FlowSection>
      ) : null}

      {uiState === 'EMPTY' ? (
        <FlowSection>
          <EmptyState
            title={t('temporaryQr.search.emptyTitle')}
            description={t('temporaryQr.search.emptyDescription')}
          />
        </FlowSection>
      ) : null}

      {results.length > 0 ? (
        <FlowSection>
          <SectionTitle title={t('temporaryQr.search.resultsTitle')} />
          {results.map(beneficiary => (
            <AppCard
              key={beneficiary.id}
              variant={selectedBeneficiary?.id === beneficiary.id ? 'elevated' : 'soft'}
              style={{ marginBottom: 8, paddingVertical: 4 }}>
              <ActionRow
                title={`${beneficiary.firstName} ${beneficiary.lastName}`}
                subtitle={beneficiary.amoNumber}
                icon={
                  <CircleIcon>
                    <IdentityGlyph color={colors.icon} />
                  </CircleIcon>
                }
                onPress={() => setSelectedBeneficiary(beneficiary)}
                isLast
              />
            </AppCard>
          ))}
        </FlowSection>
      ) : null}

      {selectedBeneficiary ? (
        <>
          <FlowSection>
            <SectionTitle title={t('temporaryQr.search.reasonTitle')} />
            <SegmentedControl
              options={reasonOptions}
              value={reason}
              onChange={setReason}
            />
          </FlowSection>

          <FlowSection>
            <SectionTitle title={t('temporaryQr.search.durationTitle')} />
            <SegmentedControl
              options={durationOptions}
              value={duration}
              onChange={setDuration}
            />
          </FlowSection>

          <FlowFooter>
            <AppButton
              label={t('temporaryQr.search.continue')}
              fullWidth
              onPress={() => {
                void handleContinue();
              }}
              disabled={eligibilityMutation.isPending}
            />
          </FlowFooter>
        </>
      ) : null}
    </AppScreen>
  );
}
