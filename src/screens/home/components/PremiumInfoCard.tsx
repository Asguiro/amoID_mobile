import { StyleSheet, View } from 'react-native';
import { AppText } from '../../../components/ui';
import { ShieldCheckGlyph } from '../../../components/ui/icons/UiGlyphs';
import { useFlowStyles } from '../../../theme/useFlowStyles';
import { useTheme } from '../../../theme/ThemeProvider';

export interface PremiumInfoCardProps {
  message: string;
}

export function PremiumInfoCard({ message }: PremiumInfoCardProps) {
  const { tokens, colors } = useTheme();
  const flow = useFlowStyles();
  const cardTheme = tokens.components.card;
  const shadow = tokens.shadows.sm;
  const shadowOffset: { width: number; height: number } =
    'shadowOffset' in shadow
      ? (shadow.shadowOffset as { width: number; height: number })
      : { width: 0, height: 0 };

  return (
    <View
      style={[
        styles.card,
        flow.cardGapMd,
        {
          borderRadius: cardTheme.borderRadius,
          backgroundColor: colors.primary,
          padding: cardTheme.padding,
          shadowColor: shadow.shadowColor,
          shadowOpacity: shadow.shadowOpacity,
          shadowRadius: shadow.shadowRadius,
          shadowOffset,
          elevation: shadow.elevation,
        },
      ]}>
      <View style={styles.iconWrap}>
        <ShieldCheckGlyph color={colors.textInverse} size={24} />
      </View>
      <AppText variant="body" color={colors.textInverse} style={styles.message}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    flexShrink: 0,
  },
  message: {
    flex: 1,
    fontWeight: '600',
  },
});
