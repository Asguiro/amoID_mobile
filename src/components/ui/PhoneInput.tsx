import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { findPhoneCountry, PHONE_COUNTRIES } from '../../constants/phoneCountries';
import { useTranslation } from '../../hooks/useTranslation';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from './AppText';
import { FieldLabel } from './FieldLabel';

const DEFAULT_COUNTRY_CODE = '+223';

export interface PhoneInputProps {
  label: string;
  countryCode?: string;
  number: string;
  onNumberChange: (number: string) => void;
  onCountryCodeChange?: (countryCode: string) => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * Phone field with selectable country dial code and local number.
 */
export function PhoneInput({
  label,
  countryCode = DEFAULT_COUNTRY_CODE,
  number,
  onNumberChange,
  onCountryCodeChange,
  error,
  hint,
  disabled = false,
  required = false,
  containerStyle,
}: PhoneInputProps) {
  const { t } = useTranslation();
  const { tokens, colors } = useTheme();
  const inputTheme = tokens.components.input;
  const [pickerVisible, setPickerVisible] = useState(false);

  const selectedCountry = useMemo(
    () => findPhoneCountry(countryCode),
    [countryCode],
  );

  const borderColor = error ? tokens.colors.danger : inputTheme.borderColor;
  const canChangeCountry = Boolean(onCountryCodeChange) && !disabled;

  const handleSelectCountry = (dialCode: string) => {
    onCountryCodeChange?.(dialCode);
    setPickerVisible(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <FieldLabel label={label} required={required} />

      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('components.phoneInput.countryPicker')}
          disabled={!canChangeCountry}
          onPress={() => setPickerVisible(true)}
          style={[
            styles.countryButton,
            {
              height: inputTheme.height,
              borderRadius: inputTheme.borderRadius,
              backgroundColor: colors.cardSoft,
              borderColor,
              paddingHorizontal: inputTheme.paddingHorizontal,
              opacity: canChangeCountry ? 1 : 0.7,
            },
          ]}>
          <AppText variant="bodyStrong" style={styles.flag}>
            {selectedCountry.flag}
          </AppText>
          <AppText variant="bodyStrong" color={colors.textSecondary}>
            {selectedCountry.dialCode}
          </AppText>
          {canChangeCountry ? (
            <AppText variant="caption" color={colors.textSecondary}>
              ▾
            </AppText>
          ) : null}
        </Pressable>

        <TextInput
          accessibilityLabel={label}
          editable={!disabled}
          keyboardType="phone-pad"
          maxLength={12}
          placeholderTextColor={inputTheme.placeholderColor}
          value={number}
          onChangeText={onNumberChange}
          style={[
            styles.numberField,
            {
              height: inputTheme.height,
              borderRadius: inputTheme.borderRadius,
              backgroundColor: disabled ? colors.cardSoft : inputTheme.backgroundColor,
              borderColor,
              color: inputTheme.textColor,
              paddingHorizontal: inputTheme.paddingHorizontal,
              opacity: disabled ? 0.7 : 1,
            },
          ]}
        />
      </View>

      {error ? (
        <AppText variant="caption" color={tokens.colors.danger} style={styles.feedback}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" color={colors.textSecondary} style={styles.feedback}>
          {hint}
        </AppText>
      ) : null}

      <Modal
        animationType="slide"
        transparent
        visible={pickerVisible}
        onRequestClose={() => setPickerVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setPickerVisible(false)}>
          <Pressable style={[styles.modalSheet, { backgroundColor: colors.card }]}>
            <AppText variant="title" style={styles.modalTitle}>
              {t('components.phoneInput.countryPickerTitle')}
            </AppText>
            <FlatList
              data={PHONE_COUNTRIES}
              keyExtractor={item => item.iso}
              renderItem={({ item }) => {
                const isSelected = item.dialCode === countryCode;

                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => handleSelectCountry(item.dialCode)}
                    style={[
                      styles.countryRow,
                      {
                        backgroundColor: isSelected ? colors.cardSoft : colors.card,
                        borderColor: colors.border,
                      },
                    ]}>
                    <AppText variant="bodyStrong" style={styles.flag}>
                      {item.flag}
                    </AppText>
                    <View style={styles.countryMeta}>
                      <AppText variant="bodyStrong">
                        {t(`components.phoneInput.countries.${item.nameKey}`)}
                      </AppText>
                      <AppText variant="caption" color={colors.textSecondary}>
                        {item.dialCode}
                      </AppText>
                    </View>
                    {isSelected ? (
                      <AppText variant="bodyStrong" color={colors.primary}>
                        ✓
                      </AppText>
                    ) : null}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  countryButton: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minWidth: 108,
  },
  flag: {
    fontSize: 20,
    lineHeight: 24,
  },
  numberField: {
    flex: 1,
    borderWidth: 1,
    fontSize: 16,
  },
  feedback: {
    marginTop: 2,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(11, 27, 51, 0.45)',
  },
  modalSheet: {
    maxHeight: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  modalTitle: {
    marginBottom: 12,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  countryMeta: {
    flex: 1,
    gap: 2,
  },
});
