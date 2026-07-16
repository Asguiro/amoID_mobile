import { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AppButton,
  AppCard,
  AppHeader,
  AppScreen,
  AppText,
  AppTextInput,
  SectionTitle,
} from '../../components/ui';
import { FlowFooter, FlowIntro, FlowSection } from '../../components/layout/FlowLayout';
import { ENROLLMENT_ROUTES } from '../../constants/routes';
import { useTranslation } from '../../hooks/useTranslation';
import type { EnrollmentStackParamList } from '../../navigation/flow-types';
import { startProvisionalEnrollment } from '../../store/enrollment-draft.store';
import { useFlowStyles } from '../../theme/useFlowStyles';
import { validateProvisionalIdentity } from './enrollment.validation';

type Navigation = NativeStackNavigationProp<
  EnrollmentStackParamList,
  typeof ENROLLMENT_ROUTES.PROVISIONAL
>;

export function ProvisionalCreateScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const flow = useFlowStyles();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleContinue = () => {
    const errors = validateProvisionalIdentity({ firstName, lastName, birthDate });
    const translatedErrors = Object.fromEntries(
      Object.entries(errors).map(([key, value]) => [key, t(value)]),
    );

    if (Object.keys(translatedErrors).length > 0) {
      setFieldErrors(translatedErrors);
      return;
    }

    startProvisionalEnrollment({ firstName, lastName, birthDate });
    navigation.navigate(ENROLLMENT_ROUTES.REQUIRED_INFO);
  };

  return (
    <AppScreen
      header={<AppHeader title={t('enrollment.provisional.title')} showBack />}
      keyboardAvoiding>
      <FlowIntro>{t('enrollment.provisional.description')}</FlowIntro>

      <FlowSection first>
        <AppCard variant="soft">
          <AppText variant="bodyStrong">{t('enrollment.provisional.banner')}</AppText>
        </AppCard>

        <SectionTitle title={t('enrollment.provisional.formSection')} />
        <View style={flow.cardGap}>
          <AppTextInput
            label={t('enrollment.provisional.firstName')}
            value={firstName}
            onChangeText={setFirstName}
            error={fieldErrors.firstName}
          />
          <AppTextInput
            label={t('enrollment.provisional.lastName')}
            value={lastName}
            onChangeText={setLastName}
            error={fieldErrors.lastName}
          />
          <AppTextInput
            label={t('enrollment.provisional.birthDate')}
            value={birthDate}
            onChangeText={setBirthDate}
            placeholder={t('enrollment.provisional.birthDatePlaceholder')}
            error={fieldErrors.birthDate}
          />
        </View>
      </FlowSection>

      <FlowFooter>
        <AppButton label={t('common.continue')} fullWidth onPress={handleContinue} />
      </FlowFooter>
    </AppScreen>
  );
}
