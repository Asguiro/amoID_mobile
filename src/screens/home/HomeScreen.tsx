import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  hasAuditAccess,
  hasCarePointAccess,
  hasEnrollmentAccess,
  hasTemporaryQrAccess,
} from '../../constants/roles';
import { MAIN_STACK_ROUTES } from '../../constants/routes';
import {
  ActionRow,
  AppCard,
  AppScreen,
  CircleIcon,
  SectionTitle,
} from '../../components/ui';
import { FlowSection } from '../../components/layout/FlowLayout';
import {
  AuditGlyph,
  IdentityGlyph,
  ListGlyph,
  QrGlyph,
} from '../../components/ui/icons/UiGlyphs';
import { useSession } from '../../hooks/useSession';
import { useTranslation } from '../../hooks/useTranslation';
import { isRouteAllowedForRole } from '../../navigation/roleConfig';
import type { MainStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme/ThemeProvider';
import { HomeToolbar } from './components/HomeToolbar';
import { PremiumInfoCard } from './components/PremiumInfoCard';

type MainStackRouteWithoutParams = Exclude<
  keyof MainStackParamList,
  typeof MAIN_STACK_ROUTES.BENEFICIARY_DETAIL
>;

type HomeStackNavigation = NativeStackNavigationProp<
  MainStackParamList,
  typeof MAIN_STACK_ROUTES.HOME
>;

interface HomeAction {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  route: MainStackRouteWithoutParams;
}

export function HomeScreen() {
  const navigation = useNavigation<HomeStackNavigation>();
  const { session } = useSession();
  const { t } = useTranslation();
  const { colors, tokens } = useTheme();

  if (!session) {
    return (
      <AppScreen header={<HomeToolbar />}>
        <View />
      </AppScreen>
    );
  }

  const navigateToRoute = (route: MainStackRouteWithoutParams) => {
    if (isRouteAllowedForRole(route, session.role)) {
      navigation.navigate(route);
    }
  };

  const primaryActions: HomeAction[] = [];

  if (hasCarePointAccess(session.role) || hasEnrollmentAccess(session.role)) {
    primaryActions.push({
      id: 'identify',
      title: t('home.quickActions.identifyBeneficiary'),
      subtitle: t('home.quickActions.identifyBeneficiaryDescription'),
      icon: (
        <CircleIcon>
          <IdentityGlyph color={colors.icon} />
        </CircleIcon>
      ),
      route: MAIN_STACK_ROUTES.VERIFICATION,
    });
  }

  if (hasTemporaryQrAccess(session.role)) {
    primaryActions.push({
      id: 'temporary-qr',
      title: t('home.quickActions.generateTemporaryQr'),
      subtitle: t('home.quickActions.generateTemporaryQrDescription'),
      icon: (
        <CircleIcon>
          <QrGlyph color={colors.icon} />
        </CircleIcon>
      ),
      route: MAIN_STACK_ROUTES.TEMPORARY_QR,
    });
  }

  if (hasEnrollmentAccess(session.role)) {
    primaryActions.push({
      id: 'enrollment',
      title: t('home.quickActions.startEnrollment'),
      subtitle: t('home.quickActions.startEnrollmentDescription'),
      icon: (
        <CircleIcon>
          <IdentityGlyph color={colors.icon} />
        </CircleIcon>
      ),
      route: MAIN_STACK_ROUTES.ENROLLMENT,
    });
    primaryActions.push({
      id: 'list',
      title: t('home.quickActions.viewBeneficiaryList'),
      subtitle: t('home.quickActions.viewBeneficiaryListDescription'),
      icon: (
        <CircleIcon>
          <ListGlyph color={colors.icon} />
        </CircleIcon>
      ),
      route: MAIN_STACK_ROUTES.BENEFICIARIES,
    });
  }

  const secondaryActions: HomeAction[] = [];

  if (hasAuditAccess(session.role)) {
    secondaryActions.push({
      id: 'audit',
      title: t('home.quickActions.viewAudit'),
      subtitle: t('home.quickActions.viewAuditDescription'),
      icon: (
        <CircleIcon>
          <AuditGlyph color={colors.icon} />
        </CircleIcon>
      ),
      route: MAIN_STACK_ROUTES.AUDIT,
    });
  }

  const renderActionCard = (action: HomeAction) => (
    <AppCard
      key={action.id}
      variant="elevated"
      style={{
        paddingVertical: tokens.spacing.sm,
        paddingHorizontal: tokens.spacing.md,
      }}>
      <ActionRow
        title={action.title}
        subtitle={action.subtitle}
        icon={action.icon}
        onPress={() => navigateToRoute(action.route)}
        isLast
      />
    </AppCard>
  );

  return (
    <AppScreen
      header={
        <HomeToolbar
          onProfilePress={() => navigation.navigate(MAIN_STACK_ROUTES.PROFILE)}
        />
      }
      contentContainerStyle={{ paddingBottom: tokens.spacing.xl }}>
      {primaryActions.length > 0 ? (
        <FlowSection first gap="md">
          <SectionTitle title={t('home.sections.primaryActions')} />
          {primaryActions.map(renderActionCard)}
        </FlowSection>
      ) : null}

      {secondaryActions.length > 0 ? (
        <FlowSection gap="md">
          <SectionTitle title={t('home.sections.secondaryActions')} />
          {secondaryActions.map(renderActionCard)}
        </FlowSection>
      ) : null}

      <FlowSection>
        <PremiumInfoCard message={t('home.infoCard.message')} />
      </FlowSection>
    </AppScreen>
  );
}
