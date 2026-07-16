import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from './AppText';

export interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  options: readonly SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Horizontal segmented selector for mutually exclusive choices.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  style,
}: SegmentedControlProps<T>) {
  const { tokens, colors } = useTheme();

  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.container,
        {
          backgroundColor: colors.cardSoft,
          borderRadius: tokens.components.input.borderRadius,
          padding: 4,
        },
        style,
      ]}>
      {options.map(option => {
        const isSelected = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onChange(option.value)}
            style={[
              styles.segment,
              {
                borderRadius: tokens.components.input.borderRadius - 2,
                backgroundColor: isSelected ? colors.card : 'transparent',
              },
            ]}>
            <AppText
              variant="bodyStrong"
              color={isSelected ? colors.primary : colors.textSecondary}
              style={styles.segmentLabel}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  segmentLabel: {
    textAlign: 'center',
  },
});
