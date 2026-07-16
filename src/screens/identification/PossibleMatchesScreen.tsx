import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { IdentificationMatchCandidate } from '../../api/types/identification.types';
import {
  AppButton,
  AppHeader,
  AppScreen,
  BeneficiaryCard,
  EmptyState,
  SectionTitle,
} from '../../components/ui';
import { FlowFooter, FlowIntro, FlowSection } from '../../components/layout/FlowLayout';
import { IDENTIFICATION_ROUTES } from '../../constants/routes';
import { useVerificationFlow } from '../../hooks/useVerificationFlow';
import { useTranslation } from '../../hooks/useTranslation';
import type { IdentificationStackParamList } from '../../navigation/flow-types';
import { setIdentificationResult } from '../../store/verification-flow.store';

type Navigation = NativeStackNavigationProp<
  IdentificationStackParamList,
  typeof IDENTIFICATION_ROUTES.POSSIBLE_MATCHES
>;

function candidateToBeneficiary(candidate: IdentificationMatchCandidate) {
  return {
    ...candidate.beneficiary,
    dossierStatus: 'complete' as const,
  };
}

export function PossibleMatchesScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const verificationFlow = useVerificationFlow();
  const matches = verificationFlow.identificationResult?.matches ?? [];

  const handleSelect = (candidate: IdentificationMatchCandidate) => {
    setIdentificationResult({
      identificationId: candidate.matchId,
      method: verificationFlow.method ?? 'manual',
      globalStatus: 'identified',
      status: candidate.status,
      confidenceLabel: candidate.confidenceLabel,
      requiresFaceVerification: false,
      beneficiary: candidate.beneficiary,
      primaryHolderName: candidate.primaryHolderName,
      primaryHolderAmoNumber: candidate.primaryHolderAmoNumber,
    });
    navigation.navigate(IDENTIFICATION_ROUTES.RESULT);
  };

  if (!matches.length) {
    return (
      <AppScreen header={<AppHeader title={t('identification.matches.title')} showBack />}>
        <EmptyState
          title={t('identification.matches.emptyTitle')}
          description={t('identification.matches.emptyDescription')}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen header={<AppHeader title={t('identification.matches.title')} showBack />}>
      <FlowIntro>{t('identification.matches.subtitle')}</FlowIntro>

      <FlowSection first gap="sm">
        <SectionTitle title={t('identification.matches.listTitle')} />
        {matches.map(candidate => (
          <BeneficiaryCard
            key={candidate.matchId}
            beneficiary={candidateToBeneficiary(candidate)}
            onPress={() => handleSelect(candidate)}
          />
        ))}
      </FlowSection>

      <FlowFooter>
        <AppButton
          label={t('identification.matches.backToSearch')}
          variant="outline"
          fullWidth
          onPress={() => navigation.goBack()}
        />
      </FlowFooter>
    </AppScreen>
  );
}
