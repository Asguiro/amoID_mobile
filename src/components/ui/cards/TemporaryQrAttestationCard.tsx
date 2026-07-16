import { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import type { TemporaryQrToken } from '../../../api/types/temporary-qr.types';
import { useTranslation } from '../../../hooks/useTranslation';
import { useTheme } from '../../../theme/ThemeProvider';
import { formatDisplayDateTimeFull } from '../../../utils/formatDate';
import { AppText } from '../AppText';

export interface TemporaryQrAttestationCardProps {
  token: TemporaryQrToken;
}

function maskAmoNumber(amoNumber: string): string {
  const parts = amoNumber.split('-');

  if (parts.length < 2) {
    return amoNumber;
  }

  const suffix = parts[parts.length - 1];
  return `AMO-****-${suffix}`;
}

export const TemporaryQrAttestationCard = forwardRef<
  View,
  TemporaryQrAttestationCardProps
>(function TemporaryQrAttestationCard({ token }, ref) {
  const { t } = useTranslation();
  const { colors, tokens } = useTheme();

  const fullName = `${token.beneficiary.firstName} ${token.beneficiary.lastName}`;

  return (
    <View
      ref={ref}
      collapsable={false}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: tokens.components.card.borderRadius,
          borderColor: colors.border,
        },
      ]}>
      <AppText variant="sectionTitle" color={colors.primary}>
        {t('temporaryQr.attestation.brandLabel')}
      </AppText>

      <AppText variant="title" style={styles.title}>
        {t('temporaryQr.attestation.title')}
      </AppText>

      <View style={styles.identityBlock}>
        <AppText variant="caption" color={colors.textSecondary}>
          {t('temporaryQr.attestation.beneficiaryLabel')}
        </AppText>
        <AppText variant="rowTitle">{fullName}</AppText>
        <AppText variant="body" color={colors.textSecondary}>
          {maskAmoNumber(token.beneficiary.amoNumber)}
        </AppText>
      </View>

      <View style={styles.qrContainer}>
        <QRCode value={token.qrValue} size={180} backgroundColor={colors.card} />
      </View>

      <View style={styles.metaBlock}>
        <AppText variant="caption" color={colors.textSecondary}>
          {t('temporaryQr.attestation.validUntilLabel')}
        </AppText>
        <AppText variant="bodyStrong">
          {formatDisplayDateTimeFull(token.expiresAt)}
        </AppText>
      </View>

      <View style={styles.metaBlock}>
        <AppText variant="caption" color={colors.textSecondary}>
          {t('temporaryQr.attestation.referenceLabel')}
        </AppText>
        <AppText variant="body">{token.printReference}</AppText>
      </View>

      <View
        style={[
          styles.notice,
          {
            backgroundColor: colors.cardSoft,
            borderRadius: tokens.components.card.borderRadius - 4,
          },
        ]}>
        <AppText variant="caption" color={colors.textSecondary}>
          {t('temporaryQr.attestation.securityNotice')}
        </AppText>
      </View>

      <AppText variant="caption" color={colors.textSecondary} style={styles.footer}>
        {t('temporaryQr.attestation.issuedAt', {
          date: formatDisplayDateTimeFull(token.issuedAt),
        })}
      </AppText>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    padding: 24,
    gap: 16,
  },
  title: {
    marginTop: -4,
  },
  identityBlock: {
    gap: 4,
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  metaBlock: {
    gap: 2,
  },
  notice: {
    padding: 12,
  },
  footer: {
    textAlign: 'center',
  },
});
