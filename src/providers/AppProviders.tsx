import { useEffect, type PropsWithChildren } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BootSplash from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppStatusBar } from '../components/ui/AppStatusBar';
import { AppNavigationContainer } from '../navigation/MainNavigator';
import { RootNavigator } from '../navigation/RootNavigator';
import { ThemeProvider } from '../theme/ThemeProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function BootSplashGate({ children }: PropsWithChildren) {
  useEffect(() => {
    BootSplash.hide({ fade: true });
  }, []);

  return children;
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
