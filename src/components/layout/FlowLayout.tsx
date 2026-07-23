import { useMemo, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from '../ui/AppText';

export interface FlowIntroProps {
  children: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Screen-level intro copy below the header — no card wrapper.
 */
export function FlowIntro({ children, style }: FlowIntroProps) {
  const { colors, tokens } = useTheme();

  return (
    <View style={[styles.introWrap, { marginBottom: tokens.spacing.lg }, style]}>
      <AppText variant="body" color={colors.textSecondary} style={styles.intro}>
        {children}
      </AppText>
    </View>
  );
}

export interface FlowSectionProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  gap?: number | FlowSpacingToken;
  first?: boolean;
}

/**
 * Vertical section with consistent top spacing from the design grid.
 */
export function FlowSection({
  children,
  style,
  gap,
  first = false,
}: FlowSectionProps) {
  const { tokens } = useTheme();

  const resolvedGap =
    typeof gap === 'string' ? tokens.spacing[gap] : gap ?? tokens.spacing.md;

  const sectionStyle = useMemo(
    () => ({
      marginTop: first ? 0 : tokens.spacing.sectionGap,
      gap: resolvedGap,
    }),
    [first, tokens.spacing.sectionGap, resolvedGap],
  );

  return <View style={[sectionStyle, style]}>{children}</View>;
}

export type FlowSpacingToken = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'sectionGap';

export interface FlowStackProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  gap?: FlowSpacingToken;
}

/**
 * Vertical stack with tokenized gap — use inside cards or form blocks.
 */
export function FlowStack({ children, style, gap = 'md' }: FlowStackProps) {
  const { tokens } = useTheme();

  return (
    <View style={[styles.fullWidth, { gap: tokens.spacing[gap] }, style]}>
      {children}
    </View>
  );
}

export interface FlowFooterProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Bottom action stack — primary CTA first, secondary actions below.
 */
export function FlowFooter({ children, style }: FlowFooterProps) {
  const { tokens } = useTheme();

  return (
    <View
      style={[
        styles.footer,
        { marginTop: tokens.spacing.sectionGap, gap: tokens.spacing.sm },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  introWrap: {
    width: '100%',
  },
  intro: {
    lineHeight: 24,
  },
  fullWidth: {
    width: '100%',
  },
  footer: {
    width: '100%',
  },
});
