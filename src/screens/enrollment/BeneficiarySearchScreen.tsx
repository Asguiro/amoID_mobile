import { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BeneficiaryDossierDetail } from '../../api/types/enrollment.types';
import type { ServiceUiState } from '../../api/types/ui-state.types';
import { enrollmentService } from '../../api/services/enrollment.service';
import {
  AppButton,
  AppCard,
  AppHeader,
  AppScreen,
  AppText,
  AppTextInput,
  BeneficiaryIdentityCard,
  EmptyState,
  ErrorState,
  SectionTitle,
} from '../../components/ui';
import { FlowFooter, FlowIntro, FlowSection } from '../../components/layout/FlowLayout';
import { ENROLLMENT_ROUTES } from '../../constants/routes';
import { useEnrollmentSearch } from '../../hooks/useEnrollment';
import { useTranslation } from '../../hooks/useTranslation';
import type { EnrollmentStackParamList } from '../../navigation/flow-types';
import {
  selectEnrollmentDossier,
  setEnrollmentSearchQuery,
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
  typeof ENROLLMENT_ROUTES.SEARCH
>;

export function BeneficiarySearchScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const flow = useFlowStyles();
  const searchMutation = useEnrollmentSearch();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BeneficiaryDossierDetail[]>([]);
  const [uiState, setUiState] = useState<ServiceUiState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [selectingId, setSelectingId] = useState<string | null>(null);

  const handleSearch = async () => {
    setUiState('LOADING');
    setErrorMessage(undefined);
    setEnrollmentSearchQuery(query);

    try {
      const response = await searchMutation.mutateAsync({ query });
      setResults(response.results);
      setUiState(response.results.length === 0 ? 'EMPTY' : 'SUCCESS');
    } catch (error) {
      setUiState(mapServiceErrorToUiState(error));
      setErrorMessage(getServiceErrorMessage(error));
    }
  };

  const handleSelect = async (dossier: BeneficiaryDossierDetail) => {
    setSelectingId(dossier.id);
    setErrorMessage(undefined);

    try {
      const fullDossier = await enrollmentService.getBeneficiaryDossier(dossier.id);
      selectEnrollmentDossier(fullDossier);
      navigation.navigate(ENROLLMENT_ROUTES.DOSSIER, {
        beneficiaryId: fullDossier.id,
      });
    } catch (error) {
      setUiState(mapServiceErrorToUiState(error));
      setErrorMessage(getServiceErrorMessage(error));
    } finally {
      setSelectingId(null);
    }
  };

  const handleCreateProvisional = () => {
    navigation.navigate(ENROLLMENT_ROUTES.PROVISIONAL);
  };

  return (
    <AppScreen
      header={<AppHeader title={t('enrollment.search.title')} showBack />}
      keyboardAvoiding>
      <FlowIntro>{t('enrollment.search.description')}</FlowIntro>

      <FlowSection first>
        <AppTextInput
          label={t('enrollment.search.label')}
          value={query}
          onChangeText={setQuery}
          placeholder={t('enrollment.search.placeholder')}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={() => { runAsync(() => handleSearch()); }}
        />
      </FlowSection>

      <FlowFooter>
        <AppButton
          label={t('enrollment.search.submit')}
          fullWidth
          loading={uiState === 'LOADING'}
          onPress={() => { runAsync(() => handleSearch()); }}
        />
      </FlowFooter>

      {uiState === 'ERROR_RESEAU' ||
      uiState === 'ERROR_METIER' ||
      uiState === 'ERROR_VALIDATION' ? (
        <FlowSection>
          <ErrorState
            message={errorMessage}
            onRetry={() => { runAsync(() => handleSearch()); }}
          />
        </FlowSection>
      ) : null}

      {uiState === 'EMPTY' ? (
        <FlowSection>
          <View style={flow.emptyBlock}>
            <EmptyState
              title={t('enrollment.search.emptyTitle')}
              description={t('enrollment.search.emptyDescription')}
            />
            <AppButton
              label={t('enrollment.search.createProvisional')}
              fullWidth
              onPress={handleCreateProvisional}
            />
          </View>
        </FlowSection>
      ) : null}

      {uiState === 'SUCCESS' ? (
        <FlowSection>
          <SectionTitle title={t('enrollment.search.resultsSection')} />
          <AppCard variant="soft">
            <AppText variant="caption" color={colors.textSecondary}>
              {t('enrollment.search.resultsCount', { count: results.length })}
            </AppText>
          </AppCard>
          <View style={flow.list}>
            {results.map(dossier => (
              <BeneficiaryIdentityCard
                key={dossier.id}
                beneficiary={dossier}
                onPress={
                  selectingId ? undefined : () => { runAsync(() => handleSelect(dossier)); }
                }
              />
            ))}
          </View>
        </FlowSection>
      ) : null}

      {uiState === 'IDLE' ? (
        <FlowSection>
          <AppCard variant="soft">
            <AppText variant="body">{t('enrollment.search.hint')}</AppText>
          </AppCard>
        </FlowSection>
      ) : null}
    </AppScreen>
  );
}
