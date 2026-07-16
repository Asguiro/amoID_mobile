import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

export type AppButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
export type AppButtonSize = 'md' | 'lg';

export interface AppButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

const SIZE_HEIGHT: Record<AppButtonSize, number> = {
  md: 48,
  lg: 52,
};

/**
 * Primary action control with institutional styling and loading state.
 *
 * @example
 * <AppButton label="Se connecter" fullWidth onPress={handleSubmit} />
 * <AppButton label="Annuler" variant="outline" onPress={onCancel} />
 */
export function AppButton({
  label,
  variant = 'primary',
  size = 'lg',
  loading = false,
  fullWidth = false,
  disabled,
  containerStyle,
  style,
  accessibilityLabel,
  ...pressableProps
}: AppButtonProps) {
  const { tokens } = useTheme();
  const buttonTheme = tokens.components.button;
  const variantTheme = buttonTheme.variants[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          height: SIZE_HEIGHT[size],
          borderRadius: buttonTheme.borderRadius,
          paddingHorizontal: buttonTheme.paddingHorizontal,
          backgroundColor: variantTheme.backgroundColor,
          borderColor:
            'borderColor' in variantTheme ? variantTheme.borderColor : 'transparent',
          borderWidth: variant === 'outline' ? 1.5 : 0,
          opacity: isDisabled ? 0.55 : pressed ? 0.9 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        containerStyle,
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
      {...pressableProps}>
      {loading ? (
        <ActivityIndicator color={variantTheme.textColor} />
      ) : (
        <Text
          style={[
            styles.label,
            {
              color: variantTheme.textColor,
              fontSize: tokens.typography.styles.button.fontSize,
              fontWeight: tokens.typography.styles.button.fontWeight as TextStyle['fontWeight'],
              letterSpacing: tokens.typography.styles.button.letterSpacing,
            },
          ]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
  },
  label: {
    textAlign: 'center',
  },
});
