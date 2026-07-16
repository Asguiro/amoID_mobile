import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IDENTIFICATION_ROUTES, VERIFICATION_ROUTES } from '../constants/routes';
import type { IdentificationStackParamList } from './flow-types';
import { FaceIdentificationScreen } from '../screens/identification/FaceIdentificationScreen';
import { IdentificationResultScreen } from '../screens/identification/IdentificationResultScreen';
import { IdentificationStartScreen } from '../screens/identification/IdentificationStartScreen';
import { ManualIdentificationScreen } from '../screens/identification/ManualIdentificationScreen';
import { PossibleMatchesScreen } from '../screens/identification/PossibleMatchesScreen';
import { QrCardScanScreen } from '../screens/identification/QrCardScanScreen';
import { VerificationAuditScreen } from '../screens/verification/VerificationAuditScreen';
import { VerificationFaceCaptureScreen } from '../screens/verification/VerificationFaceCaptureScreen';
import { VerificationHomeScreen } from '../screens/verification/VerificationHomeScreen';
import { VerificationIdentifyScreen } from '../screens/verification/VerificationIdentifyScreen';
import { VerificationManualScreen } from '../screens/verification/VerificationManualScreen';
import { VerificationMatchScreen } from '../screens/verification/VerificationMatchScreen';

const Stack = createNativeStackNavigator<IdentificationStackParamList>();

export function IdentificationStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={IDENTIFICATION_ROUTES.START}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { flex: 1 },
      }}>
      <Stack.Screen
        name={IDENTIFICATION_ROUTES.START}
        component={IdentificationStartScreen}
      />
      <Stack.Screen
        name={IDENTIFICATION_ROUTES.FACE}
        component={FaceIdentificationScreen}
      />
      <Stack.Screen
        name={IDENTIFICATION_ROUTES.QR}
        component={QrCardScanScreen}
      />
      <Stack.Screen
        name={IDENTIFICATION_ROUTES.MANUAL}
        component={ManualIdentificationScreen}
      />
      <Stack.Screen
        name={IDENTIFICATION_ROUTES.FACE_CAPTURE}
        component={VerificationFaceCaptureScreen}
      />
      <Stack.Screen name={IDENTIFICATION_ROUTES.MATCH} component={VerificationMatchScreen} />
      <Stack.Screen
        name={IDENTIFICATION_ROUTES.POSSIBLE_MATCHES}
        component={PossibleMatchesScreen}
      />
      <Stack.Screen
        name={IDENTIFICATION_ROUTES.RESULT}
        component={IdentificationResultScreen}
      />
      <Stack.Screen
        name={IDENTIFICATION_ROUTES.MANUAL_CONTROL}
        component={VerificationManualScreen}
      />
      <Stack.Screen name={IDENTIFICATION_ROUTES.AUDIT} component={VerificationAuditScreen} />
      {/* Legacy routes — kept until full migration */}
      <Stack.Screen name={VERIFICATION_ROUTES.HOME} component={VerificationHomeScreen} />
      <Stack.Screen
        name={VERIFICATION_ROUTES.IDENTIFY}
        component={VerificationIdentifyScreen}
      />
    </Stack.Navigator>
  );
}

/** @deprecated Use IdentificationStackNavigator */
export const VerificationStackNavigator = IdentificationStackNavigator;
