import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppCard } from './AppCard';
import { AppText } from './AppText';

export interface CollapsibleCardProps {
  title: string;
  subtitle?: string;
  defaultExpanded?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

/**
 * Expandable card section to reduce visual clutter on long forms.
 */
export function CollapsibleCard({
  title,
  subtitle,
  defaultExpanded = false,
  disabled = false,
  children,
}: CollapsibleCardProps) {
  const { colors, tokens } = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const isOpen = !disabled && expanded;

  return (
    <AppCard variant="elevated" style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen, disabled }}
        disabled={disabled}
        onPress={() => setExpanded(current => !current)}
        style={styles.header}>
        <View style={styles.headerText}>
          <AppText variant="bodyStrong">{title}</AppText>
          {subtitle ? (
            <AppText variant="caption" color={colors.textSecondary}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
        <AppText variant="bodyStrong" color={colors.textSecondary}>
          {isOpen ? '▾' : '▸'}
        </AppText>
      </Pressable>

      {isOpen ? (
        <View style={[styles.body, { borderTopColor: colors.border, marginTop: tokens.spacing.md }]}>
          {children}
        </View>
      ) : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  body: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 16,
    gap: 16,
  },
});
