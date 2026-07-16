import { Pressable, StyleSheet, View } from 'react-native';
import { AppCard, AppText } from '../../../components/ui';
import { useTheme } from '../../../theme/ThemeProvider';

export interface QuickActionItem {
  id: string;
  title: string;
  description: string;
}

export interface QuickActionGridProps {
  actions: QuickActionItem[];
}

export function QuickActionGrid({ actions }: QuickActionGridProps) {
  const { colors } = useTheme();

  if (actions.length === 0) {
    return null;
  }

  return (
    <View style={styles.grid}>
      {actions.map(action => (
        <Pressable
          key={action.id}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.item,
            { opacity: pressed ? 0.92 : 1 },
          ]}>
          <AppCard variant="soft" style={styles.card}>
            <AppText variant="title">{action.title}</AppText>
            <AppText variant="body" color={colors.textSecondary}>
              {action.description}
            </AppText>
          </AppCard>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 12,
  },
  item: {
    width: '100%',
  },
  card: {
    gap: 8,
  },
});
