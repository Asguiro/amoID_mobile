import { StyleSheet, View } from 'react-native';
import type { BeneficiaryCoverageStatus } from '../../../api/types/beneficiary.types';
import { useTranslation } from '../../../hooks/useTranslation';
import { useTheme } from '../../../theme/ThemeProvider';
import { AppCard } from '../AppCard';
import { AppText } from '../AppText';
import { CircleIcon } from '../CircleIcon';
import { StatusBadge, type StatusBadgeTone } from '../StatusBadge';
import { ShieldCheckGlyph } from '../icons/UiGlyphs';

const COVERAGE_TONE: Record<BeneficiaryCoverageStatus, StatusBadgeTone> = {
  active: 'success',
  suspended: 'danger',
  update_required: 'warning',
  not_found: 'neutral',
};

export interface EligibilityCardProps {
  beneficiaryName: string;
  amoNumber: string;
  coverageStatus: BeneficiaryCoverageStatus;
  lastVerifiedAt?: string;
  establishmentName?: string;
}

/**
 * Eligibility verification result card — business status only, never raw scores.
 */
export function EligibilityCard({
  beneficiaryName,
  amoNumber,
  coverageStatus,
  lastVerifiedAt,
  establishmentName,
}: EligibilityCardProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useTheme();

  const isActive = coverageStatus === 'active';
  const iconTone = isActive ? 'success' : coverageStatus === 'suspended' ? 'danger' : 'default';

  return (
    <AppCard variant="elevated" style={styles.card}>
      <View style={styles.header}>
        <CircleIcon tone={iconTone}>
          <ShieldCheckGlyph color={isActive ? tokens.colors.success : colors.icon} />
        </CircleIcon>
        <View style={styles.identity}>
          <AppText variant="rowTitle">{beneficiaryName}</AppText>
          <AppText variant="rowSubtitle" color={colors.textSecondary}>
            {amoNumber}
          </AppText>
        </View>
        <StatusBadge
          label={t(`beneficiaries.coverage.${coverageStatus}`)}
          tone={COVERAGE_TONE[coverageStatus]}
          showDot
        />
      </View>

      {establishmentName ? (
        <AppText variant="caption" color={colors.textSecondary}>
          {establishmentName}
        </AppText>
      ) : null}

      {lastVerifiedAt ? (
        <AppText variant="caption" color={colors.textSecondary} style={{ marginTop: tokens.spacing.xs }}>
          {t('eligibility.lastVerified', { date: lastVerifiedAt })}
        </AppText>
      ) : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  identity: {
    flex: 1,
    gap: 4,
  },
});
