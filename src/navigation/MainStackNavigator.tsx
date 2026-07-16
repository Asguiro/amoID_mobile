import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MAIN_STACK_ROUTES } from '../constants/routes';
import { AuditScreen } from '../screens/audit/AuditScreen';
import { BeneficiaryDetailScreen } from '../screens/beneficiaries/BeneficiaryDetailScreen';
import { BeneficiariesListScreen } from '../screens/beneficiaries/BeneficiariesListScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { EnrollmentStackNavigator } from './EnrollmentStackNavigator';
import { IdentificationStackNavigator } from './IdentificationStackNavigator';
import { TemporaryQrStackNavigator } from './TemporaryQrStackNavigator';
import type { MainStackParamList } from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={MAIN_STACK_ROUTES.HOME}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { flex: 1 },
      }}>
      <Stack.Screen name={MAIN_STACK_ROUTES.HOME} component={HomeScreen} />
      <Stack.Screen
        name={MAIN_STACK_ROUTES.BENEFICIARIES}
        component={BeneficiariesListScreen}
      />
      <Stack.Screen
        name={MAIN_STACK_ROUTES.BENEFICIARY_DETAIL}
        component={BeneficiaryDetailScreen}
      />
      <Stack.Screen
        name={MAIN_STACK_ROUTES.VERIFICATION}
        component={IdentificationStackNavigator}
      />
      <Stack.Screen
        name={MAIN_STACK_ROUTES.ENROLLMENT}
        component={EnrollmentStackNavigator}
      />
      <Stack.Screen
        name={MAIN_STACK_ROUTES.TEMPORARY_QR}
        component={TemporaryQrStackNavigator}
      />
      <Stack.Screen name={MAIN_STACK_ROUTES.AUDIT} component={AuditScreen} />
      <Stack.Screen name={MAIN_STACK_ROUTES.PROFILE} component={ProfileScreen} />
    </Stack.Navigator>
  );
}
