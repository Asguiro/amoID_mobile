import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from './AppText';
import { ChevronRight } from './icons/ChevronRight';

export interface ActionRowProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  trailing?: ReactNode;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  isLast?: boolean;
}

/**
 * Navigable row with circle icon, title stack and optional chevron.
 */
export function ActionRow({
  title,
  subtitle,
  icon,
  onPress,
  showChevron = true,
  trailing,
  disabled = false,
  accessibilityLabel,
  style,
  isLast = false,
}: ActionRowProps) {
  const { tokens, colors } = useTheme();
  const rowTheme = tokens.components.actionRow;

  const content = (
    <>
      <View style={styles.leading}>{icon}</View>
      <View style={styles.textStack}>
        <AppText variant="rowTitle" numberOfLines={2}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="rowSubtitle" color={colors.textSecondary} numberOfLines={2}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {trailing ?? (showChevron && onPress ? (
        <ChevronRight color={tokens.colors.chevron} />
      ) : null)}
    </>
  );

  const rowStyle = [
    styles.row,
    {
      minHeight: rowTheme.minHeight,
      paddingVertical: tokens.spacing.sm,
    },
    style,
  ];

  const divider = !isLast ? (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: colors.divider,
          marginLeft: rowTheme.dividerInset,
        },
      ]}
    />
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
    gap: 16,
  },
  leading: {
    flexShrink: 0,
  },
  textStack: {
    flex: 1,
    gap: 4,
    paddingRight: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
});
