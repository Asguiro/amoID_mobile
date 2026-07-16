import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

const TABLET_MIN_WIDTH = 768;

export function useDeviceLayout() {
  const { width, height } = useWindowDimensions();

  return useMemo(
    () => ({
      screenWidth: width,
      screenHeight: height,
      isTablet: width >= TABLET_MIN_WIDTH,
      isLandscape: width > height,
    }),
    [width, height],
  );
}
