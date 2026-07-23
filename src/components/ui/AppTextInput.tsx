import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from './AppText';
import { FieldLabel } from './FieldLabel';

export interface AppTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * Accessible labeled text field with error and hint support.
 *
 * @example
 * <AppTextInput
 *   label="Identifiant"
 *   value={identifier}
 *   onChangeText={setIdentifier}
 *   placeholder="Matricule ou e-mail"
 *   error={errors.identifier}
 *   autoCapitalize="none"
 * />
 */
export function AppTextInput({
  label,
  error,
  hint,
  required = false,
  containerStyle,
  editable = true,
  style,
  ...inputProps
}: AppTextInputProps) {
  const { tokens, colors } = useTheme();
  const inputTheme = tokens.components.input;
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? tokens.colors.danger
    : isFocused
      ? colors.primary
      : inputTheme.borderColor;

  return (
    <View style={[styles.container, containerStyle]}>
      <FieldLabel label={label} required={required} />

      <TextInput
        accessibilityLabel={label}
        accessibilityHint={hint}
        editable={editable}
        placeholderTextColor={inputTheme.placeholderColor}
        onFocus={event => {
          setIsFocused(true);
          inputProps.onFocus?.(event);
        }}
        onBlur={event => {
          setIsFocused(false);
          inputProps.onBlur?.(event);
        }}
        style={[
          styles.input,
          {
            height: inputTheme.height,
            borderRadius: inputTheme.borderRadius,
            backgroundColor: editable ? inputTheme.backgroundColor : colors.cardSoft,
            borderColor,
            color: inputTheme.textColor,
            paddingHorizontal: inputTheme.paddingHorizontal,
          },
          !editable && styles.dimmed,
          style,
        ]}
        {...inputProps}
      />

      {error ? (
        <AppText
          variant="caption"
          color={tokens.colors.danger}
          accessibilityRole="text"
          style={styles.feedback}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" color={colors.textSecondary} style={styles.feedback}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    marginBottom: 0,
  },
  input: {
    borderWidth: 1,
    fontSize: 16,
  },
  dimmed: {
    opacity: 0.7,
  },
  feedback: {
    marginTop: 2,
  },
});
