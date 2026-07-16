import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TEMPORARY_QR_ROUTES } from '../constants/routes';
import { TemporaryQrConfirmationScreen } from '../screens/temporary-qr/TemporaryQrConfirmationScreen';
import { TemporaryQrFaceCaptureScreen } from '../screens/temporary-qr/TemporaryQrFaceCaptureScreen';
import { TemporaryQrHomeScreen } from '../screens/temporary-qr/TemporaryQrHomeScreen';
import { TemporaryQrPreviewScreen } from '../screens/temporary-qr/TemporaryQrPreviewScreen';
import { TemporaryQrSearchScreen } from '../screens/temporary-qr/TemporaryQrSearchScreen';
import type { TemporaryQrStackParamList } from './flow-types';

const Stack = createNativeStackNavigator<TemporaryQrStackParamList>();

export function TemporaryQrStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={TEMPORARY_QR_ROUTES.HOME}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { flex: 1 },
      }}>
      <Stack.Screen
        name={TEMPORARY_QR_ROUTES.HOME}
        component={TemporaryQrHomeScreen}
      />
      <Stack.Screen
        name={TEMPORARY_QR_ROUTES.SEARCH}
        component={TemporaryQrSearchScreen}
      />
      <Stack.Screen
        name={TEMPORARY_QR_ROUTES.FACE_CAPTURE}
        component={TemporaryQrFaceCaptureScreen}
      />
      <Stack.Screen
        name={TEMPORARY_QR_ROUTES.PREVIEW}
        component={TemporaryQrPreviewScreen}
      />
      <Stack.Screen
        name={TEMPORARY_QR_ROUTES.CONFIRMATION}
        component={TemporaryQrConfirmationScreen}
      />
    </Stack.Navigator>
  );
}
