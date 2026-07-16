import { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AppButton,
  AppCard,
  AppHeader,
  AppScreen,
  AppSwitchRow,
  AppText,
  AppTextInput,
  BloodGroupPicker,
  CollapsibleCard,
  PhoneInput,
  SensitiveInfoNotice,
} from '../../components/ui';
import { FlowFooter, FlowSection } from '../../components/layout/FlowLayout';
import { ENROLLMENT_ROUTES } from '../../constants/routes';
import { useEnrollmentDraft } from '../../hooks/useEnrollmentDraft';
import { useTranslation } from '../../hooks/useTranslation';
import type { EnrollmentStackParamList } from '../../navigation/flow-types';
import {
  setEnrollmentHealthConsentAccepted,
  updateEnrollmentHealthFields,
} from '../../store/enrollment-draft.store';
import { useFlowStyles } from '../../theme/useFlowStyles';
import { useTheme } from '../../theme/ThemeProvider';

type Navigation = NativeStackNavigationProp<
  EnrollmentStackParamList,
  typeof ENROLLMENT_ROUTES.OPTIONAL_INFO
>;

export function HealthEmergencyScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const flow = useFlowStyles();
  const draft = useEnrollmentDraft();
  const { healthFields, healthConsentAccepted } = draft;
  const [showMedicalDetails, setShowMedicalDetails] = useState(false);

  const fieldsEnabled = healthConsentAccepted;

  const handleContinue = () => {
    navigation.navigate(ENROLLMENT_ROUTES.FACE_CAPTURE);
  };

  const handleSkip = () => {
    navigation.navigate(ENROLLMENT_ROUTES.FACE_CAPTURE);
  };

  return (
    <AppScreen
      header={<AppHeader title={t('enrollment.health.title')} showBack />}
      keyboardAvoiding>
      <FlowSection first>
        <SensitiveInfoNotice
          title={t('enrollment.health.prudenceTitle')}
          message={t('enrollment.health.prudenceMessage')}
        />
      </FlowSection>

      <FlowSection>
        <AppCard variant="elevated">
          <AppSwitchRow
            title={t('enrollment.health.consent')}
            value={healthConsentAccepted}
            onValueChange={setEnrollmentHealthConsentAccepted}
            isLast
          />
        </AppCard>
        {!healthConsentAccepted ? (
          <AppText variant="caption" color={colors.textSecondary} style={flow.sectionHint}>
            {t('enrollment.health.consentHint')}
          </AppText>
        ) : null}
      </FlowSection>

      <FlowSection>
        <View style={flow.cardGap}>
          <CollapsibleCard
            title={t('enrollment.health.emergencySection')}
            subtitle={t('enrollment.health.emergencySectionHint')}
            defaultExpanded
            disabled={!fieldsEnabled}>
            <AppTextInput
              label={t('enrollment.health.emergencyName')}
              value={healthFields.emergencyContactName}
              onChangeText={value =>
                updateEnrollmentHealthFields({ emergencyContactName: value })
              }
              editable={fieldsEnabled}
            />
            <AppTextInput
              label={t('enrollment.health.emergencyRelationship')}
              value={healthFields.emergencyContactRelationship}
              onChangeText={value =>
                updateEnrollmentHealthFields({ emergencyContactRelationship: value })
              }
              editable={fieldsEnabled}
            />
            <PhoneInput
              label={t('enrollment.health.emergencyPhone')}
              number={healthFields.emergencyContactPhone}
              onNumberChange={value =>
                updateEnrollmentHealthFields({ emergencyContactPhone: value })
              }
              disabled={!fieldsEnabled}
            />
            <AppSwitchRow
              title={t('enrollment.health.emergencyAuthorized')}
              value={healthFields.emergencyContactAuthorized}
              onValueChange={value =>
                updateEnrollmentHealthFields({ emergencyContactAuthorized: value })
              }
              disabled={!fieldsEnabled}
              isLast
            />
          </CollapsibleCard>

          <CollapsibleCard
            title={t('enrollment.health.medicalSection')}
            subtitle={t('enrollment.health.medicalSectionHint')}
            disabled={!fieldsEnabled}>
            <BloodGroupPicker
              label={t('enrollment.health.bloodGroup')}
              value={healthFields.bloodGroup}
              onChange={value => updateEnrollmentHealthFields({ bloodGroup: value })}
              disabled={!fieldsEnabled}
            />

            <AppButton
              label={
                showMedicalDetails
                  ? t('enrollment.health.hideMedicalDetails')
                  : t('enrollment.health.showMedicalDetails')
              }
              variant="outline"
              fullWidth
              disabled={!fieldsEnabled}
              onPress={() => setShowMedicalDetails(current => !current)}
            />

            {showMedicalDetails ? (
              <View style={flow.cardGap}>
                <AppTextInput
                  label={t('enrollment.health.allergies')}
                  value={healthFields.allergies}
                  onChangeText={value =>
                    updateEnrollmentHealthFields({ allergies: value })
                  }
                  editable={fieldsEnabled}
                  multiline
                />
                <AppTextInput
                  label={t('enrollment.health.chronicConditions')}
                  value={healthFields.chronicConditions}
                  onChangeText={value =>
                    updateEnrollmentHealthFields({ chronicConditions: value })
                  }
                  editable={fieldsEnabled}
                  multiline
                />
                <AppTextInput
                  label={t('enrollment.health.currentTreatments')}
                  value={healthFields.currentTreatments}
                  onChangeText={value =>
                    updateEnrollmentHealthFields({ currentTreatments: value })
                  }
                  editable={fieldsEnabled}
                  multiline
                />
                <AppTextInput
                  label={t('enrollment.health.specialAttention')}
                  value={healthFields.specialAttention}
                  onChangeText={value =>
                    updateEnrollmentHealthFields({ specialAttention: value })
                  }
                  editable={fieldsEnabled}
                  multiline
                />
                <AppTextInput
                  label={t('enrollment.health.medicalNotes')}
                  value={healthFields.medicalNotes}
                  onChangeText={value =>
                    updateEnrollmentHealthFields({ medicalNotes: value })
                  }
                  editable={fieldsEnabled}
                  multiline
                />
              </View>
            ) : null}
          </CollapsibleCard>

          <CollapsibleCard
            title={t('enrollment.health.careSection')}
            subtitle={t('enrollment.health.careSectionHint')}
            disabled={!fieldsEnabled}>
            <AppTextInput
              label={t('enrollment.health.followUpEstablishment')}
              value={healthFields.followUpEstablishment}
              onChangeText={value =>
                updateEnrollmentHealthFields({ followUpEstablishment: value })
              }
              editable={fieldsEnabled}
            />
            <AppTextInput
              label={t('enrollment.health.referringDoctor')}
              value={healthFields.referringDoctor}
              onChangeText={value =>
                updateEnrollmentHealthFields({ referringDoctor: value })
              }
              editable={fieldsEnabled}
            />
            <AppTextInput
              label={t('enrollment.health.externalDossierNumber')}
              value={healthFields.externalDossierNumber}
              onChangeText={value =>
                updateEnrollmentHealthFields({ externalDossierNumber: value })
              }
              editable={fieldsEnabled}
            />
          </CollapsibleCard>
        </View>
      </FlowSection>

      <AppText variant="caption" color={colors.textSecondary} style={flow.sectionHint}>
        {t('enrollment.health.skipHint')}
      </AppText>

      <FlowFooter>
        <AppButton label={t('common.continue')} fullWidth onPress={handleContinue} />
        <AppButton
          label={t('enrollment.health.skip')}
          variant="outline"
          fullWidth
          onPress={handleSkip}
        />
      </FlowFooter>
    </AppScreen>
  );
}
