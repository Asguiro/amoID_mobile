import { Alert, View } from 'react-native';
import {
  AppButton,
  AppCard,
  AppHeader,
  AppScreen,
  AppText,
  SectionTitle,
} from '../../components/ui';
import { FlowFooter, FlowSection } from '../../components/layout/FlowLayout';
import { useSession, useSessionActions } from '../../hooks/useSession';
import { useTranslation } from '../../hooks/useTranslation';
import { useFlowStyles } from '../../theme/useFlowStyles';
import { useTheme } from '../../theme/ThemeProvider';

interface ProfileFieldProps {
  label: string;
  value: string;
}

function ProfileField({ label, value }: ProfileFieldProps) {
  const { colors } = useTheme();
  const flow = useFlowStyles();

  return (
    <View style={flow.field}>
      <AppText variant="caption" color={colors.textSecondary}>
        {label}
      </AppText>
      <AppText variant="bodyStrong">{value}</AppText>
    </View>
  );
}

export function ProfileScreen() {
  const { session } = useSession();
  const { logout } = useSessionActions();
  const { t } = useTranslation();

  if (!session) {
    return null;
  }

  const confirmLogout = () => {
    Alert.alert(t('profile.logoutConfirmTitle'), t('profile.logoutConfirmMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.logout'),
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  return (
    <AppScreen header={<AppHeader title={t('profile.title')} showBack />}>
      <FlowSection first>
        <SectionTitle title={t('profile.agentSection')} />
        <AppCard variant="elevated">
          <ProfileField label={t('profile.agentId')} value={session.agentId} />
          <ProfileField label={t('profile.role')} value={t(`roles.${session.role}`)} />
          <ProfileField
            label={t('profile.establishment')}
            value={session.establishmentName}
          />
          <ProfileField label={t('profile.device')} value={session.deviceId} />
        </AppCard>
      </FlowSection>

      <FlowSection>
        <SectionTitle title={t('profile.sessionSection')} />
      </FlowSection>

      <FlowFooter>
        <AppButton
          label={t('common.logout')}
          variant="outline"
          fullWidth
          onPress={confirmLogout}
        />
      </FlowFooter>
    </AppScreen>
  );
}
