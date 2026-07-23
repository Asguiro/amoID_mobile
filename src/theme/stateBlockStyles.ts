import { StyleSheet } from 'react-native';

/** Shared layout for EmptyState / ErrorState / SuccessState */
export const stateBlockStyles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    maxWidth: 300,
  },
});
