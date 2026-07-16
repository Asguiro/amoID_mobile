import Svg, { Path } from 'react-native-svg';

export interface ChevronRightProps {
  size?: number;
  color?: string;
}

/**
 * Thin right chevron for navigable rows.
 */
export function ChevronRight({ size = 18, color = '#9CA3AF' }: ChevronRightProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 6L15 12L9 18"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
