import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText, type AppTextVariant } from './AppText';
import { ChevronLeft } from './icons/ChevronLeft';

export type AppHeaderVariant = 'screen' | 'section';

export interface AppHeaderProps {
  title: string;
  style?: StyleProp<ViewStyle>;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  variant?: AppHeaderVariant;
  align?: 'left' | 'center';
  showBack?: boolean;
  onBackPress?: () => void;
  /** @deprecated Use `variant="section"` instead. */
  compact?: boolean;
}

/**
 * Screen title block with optional back action and trailing slot.
 */
export function AppHeader({
  title,
  style,
  leading,
  trailing,
  variant,
  compact = false,
  align = 'left',
  showBack = false,
  onBackPress,
}: AppHeaderProps) {
  const navigation = useNavigation();
  const { tokens, colors } = useTheme();

  const resolvedVariant: AppHeaderVariant =
    variant ?? (compact ? 'section' : 'screen');

  // Compact nav-bar title — mobile standard (~17px), not page hero (h2).
  const titleVariant: AppTextVariant =
    resolvedVariant === 'screen' ? 'rowTitle' : 'bodyStrong';

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const resolvedLeading =
    leading ??
    (showBack ? (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Retour"
        hitSlop={6}
        onPress={handleBackPress}
        style={({ pressed }) => [
          styles.backButton,
          {
            backgroundColor: pressed ? tokens.colors.primarySoft : colors.background,
            borderColor: colors.border,
          },
        ]}>
        <ChevronLeft color={colors.primary} size={20} />
      </Pressable>
    ) : null);

  const marginBottom = resolvedVariant === 'section' ? tokens.spacing.md : 0;

  return (
    <View style={[styles.header, { marginBottom }, style]}>
      {resolvedLeading ? <View style={styles.leading}>{resolvedLeading}</View> : null}

      <View
        style={[
          styles.textBlock,
          align === 'center' ? styles.textBlockCenter : undefined,
          showBack || leading ? styles.textBlockWithLeading : undefined,
        ]}>
        <AppText
          variant={titleVariant}
          accessibilityRole="header"
          numberOfLines={2}
          style={align === 'center' ? styles.centeredText : undefined}>
          {title}
        </AppText>
      </View>

      {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    gap: 10,
  },
  leading: {
    flexShrink: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  textBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  textBlockWithLeading: {
    paddingRight: 4,
  },
  textBlockCenter: {
    alignItems: 'center',
  },
  centeredText: {
    textAlign: 'center',
  },
  trailing: {
    flexShrink: 0,
  },
});
