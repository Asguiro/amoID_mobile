import { useMemo } from 'react';
import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export type AppTextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'title'
  | 'sectionTitle'
  | 'rowTitle'
  | 'rowSubtitle'
  | 'body'
  | 'bodyStrong'
  | 'caption'
  | 'button';

export interface AppTextProps {
  children: string;
  variant?: AppTextVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  accessibilityRole?: 'text' | 'header';
}

/**
 * Tokenized typography for consistent hierarchy across screens.
 *
 * @example
 * <AppText variant="h2">Connexion agent</AppText>
 * <AppText variant="body" color={colors.textSecondary}>Sous-titre</AppText>
 */
export function AppText({
  children,
  variant = 'body',
  color,
  style,
  numberOfLines,
  accessibilityRole,
}: AppTextProps) {
  const { tokens, colors } = useTheme();
  const typography = tokens.typography.styles[variant];

  const variantStyle = useMemo(
    () => ({
      color: color ?? colors.textPrimary,
      fontSize: typography.fontSize,
      lineHeight: typography.lineHeight,
      fontWeight: typography.fontWeight as TextStyle['fontWeight'],
      letterSpacing:
        'letterSpacing' in typography ? typography.letterSpacing : undefined,
    }),
    [color, colors.textPrimary, typography],
  );

  return (
    <Text
      accessibilityRole={accessibilityRole ?? (variant.startsWith('h') ? 'header' : 'text')}
      numberOfLines={numberOfLines}
      style={[
        variantStyle,
        variant === 'sectionTitle' && styles.uppercase,
        style,
      ]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  uppercase: {
    textTransform: 'uppercase',
  },
});
