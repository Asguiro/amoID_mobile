import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export type AppCardVariant = 'elevated' | 'soft' | 'outline';

export interface AppCardProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  variant?: AppCardVariant;
}

/**
 * White surface container for grouped content.
 *
 * @example
 * <AppCard variant="elevated">
 *   <AppText variant="title">Section</AppText>
 * </AppCard>
 */
export function AppCard({ children, style, variant = 'elevated' }: AppCardProps) {
  const { tokens, colors } = useTheme();
  const cardTheme = tokens.components.card;
  const resolvedVariant: AppCardVariant = variant;

  const shadow =
    resolvedVariant === 'elevated'
      ? tokens.shadows[cardTheme.shadow as keyof typeof tokens.shadows]
      : tokens.shadows.none;

  const shadowOffset: { width: number; height: number } =
    'shadowOffset' in shadow
      ? (shadow.shadowOffset as { width: number; height: number })
      : { width: 0, height: 0 };

  const backgroundByVariant: Record<AppCardVariant, string> = {
    elevated: colors.card,
    soft: colors.cardSoft,
    outline: colors.card,
  };

  const borderWidthByVariant: Record<AppCardVariant, number> = {
    elevated: 0,
    soft: 0,
    outline: 1,
  };

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: cardTheme.borderRadius,
          backgroundColor: backgroundByVariant[resolvedVariant],
          padding: cardTheme.padding,
          borderColor: colors.border,
          borderWidth: borderWidthByVariant[resolvedVariant],
          shadowColor: shadow.shadowColor,
          shadowOpacity: shadow.shadowOpacity,
          shadowRadius: shadow.shadowRadius,
          shadowOffset,
          elevation: shadow.elevation,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
});
