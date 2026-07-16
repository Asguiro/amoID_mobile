# AMO ID Santé — Catalogue composants UI

> Implémentation : `src/components/ui/`  
> Tokens : `src/config/amo-id-sante.theme.json`

## Fondations

### AppScreen

Conteneur racine avec safe area, fond `#F5F7FB`, scroll optionnel, bannière offline.

```tsx
<AppScreen background="alt" scrollable padded>
  {children}
</AppScreen>
```

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `scrollable` | boolean | `true` | ScrollView vs View |
| `padded` | boolean | `true` | Padding horizontal 24 + safe area |
| `background` | `'default' \| 'alt'` | `'alt'` | Fond blanc ou gris-bleu |
| `withOfflineBanner` | boolean | `true` | Affiche bannière offline |

---

### AppHeader

Titre navy 32px avec slots leading/trailing (toolbar ou écran settings).

```tsx
<AppHeader
  title="Paramètres"
  subtitle="Préférences de l'appareil"
  leading={<BackButton />}
  trailing={<SettingsButton />}
/>
```

---

### SectionTitle

Label de section uppercase vert — pattern Microblink.

```tsx
<SectionTitle title="Identification" />
```

Rendu : `IDENTIFICATION` en 13px bold, couleur `sectionLabel`.

---

### AppCard

Surface blanche avec ombre douce. Variants : `elevated`, `soft`, `outline`.

```tsx
<AppCard variant="elevated">{content}</AppCard>
```

---

### CircleIcon

Icône fine dans cercle 72px. Tones : `default`, `soft`, `success`, `warning`, `danger`.

```tsx
<CircleIcon tone="soft">
  <IdentityGlyph color={colors.icon} />
</CircleIcon>
```

---

### AppButton

CTA avec variants `primary` (vert), `secondary`, `outline`, `danger`. Hauteur 52px par défaut.

```tsx
<AppButton label="Continuer" fullWidth loading={isPending} />
```

---

## Navigation & listes

### ActionRow

Ligne pressable : icône cercle + titre + sous-titre + chevron. Divider inset sauf `isLast`.

```tsx
<ActionRow
  title="Identifier un assuré"
  subtitle="Capture faciale au point de soin"
  icon={<CircleIcon><FaceScanGlyph color={colors.icon} /></CircleIcon>}
  onPress={goToVerify}
/>
```

| Prop | Description |
|------|-------------|
| `trailing` | Remplace le chevron (ex. badge) |
| `showChevron` | Affiche chevron si `onPress` (défaut `true`) |
| `isLast` | Supprime le divider bas |

---

### ActionGroupCard

Carte blanche contenant plusieurs `ActionRow` avec séparateurs internes.

```tsx
<ActionGroupCard>
  <ActionRow ... isLast={false} />
  <ActionRow ... isLast />
</ActionGroupCard>
```

---

### SettingsRow

Ligne paramètres sans icône cercle — titre, sous-titre, valeur, chevron.

```tsx
<SettingsRow
  title="Langue de l'application"
  subtitle="Français"
  onPress={openLanguage}
/>
```

---

### AppSwitchRow

Ligne paramètres avec `Switch` natif (track vert actif).

```tsx
<AppSwitchRow
  title="Authentification biométrique"
  subtitle="Verrouillage par empreinte ou visage"
  value={enabled}
  onValueChange={setEnabled}
/>
```

---

## États

| Composant | Usage |
|-----------|-------|
| `LoadingState` | Spinner + label |
| `EmptyState` | Cercle + titre + action optionnelle |
| `ErrorState` | Alert circle + retry |
| `SuccessState` | Check vert + confirmation |
| `StatusBadge` | Chip statut métier (`success`, `warning`, `danger`, `info`, `neutral`) |

**Règle** : ne jamais afficher de score biométrique brut — statuts métier uniquement.

---

## Cartes métier

### BeneficiaryIdentityCard

Résumé assuré en format `ActionRow` dans `ActionGroupCard`.

```tsx
<BeneficiaryIdentityCard beneficiary={item} onPress={() => open(item.id)} />
```

---

### EligibilityCard

Résultat vérification AMO avec icône bouclier et badge couverture.

```tsx
<EligibilityCard
  beneficiaryName="Awa Diallo"
  amoNumber="AMO-2024-00123"
  coverageStatus="active"
  lastVerifiedAt="04/07/2026 10:32"
/>
```

---

### BiometricScanCard

Zone scan faciale avec cadre dashed et statut métier.

```tsx
<BiometricScanCard
  title="Capture faciale"
  description="Visage bien éclairé, sans masque."
  status="idle"
  actionLabel="Démarrer"
  onAction={startCapture}
/>
```

---

### TemporaryQrAttestationCard

Attestation imprimable avec QR temporaire, validité, référence et mention de sécurité.

```tsx
<TemporaryQrAttestationCard token={generatedToken} />
```

Utilisé dans `TemporaryQrPreviewScreen` avec capture (`react-native-view-shot`) pour partage et impression.

---

### QRCodeScanCard

Zone scan QR avec note de sécurité (vérification faciale obligatoire).

```tsx
<QRCodeScanCard
  title="Scanner le QR temporaire"
  description="Cadrez le code dans la zone."
  securityNote="Un QR seul ne suffit jamais : vérification faciale obligatoire."
  actionLabel="Ouvrir le scanner"
  onAction={openScanner}
/>
```

---

### EmergencyInfoCard

Informations d'urgence autorisées — champs limités, pas de données médicales sensibles.

```tsx
<EmergencyInfoCard
  title="Accès urgence"
  description="Consultation des données autorisées uniquement."
  authorizedFields={['Groupe sanguin', 'Allergies connues', 'Contact urgence']}
  level="critical"
  actionLabel="Consulter"
  onAction={openEmergency}
/>
```

---

## Icônes SVG (`icons/UiGlyphs.tsx`)

| Glyph | Usage AMO |
|-------|-----------|
| `IdentityGlyph` | Identifier un assuré |
| `FaceScanGlyph` | Scan facial |
| `QrGlyph` | QR temporaire |
| `ShieldCheckGlyph` | Éligibilité |
| `HospitalGlyph` | Consultation |
| `EmergencyGlyph` | Urgence |
| `AuditGlyph` | Journalisation |
| `SettingsGlyph` | Paramètres |

Style : traits 1.75px, couleur `colors.icon` (`#0E5B3B`).

---

## Patterns écran

### Accueil agent

```
AppScreen
  WelcomeHeader
  SectionTitle + ActionGroupCard (Identification)
  SectionTitle + ActionGroupCard (Services médicaux)
  SectionTitle + stat AppCards
```

### Paramètres

```
AppScreen
  AppHeader (titre h2)
  SectionTitle + ActionGroupCard (SettingsRow / AppSwitchRow)
  AppText caption (footer explicatif)
```

### Liste avec états

```
AppScreen
  AppHeader
  {isPending && <LoadingState />}
  {isError && <ErrorState onRetry={refetch} />}
  {isEmpty && <EmptyState ... />}
  {isSuccess && items.map(...)}
```

---

## Alias rétrocompatibles

| Ancien | Nouveau |
|--------|---------|
| `EligibilityStatusCard` | `EligibilityCard` |
| `QRScanCard` | `QRCodeScanCard` |
| `BeneficiaryCard` | `BeneficiaryIdentityCard` (préféré) |
