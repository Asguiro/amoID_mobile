# AMO ID Santé — Design System

Référence visuelle pour l'application mobile. Complète `brand.md`, `microblink-inspired-direction.md` et `ux-checklist.md`.

## Direction

**Microblink-inspired, AMO-branded** : simplicité premium, cartes blanches, navy + vert institutionnel AMO, vert vif pour la validation AMO.

## Principes

- **Institutionnel premium** : confiance, sécurité, service public moderne
- **Lisibilité terrain** : touch targets ≥ 72px sur les lignes, contrastes ≥ 4.5:1
- **Sobriété** : ombres légères (`shadows.sm`), fond `#F5F7FB`, max 2 couleurs fortes par écran
- **Inspiration, pas copie** : structure Microblink, identité AMO/KANAM

## Palette

| Rôle | Token | Valeur | Usage |
|------|-------|--------|-------|
| Fond écran | `semanticColors.light.backgroundAlt` | `#F5F7FB` | Arrière-plan principal |
| Carte | `semanticColors.light.card` | `#FFFFFF` | Conteneurs |
| Navy titres | `colors.navy` | `#0B1B33` | Titres, texte principal |
| Vert action | `colors.primary` | `#0E5B3B` | CTA, sections, icônes actives |
| Vert soft | `colors.primarySoft` | `#E8F7EF` | Cartes soft, fonds info |
| Cercle icône | `colors.iconCircleBg` | `#E8F7EF` | Fond `CircleIcon` |
| Succès AMO | `colors.success` | `#18A058` | Éligible, vérifié |
| Attention | `colors.warning` | `#F59E0B` | Doute, mise à jour |
| Danger | `colors.danger` | `#EF4444` | Refus, urgence |
| Texte secondaire | `semanticColors.light.textSecondary` | `#6B7280` | Sous-titres |
| Bordure | `semanticColors.light.border` | `#E5EAF0` | Séparateurs |
| Chevron | `colors.chevron` | `#9CA3AF` | Navigation |

> Le **vert `#0E5B3B`** porte l'action, la navigation et l'identité AMO. Le **vert `#18A058`** signale les statuts positifs AMO. Le **rouge** signale refus ou urgence critique uniquement.

## Typographie

Maximum **3 niveaux** visibles par écran.

| Variant | px | Usage |
|---------|-----|-------|
| `h2` | 32 | Titre d'écran |
| `sectionTitle` | 13 uppercase | Label de section |
| `rowTitle` | 17 | Titre ligne action/settings |
| `rowSubtitle` | 14 | Sous-titre ligne |
| `title` | 20 | Titre carte |
| `body` | 16 | Texte courant |
| `caption` | 13 | Aide, footers |
| `button` | 15 | Libellés CTA |

## Espacement (grille 8px)

| Token | px | Usage |
|-------|-----|-------|
| `xs` | 8 | Gap interne compact |
| `sm` | 12 | Entre label et contenu |
| `md` | 16 | Padding interne |
| `lg` | 24 | Séparation blocs |
| `sectionGap` | 28 | Entre sections home/settings |
| `screenHorizontal` | 24 | Padding horizontal écran |
| `cardPadding` | 22 | Padding carte |
| `rowMinHeight` | 72 | Ligne action/settings |
| `iconCircleSize` | 72 | Diamètre cercle icône |

## Rayons

| Token | px | Usage |
|-------|-----|-------|
| `md` | 14 | Champs texte |
| `lg` | 18 | Boutons |
| `xl` | 24 | Cartes |
| `pill` | 999 | Badges |

## Ombres

- Cartes : `shadows.sm` — opacity 0.06, radius 10, elevation 2
- **Jamais** `shadows.lg` sur formulaires

## Composants UI

Import via barrel :

```ts
import {
  AppScreen,
  SectionTitle,
  ActionGroupCard,
  ActionRow,
} from '@/components/ui';
```

### Fondations

| Composant | Rôle |
|-----------|------|
| `AppScreen` | Conteneur écran (safe area, fond alt, scroll) |
| `AppHeader` | Titre navy + retour + leading/trailing slots |
| `SectionTitle` | Label uppercase vert |
| `AppText` | Typographie tokenisée |
| `AppButton` | CTA primaire vert / outline / danger |
| `AppCard` | Surface blanche élevée |
| `CircleIcon` | Icône fine dans cercle pâle |

### Navigation & listes

| Composant | Rôle |
|-----------|------|
| `ActionRow` | Ligne action avec icône, chevron, divider inset |
| `ActionGroupCard` | Carte groupant plusieurs `ActionRow` |
| `SettingsRow` | Ligne paramètres avec chevron |
| `AppSwitchRow` | Ligne paramètres avec switch natif |

### États

| Composant | Rôle |
|-----------|------|
| `StatusBadge` | Statut métier (jamais score brut) |
| `LoadingState` | Chargement centré |
| `EmptyState` | Liste vide |
| `ErrorState` | Erreur avec retry |
| `SuccessState` | Confirmation succès |

### Cartes métier

| Composant | Rôle |
|-----------|------|
| `BeneficiaryIdentityCard` | Identité assuré (Microblink row style) |
| `EligibilityCard` | Résultat éligibilité AMO |
| `BiometricScanCard` | Zone capture faciale |
| `QRCodeScanCard` | Zone scan QR temporaire |
| `EmergencyInfoCard` | Infos urgence autorisées |

## Accessibilité

- Touch target minimum **48×48** ; lignes action **72px** min
- `accessibilityRole`, `accessibilityLabel` sur éléments interactifs
- Contraste texte/fond ≥ 4.5:1
- États `disabled` : opacité 0.55

## Navigation mobile

- **Stack navigation** : accueil hub + écrans empilés avec retour
- Toolbar accueil : menu | logo AMO | profil
- Pas de bottom tab bar

## États obligatoires par écran

Chaque écran de données : **loading**, **empty**, **error**, **success** (si applicable).

## Source de vérité tokens

`src/config/amo-id-sante.theme.json` — **ne jamais hardcoder** de couleurs dans les composants.
