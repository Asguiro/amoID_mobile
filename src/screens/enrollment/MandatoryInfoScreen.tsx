import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BeneficiaryType } from '../../api/types/beneficiary.types';
import type { BeneficiarySex } from '../../api/types/enrollment.types';
import {
  AppButton,
  AppCard,
  AppHeader,
  AppScreen,
  AppText,
  AppTextInput,
  DateInput,
  FieldLabel,
  PhoneInput,
  SectionTitle,
} from '../../components/ui';
import { FlowFooter, FlowSection } from '../../components/layout/FlowLayout';
import { ENROLLMENT_ROUTES } from '../../constants/routes';
import { useEnrollmentDraft } from '../../hooks/useEnrollmentDraft';
import { useTranslation } from '../../hooks/useTranslation';
import type { EnrollmentStackParamList } from '../../navigation/flow-types';
import { updateEnrollmentRequiredFields } from '../../store/enrollment-draft.store';
import { useFlowStyles } from '../../theme/useFlowStyles';
import { useTheme } from '../../theme/ThemeProvider';
import { parseIsoDate, toIsoDate } from '../../utils/formatDate';
import { validateRequiredFields } from './enrollment.validation';

type Navigation = NativeStackNavigationProp<
  EnrollmentStackParamList,
  typeof ENROLLMENT_ROUTES.REQUIRED_INFO
>;

const SEX_OPTIONS: readonly BeneficiarySex[] = ['female', 'male'];
const BENEFICIARY_TYPE_OPTIONS: readonly BeneficiaryType[] = ['primary', 'dependent'];

function ChoiceChips<T extends string>({
  options,
  value,
  onChange,
  labelFor,
  disabled = false,
}: {
  options: readonly T[];
  value: T | '';
  onChange: (next: T) => void;
  labelFor: (option: T) => string;
  disabled?: boolean;
}) {
  const { colors } = useTheme();
  const flow = useFlowStyles();

  return (
    <View style={flow.chipRow}>
      {options.map(option => {
        const isActive = value === option;

        return (
          <Pressable
            key={option}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            disabled={disabled}
            onPress={() => onChange(option)}
            style={[
              flow.typeChip,
              {
                borderColor: isActive ? colors.primary : colors.border,
                backgroundColor: isActive ? colors.cardSoft : colors.card,
              },
              disabled && styles.dimmed,
            ]}>
            <AppText
              variant="bodyStrong"
              color={isActive ? colors.primary : colors.textSecondary}>
              {labelFor(option)}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  dimmed: {
    opacity: 0.6,
  },
});

export function MandatoryInfoScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const flow = useFlowStyles();
  const draft = useEnrollmentDraft();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const fields = draft.requiredFields;
  const birthDateValue = useMemo(
    () => (fields.birthDate ? parseIsoDate(fields.birthDate) : null),
    [fields.birthDate],
  );

  const isFormValid = useMemo(
    () => Object.keys(validateRequiredFields(fields)).length === 0,
    [fields],
  );

  const updateField = <K extends keyof typeof fields>(
    key: K,
    value: (typeof fields)[K],
  ) => {
    updateEnrollmentRequiredFields({ [key]: value });
    setFieldErrors(current => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const handleContinue = () => {
    const errors = validateRequiredFields(fields);
    const translatedErrors = Object.fromEntries(
      Object.entries(errors).map(([key, value]) => [key, t(value)]),
    );

    if (Object.keys(translatedErrors).length > 0) {
      setFieldErrors(translatedErrors);
      return;
    }

    navigation.navigate(ENROLLMENT_ROUTES.OPTIONAL_INFO);
  };

  const identifierLabel =
    draft.identifierType === 'biometric_card'
      ? t('enrollment.mandatory.biometricCard')
      : t('enrollment.mandatory.nina');

  const identifierValue =
    draft.identifierType === 'biometric_card'
      ? fields.biometricCardNumber
      : fields.nina;

  return (
    <AppScreen
      header={<AppHeader title={t('enrollment.mandatory.title')} showBack />}
      keyboardAvoiding>
      <FlowSection first>
        <SectionTitle title={t('enrollment.mandatory.identitySection')} />
        <AppCard variant="elevated">
          <View style={flow.cardGap}>
            <AppTextInput
              label={t('enrollment.mandatory.firstName')}
              value={fields.firstName}
              onChangeText={value => updateField('firstName', value)}
              error={fieldErrors.firstName}
              required
            />
            <AppTextInput
              label={t('enrollment.mandatory.lastName')}
              value={fields.lastName}
              onChangeText={value => updateField('lastName', value)}
              error={fieldErrors.lastName}
              required
            />
            <DateInput
              label={t('enrollment.mandatory.birthDate')}
              value={birthDateValue}
              onChange={date => updateField('birthDate', toIsoDate(date))}
              error={fieldErrors.birthDate}
              maximumDate={new Date()}
              required
            />
            <View style={flow.cardGap}>
              <FieldLabel label={t('enrollment.mandatory.sex')} required />
              <ChoiceChips
                options={SEX_OPTIONS}
                value={fields.sex}
                onChange={value => updateField('sex', value)}
                labelFor={option => t(`enrollment.mandatory.sexOptions.${option}`)}
              />
              {fieldErrors.sex ? (
                <AppText variant="caption" color={tokens.colors.danger}>
                  {fieldErrors.sex}
                </AppText>
              ) : null}
            </View>
            {identifierValue ? (
              <AppTextInput
                label={identifierLabel}
                value={identifierValue}
                editable={false}
                hint={t('enrollment.mandatory.identifierReadOnly')}
              />
            ) : null}
          </View>
        </AppCard>
      </FlowSection>

      <FlowSection>
        <SectionTitle title={t('enrollment.mandatory.contactSection')} />
        <AppCard variant="elevated">
          <View style={flow.cardGap}>
            <PhoneInput
              label={t('enrollment.mandatory.phone')}
              countryCode={fields.phoneCountryCode}
              number={fields.phoneNumber}
              onNumberChange={value => updateField('phoneNumber', value)}
              onCountryCodeChange={value => updateField('phoneCountryCode', value)}
              error={fieldErrors.phoneNumber}
              required
            />
            <AppTextInput
              label={t('enrollment.mandatory.address')}
              value={fields.address}
              onChangeText={value => updateField('address', value)}
              error={fieldErrors.address}
              required
            />
            <AppTextInput
              label={t('enrollment.mandatory.city')}
              value={fields.city}
              onChangeText={value => updateField('city', value)}
            />
          </View>
        </AppCard>
      </FlowSection>

      <FlowSection>
        <SectionTitle title={t('enrollment.mandatory.adminSection')} />
        <AppCard variant="elevated">
          <View style={flow.cardGap}>
            <FieldLabel label={t('enrollment.mandatory.beneficiaryType')} required />
            <ChoiceChips
              options={BENEFICIARY_TYPE_OPTIONS}
              value={fields.beneficiaryType}
              onChange={value => updateField('beneficiaryType', value)}
              labelFor={option =>
                t(`enrollment.mandatory.beneficiaryTypeOptions.${option}`)
              }
            />
            {fieldErrors.beneficiaryType ? (
              <AppText variant="caption" color={tokens.colors.danger}>
                {fieldErrors.beneficiaryType}
              </AppText>
            ) : null}
          </View>
        </AppCard>
      </FlowSection>

      <AppText variant="caption" color={tokens.colors.warning} style={flow.sectionHint}>
        {t('enrollment.mandatory.requiredHint')}
      </AppText>

      <FlowFooter>
        <AppButton
          label={t('common.continue')}
          fullWidth
          disabled={!isFormValid}
          onPress={handleContinue}
        />
      </FlowFooter>
    </AppScreen>
  );
}
