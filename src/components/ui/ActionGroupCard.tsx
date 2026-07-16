import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { AppCard } from './AppCard';

export interface ActionGroupCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * White grouped card for multiple ActionRow items with inset dividers.
 */
export function ActionGroupCard({ children, style }: ActionGroupCardProps) {
  return (
    <AppCard variant="elevated" style={style}>
      <View style={styles.inner}>{children}</View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  inner: {
    width: '100%',
  },
});
