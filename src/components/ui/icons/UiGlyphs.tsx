import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

export interface UiGlyphProps {
  size?: number;
  color?: string;
}

export function IdentityGlyph({ size = 28, color = '#0E5B3B' }: UiGlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Rect x="5" y="4" width="18" height="20" rx="3" stroke={color} strokeWidth="1.75" />
      <Circle cx="14" cy="11" r="3.5" stroke={color} strokeWidth="1.75" />
      <Path d="M9 20C10 16.5 18 16.5 19 20" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  );
}

export function FaceScanGlyph({ size = 28, color = '#0E5B3B' }: UiGlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Ellipse cx="14" cy="12" rx="7" ry="8.5" stroke={color} strokeWidth="1.75" />
      <Path d="M8 22C10 18 18 18 20 22" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <Circle cx="14" cy="12" r="11" stroke={color} strokeWidth="1.25" opacity={0.35} />
    </Svg>
  );
}

export function QrGlyph({ size = 28, color = '#0E5B3B' }: UiGlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Rect x="4" y="4" width="9" height="9" rx="1.5" stroke={color} strokeWidth="1.75" />
      <Rect x="15" y="4" width="9" height="9" rx="1.5" stroke={color} strokeWidth="1.75" />
      <Rect x="4" y="15" width="9" height="9" rx="1.5" stroke={color} strokeWidth="1.75" />
      <Path d="M16 16H19V19H16V16Z" fill={color} />
      <Path d="M22 16H25V19H22V16Z" fill={color} />
      <Path d="M19 22H22V25H19V22Z" fill={color} />
      <Path d="M16 22H19V25H16V22Z" fill={color} />
    </Svg>
  );
}

export function ShieldCheckGlyph({ size = 28, color = '#0E5B3B' }: UiGlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path
        d="M14 4L22 7V13.5C22 18.5 18.5 22.5 14 24C9.5 22.5 6 18.5 6 13.5V7L14 4Z"
        stroke={color}
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <Path d="M10 14L13 17L18 11" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function HospitalGlyph({ size = 28, color = '#0E5B3B' }: UiGlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Rect x="5" y="6" width="18" height="18" rx="3" stroke={color} strokeWidth="1.75" />
      <Path d="M14 10V18M10 14H18" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  );
}

export function EmergencyGlyph({ size = 28, color = '#0E5B3B' }: UiGlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path
        d="M14 4L24 24H4L14 4Z"
        stroke={color}
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <Path d="M14 11V16" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <Circle cx="14" cy="20" r="1" fill={color} />
    </Svg>
  );
}

export function AuditGlyph({ size = 28, color = '#0E5B3B' }: UiGlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Rect x="6" y="4" width="16" height="20" rx="2.5" stroke={color} strokeWidth="1.75" />
      <Path d="M10 10H18M10 14H18M10 18H14" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  );
}

export function MenuGlyph({ size = 28, color = '#0E5B3B' }: UiGlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path d="M5 8H23" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <Path d="M5 14H23" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <Path d="M5 20H23" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  );
}

export function PharmacyGlyph({ size = 28, color = '#0E5B3B' }: UiGlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Rect x="6" y="8" width="16" height="16" rx="3" stroke={color} strokeWidth="1.75" />
      <Path d="M10 14H18" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <Path d="M14 10V18" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <Path d="M8 8V6C8 4.9 8.9 4 10 4H18C19.1 4 20 4.9 20 6V8" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  );
}

export function ProfileGlyph({ size = 28, color = '#0E5B3B' }: UiGlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="10" r="4.5" stroke={color} strokeWidth="1.75" />
      <Path
        d="M7 24C8.5 19 19.5 19 21 24"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function SearchGlyph({ size = 28, color = '#0E5B3B' }: UiGlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="12.5" cy="12.5" r="6.5" stroke={color} strokeWidth="1.75" />
      <Path d="M17.5 17.5L23 23" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  );
}

export function ListGlyph({ size = 28, color = '#0E5B3B' }: UiGlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Path d="M6 8H22" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <Path d="M6 14H22" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <Path d="M6 20H22" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
      <Circle cx="8" cy="8" r="1.25" fill={color} />
      <Circle cx="8" cy="14" r="1.25" fill={color} />
      <Circle cx="8" cy="20" r="1.25" fill={color} />
    </Svg>
  );
}

export function SettingsGlyph({ size = 28, color = '#0E5B3B' }: UiGlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <Circle cx="14" cy="14" r="3.5" stroke={color} strokeWidth="1.75" />
      <Path
        d="M14 4V7M14 21V24M4 14H7M21 14H24M7.5 7.5L9.5 9.5M18.5 18.5L20.5 20.5M7.5 20.5L9.5 18.5M18.5 9.5L20.5 7.5"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </Svg>
  );
}
