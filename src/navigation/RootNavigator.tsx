import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROOT_ROUTES } from '../constants/routes';
import { useSession } from '../hooks/useSession';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import type { RootStackParamList } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated } = useSession();

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false, contentStyle: { flex: 1 } }}>
      {isAuthenticated ? (
        <RootStack.Screen name={ROOT_ROUTES.MAIN} component={MainNavigator} />
      ) : (
        <RootStack.Screen name={ROOT_ROUTES.AUTH} component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
}
