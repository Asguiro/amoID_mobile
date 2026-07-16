import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from './AppText';

export interface FieldLabelProps {
  label: string;
  required?: boolean;
}

/**
 * Form field label with optional required marker.
 */
export function FieldLabel({ label, required = false }: FieldLabelProps) {
  const { tokens } = useTheme();

  return (
    <View style={styles.row}>
      <AppText variant="bodyStrong">{label}</AppText>
      {required ? (
        <AppText variant="bodyStrong" color={tokens.colors.warning}>
          {' *'}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});
