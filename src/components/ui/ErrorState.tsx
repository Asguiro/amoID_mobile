import { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { stateBlockStyles } from '../../theme/stateBlockStyles';
import { useTheme } from '../../theme/ThemeProvider';
import { AppButton } from './AppButton';
import { AppText } from './AppText';
import { CircleIcon } from './CircleIcon';

export interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

/**
 * @example
 * <ErrorState onRetry={refetch} />
 * <ErrorState message="Session expirée." onRetry={relogin} />
 */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();
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
      <CircleIcon tone="danger">
        <AppText variant="title" color={tokens.colors.danger}>
          !
        </AppText>
      </CircleIcon>
      <AppText variant="title" style={styles.title}>
        {t('common.errorTitle')}
      </AppText>
      <AppText
        variant="body"
        color={colors.textSecondary}
        style={styles.description}>
        {message ?? t('common.errorGeneric')}
      </AppText>
      {onRetry ? (
        <AppButton
          label={t('common.retry')}
          variant="outline"
          onPress={onRetry}
          containerStyle={styles.action}
        />
      ) : null}
    </View>
  );
}
