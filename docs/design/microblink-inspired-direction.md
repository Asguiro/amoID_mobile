# AMO Mobile — Microblink-Inspired Design Direction

> Références visuelles internes : `assets/design-references/microblink/home.jpeg`, `settings.jpeg`  
> **Inspiration uniquement** — ne jamais copier logo, noms de produits, textes ou identité Microblink.

## Objectif

L'application AMO ID Santé Mali doit tendre vers un design **simple, clair, premium, professionnel** — orienté identité, vérification et confiance institutionnelle.

Le design doit évoquer :
- confiance et sécurité
- rapidité d'exécution terrain
- biométrie et identité
- santé publique / CANAM
- contrôle d'éligibilité AMO
- usage par agents habilités (pharmacie, hôpital, clinique)

---

## Étape 1 — Analyse UI (captures Microblink)

### Écran d'accueil (`home.jpeg`)

| Élément | Observation | Règle AMO |
|---------|-------------|-----------|
| Fond | Gris très clair, dégradé subtil | `#F5F7FB` (`backgroundAlt`) |
| Header | Menu gauche, logo centré, action droite | Toolbar : menu \| logo AMO \| profil |
| Sections | Labels **UPPERCASE vert**, espacement généreux au-dessus | `SectionTitle` — 13px, bold, letter-spacing 0.8 |
| Cartes | Blanches, radius ~24px, ombre très douce | `AppCard` / `ActionGroupCard` |
| Lignes d'action | Icône fine dans cercle pâle + titre bold navy + sous-titre gris + chevron | `ActionRow` |
| Séparateurs | Ligne fine inset (ne traverse pas l'icône) | `dividerInset: 88` |
| CTA promo | Carte verte institutionnelle en bas | `PremiumInfoCard` |

### Écran paramètres (`settings.jpeg`)

| Élément | Observation | Règle AMO |
|---------|-------------|-----------|
| Titre | Grand, navy, aligné gauche | `AppHeader` variant `h2` (32px) + retour |
| Groupes | Label gris au-dessus, carte blanche en dessous | `SectionTitle` + `ActionGroupCard` |
| Lignes | Titre + sous-titre empilés, chevron ou switch à droite | `SettingsRow` / `AppSwitchRow` |
| Switches | Vert actif, gris inactif | `trackColor` via tokens `primary` |
| Footer | Texte explicatif gris sous la carte | `AppText` variant `caption` |
| Densité | Aérée, jamais compacte | `rowMinHeight: 72`, `sectionGap: 28` |

### Principes transposables (sans copier)

1. **Une action principale par écran** — hiérarchie évidente en < 3 secondes
2. **Maximum 2 couleurs fortes** par écran (vert action + vert succès OU rouge alerte)
3. **Typographie respirante** — 3 niveaux max visibles
4. **Icônes fines** dans cercles 72px, jamais remplies lourdes
5. **Chevrons discrets** à droite pour toute navigation
6. **Ombres quasi invisibles** — elevation 2, opacity ~0.06

---

## Style général AMO

Direction visuelle :
- interface claire, fond `#F5F7FB`
- cartes blanches arrondies (24px)
- titres navy `#0B1B33`
- sections uppercase vert `#0E5B3B`
- icônes fines dans cercles `#E8F7EF`
- ombres très douces
- vert `#18A058` pour validation / éligibilité
- rouge `#EF4444` **uniquement** pour refus / urgence critique

À éviter :
- copier branding Microblink
- gradients excessifs
- ombres fortes
- couleurs aléatoires
- écrans denses ou administratifs
- design startup flashy
- bottom tab bar

---

## Palette

| Rôle | Token | Valeur |
|------|-------|--------|
| Navy (titres) | `colors.navy` | `#0B1B33` |
| Vert action | `colors.primary` | `#0E5B3B` |
| Vert soft | `colors.primarySoft` | `#E8F7EF` |
| Fond écran | `semanticColors.light.backgroundAlt` | `#F5F7FB` |
| Surface carte | `semanticColors.light.card` | `#FFFFFF` |
| Texte secondaire | `semanticColors.light.textSecondary` | `#6B7280` |
| Bordure / divider | `semanticColors.light.border` | `#E5EAF0` |
| Succès AMO | `colors.success` | `#18A058` |
| Attention | `colors.warning` | `#F59E0B` |
| Danger | `colors.danger` | `#EF4444` |

---

## Typographie

| Variant | Taille | Usage |
|---------|--------|-------|
| `h2` | 32 | Titre d'écran (Profil, Accueil) |
| `sectionTitle` | 13 uppercase | Labels de section |
| `rowTitle` | 17 semibold | Titre de ligne action/settings |
| `rowSubtitle` | 14 | Sous-titre de ligne |
| `body` | 16 | Texte courant |
| `caption` | 13 | Aide, footers, métadonnées |
| `button` | 15 bold | CTA |

---

## Espacement (grille 8px)

| Token | px | Usage |
|-------|-----|-------|
| `screenHorizontal` | 24 | Padding horizontal écran |
| `sectionGap` | 28 | Entre sections |
| `cardPadding` | 22 | Padding interne carte |
| `rowMinHeight` | 72 | Hauteur minimale ligne |
| `iconCircleSize` | 72 | Cercle icône |

---

## Structure écran d'accueil AMO

```
[Toolbar: menu | logo AMO | profil]

IDENTIFICATION          ← SectionTitle
┌─────────────────────┐
│ ○ Identifier un assuré    › │
│ ─────────────────────────── │
│ ○ Vérifier l'éligibilité  › │
│ ─────────────────────────── │
│ ○ Accès urgence           › │
└─────────────────────┘

SERVICES
┌─────────────────────┐
│ ○ Consultation            › │
│ ○ Pharmacie               › │
└─────────────────────┘

[PremiumInfoCard — message institutionnel vert]
```

---

## Structure écran profil

```
← Profil                  ← AppHeader h2 + retour

┌─────────────────────┐
│ Identifiant agent       │
│ Rôle                    │
│ Établissement           │
│ Appareil                │
└─────────────────────┘

[Se déconnecter]
```

---

## UX — 3 questions en < 3 secondes

1. **Où suis-je ?** — titre navy + section uppercase
2. **Que dois-je faire ?** — une action principale évidente
3. **Quel est le statut ?** — badge métier (jamais score brut)

---

## Fichiers de référence

- Tokens : `src/config/amo-id-sante.theme.json`
- Composants : `src/components/ui/`
- Checklist QA : `docs/design/ux-checklist.md`
- Catalogue composants : `docs/design/components.md`
