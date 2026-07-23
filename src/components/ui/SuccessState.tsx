import { useMemo } from 'react';
import { View } from 'react-native';
import { stateBlockStyles } from '../../theme/stateBlockStyles';
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

  const styles = useMemo(
    () => ({
      root: [stateBlockStyles.centered, { paddingVertical: tokens.spacing.xl }],
      title: [stateBlockStyles.title, { marginTop: tokens.spacing.md }],
      description: [stateBlockStyles.description, { marginTop: tokens.spacing.sm }],
      action: { marginTop: tokens.spacing.lg },
    }),
    [tokens.spacing.xl, tokens.spacing.md, tokens.spacing.sm, tokens.spacing.lg],
  );

  return (
    <View style={styles.root}>
      <CircleIcon tone="success">
        <AppText variant="title" color={tokens.colors.success}>
          ✓
        </AppText>
      </CircleIcon>
      <AppText variant="title" style={styles.title}>
        {title}
      </AppText>
      {description ? (
        <AppText
          variant="body"
          color={colors.textSecondary}
          style={styles.description}>
          {description}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <AppButton
          label={actionLabel}
          onPress={onAction}
          containerStyle={styles.action}
        />
      ) : null}
    </View>
  );
}
