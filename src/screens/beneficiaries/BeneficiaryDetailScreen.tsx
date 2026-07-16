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
import { ENROLLMENT_ROUTES, MAIN_STACK_ROUTES } from '../../constants/routes';
import { useBeneficiaryDossier } from '../../hooks/useEnrollment';
import { useTranslation } from '../../hooks/useTranslation';
import type { MainStackParamList } from '../../navigation/types';
import { selectEnrollmentDossier } from '../../store/enrollment-draft.store';
import { useFlowStyles } from '../../theme/useFlowStyles';

type Navigation = NativeStackNavigationProp<
  MainStackParamList,
  typeof MAIN_STACK_ROUTES.BENEFICIARY_DETAIL
>;

type Route = RouteProp<
  MainStackParamList,
  typeof MAIN_STACK_ROUTES.BENEFICIARY_DETAIL
>;

export function BeneficiaryDetailScreen() {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<Route>();
  const { t } = useTranslation();
  const flow = useFlowStyles();
  const { data, isPending, isError, refetch } = useBeneficiaryDossier(
    route.params.beneficiaryId,
  );

  const isIncomplete = data?.dossierStatus === 'incomplete';

  const handleContinueEnrollment = () => {
    if (!data) {
      return;
    }

    selectEnrollmentDossier(data);
    navigation.navigate(MAIN_STACK_ROUTES.ENROLLMENT, {
      screen: ENROLLMENT_ROUTES.DOSSIER,
      params: { beneficiaryId: data.id },
    });
  };

  return (
    <AppScreen header={<AppHeader title={t('beneficiaries.detail.title')} showBack />}>
      {isPending ? <LoadingState /> : null}
      {isError ? <ErrorState onRetry={() => refetch()} /> : null}

      {data ? (
        <>
          <FlowSection first>
            <BeneficiaryIdentityCard beneficiary={data} />
          </FlowSection>

          <FlowSection>
            <SectionTitle title={t('beneficiaries.detail.completeness')} />
            <AppCard variant="soft">
              <View style={flow.badgeRow}>
                <StatusBadge
                  label={
                    data.dossierStatus === 'complete'
                      ? t('beneficiaries.detail.dossierComplete')
                      : t('beneficiaries.detail.dossierIncomplete')
                  }
                  tone={data.dossierStatus === 'complete' ? 'success' : 'warning'}
                  showDot
                />
                <StatusBadge
                  label={
                    data.hasBiometrics
                      ? t('enrollment.dossier.biometricsPresent')
                      : t('enrollment.dossier.biometricsMissing')
                  }
                  tone={data.hasBiometrics ? 'success' : 'warning'}
                />
              </View>
            </AppCard>
          </FlowSection>

          {isIncomplete ? (
            <FlowFooter>
              <AppButton
                label={t('beneficiaries.detail.continueEnrollment')}
                fullWidth
                onPress={handleContinueEnrollment}
              />
            </FlowFooter>
          ) : null}
        </>
      ) : null}
    </AppScreen>
  );
}
