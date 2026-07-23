import { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../theme/ThemeProvider';
import { useTranslation } from '../../hooks/useTranslation';
import { AppText } from './AppText';
import { FieldLabel } from './FieldLabel';

export interface DateInputProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

function formatDisplayDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Read-only date field that opens the native calendar picker.
 */
export function DateInput({
  label,
  value,
  onChange,
  error,
  hint,
  required = false,
  minimumDate,
  maximumDate,
  disabled = false,
  containerStyle,
}: DateInputProps) {
  const { tokens, colors } = useTheme();
  const { t } = useTranslation();
  const inputTheme = tokens.components.input;
  const [showPicker, setShowPicker] = useState(false);

  const borderColor = error ? tokens.colors.danger : inputTheme.borderColor;

  const displayValue = value
    ? formatDisplayDate(value)
    : t('components.dateInput.placeholder');

  const handleValueChange = (_event: unknown, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const handleDismiss = () => {
    setShowPicker(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <FieldLabel label={label} required={required} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={t('components.dateInput.accessibilityHint')}
        disabled={disabled}
        onPress={() => setShowPicker(true)}
        style={[
          styles.field,
          {
            height: inputTheme.height,
            borderRadius: inputTheme.borderRadius,
            backgroundColor: disabled ? colors.cardSoft : inputTheme.backgroundColor,
            borderColor,
            paddingHorizontal: inputTheme.paddingHorizontal,
          },
          disabled && styles.dimmed,
        ]}>
        <AppText
          variant="body"
          color={value ? inputTheme.textColor : inputTheme.placeholderColor}>
          {displayValue}
        </AppText>
      </Pressable>

      {error ? (
        <AppText variant="caption" color={tokens.colors.danger} style={styles.feedback}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" color={colors.textSecondary} style={styles.feedback}>
          {hint}
        </AppText>
      ) : null}

      {showPicker ? (
        <>
          <DateTimePicker
            value={value ?? new Date(1990, 0, 1)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onValueChange={handleValueChange}
            onDismiss={handleDismiss}
          />
          {Platform.OS === 'ios' ? (
            <Pressable
              accessibilityRole="button"
              onPress={handleDismiss}
              style={[styles.iosDone, { backgroundColor: colors.cardSoft }]}>
              <AppText variant="bodyStrong" color={colors.primary}>
                {t('common.confirm')}
              </AppText>
            </Pressable>
          ) : null}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  field: {
    borderWidth: 1,
    justifyContent: 'center',
  },
  dimmed: {
    opacity: 0.7,
  },
  iosDone: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 4,
  },
  feedback: {
    marginTop: 2,
  },
});
