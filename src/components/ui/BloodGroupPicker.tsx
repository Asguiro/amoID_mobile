import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { BLOOD_GROUPS } from '../../constants/bloodGroups';
import { useTranslation } from '../../hooks/useTranslation';
import { useTheme } from '../../theme/ThemeProvider';
import { FieldLabel } from './FieldLabel';
import { AppText } from './AppText';

export interface BloodGroupPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * Visual grid selector for standard blood groups.
 */
export function BloodGroupPicker({
  label,
  value,
  onChange,
  disabled = false,
  containerStyle,
}: BloodGroupPickerProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      <FieldLabel label={label} />

      <View style={styles.grid}>
        {BLOOD_GROUPS.map(group => {
          const isSelected = value === group;

          return (
            <Pressable
              key={group}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected, disabled }}
              disabled={disabled}
              onPress={() => onChange(group)}
              style={[
                styles.chip,
                {
                  borderColor: isSelected ? colors.primary : colors.border,
                  backgroundColor: isSelected ? colors.cardSoft : colors.card,
                  opacity: disabled ? 0.6 : 1,
                },
              ]}>
              <AppText
                variant="bodyStrong"
                color={isSelected ? colors.primary : colors.textSecondary}>
                {group}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: value === '', disabled }}
        disabled={disabled}
        onPress={() => onChange('')}
        style={[
          styles.unknownChip,
          {
            borderColor: value === '' ? colors.primary : colors.border,
            backgroundColor: value === '' ? colors.cardSoft : colors.backgroundAlt,
          },
        ]}>
        <AppText
          variant="caption"
          color={value === '' ? colors.primary : colors.textSecondary}>
          {t('enrollment.health.bloodGroupUnknown')}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    minWidth: 56,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unknownChip: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
});
