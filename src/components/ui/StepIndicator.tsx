import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { useTranslation } from '../../hooks/useTranslation';
import { AppText } from './AppText';

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Wizard progress label — e.g. "Étape 2/5".
 */
export function StepIndicator({ currentStep, totalSteps, style }: StepIndicatorProps) {
  const { tokens, colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={t('components.stepIndicator.accessibilityLabel', {
        current: currentStep,
        total: totalSteps,
      })}
      style={[styles.wrapper, style]}>
      <AppText variant="sectionTitle" color={colors.primary}>
        {t('components.stepIndicator.label', {
          current: currentStep,
          total: totalSteps,
        })}
      </AppText>

      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.fill,
            {
              backgroundColor: colors.primary,
              width: `${(currentStep / totalSteps) * 100}%`,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 2,
  },
});
