import { useMemo } from 'react';
import { View } from 'react-native';
import { stateBlockStyles } from '../../theme/stateBlockStyles';
import { useTheme } from '../../theme/ThemeProvider';
import { AppButton } from './AppButton';
import { AppText } from './AppText';
import { CircleIcon } from './CircleIcon';

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * @example
 * <EmptyState
 *   title="Aucun bénéficiaire"
 *   description="Affinez votre recherche."
 *   actionLabel="Nouvel enrôlement"
 *   onAction={goToEnrollment}
 * />
 */
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
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
      <CircleIcon tone="soft">
        <AppText variant="title" color={colors.primary}>
          —
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
