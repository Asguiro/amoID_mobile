import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AUTH_ROUTES } from '../constants/routes';
import { LoginScreen } from '../screens/auth/LoginScreen';
import type { AuthStackParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name={AUTH_ROUTES.LOGIN} component={LoginScreen} />
    </AuthStack.Navigator>
  );
}
