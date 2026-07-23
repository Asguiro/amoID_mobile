import { useEffect, useState, type PropsWithChildren } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BootSplash from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppStatusBar } from '../components/ui/AppStatusBar';
import { AppNavigationContainer } from '../navigation/MainNavigator';
import { RootNavigator } from '../navigation/RootNavigator';
import { hydrateMobileDeviceId } from '../api/device-id';
import { hydrateSession } from '../store/session.store';
import { ThemeProvider, useTheme } from '../theme/ThemeProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function BootSplashGate({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await hydrateMobileDeviceId();
      await hydrateSession();
      if (!cancelled) {
        setReady(true);
        await BootSplash.hide({ fade: true });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return children;
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AppStatusBar />
            <BootSplashGate>
              <AppNavigationContainer>{children}</AppNavigationContainer>
            </BootSplashGate>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export function AppRoot() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
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
