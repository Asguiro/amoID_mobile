import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from './AppText';

export interface SectionTitleProps {
  title: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Uppercase green section label — Microblink-inspired grouping header.
 */
export function SectionTitle({ title, style }: SectionTitleProps) {
  const { tokens, colors } = useTheme();

  return (
    <View style={[styles.wrapper, { marginBottom: tokens.spacing.sm }, style]}>
      <AppText
        variant="sectionTitle"
        color={colors.primary}
        accessibilityRole="header">
        {title}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
});
