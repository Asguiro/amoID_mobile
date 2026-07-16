import { StyleSheet, View } from 'react-native';
import { AppText } from '../../../components/ui';
import { useTranslation } from '../../../hooks/useTranslation';
import { useTheme } from '../../../theme/ThemeProvider';

export interface WelcomeHeaderProps {
  agentName: string;
  roleLabel: string;
  establishmentName: string;
}

export function WelcomeHeader({
  agentName,
  roleLabel,
  establishmentName,
}: WelcomeHeaderProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useTheme();

  return (
    <View style={[styles.container, { marginBottom: tokens.spacing.lg }]}>
      <AppText variant="h2">{t('home.greeting', { name: agentName })}</AppText>
      <View style={styles.metaRow}>
        <AppText variant="caption" color={colors.textSecondary}>
          {`${t('home.roleLabel')} : ${roleLabel}`}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          {`${t('home.establishmentLabel')} : ${establishmentName}`}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  metaRow: {
    gap: 4,
  },
});
