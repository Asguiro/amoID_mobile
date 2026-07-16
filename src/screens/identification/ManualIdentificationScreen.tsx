import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ServiceUiState } from '../../api/types/ui-state.types';
import type { ManualSearchType } from '../../api/types/identification.types';
import {
  AppButton,
  AppHeader,
  AppScreen,
  AppText,
  AppTextInput,
  ErrorState,
  LoadingState,
  SegmentedControl,
} from '../../components/ui';
import { FlowFooter, FlowIntro, FlowSection } from '../../components/layout/FlowLayout';
import { IDENTIFICATION_ROUTES } from '../../constants/routes';
import { useManualIdentification } from '../../hooks/useIdentification';
import { useTranslation } from '../../hooks/useTranslation';
import type { IdentificationStackParamList } from '../../navigation/flow-types';
import {
  setIdentificationMethod,
  setIdentificationResult,
  setManualSearchPayload,
} from '../../store/verification-flow.store';
import { useTheme } from '../../theme/ThemeProvider';
import {
  getServiceErrorMessage,
  mapServiceErrorToUiState,
} from '../../utils/serviceError';

type Navigation = NativeStackNavigationProp<
  IdentificationStackParamList,
  typeof IDENTIFICATION_ROUTES.MANUAL
>;

const SEARCH_TYPES: readonly ManualSearchType[] = [
  'nina',
  'biometricCard',
  'amoNumber',
] as const;

function isValidSearchValue(type: ManualSearchType, value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  switch (type) {
    case 'nina':
      return trimmed.length >= 6;
    case 'biometricCard':
      return trimmed.length >= 8;
    case 'amoNumber':
      return /^AMO-\d{4,}$/i.test(trimmed);
    default:
      return false;
  }
}

export function ManualIdentificationScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [searchType, setSearchType] = useState<ManualSearchType>('nina');
  const [searchValue, setSearchValue] = useState('');
  const [uiState, setUiState] = useState<ServiceUiState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const searchMutation = useManualIdentification();

  const segmentedOptions = SEARCH_TYPES.map(type => ({
    value: type,
    label: t(`identification.manual.types.${type}`),
  }));

  const canSearch =
    isValidSearchValue(searchType, searchValue) && !searchMutation.isPending;

  const handleSearch = async () => {
    if (!canSearch) {
      return;
    }

    setUiState('LOADING');
    setErrorMessage(undefined);
    setIdentificationMethod('manual');
    setManualSearchPayload(searchType, searchValue.trim());

    try {
      const result = await searchMutation.mutateAsync({
        searchType,
        searchValue: searchValue.trim(),
      });

      setIdentificationResult(result);
      setUiState('IDLE');

      if (result.globalStatus === 'multiple_matches') {
        navigation.navigate(IDENTIFICATION_ROUTES.POSSIBLE_MATCHES);
        return;
      }

      navigation.navigate(IDENTIFICATION_ROUTES.RESULT);
    } catch (error) {
      setUiState(mapServiceErrorToUiState(error));
      setErrorMessage(getServiceErrorMessage(error));
    }
  };

  return (
    <AppScreen
      header={<AppHeader title={t('identification.manual.title')} showBack />}
      keyboardAvoiding>
      <FlowIntro>{t('identification.manual.subtitle')}</FlowIntro>

      <FlowSection first>
        <SegmentedControl
          options={segmentedOptions}
          value={searchType}
          onChange={setSearchType}
        />

        <AppTextInput
          label={t(`identification.manual.labels.${searchType}`)}
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder={t(`identification.manual.placeholders.${searchType}`)}
          autoCapitalize={searchType === 'amoNumber' ? 'characters' : 'none'}
          keyboardType={searchType === 'nina' ? 'number-pad' : 'default'}
        />

        {__DEV__ ? (
          <AppText variant="caption" color={colors.textSecondary}>
            {t('identification.manual.devHint')}
          </AppText>
        ) : null}
      </FlowSection>

      {searchMutation.isPending ? (
        <FlowSection>
          <LoadingState label={t('identification.manual.searching')} />
        </FlowSection>
      ) : null}

      {uiState === 'ERROR_RESEAU' || uiState === 'ERROR_METIER' ? (
        <FlowSection>
          <ErrorState
            message={errorMessage}
            onRetry={() => {
              void handleSearch();
            }}
          />
        </FlowSection>
      ) : null}

      <FlowFooter>
        <AppButton
          label={t('identification.manual.search')}
          fullWidth
          disabled={!canSearch}
          loading={searchMutation.isPending}
          onPress={() => {
            void handleSearch();
          }}
        />
      </FlowFooter>
    </AppScreen>
  );
}
