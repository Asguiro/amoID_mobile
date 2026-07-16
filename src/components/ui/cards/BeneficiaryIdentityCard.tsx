import { Pressable, StyleSheet, View } from 'react-native';
import type { BeneficiarySummary } from '../../../api/types/beneficiary.types';
import { useTranslation } from '../../../hooks/useTranslation';
import { useTheme } from '../../../theme/ThemeProvider';
import { formatDisplayDate, formatDisplayDateTime } from '../../../utils/formatDate';
import { ActionGroupCard } from '../ActionGroupCard';
import { AppText } from '../AppText';
import { CircleIcon } from '../CircleIcon';
import { StatusDot } from '../StatusDot';
import type { StatusBadgeTone } from '../StatusBadge';
import { ChevronRight } from '../icons/ChevronRight';
import { IdentityGlyph } from '../icons/UiGlyphs';

const COVERAGE_TONE: Record<BeneficiarySummary['coverageStatus'], StatusBadgeTone> = {
  active: 'success',
  suspended: 'danger',
  update_required: 'warning',
  not_found: 'neutral',
};

export interface BeneficiaryIdentityCardProps {
  beneficiary: BeneficiarySummary;
  onPress?: () => void;
}

function CardField({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();

  return (
    <View style={styles.field}>
      <AppText variant="caption" color={colors.textSecondary}>
        {label}
      </AppText>
      <AppText variant="rowSubtitle" color={colors.textPrimary}>
        {value}
      </AppText>
    </View>
  );
}

/**
 * Identity summary card with full dossier preview and color-only status dot.
 */
export function BeneficiaryIdentityCard({ beneficiary, onPress }: BeneficiaryIdentityCardProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useTheme();

  const fullName = `${beneficiary.firstName} ${beneficiary.lastName}`;
  const statusLabel = t(`beneficiaries.coverage.${beneficiary.coverageStatus}`);

  const content = (
    <View style={styles.row}>
      <CircleIcon size={52}>
        <IdentityGlyph color={colors.icon} size={24} />
      </CircleIcon>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <AppText variant="rowTitle" style={styles.name}>
            {fullName}
          </AppText>
          <StatusDot
            tone={COVERAGE_TONE[beneficiary.coverageStatus]}
            accessibilityLabel={statusLabel}
          />
        </View>

        <CardField label={t('beneficiaries.amoNumberLabel')} value={beneficiary.amoNumber} />

        <CardField
          label={t('beneficiaries.typeLabel')}
          value={t(`beneficiaries.type.${beneficiary.beneficiaryType}`)}
        />

        <CardField
          label={t('beneficiaries.establishmentLabel')}
          value={beneficiary.establishmentName}
        />

        <CardField
          label={t('beneficiaries.birthDateLabel')}
          value={formatDisplayDate(beneficiary.birthDate)}
        />

        {beneficiary.lastVerifiedAt ? (
          <CardField
            label={t('beneficiaries.lastVerifiedLabel')}
            value={formatDisplayDateTime(beneficiary.lastVerifiedAt)}
          />
        ) : null}
      </View>

      {onPress ? (
        <View style={styles.chevron}>
          <ChevronRight color={tokens.colors.chevron} />
        </View>
      ) : null}
    </View>
  );

  if (!onPress) {
    return (
      <ActionGroupCard>
        <View style={[styles.cardInner, { paddingVertical: tokens.spacing.sm }]}>
          {content}
        </View>
      </ActionGroupCard>
    );
  }

  return (
    <ActionGroupCard>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={fullName}
        onPress={onPress}
        style={({ pressed }) => [
          styles.cardInner,
          { paddingVertical: tokens.spacing.sm, opacity: pressed ? 0.88 : 1 },
        ]}>
        {content}
      </Pressable>
    </ActionGroupCard>
  );
}

const styles = StyleSheet.create({
  cardInner: {
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  body: {
    flex: 1,
    gap: 10,
    paddingTop: 2,
    paddingRight: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  name: {
    flex: 1,
    flexShrink: 1,
  },
  field: {
    gap: 2,
  },
  chevron: {
    marginTop: 16,
  },
});
