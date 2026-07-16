import { useRef, useState, type ElementRef } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import {
  AppButton,
  AppHeader,
  AppScreen,
  AppText,
  EmptyState,
  SectionTitle,
  SensitiveInfoNotice,
  TemporaryQrAttestationCard,
} from '../../components/ui';
import { FlowFooter, FlowIntro, FlowSection } from '../../components/layout/FlowLayout';
import { TEMPORARY_QR_ROUTES } from '../../constants/routes';
import { useTranslation } from '../../hooks/useTranslation';
import type { TemporaryQrStackParamList } from '../../navigation/flow-types';
import { getTemporaryQrFlowState } from '../../store/temporary-qr-flow.store';
import { useTheme } from '../../theme/ThemeProvider';

type Navigation = NativeStackNavigationProp<
  TemporaryQrStackParamList,
  typeof TEMPORARY_QR_ROUTES.PREVIEW
>;

export function TemporaryQrPreviewScreen() {
  const navigation = useNavigation<Navigation>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const viewShotRef = useRef<ElementRef<typeof ViewShot>>(null);
  const [shareError, setShareError] = useState<string | undefined>();

  const token = getTemporaryQrFlowState().generatedToken;

  if (!token) {
    return (
      <AppScreen header={<AppHeader title={t('temporaryQr.preview.title')} showBack />}>
        <EmptyState
          title={t('temporaryQr.preview.missingTitle')}
          description={t('temporaryQr.preview.missingDescription')}
        />
      </AppScreen>
    );
  }

  const captureAttestation = async (): Promise<string | undefined> => {
    const uri = await viewShotRef.current?.capture?.();

    if (!uri) {
      setShareError(t('temporaryQr.preview.captureError'));
      return undefined;
    }

    return uri;
  };

  const handleShare = async () => {
    setShareError(undefined);

    try {
      const uri = await captureAttestation();

      if (!uri) {
        return;
      }

      await Share.open({
        url: uri,
        type: 'image/png',
        title: t('temporaryQr.preview.shareTitle'),
        message: t('temporaryQr.preview.shareMessage'),
        failOnCancel: false,
      });
    } catch {
      setShareError(t('temporaryQr.preview.shareError'));
    }
  };

  const handlePrint = async () => {
    setShareError(undefined);

    try {
      const uri = await captureAttestation();

      if (!uri) {
        return;
      }

      await Share.open({
        url: uri,
        type: 'image/png',
        title: t('temporaryQr.preview.printTitle'),
        message: t('temporaryQr.preview.printMessage'),
        failOnCancel: false,
      });
    } catch {
      setShareError(t('temporaryQr.preview.shareError'));
    }
  };

  const handleContinue = () => {
    navigation.navigate(TEMPORARY_QR_ROUTES.CONFIRMATION);
  };

  return (
    <AppScreen header={<AppHeader title={t('temporaryQr.preview.title')} showBack />}>
      <FlowIntro>{t('temporaryQr.preview.subtitle')}</FlowIntro>

      <FlowSection first>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
          <TemporaryQrAttestationCard token={token} />
        </ViewShot>
      </FlowSection>

      <FlowSection>
        <SensitiveInfoNotice
          title={t('temporaryQr.preview.securityTitle')}
          message={t('temporaryQr.preview.securityNotice')}
        />
      </FlowSection>

      {shareError ? (
        <FlowSection>
          <AppText variant="body" color={colors.accent}>
            {shareError}
          </AppText>
        </FlowSection>
      ) : null}

      <FlowSection>
        <SectionTitle title={t('temporaryQr.preview.actionsTitle')} />
      </FlowSection>

      <FlowFooter>
        <AppButton
          label={t('temporaryQr.preview.share')}
          fullWidth
          onPress={() => {
            void handleShare();
          }}
        />
        <AppButton
          label={t('temporaryQr.preview.print')}
          variant="outline"
          fullWidth
          onPress={() => {
            void handlePrint();
          }}
        />
        <AppButton
          label={t('temporaryQr.preview.continue')}
          variant="outline"
          fullWidth
          onPress={handleContinue}
        />
      </FlowFooter>
    </AppScreen>
  );
}
