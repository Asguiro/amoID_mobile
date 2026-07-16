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
import { VERIFICATION_ROUTES } from '../../constants/routes';
import { useTranslation } from '../../hooks/useTranslation';
import type { VerificationStackParamList } from '../../navigation/flow-types';
import { setVerificationAmoNumber } from '../../store/verification-flow.store';
import { useFlowStyles } from '../../theme/useFlowStyles';
import { useTheme } from '../../theme/ThemeProvider';

type Navigation = NativeStackNavigationProp<
  VerificationStackParamList,
  typeof VERIFICATION_ROUTES.IDENTIFY
>;

export function VerificationIdentifyScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const flow = useFlowStyles();
  const [amoNumber, setAmoNumber] = useState('');

  const handleStartCapture = () => {
    setVerificationAmoNumber(amoNumber);
    navigation.navigate(VERIFICATION_ROUTES.FACE_CAPTURE, { mode: 'verification' });
  };

  return (
    <AppScreen
      header={<AppHeader title={t('verification.identify.title')} showBack />}
      keyboardAvoiding>
      <FlowIntro>{t('verification.identify.description')}</FlowIntro>

      <FlowSection first>
        <SectionTitle title={t('verification.identify.modeTitle')} />
        <AppCard variant="elevated" style={flow.cardGap}>
          <AppText variant="body" color={colors.textSecondary}>
            {t('verification.identify.modeDescription')}
          </AppText>
        </AppCard>
      </FlowSection>

      <FlowSection>
        <AppTextInput
          label={t('verification.identify.amoOptional')}
          value={amoNumber}
          onChangeText={setAmoNumber}
          placeholder={t('verification.identify.amoPlaceholder')}
          autoCapitalize="characters"
          hint={t('verification.identify.amoHint')}
        />
      </FlowSection>

      <FlowFooter>
        <AppButton
          label={t('verification.startCapture')}
          fullWidth
          onPress={handleStartCapture}
        />
        <AppText variant="caption" color={colors.textSecondary} style={flow.hint}>
          {t('verification.startCaptureDescription')}
        </AppText>
      </FlowFooter>
    </AppScreen>
  );
}
