import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from './AppText';
import { ChevronRight } from './icons/ChevronRight';

export interface SettingsRowProps {
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  trailing?: ReactNode;
  showChevron?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  isLast?: boolean;
}

/**
 * Settings-style row with title, optional subtitle/value and chevron.
 */
export function SettingsRow({
  title,
  subtitle,
  value,
  onPress,
  trailing,
  showChevron = Boolean(onPress),
  disabled = false,
  accessibilityLabel,
  style,
  isLast = false,
}: SettingsRowProps) {
  const { tokens, colors } = useTheme();

  const content = (
    <>
      <View style={styles.textStack}>
        <AppText variant="rowTitle" numberOfLines={1}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="rowSubtitle" color={colors.textSecondary} numberOfLines={2}>
            {subtitle}
          </AppText>
        ) : null}
        {value ? (
          <AppText variant="caption" color={colors.textSecondary} numberOfLines={1}>
            {value}
          </AppText>
        ) : null}
      </View>
      <View style={styles.trailing}>
        {trailing ?? (showChevron && onPress ? (
          <ChevronRight color={tokens.colors.chevron} />
        ) : null)}
      </View>
    </>
  );

  const rowStyle = [
    styles.row,
    {
      minHeight: tokens.components.actionRow.minHeight,
      paddingVertical: tokens.spacing.md,
    },
    style,
  ];

  const divider = !isLast ? (
    <View style={[styles.divider, { backgroundColor: colors.divider }]} />
  ) : null;

  if (!onPress) {
    return (
      <View>
        <View style={rowStyle}>{content}</View>
        {divider}
      </View>
    );
  }

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          rowStyle,
          { opacity: disabled ? 0.5 : pressed ? 0.88 : 1 },
        ]}>
        {content}
      </Pressable>
      {divider}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  textStack: {
    flex: 1,
    gap: 4,
  },
  trailing: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
});
