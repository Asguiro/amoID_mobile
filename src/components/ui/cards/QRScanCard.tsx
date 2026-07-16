import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useTheme } from '../../../theme/ThemeProvider';
import { AppButton } from '../AppButton';
import { AppCard } from '../AppCard';
import { AppText } from '../AppText';

export type QRScanState = 'idle' | 'scanning' | 'success' | 'error';

export interface QRScanCardProps {
  securityNote: string;
  scanState?: QRScanState;
  actionLabel?: string;
  onAction?: () => void;
  disabled?: boolean;
}

/**
 * QR scan zone — always paired with facial verification per security rules.
 */
export function QRScanCard({
  securityNote,
  scanState = 'idle',
  actionLabel,
  onAction,
  disabled = false,
}: QRScanCardProps) {
  const { tokens } = useTheme();
  const qrTheme = tokens.components.qrScanner;
  const isScanning = scanState === 'scanning';
  const isSuccess = scanState === 'success';

  return (
    <AppCard variant="elevated" style={styles.card}>
      <View
        style={[
          styles.scanZone,
          {
            borderRadius: qrTheme.cornerRadius,
            backgroundColor: tokens.colors.navy,
            borderColor: isSuccess ? tokens.colors.primary : 'transparent',
            borderWidth: isSuccess ? 2 : 0,
          },
        ]}>
        {isScanning ? (
          <ActivityIndicator size="large" color={tokens.colors.primary} />
        ) : (
          <Svg width={168} height={168} viewBox="0 0 140 140">
            <Rect x="20" y="20" width="100" height="100" rx="8" fill="rgba(255,255,255,0.06)" />
            <Path
              d="M36 36 H56 V46 H46 V56 H36 Z M84 36 H104 V56 H94 V46 H84 Z M36 84 V104 H56 V94 H46 V84 Z M94 84 H104 V104 H84 V94 H94 Z"
              fill={tokens.colors.primary}
            />
            <Rect x="48" y="48" width="44" height="44" rx="4" fill="rgba(255,255,255,0.08)" />
          </Svg>
        )}
      </View>

      <View style={[styles.securityNote, { backgroundColor: tokens.colors.primarySoft }]}>
        <AppText variant="caption" color={tokens.colors.primary}>
          {securityNote}
        </AppText>
      </View>

      {actionLabel && onAction ? (
        <AppButton
          label={actionLabel}
          fullWidth
          onPress={onAction}
          disabled={disabled || isScanning}
          loading={isScanning}
        />
      ) : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 20,
  },
  scanZone: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 240,
    paddingVertical: 32,
  },
  securityNote: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
  },
});
