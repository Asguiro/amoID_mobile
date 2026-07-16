import themeJson from '../config/amo-id-sante.theme.json';

export type ColorScheme = 'light' | 'dark';

export type StatusBarStyleToken = 'dark' | 'light';

export type ThemeTokens = typeof themeJson;

export const themeTokens: ThemeTokens = themeJson;

export function getSemanticColors(scheme: ColorScheme) {
  return themeTokens.semanticColors[scheme];
}

export function getNavigationColors(scheme: ColorScheme) {
  const semantic = getSemanticColors(scheme);

  return {
    headerBackground: themeTokens.navigation.headerBackground,
    headerTint: themeTokens.navigation.headerTint,
    background: semantic.backgroundAlt,
    border: semantic.border,
  };
}

export function getStatusBarBarStyle(
  scheme: ColorScheme,
): 'dark-content' | 'light-content' {
  const styleToken = getSemanticColors(scheme).statusBarStyle as StatusBarStyleToken;

  return styleToken === 'light' ? 'light-content' : 'dark-content';
}
