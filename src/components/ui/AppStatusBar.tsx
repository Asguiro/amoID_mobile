import { Platform, StatusBar } from 'react-native';
import { getStatusBarBarStyle } from '../../theme/theme.tokens';
import { useTheme } from '../../theme/ThemeProvider';

/**
 * Global status bar aligned with semantic theme tokens.
 * Android uses backgroundColor; iOS relies on barStyle + screen background behind the notch.
 */
export function AppStatusBar() {
  const { colors, scheme } = useTheme();

  return (
    <StatusBar
      animated
      barStyle={getStatusBarBarStyle(scheme)}
      backgroundColor={colors.statusBarBackground}
      translucent={Platform.OS === 'android' ? false : undefined}
    />
  );
}
