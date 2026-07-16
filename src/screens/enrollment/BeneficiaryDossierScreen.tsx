import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import {
  AppButton,
  AppCard,
  AppHeader,
  AppScreen,
  BeneficiaryIdentityCard,
  ErrorState,
  LoadingState,
  SectionTitle,
  StatusBadge,
} from '../../components/ui';
import { FlowFooter, FlowSection } from '../../components/layout/FlowLayout';
import { ENROLLMENT_ROUTES } from '../../constants/routes';
import { useBeneficiaryDossier } from '../../hooks/useEnrollment';
import { useEnrollmentDraft } from '../../hooks/useEnrollmentDraft';
import { useTranslation } from '../../hooks/useTranslation';
import type { EnrollmentStackParamList } from '../../navigation/flow-types';
import { useFlowStyles } from '../../theme/useFlowStyles';

type Navigation = NativeStackNavigationProp<
  EnrollmentStackParamList,
  typeof ENROLLMENT_ROUTES.DOSSIER
>;

type Route = RouteProp<
  EnrollmentStackParamList,
  typeof ENROLLMENT_ROUTES.DOSSIER
>;

export function BeneficiaryDossierScreen() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<Route>();
  const { t } = useTranslation();
  const flow = useFlowStyles();
  const draft = useEnrollmentDraft();
  const { data, isPending, isError, refetch } = useBeneficiaryDossier(
    route.params.beneficiaryId,
  );

  const dossier = data ?? draft.selectedDossier;

  return (
    <AppScreen header={<AppHeader title={t('enrollment.dossier.title')} showBack />}>
      {isPending ? <LoadingState /> : null}
      {isError ? <ErrorState onRetry={() => refetch()} /> : null}

      {dossier ? (
        <>
          <FlowSection first>
            <BeneficiaryIdentityCard beneficiary={dossier} />
          </FlowSection>

          <FlowSection>
            <SectionTitle title={t('enrollment.dossier.completeness')} />
            <AppCard variant="soft">
              <View style={flow.badgeRow}>
                <StatusBadge
                  label={
                    dossier.hasBiometrics
                      ? t('enrollment.dossier.biometricsPresent')
                      : t('enrollment.dossier.biometricsMissing')
                  }
                  tone={dossier.hasBiometrics ? 'success' : 'warning'}
                  showDot
                />
                <StatusBadge
                  label={
                    dossier.hasHealthInfo
                      ? t('enrollment.dossier.healthPresent')
                      : t('enrollment.dossier.healthMissing')
                  }
                  tone={dossier.hasHealthInfo ? 'success' : 'neutral'}
                />
              </View>
            </AppCard>
          </FlowSection>

          {dossier.dossierStatus === 'incomplete' ? (
            <FlowFooter>
              <AppButton
                label={t('enrollment.dossier.continue')}
                fullWidth
                onPress={() => navigation.navigate(ENROLLMENT_ROUTES.REQUIRED_INFO)}
              />
            </FlowFooter>
          ) : null}
        </>
      ) : null}
    </AppScreen>
  );
}
