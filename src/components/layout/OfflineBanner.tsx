import { StyleSheet, View } from 'react-native';
import { useSession } from '../../hooks/useSession';
import { useTranslation } from '../../hooks/useTranslation';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from '../ui';

export function OfflineBanner() {
  const { isOffline, pendingSyncCount } = useSession();
  const { t } = useTranslation();
  const { colors, tokens } = useTheme();

  if (!isOffline && pendingSyncCount === 0) {
    return null;
  }

  const message = isOffline
    ? t('common.offline')
    : t(
        pendingSyncCount > 1
          ? 'common.pendingSync_plural'
          : 'common.pendingSync',
        { count: pendingSyncCount },
      );

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: colors.cardSoft,
          borderColor: colors.border,
          borderRadius: tokens.radii.md,
          marginBottom: tokens.spacing.md,
          marginHorizontal: tokens.spacing.screenHorizontal,
        },
      ]}>
      <AppText variant="bodyStrong" color={colors.primary}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
});
