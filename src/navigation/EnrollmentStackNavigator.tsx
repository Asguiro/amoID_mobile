import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ENROLLMENT_ROUTES } from '../constants/routes';
import type { EnrollmentStackParamList } from './flow-types';
import { BeneficiaryDossierScreen } from '../screens/enrollment/BeneficiaryDossierScreen';
import { EnrollmentIdentityCheckScreen } from '../screens/enrollment/EnrollmentIdentityCheckScreen';
import { BeneficiarySearchScreen } from '../screens/enrollment/BeneficiarySearchScreen';
import { EnrollmentConfirmationScreen } from '../screens/enrollment/EnrollmentConfirmationScreen';
import { EnrollmentHomeScreen } from '../screens/enrollment/EnrollmentHomeScreen';
import { EnrollmentRecapScreen } from '../screens/enrollment/EnrollmentRecapScreen';
import { EnrollmentSubmitScreen } from '../screens/enrollment/EnrollmentSubmitScreen';
import { HealthEmergencyScreen } from '../screens/enrollment/HealthEmergencyScreen';
import { MandatoryInfoScreen } from '../screens/enrollment/MandatoryInfoScreen';
import { ProvisionalCreateScreen } from '../screens/enrollment/ProvisionalCreateScreen';
import { EnrollmentFaceCaptureScreen } from '../screens/enrollment/EnrollmentFaceCaptureScreen';

const Stack = createNativeStackNavigator<EnrollmentStackParamList>();

export function EnrollmentStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={ENROLLMENT_ROUTES.HOME}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { flex: 1 },
      }}>
      <Stack.Screen name={ENROLLMENT_ROUTES.HOME} component={EnrollmentHomeScreen} />
      <Stack.Screen
        name={ENROLLMENT_ROUTES.IDENTITY_CHECK}
        component={EnrollmentIdentityCheckScreen}
      />
      <Stack.Screen name={ENROLLMENT_ROUTES.SEARCH} component={BeneficiarySearchScreen} />
      <Stack.Screen name={ENROLLMENT_ROUTES.DOSSIER} component={BeneficiaryDossierScreen} />
      <Stack.Screen
        name={ENROLLMENT_ROUTES.PROVISIONAL}
        component={ProvisionalCreateScreen}
      />
      <Stack.Screen
        name={ENROLLMENT_ROUTES.REQUIRED_INFO}
        component={MandatoryInfoScreen}
      />
      <Stack.Screen
        name={ENROLLMENT_ROUTES.OPTIONAL_INFO}
        component={HealthEmergencyScreen}
      />
      <Stack.Screen
        name={ENROLLMENT_ROUTES.FACE_CAPTURE}
        component={EnrollmentFaceCaptureScreen}
      />
      <Stack.Screen name={ENROLLMENT_ROUTES.RECAP} component={EnrollmentRecapScreen} />
      <Stack.Screen name={ENROLLMENT_ROUTES.SUBMIT} component={EnrollmentSubmitScreen} />
      <Stack.Screen
        name={ENROLLMENT_ROUTES.CONFIRMATION}
        component={EnrollmentConfirmationScreen}
      />
    </Stack.Navigator>
  );
}
