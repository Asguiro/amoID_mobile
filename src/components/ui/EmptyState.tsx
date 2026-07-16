import { StyleSheet, View } from 'react-native';
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

  return (
    <View style={[styles.centered, { paddingVertical: tokens.spacing.xl }]}>
      <CircleIcon tone="soft">
        <AppText variant="title" color={colors.primary}>
          —
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
