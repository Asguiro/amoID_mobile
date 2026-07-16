import { StyleSheet, View } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
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

  return (
    <View style={[styles.centered, { paddingVertical: tokens.spacing.xl }]}>
      <CircleIcon tone="danger">
        <AppText variant="title" color={tokens.colors.danger}>
          !
        </AppText>
      </CircleIcon>
      <AppText variant="title" style={{ marginTop: tokens.spacing.md, textAlign: 'center' }}>
        {t('common.errorTitle')}
      </AppText>
      <AppText
        variant="body"
        color={colors.textSecondary}
        style={{ marginTop: tokens.spacing.sm, textAlign: 'center', maxWidth: 300 }}>
        {message ?? t('common.errorGeneric')}
      </AppText>
      {onRetry ? (
        <AppButton
          label={t('common.retry')}
          variant="outline"
          onPress={onRetry}
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
