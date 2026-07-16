import { useMemo } from 'react';
import { useTheme } from './ThemeProvider';

/**
 * Shared layout styles aligned with the design-system spacing grid.
 */
export function useFlowStyles() {
  const { tokens } = useTheme();

  return useMemo(
    () => ({
      cardGap: { gap: tokens.spacing.sm },
      cardGapMd: { gap: tokens.spacing.md },
      heroCard: { gap: tokens.spacing.sm },
      list: { gap: tokens.spacing.sm },
      listMd: { gap: tokens.spacing.md },
      meta: { gap: tokens.spacing.xs },
      rowTight: { gap: tokens.spacing.xxs },
      section: { marginBottom: tokens.spacing.lg },
      sectionHint: { marginBottom: tokens.spacing.sm },
      hint: {
        textAlign: 'center' as const,
        lineHeight: 20,
        paddingHorizontal: tokens.spacing.xs,
      },
      devHint: {
        marginTop: tokens.spacing.sm,
        textAlign: 'center' as const,
      },
      contentBottom: { paddingBottom: tokens.spacing.xl },
      scrollCenter: {
        flexGrow: 1,
        justifyContent: 'center' as const,
        paddingVertical: tokens.spacing.xl,
      },
      hero: {
        alignItems: 'flex-start' as const,
        gap: tokens.spacing.sm,
        marginBottom: tokens.spacing.sectionGap,
      },
      logo: {
        width: 200,
        height: 52,
        marginBottom: tokens.spacing.xxs,
      },
      formFields: { gap: tokens.spacing.lg },
      trustBanner: {
        flexDirection: 'row' as const,
        alignItems: 'flex-start' as const,
        gap: tokens.spacing.sm,
        marginTop: tokens.spacing.lg,
        paddingHorizontal: tokens.spacing.sm,
        paddingVertical: tokens.spacing.sm,
        borderRadius: tokens.radii.md,
      },
      devHintCaption: {
        marginTop: tokens.spacing.lg,
        opacity: 0.75,
        lineHeight: 18,
      },
      chipRow: {
        flexDirection: 'row' as const,
        gap: tokens.spacing.sm,
      },
      typeChip: {
        flex: 1,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        paddingVertical: tokens.spacing.sm,
        paddingHorizontal: tokens.spacing.xs,
        borderRadius: tokens.radii.md,
        borderWidth: 1,
      },
      badgeRow: {
        flexDirection: 'row' as const,
        flexWrap: 'wrap' as const,
        gap: tokens.spacing.xs,
      },
      inputInset: {
        paddingHorizontal: tokens.spacing.xxs,
        marginBottom: tokens.spacing.sm,
      },
      field: {
        gap: tokens.spacing.xxs,
        marginBottom: tokens.spacing.md,
      },
      banner: {
        gap: tokens.spacing.sm,
        marginBottom: tokens.spacing.sm,
      },
      emptyBlock: {
        gap: tokens.spacing.md,
        marginTop: tokens.spacing.xs,
      },
      incompleteBadge: {
        alignSelf: 'flex-start' as const,
        marginLeft: tokens.spacing.xxs,
      },
      methods: { gap: tokens.spacing.sm },
      auditHint: {
        textAlign: 'center' as const,
        lineHeight: 20,
        paddingHorizontal: tokens.spacing.xs,
      },
      cameraCard: {
        gap: tokens.spacing.md,
        overflow: 'hidden' as const,
      },
      headerRow: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
        gap: tokens.spacing.sm,
      },
    }),
    [tokens],
  );
}
