import { StyleSheet, View } from 'react-native';
import { useTranslation } from '../../../hooks/useTranslation';
import { useTheme } from '../../../theme/ThemeProvider';
import { ActionGroupCard } from '../ActionGroupCard';
import { ActionRow } from '../ActionRow';
import { AppButton } from '../AppButton';
import { AppText } from '../AppText';
import { CircleIcon } from '../CircleIcon';
import { StatusBadge } from '../StatusBadge';
import { EmergencyGlyph } from '../icons/UiGlyphs';

export type EmergencyInfoLevel = 'standard' | 'critical';

export interface EmergencyInfoCardProps {
  title: string;
  description: string;
  authorizedFields: string[];
  level?: EmergencyInfoLevel;
  actionLabel?: string;
  onAction?: () => void;
  onPress?: () => void;
}

/**
 * Controlled emergency information card — only authorized fields, no medical data in logs.
 */
export function EmergencyInfoCard({
  title,
  description,
  authorizedFields,
  level = 'standard',
  actionLabel,
  onAction,
  onPress,
}: EmergencyInfoCardProps) {
  const { t } = useTranslation();
  const { tokens, colors } = useTheme();
  const isCritical = level === 'critical';

  return (
    <View style={styles.wrapper}>
      <ActionGroupCard>
        <ActionRow
          title={title}
          subtitle={description}
          icon={
            <CircleIcon tone={isCritical ? 'danger' : 'warning'}>
              <EmergencyGlyph color={isCritical ? tokens.colors.danger : tokens.colors.warning} />
            </CircleIcon>
          }
          trailing={
            <StatusBadge
              label={
                isCritical ? t('emergency.levelCritical') : t('emergency.levelLimited')
              }
              tone={isCritical ? 'danger' : 'warning'}
            />
          }
          showChevron={Boolean(onPress)}
          onPress={onPress}
          isLast
        />
      </ActionGroupCard>

      <View
        style={[
          styles.fieldsCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: tokens.radii.lg,
          },
        ]}>
        <AppText variant="sectionTitle" color={colors.textSecondary}>
          {t('emergency.authorizedFieldsLabel')}
        </AppText>
        {authorizedFields.map(field => (
          <AppText key={field} variant="bodyStrong" style={styles.fieldItem}>
            {field}
          </AppText>
        ))}
      </View>

      {actionLabel && onAction ? (
        <AppButton
          label={actionLabel}
          variant={isCritical ? 'danger' : 'primary'}
          fullWidth
          onPress={onAction}
          containerStyle={{ marginTop: tokens.spacing.md }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: 12,
  },
  fieldsCard: {
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  fieldItem: {
    paddingVertical: 2,
  },
});
