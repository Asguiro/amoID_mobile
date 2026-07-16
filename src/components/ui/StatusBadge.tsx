import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from './AppText';

export type StatusBadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface StatusBadgeProps {
  label: string;
  tone?: StatusBadgeTone;
  showDot?: boolean;
}

/**
 * Compact status chip for business states (never raw biometric scores).
 *
 * @example
 * <StatusBadge label="Droits actifs" tone="success" showDot />
 * <StatusBadge label="Douteux" tone="warning" />
 */
export function StatusBadge({
  label,
  tone = 'neutral',
  showDot = false,
}: StatusBadgeProps) {
  const { tokens, colors } = useTheme();

  const toneColors: Record<StatusBadgeTone, { bg: string; text: string; dot: string }> = {
    success: {
      bg: tokens.colors.successSoft,
      text: tokens.colors.success,
      dot: tokens.colors.success,
    },
    warning: {
      bg: tokens.colors.warningSoft,
      text: tokens.colors.warning,
      dot: tokens.colors.warning,
    },
    danger: {
      bg: tokens.colors.dangerSoft,
      text: tokens.colors.danger,
      dot: tokens.colors.danger,
    },
    info: {
      bg: tokens.colors.primarySoft,
      text: tokens.colors.info,
      dot: tokens.colors.info,
    },
    neutral: {
      bg: tokens.colors.iconCircleBg,
      text: colors.textSecondary,
      dot: colors.textSecondary,
    },
  };

  const palette = toneColors[tone];

  return (
    <View
      accessibilityRole="text"
      style={[
        styles.badge,
        {
          backgroundColor: palette.bg,
          borderRadius: tokens.radii.pill,
        },
      ]}>
      {showDot ? (
        <View style={[styles.dot, { backgroundColor: palette.dot }]} />
      ) : null}
      <AppText variant="caption" color={palette.text}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
