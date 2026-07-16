import { Image, Pressable, StyleSheet, View } from 'react-native';
import { CircleIcon } from '../../../components/ui';
import { ProfileGlyph } from '../../../components/ui/icons/UiGlyphs';
import { useTranslation } from '../../../hooks/useTranslation';
import { useTheme } from '../../../theme/ThemeProvider';

const brandLogo = require('../../../assets/brand/amo-id-sante-logo-horizontal.png');

export interface HomeToolbarProps {
  onProfilePress?: () => void;
}

export function HomeToolbar({ onProfilePress }: HomeToolbarProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Image
        source={brandLogo}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel={t('common.appName')}
      />

      <View style={styles.spacer} />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('home.toolbar.profile')}
        hitSlop={8}
        onPress={onProfilePress}
        style={({ pressed }) => [styles.profileAction, { opacity: pressed ? 0.72 : 1 }]}>
        <CircleIcon size={44}>
          <ProfileGlyph color={colors.icon} size={22} />
        </CircleIcon>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  logo: {
    width: 140,
    height: 38,
    flexShrink: 0,
  },
  spacer: {
    flex: 1,
  },
  profileAction: {
    flexShrink: 0,
  },
});
