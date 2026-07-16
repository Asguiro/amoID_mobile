import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppButton } from './AppButton';
import { AppText } from './AppText';
import { CircleIcon } from './CircleIcon';

export interface SuccessStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Success feedback block for completed flows.
 */
export function SuccessState({
  title,
  description,
  actionLabel,
  onAction,
}: SuccessStateProps) {
  const { tokens, colors } = useTheme();

  return (
    <View style={[styles.centered, { paddingVertical: tokens.spacing.xl }]}>
      <CircleIcon tone="success">
        <AppText variant="title" color={tokens.colors.success}>
          ✓
        </AppText>
      </CircleIcon>
      <AppText variant="title" style={{ marginTop: tokens.spacing.md, textAlign: 'center' }}>
        {title}
      </AppText>
      {description ? (
        <AppText
          variant="body"
          color={colors.textSecondary}
          style={{ marginTop: tokens.spacing.sm, textAlign: 'center', maxWidth: 300 }}>
          {description}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <AppButton
          label={actionLabel}
          onPress={onAction}
          containerStyle={{ marginTop: tokens.spacing.lg }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
