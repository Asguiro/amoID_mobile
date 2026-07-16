import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BeneficiarySummary } from '../../api/types/beneficiary.types';
import {
  AppHeader,
  AppScreen,
  AppText,
  AppTextInput,
  BeneficiaryIdentityCard,
  EmptyState,
  ErrorState,
  LoadingState,
  SectionTitle,
  StatusBadge,
} from '../../components/ui';
import { FlowSection } from '../../components/layout/FlowLayout';
import { MAIN_STACK_ROUTES } from '../../constants/routes';
import { useBeneficiaries } from '../../hooks/useBeneficiaries';
import { useTranslation } from '../../hooks/useTranslation';
import type { MainStackParamList } from '../../navigation/types';
import { useFlowStyles } from '../../theme/useFlowStyles';
import { useTheme } from '../../theme/ThemeProvider';

type Navigation = NativeStackNavigationProp<
  MainStackParamList,
  typeof MAIN_STACK_ROUTES.BENEFICIARIES
>;

function filterBeneficiaries(
  beneficiaries: BeneficiarySummary[],
  query: string,
): BeneficiarySummary[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return beneficiaries;
  }

  return beneficiaries.filter(item => {
    const haystack = [
      item.firstName,
      item.lastName,
      item.amoNumber,
      item.nina,
      item.biometricCardNumber,
      item.establishmentName,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function BeneficiariesListScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const flow = useFlowStyles();
  const { data, isPending, isError, refetch } = useBeneficiaries();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBeneficiaries = useMemo(
    () => filterBeneficiaries(data ?? [], searchQuery),
    [data, searchQuery],
  );

  const incompleteDossiers = useMemo(
    () => filteredBeneficiaries.filter(item => item.dossierStatus === 'incomplete'),
    [filteredBeneficiaries],
  );

  const completeDossiers = useMemo(
    () => filteredBeneficiaries.filter(item => item.dossierStatus === 'complete'),
    [filteredBeneficiaries],
  );

  const openBeneficiary = (beneficiaryId: string) => {
    navigation.navigate(MAIN_STACK_ROUTES.BENEFICIARY_DETAIL, { beneficiaryId });
  };

  return (
    <AppScreen
      header={<AppHeader title={t('beneficiaries.title')} showBack />}
      keyboardAvoiding>
      <FlowSection first>
        <AppTextInput
          label={t('beneficiaries.searchLabel')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('beneficiaries.searchPlaceholder')}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />

        {!isPending && !isError ? (
          <AppText variant="caption" color={colors.textSecondary}>
            {t(
              filteredBeneficiaries.length > 1
                ? 'beneficiaries.count_plural'
                : 'beneficiaries.count',
              { count: filteredBeneficiaries.length },
            )}
          </AppText>
        ) : null}
      </FlowSection>

      {isPending ? <LoadingState /> : null}
      {isError ? <ErrorState onRetry={() => refetch()} /> : null}
      {!isPending && !isError && filteredBeneficiaries.length === 0 ? (
        <EmptyState
          title={t('beneficiaries.emptyTitle')}
          description={t('beneficiaries.emptyDescription')}
        />
      ) : null}

      {!isPending && !isError && incompleteDossiers.length > 0 ? (
        <FlowSection>
          <SectionTitle title={t('beneficiaries.incompleteTitle')} />
          <AppText variant="body" color={colors.textSecondary} style={flow.sectionHint}>
            {t('beneficiaries.incompleteDescription')}
          </AppText>
          <View style={flow.listMd}>
            {incompleteDossiers.map(item => (
              <View key={item.id} style={flow.cardGap}>
                <BeneficiaryIdentityCard
                  beneficiary={item}
                  onPress={() => openBeneficiary(item.id)}
                />
                <View style={flow.incompleteBadge}>
                  <StatusBadge
                    label={t('beneficiaries.incompleteBadge')}
                    tone="warning"
                    showDot
                  />
                </View>
              </View>
            ))}
          </View>
        </FlowSection>
      ) : null}

      {!isPending && !isError && completeDossiers.length > 0 ? (
        <FlowSection>
          {incompleteDossiers.length > 0 ? (
            <SectionTitle title={t('beneficiaries.completeTitle')} />
          ) : null}
          <View style={flow.listMd}>
            {completeDossiers.map(item => (
              <BeneficiaryIdentityCard
                key={item.id}
                beneficiary={item}
                onPress={() => openBeneficiary(item.id)}
              />
            ))}
          </View>
        </FlowSection>
      ) : null}
    </AppScreen>
  );
}
