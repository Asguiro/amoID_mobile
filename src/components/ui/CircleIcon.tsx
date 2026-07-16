import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export type CircleIconTone = 'default' | 'soft' | 'success' | 'warning' | 'danger';

export interface CircleIconProps {
  children: ReactNode;
  tone?: CircleIconTone;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Thin icon inside a soft circular container — Microblink-inspired.
 */
export function CircleIcon({
  children,
  tone = 'default',
  size,
  style,
}: CircleIconProps) {
  const { tokens, colors } = useTheme();
  const circleTheme = tokens.components.circleIcon;
  const resolvedSize = size ?? circleTheme.size;

  const toneBackground: Record<CircleIconTone, string> = {
    default: tokens.colors.iconCircleBg,
    soft: colors.cardSoft,
    success: tokens.colors.successSoft,
    warning: tokens.colors.warningSoft,
    danger: tokens.colors.dangerSoft,
  };

  return (
    <View
      style={[
        styles.circle,
        {
          width: resolvedSize,
          height: resolvedSize,
          borderRadius: resolvedSize / 2,
          backgroundColor: toneBackground[tone],
        },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
