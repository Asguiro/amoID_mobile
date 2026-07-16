import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  AppButton,
  AppCard,
  AppHeader,
  AppScreen,
  AppText,
  CircleIcon,
  SectionTitle,
  SensitiveInfoNotice,
} from '../../components/ui';
import { FlowFooter, FlowIntro, FlowSection } from '../../components/layout/FlowLayout';
import { FaceScanGlyph } from '../../components/ui/icons/UiGlyphs';
import { IDENTIFICATION_ROUTES } from '../../constants/routes';
import { useTranslation } from '../../hooks/useTranslation';
import type { IdentificationStackParamList } from '../../navigation/flow-types';
import { setIdentificationMethod } from '../../store/verification-flow.store';
import { useFlowStyles } from '../../theme/useFlowStyles';
import { useTheme } from '../../theme/ThemeProvider';

type Navigation = NativeStackNavigationProp<
  IdentificationStackParamList,
  typeof IDENTIFICATION_ROUTES.FACE
>;

const PREP_ITEMS = ['lighting', 'glasses', 'centered', 'consent'] as const;

export function FaceIdentificationScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { colors, tokens } = useTheme();
  const flow = useFlowStyles();

  const handleStartCapture = () => {
    setIdentificationMethod('face');
    navigation.navigate(IDENTIFICATION_ROUTES.FACE_CAPTURE, {
      mode: 'verification',
    });
  };

  return (
    <AppScreen header={<AppHeader title={t('identification.face.title')} showBack />}>
      <FlowIntro>{t('identification.face.subtitle')}</FlowIntro>

      <FlowSection first>
        <SectionTitle title={t('identification.face.prepTitle')} />
        <AppCard variant="elevated" style={flow.cardGapMd}>
          <View style={flow.headerRow}>
            <CircleIcon tone="success">
              <FaceScanGlyph color={colors.primary} />
            </CircleIcon>
            <View style={{ flex: 1, gap: tokens.spacing.xxs, paddingTop: tokens.spacing.xxs }}>
              <AppText variant="rowSubtitle" color={colors.textSecondary}>
                {t('identification.face.prepDescription')}
              </AppText>
            </View>
          </View>

          <View style={flow.cardGapMd}>
            {PREP_ITEMS.map(item => (
              <View key={item} style={flow.headerRow}>
                <View
                  style={{
                    width: tokens.spacing.xs,
                    height: tokens.spacing.xs,
                    borderRadius: tokens.spacing.xxs,
                    backgroundColor: colors.primary,
                    marginTop: tokens.spacing.xs,
                  }}
                />
                <AppText variant="body" color={colors.textPrimary} style={{ flex: 1, lineHeight: 24 }}>
                  {t(`identification.face.prepItems.${item}`)}
                </AppText>
              </View>
            ))}
          </View>
        </AppCard>
      </FlowSection>

      <FlowSection>
        <SensitiveInfoNotice
          title={t('identification.face.securityTitle')}
          message={t('identification.face.securityNote')}
        />
      </FlowSection>

      <FlowFooter>
        <AppButton
          label={t('identification.face.startCapture')}
          fullWidth
          onPress={handleStartCapture}
        />
      </FlowFooter>
    </AppScreen>
  );
}
