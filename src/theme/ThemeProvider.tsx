import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from 'react';
import { useColorScheme } from 'react-native';
import {
  getNavigationColors,
  getSemanticColors,
  themeTokens,
  type ColorScheme,
} from './theme.tokens';

export interface AppTheme {
  scheme: ColorScheme;
  tokens: typeof themeTokens;
  colors: ReturnType<typeof getSemanticColors>;
  navigation: ReturnType<typeof getNavigationColors>;
}

const ThemeContext = createContext<AppTheme | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const scheme: ColorScheme = systemScheme === 'dark' ? 'dark' : 'light';

  const value = useMemo<AppTheme>(
    () => ({
      scheme,
      tokens: themeTokens,
      colors: getSemanticColors(scheme),
      navigation: getNavigationColors(scheme),
    }),
    [scheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): AppTheme {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}
