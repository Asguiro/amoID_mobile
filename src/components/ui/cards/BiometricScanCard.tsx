import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { useTheme } from '../../../theme/ThemeProvider';
import { AppButton } from '../AppButton';
import { AppCard } from '../AppCard';
import { AppText } from '../AppText';
import { CircleIcon } from '../CircleIcon';
import { StatusBadge } from '../StatusBadge';
import { FaceScanGlyph } from '../icons/UiGlyphs';

export type BiometricScanStatus = 'idle' | 'scanning' | 'success' | 'warning' | 'failed';

export interface BiometricScanCardProps {
  title: string;
  description: string;
  status?: BiometricScanStatus;
  statusLabel?: string;
  actionLabel?: string;
  onAction?: () => void;
  disabled?: boolean;
}

const STATUS_TONE: Record<
  BiometricScanStatus,
  'neutral' | 'info' | 'success' | 'warning' | 'danger'
> = {
  idle: 'neutral',
  scanning: 'info',
  success: 'success',
  warning: 'warning',
  failed: 'danger',
};

const CIRCLE_TONE: Record<
  BiometricScanStatus,
  'default' | 'soft' | 'success' | 'warning' | 'danger'
> = {
  idle: 'soft',
  scanning: 'soft',
  success: 'success',
  warning: 'warning',
  failed: 'danger',
};

/**
 * Biometric capture card with framed scan zone and business status only.
 */
export function BiometricScanCard({
  title,
  description,
  status = 'idle',
  statusLabel,
  actionLabel,
  onAction,
  disabled = false,
}: BiometricScanCardProps) {
  const { tokens, colors } = useTheme();
  const biometricTheme = tokens.components.biometric;
  const frameColor =
    status === 'success'
      ? biometricTheme.successColor
      : status === 'failed'
        ? biometricTheme.dangerColor
        : status === 'warning'
          ? biometricTheme.warningColor
          : biometricTheme.faceFrameColor;

  return (
    <AppCard variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <CircleIcon tone={CIRCLE_TONE[status]}>
          <FaceScanGlyph color={frameColor} />
        </CircleIcon>
        <View style={styles.headerText}>
          <AppText variant="rowTitle">{title}</AppText>
          <AppText variant="rowSubtitle" color={colors.textSecondary} numberOfLines={2}>
            {description}
          </AppText>
        </View>
        {statusLabel ? (
          <StatusBadge label={statusLabel} tone={STATUS_TONE[status]} showDot />
        ) : null}
      </View>

      <View
        style={[
          styles.scanZone,
          {
            borderColor: frameColor,
            backgroundColor: colors.cardSoft,
            borderRadius: tokens.radii.lg,
          },
        ]}>
        <Svg width={120} height={120} viewBox="0 0 120 120" accessibilityLabel="">
          <Ellipse
            cx="60"
            cy="52"
            rx="28"
            ry="34"
            stroke={frameColor}
            strokeWidth="2"
            fill="none"
          />
          <Path
            d="M36 88 C44 76 76 76 84 88"
            stroke={frameColor}
            strokeWidth="2"
            fill="none"
          />
          <Circle cx="60" cy="52" r="46" stroke={frameColor} strokeWidth="1.25" fill="none" opacity={0.3} />
        </Svg>
      </View>

      {actionLabel && onAction ? (
        <AppButton
          label={actionLabel}
          fullWidth
          onPress={onAction}
          disabled={disabled}
          loading={status === 'scanning'}
          containerStyle={{ marginTop: tokens.spacing.sm }}
        />
      ) : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  scanZone: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
});
