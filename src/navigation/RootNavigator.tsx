import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROOT_ROUTES } from '../constants/routes';
import { useSession } from '../hooks/useSession';
import { useTheme } from '../theme/ThemeProvider';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import type { RootStackParamList } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated, isHydrated } = useSession();
  const { colors } = useTheme();

  if (!isHydrated) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <RootStack.Navigator
      screenOptions={{ headerShown: false, contentStyle: styles.flex }}>
      {isAuthenticated ? (
        <RootStack.Screen name={ROOT_ROUTES.MAIN} component={MainNavigator} />
      ) : (
        <RootStack.Screen name={ROOT_ROUTES.AUTH} component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
});
