import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';
import { OfflineBanner } from '../layout/OfflineBanner';

export type AppScreenBackground = 'default' | 'alt';

export interface AppScreenProps extends ScrollViewProps {
  scrollable?: boolean;
  padded?: boolean;
  withOfflineBanner?: boolean;
  background?: AppScreenBackground;
  keyboardAvoiding?: boolean;
  header?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

/**
 * Root screen wrapper with optional fixed white header and scrollable body.
 */
export function AppScreen({
  children,
  scrollable = true,
  padded = true,
  withOfflineBanner = true,
  background = 'alt',
  keyboardAvoiding = false,
  header,
  contentContainerStyle,
  style,
  ...scrollProps
}: AppScreenProps) {
  const { colors, tokens } = useTheme();
  const insets = useSafeAreaInsets();

  const screenBackground =
    background === 'alt' ? colors.backgroundAlt : colors.background;

  const horizontalPadding = padded ? tokens.spacing.screenHorizontal : 0;
  const bodyPaddingBottom = padded
    ? Math.max(insets.bottom, tokens.spacing.lg)
    : 0;

  const bodyInsets = header
    ? {
        paddingHorizontal: horizontalPadding,
        paddingTop: tokens.spacing.sm,
        paddingBottom: bodyPaddingBottom,
      }
    : {
        paddingTop: Math.max(insets.top, tokens.spacing.md),
        paddingHorizontal: horizontalPadding,
        paddingBottom: bodyPaddingBottom,
      };

  const scrollBody = scrollable ? (
    <ScrollView
      style={[styles.scroll, { backgroundColor: screenBackground }, style]}
      contentContainerStyle={[bodyInsets, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      {...scrollProps}>
      {withOfflineBanner ? <OfflineBanner /> : null}
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.scroll,
        { backgroundColor: screenBackground },
        bodyInsets,
        contentContainerStyle,
        style,
      ]}>
      {withOfflineBanner ? <OfflineBanner /> : null}
      {children}
    </View>
  );

  const layout = header ? (
    <View style={[styles.root, { backgroundColor: screenBackground }]}>
      <View
        style={[
          styles.fixedHeader,
          {
            paddingTop: Math.max(insets.top, tokens.spacing.sm),
            paddingBottom: tokens.spacing.sm,
            paddingHorizontal: horizontalPadding,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}>
        {header}
      </View>
      <View style={styles.body}>{scrollBody}</View>
    </View>
  ) : (
    <View style={[styles.root, { backgroundColor: screenBackground }]}>{scrollBody}</View>
  );

  if (!keyboardAvoiding) {
    return layout;
  }

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: screenBackground }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}>
      {layout}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  fixedHeader: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
