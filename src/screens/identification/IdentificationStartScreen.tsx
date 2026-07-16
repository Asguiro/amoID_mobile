import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActionGroupCard,
  ActionRow,
  AppHeader,
  AppScreen,
  AppText,
  CircleIcon,
  SectionTitle,
} from '../../components/ui';
import { FlowIntro, FlowSection } from '../../components/layout/FlowLayout';
import {
  FaceScanGlyph,
  QrGlyph,
  SearchGlyph,
} from '../../components/ui/icons/UiGlyphs';
import { IDENTIFICATION_ROUTES } from '../../constants/routes';
import { useTranslation } from '../../hooks/useTranslation';
import type { IdentificationStackParamList } from '../../navigation/flow-types';
import { resetVerificationFlow } from '../../store/verification-flow.store';
import { useFlowStyles } from '../../theme/useFlowStyles';
import { useTheme } from '../../theme/ThemeProvider';

type Navigation = NativeStackNavigationProp<
  IdentificationStackParamList,
  typeof IDENTIFICATION_ROUTES.START
>;

export function IdentificationStartScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const flow = useFlowStyles();

  const handleFacePress = () => {
    resetVerificationFlow();
    navigation.navigate(IDENTIFICATION_ROUTES.FACE);
  };

  const handleQrPress = () => {
    resetVerificationFlow();
    navigation.navigate(IDENTIFICATION_ROUTES.QR);
  };

  const handleManualPress = () => {
    resetVerificationFlow();
    navigation.navigate(IDENTIFICATION_ROUTES.MANUAL);
  };

  return (
    <AppScreen header={<AppHeader title={t('identification.start.title')} showBack />}>
      <FlowIntro>{t('identification.start.subtitle')}</FlowIntro>

      <FlowSection first>
        <SectionTitle title={t('identification.start.methodsSection')} />
        <ActionGroupCard>
          <ActionRow
            title={t('identification.start.methods.face.title')}
            subtitle={t('identification.start.methods.face.description')}
            icon={
              <CircleIcon>
                <FaceScanGlyph color={colors.icon} />
              </CircleIcon>
            }
            onPress={handleFacePress}
          />
          <ActionRow
            title={t('identification.start.methods.qr.title')}
            subtitle={t('identification.start.methods.qr.description')}
            icon={
              <CircleIcon>
                <QrGlyph color={colors.icon} />
              </CircleIcon>
            }
            onPress={handleQrPress}
          />
          <ActionRow
            title={t('identification.start.methods.manual.title')}
            subtitle={t('identification.start.methods.manual.description')}
            icon={
              <CircleIcon>
                <SearchGlyph color={colors.icon} />
              </CircleIcon>
            }
            onPress={handleManualPress}
            isLast
          />
        </ActionGroupCard>

        <AppText variant="caption" color={colors.textSecondary} style={flow.auditHint}>
          {t('identification.start.auditHint')}
        </AppText>
      </FlowSection>
    </AppScreen>
  );
}
