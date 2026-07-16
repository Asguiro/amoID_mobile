import { StyleSheet, Switch, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from './AppText';

export interface AppSwitchRowProps {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  isLast?: boolean;
}

/**
 * Settings row with native switch control.
 */
export function AppSwitchRow({
  title,
  subtitle,
  value,
  onValueChange,
  disabled = false,
  accessibilityLabel,
  style,
  isLast = false,
}: AppSwitchRowProps) {
  const { tokens, colors } = useTheme();

  return (
    <View>
      <View
        style={[
          styles.row,
          {
            minHeight: tokens.components.actionRow.minHeight,
            paddingVertical: tokens.spacing.md,
          },
          style,
        ]}>
        <View style={styles.textStack}>
          <AppText variant="rowTitle" numberOfLines={1}>
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="rowSubtitle" color={colors.textSecondary} numberOfLines={2}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
        <Switch
          accessibilityRole="switch"
          accessibilityLabel={accessibilityLabel ?? title}
          accessibilityState={{ disabled, checked: value }}
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{
            false: colors.border,
            true: colors.primary,
          }}
          thumbColor={colors.card}
          ios_backgroundColor={colors.border}
        />
      </View>
      {!isLast ? (
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      ) : null}
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
    paddingRight: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
});
