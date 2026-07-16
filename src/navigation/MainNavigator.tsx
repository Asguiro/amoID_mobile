import React, { useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeProvider';
import { MainStackNavigator } from './MainStackNavigator';

export function MainNavigator() {
  return <MainStackNavigator />;
}

export function AppNavigationContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { navigation: navTheme, scheme } = useTheme();

  const navigationTheme = useMemo(
    () => ({
      dark: scheme === 'dark',
      colors: {
        primary: navTheme.headerTint,
        background: navTheme.background,
        card: navTheme.headerBackground,
        text: navTheme.headerTint,
        border: navTheme.border,
        notification: navTheme.headerTint,
      },
      fonts: {
        regular: { fontFamily: 'System', fontWeight: '400' as const },
        medium: { fontFamily: 'System', fontWeight: '500' as const },
        bold: { fontFamily: 'System', fontWeight: '700' as const },
        heavy: { fontFamily: 'System', fontWeight: '800' as const },
      },
    }),
    [navTheme, scheme],
  );

  return (
    <NavigationContainer theme={navigationTheme}>{children}</NavigationContainer>
  );
}
