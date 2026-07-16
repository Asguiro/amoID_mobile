import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from './AppText';

export interface LoadingStateProps {
  label?: string;
}

/**
 * @example
 * <LoadingState />
 * <LoadingState label="Chargement des bénéficiaires…" />
 */
export function LoadingState({ label }: LoadingStateProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useTheme();

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label ?? t('common.loading')}
      style={[styles.centered, { paddingVertical: tokens.spacing.xl }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <AppText
        variant="body"
        color={colors.textSecondary}
        style={{ marginTop: tokens.spacing.md }}>
        {label ?? t('common.loading')}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
