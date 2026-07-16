import { StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppCard } from './AppCard';
import { AppText } from './AppText';

export interface SensitiveInfoNoticeProps {
  title: string;
  message: string;
}

/**
 * Prudence notice for sensitive health or identity data.
 */
export function SensitiveInfoNotice({ title, message }: SensitiveInfoNoticeProps) {
  const { colors, tokens } = useTheme();

  return (
    <AppCard variant="soft" style={styles.card}>
      <AppText variant="bodyStrong" color={colors.primary}>
        {title}
      </AppText>
      <AppText
        variant="body"
        color={colors.textSecondary}
        style={{ marginTop: tokens.spacing.xs }}>
        {message}
      </AppText>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 4,
  },
});
