import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import type { StatusBadgeTone } from './StatusBadge';

export interface StatusDotProps {
  tone?: StatusBadgeTone;
  accessibilityLabel: string;
  size?: 'sm' | 'md';
}

/**
 * Compact color-only status indicator (soft ring + inner dot, no label).
 */
export function StatusDot({
  tone = 'neutral',
  accessibilityLabel,
  size = 'md',
}: StatusDotProps) {
  const { tokens, colors } = useTheme();
  const dimensions = size === 'sm' ? { outer: 18, inner: 6 } : { outer: 22, inner: 8 };

  const palette = {
    success: {
      ring: tokens.colors.successSoft,
      dot: tokens.colors.success,
    },
    warning: {
      ring: tokens.colors.warningSoft,
      dot: tokens.colors.warning,
    },
    danger: {
      ring: tokens.colors.dangerSoft,
      dot: tokens.colors.danger,
    },
    info: {
      ring: tokens.colors.primarySoft,
      dot: tokens.colors.info,
    },
    neutral: {
      ring: tokens.colors.iconCircleBg,
      dot: colors.textSecondary,
    },
  }[tone];

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.outer,
        {
          width: dimensions.outer,
          height: dimensions.outer,
          borderRadius: dimensions.outer / 2,
          backgroundColor: palette.ring,
        },
      ]}>
      <View
        style={[
          styles.inner,
          {
            width: dimensions.inner,
            height: dimensions.inner,
            borderRadius: dimensions.inner / 2,
            backgroundColor: palette.dot,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  inner: {},
});
