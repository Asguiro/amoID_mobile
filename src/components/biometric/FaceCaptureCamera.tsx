import { useCallback, useImperativeHandle, useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import type { Face } from 'react-native-vision-camera-face-detector';
import { useFaceDetectorOutput } from 'react-native-vision-camera-face-detector';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
} from 'react-native-vision-camera';
import { AppText } from '../ui/AppText';
import { useTranslation } from '../../hooks/useTranslation';
import { useTheme } from '../../theme/ThemeProvider';
import { toDisplayFileUri } from '../../utils/fileUri';
import {
  FaceCapturePhotoError,
  logDevError,
  type FaceCaptureErrorKind,
} from '../../utils/userFacingError';

export const FACE_CAPTURE_PREVIEW_HEIGHT = 360;

export interface FaceCaptureCameraProps {
  isActive: boolean;
  guidance?: string;
  onFacesDetected: (faces: Face[], frameWidth: number, frameHeight: number) => void;
  onCameraError?: (kind: FaceCaptureErrorKind) => void;
}

export type FaceCaptureCameraRef = {
  takePhoto: () => Promise<string>;
};

export function FaceCaptureCamera({
  isActive,
  guidance,
  onFacesDetected,
  onCameraError,
  cameraRef,
}: FaceCaptureCameraProps & {
  cameraRef: React.RefObject<FaceCaptureCameraRef | null>;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useTheme();
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();
  const photoOutput = usePhotoOutput();
  const [previewSize, setPreviewSize] = useState({ width: 0, height: FACE_CAPTURE_PREVIEW_HEIGHT });

  const handlePreviewLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    if (width <= 0 || height <= 0) {
      return;
    }

    setPreviewSize(current =>
      current.width === width && current.height === height
        ? current
        : { width, height },
    );
  }, []);

  const handleFacesDetected = useCallback(
    (faces: Face[]) => {
      if (previewSize.width <= 0 || previewSize.height <= 0) {
        return;
      }

      onFacesDetected(faces, previewSize.width, previewSize.height);
    },
    [onFacesDetected, previewSize.height, previewSize.width],
  );

  const handleDetectorError = useCallback(
    (error: unknown) => {
      logDevError('FaceCaptureCamera.detector', error);
      onCameraError?.('detector');
    },
    [onCameraError],
  );

  const handleCameraRuntimeError = useCallback(
    (error: unknown) => {
      logDevError('FaceCaptureCamera.camera', error);
      onCameraError?.('camera');
    },
    [onCameraError],
  );

  const faceOutput = useFaceDetectorOutput({
    onFacesDetected: handleFacesDetected,
    onError: handleDetectorError,
    performanceMode: 'fast',
    runClassifications: true,
    runLandmarks: true,
    cameraFacing: 'front',
    autoMode: true,
    windowWidth: previewSize.width > 0 ? previewSize.width : 1,
    windowHeight: previewSize.height > 0 ? previewSize.height : FACE_CAPTURE_PREVIEW_HEIGHT,
    outputResolution: 'preview',
  });

  const outputs = useMemo(() => [faceOutput, photoOutput], [faceOutput, photoOutput]);

  useImperativeHandle(
    cameraRef,
    () => ({
      takePhoto: async () => {
        try {
          const { filePath } = await photoOutput.capturePhotoToFile(
            { flashMode: 'off' },
            {},
          );
          return toDisplayFileUri(filePath);
        } catch (error) {
          logDevError('FaceCaptureCamera.takePhoto', error);
          throw new FaceCapturePhotoError();
        }
      },
    }),
    [photoOutput],
  );

  if (!hasPermission) {
    return (
      <View style={[styles.placeholder, { backgroundColor: colors.cardSoft }]}>
        <AppText variant="body" color={colors.textSecondary} style={styles.centered}>
          {t('faceCapture.permissionRequired')}
        </AppText>
        <Pressable
          accessibilityRole="button"
          onPress={() => void requestPermission()}
          style={styles.permissionAction}>
          <AppText variant="bodyStrong" color={colors.primary}>
            {t('faceCapture.grantPermission')}
          </AppText>
        </Pressable>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={[styles.placeholder, { backgroundColor: colors.cardSoft }]}>
        <AppText variant="body" color={colors.textSecondary} style={styles.centered}>
          {t('faceCapture.cameraUnavailable')}
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={handlePreviewLayout}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive && hasPermission && previewSize.width > 0}
        outputs={outputs}
        onError={handleCameraRuntimeError}
      />

      <View
        pointerEvents="none"
        style={[
          styles.overlay,
          {
            borderColor: tokens.components.biometric.faceFrameColor,
            borderRadius: tokens.radii.lg,
          },
        ]}
      />

      {guidance ? (
        <View style={styles.guidanceBar}>
          <AppText variant="bodyStrong" color="#FFFFFF" style={styles.centered}>
            {guidance}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: FACE_CAPTURE_PREVIEW_HEIGHT,
    overflow: 'hidden',
    borderRadius: 16,
  },
  placeholder: {
    height: FACE_CAPTURE_PREVIEW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    padding: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    margin: 28,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  guidanceBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  centered: {
    textAlign: 'center',
  },
  permissionAction: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
