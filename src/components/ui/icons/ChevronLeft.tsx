import Svg, { Path } from 'react-native-svg';

export interface ChevronLeftProps {
  size?: number;
  color?: string;
}

export function ChevronLeft({ size = 18, color = '#9CA3AF' }: ChevronLeftProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 6L9 12L15 18"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
