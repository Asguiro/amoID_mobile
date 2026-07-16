import { Image, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { EnrollmentHealthFields } from '../../api/types/enrollment.types';
import {
  AppButton,
  AppCard,
  AppHeader,
  AppScreen,
  AppText,
  SectionTitle,
  StatusBadge,
} from '../../components/ui';
import { FlowFooter, FlowSection } from '../../components/layout/FlowLayout';
import { ENROLLMENT_ROUTES } from '../../constants/routes';
import { useEnrollmentDraft } from '../../hooks/useEnrollmentDraft';
import { useTranslation } from '../../hooks/useTranslation';
import type { EnrollmentStackParamList } from '../../navigation/flow-types';
import { useTheme } from '../../theme/ThemeProvider';
import { useFlowStyles } from '../../theme/useFlowStyles';
import { formatDisplayDate } from '../../utils/formatDate';
import { formatEnrollmentPhone } from './enrollment.validation';

type Navigation = NativeStackNavigationProp<
  EnrollmentStackParamList,
  typeof ENROLLMENT_ROUTES.RECAP
>;

function RecapRow({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();

  return (
    <View style={{ gap: 2 }}>
      <AppText variant="caption" color={colors.textSecondary}>
        {label}
      </AppText>
      <AppText variant="bodyStrong">{value || '—'}</AppText>
    </View>
  );
}

function hasHealthInfo(fields: EnrollmentHealthFields): boolean {
  return Boolean(
    fields.emergencyContactName.trim() ||
      fields.emergencyContactRelationship.trim() ||
      fields.emergencyContactPhone.trim() ||
      fields.bloodGroup.trim() ||
      fields.allergies.trim() ||
      fields.chronicConditions.trim() ||
      fields.currentTreatments.trim() ||
      fields.specialAttention.trim() ||
      fields.medicalNotes.trim() ||
      fields.followUpEstablishment.trim() ||
      fields.referringDoctor.trim() ||
      fields.externalDossierNumber.trim(),
  );
}

export function EnrollmentRecapScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const flow = useFlowStyles();
  const draft = useEnrollmentDraft();
  const { requiredFields, healthFields, faceCaptureResult, isProvisional } = draft;

  const captureLabel = faceCaptureResult
    ? t(`enrollment.recap.captureQuality.${faceCaptureResult.qualityLabel}`)
    : t('enrollment.recap.captureMissing');

  const captureTone =
    faceCaptureResult?.qualityLabel === 'good'
      ? 'success'
      : faceCaptureResult?.qualityLabel === 'acceptable'
        ? 'warning'
        : 'danger';

  const phoneDisplay = formatEnrollmentPhone(requiredFields);
  const birthDateDisplay = requiredFields.birthDate
    ? formatDisplayDate(requiredFields.birthDate)
    : '';

  return (
    <AppScreen header={<AppHeader title={t('enrollment.recap.title')} showBack />}>
      <FlowSection first>
        <SectionTitle title={t('enrollment.recap.identitySection')} />
        <AppCard variant="elevated" style={flow.cardGap}>
          <RecapRow
            label={t('enrollment.mandatory.firstName')}
            value={requiredFields.firstName}
          />
          <RecapRow
            label={t('enrollment.mandatory.lastName')}
            value={requiredFields.lastName}
          />
          <RecapRow label={t('enrollment.mandatory.birthDate')} value={birthDateDisplay} />
          <RecapRow
            label={t('enrollment.mandatory.sex')}
            value={
              requiredFields.sex
                ? t(`enrollment.mandatory.sexOptions.${requiredFields.sex}`)
                : ''
            }
          />
          <RecapRow label={t('enrollment.mandatory.phone')} value={phoneDisplay} />
          <RecapRow label={t('enrollment.mandatory.address')} value={requiredFields.address} />
          {requiredFields.city ? (
            <RecapRow label={t('enrollment.mandatory.city')} value={requiredFields.city} />
          ) : null}
          {isProvisional ? (
            <StatusBadge
              label={t('enrollment.recap.provisionalBadge')}
              tone="warning"
              showDot
            />
          ) : null}
        </AppCard>
      </FlowSection>

      <FlowSection>
        <SectionTitle title={t('enrollment.recap.healthSection')} />
        <AppCard variant="soft">
          <AppText variant="body">
            {hasHealthInfo(healthFields)
              ? t('enrollment.dossier.healthPresent')
              : t('enrollment.recap.healthEmpty')}
          </AppText>
        </AppCard>
      </FlowSection>

      <FlowSection>
        <SectionTitle title={t('enrollment.recap.captureSection')} />
        <AppCard variant="soft" style={flow.cardGap}>
          {faceCaptureResult?.previewUri ? (
            <View style={styles.previewFrame}>
              <Image
                source={{ uri: faceCaptureResult.previewUri }}
                style={styles.previewImage}
                accessibilityLabel={t('enrollment.recap.capturePreviewA11y')}
                resizeMode="cover"
              />
            </View>
          ) : null}
          {faceCaptureResult ? (
            <StatusBadge label={captureLabel} tone={captureTone} showDot />
          ) : (
            <AppText variant="body">{captureLabel}</AppText>
          )}
          {faceCaptureResult?.previewUri ? (
            <AppText variant="caption" color={colors.textSecondary}>
              {t('enrollment.recap.capturePreviewNote')}
            </AppText>
          ) : null}
        </AppCard>
      </FlowSection>

      <FlowFooter>
        <AppButton
          label={t('enrollment.recap.editRequired')}
          variant="outline"
          fullWidth
          onPress={() => navigation.navigate(ENROLLMENT_ROUTES.REQUIRED_INFO)}
        />
        <AppButton
          label={t('enrollment.recap.submit')}
          fullWidth
          onPress={() => navigation.navigate(ENROLLMENT_ROUTES.SUBMIT)}
          disabled={!faceCaptureResult}
        />
      </FlowFooter>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  previewFrame: {
    overflow: 'hidden',
    borderRadius: 16,
    alignSelf: 'center',
    width: 180,
    height: 220,
    backgroundColor: '#E8EDF2',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
});
