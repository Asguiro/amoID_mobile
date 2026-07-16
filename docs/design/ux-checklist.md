# UX/UI Quality Checklist — AMO ID Santé

Un écran est accepté seulement si tous les critères ci-dessous sont respectés.  
Référence visuelle : `docs/design/microblink-inspired-direction.md`.

## Clarté (< 3 secondes)

- [ ] L'utilisateur comprend **où il est** (titre navy + section uppercase)
- [ ] L'action principale est **évidente** sans chercher
- [ ] Le statut assuré/action est **lisible** (badge métier, pas score brut)
- [ ] Textes courts, en français via `src/i18n/fr.ts`

## Hiérarchie

- [ ] Un seul titre principal (`h2`) par écran
- [ ] Maximum **3 niveaux typographiques** visibles
- [ ] Une action principale dominante (bouton vert pleine largeur si applicable)
- [ ] Informations secondaires en gris (`textSecondary`)

## Espacement Microblink-inspired

- [ ] Padding horizontal écran : **24px**
- [ ] Gap entre sections : **28px**
- [ ] Cartes : padding **22px**, radius **24px**
- [ ] Lignes action : hauteur min **72px**
- [ ] Aucun élément collé — respiration suffisante

## Couleurs (tokens uniquement)

- [ ] Fond écran `#F5F7FB` — pas de blanc pur partout
- [ ] Titres navy `#0B1B33`, sections vert `#0E5B3B`
- [ ] Vert `#18A058` pour succès / éligibilité
- [ ] Rouge `#EF4444` **uniquement** refus / urgence critique
- [ ] Max **2 couleurs fortes** par écran
- [ ] Aucune couleur hardcodée hors `amo-id-sante.theme.json`

## Composants

- [ ] Cartes blanches via `AppCard` / `ActionGroupCard`
- [ ] Actions navigables via `ActionRow` + chevron
- [ ] Icônes dans `CircleIcon` (72px, traits fins)
- [ ] Sections via `SectionTitle` uppercase
- [ ] Paramètres via `SettingsRow` / `AppSwitchRow`

## Mobile & accessibilité

- [ ] Touch targets ≥ 48×48 (lignes ≥ 72px)
- [ ] Safe area respectée (`AppScreen`)
- [ ] Utilisable à une main (CTA bas d'écran si action principale)
- [ ] `accessibilityLabel` sur boutons et lignes pressables
- [ ] Contraste ≥ 4.5:1

## États obligatoires

- [ ] **Loading** — spinner vert + label
- [ ] **Empty** — message utile + action optionnelle
- [ ] **Error** — message clair + retry
- [ ] **Success** — confirmation visible si flux terminé
- [ ] **Disabled** — opacité 0.55, non cliquable

## Sécurité & métier AMO

- [ ] Pas de score biométrique brut affiché
- [ ] Pas de données médicales en clair dans l'UI mock
- [ ] QR jamais validé seul (note faciale couplée visible)
- [ ] Urgence : champs autorisés uniquement (`EmergencyInfoCard`)
- [ ] Navigation bloquée par rôle, pas seulement masquée

## Professionnalisme

- [ ] Pas de gradient excessif
- [ ] Ombres douces (`shadows.sm`) — pas d'ombres lourdes
- [ ] Pas d'interface surchargée
- [ ] Cohérence avec les captures de référence (simplicité, finition)
- [ ] **Ne ressemble pas à une copie Microblink** — identité AMO préservée
- [ ] Prêt à livrer — niveau production, pas prototype amateur

## Revue design senior (avant merge)

1. Spacing — gaps réguliers, pas de zones trop denses
2. Typographie — hiérarchie claire, pas de tailles ad hoc
3. Couleurs — palette respectée, vert/rouge au bon usage
4. Accessibilité — labels, contrastes, touch targets
5. Cohérence — même pattern row/card sur tout l'écran
