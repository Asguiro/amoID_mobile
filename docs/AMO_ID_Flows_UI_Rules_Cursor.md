# AMO ID Santé — Règles UX/UI et flows mobile pour Cursor

Document de cadrage pour aligner Cursor sur la vision produit AMO ID Santé : une application mobile simple, professionnelle, sécurisée, inspirée de la clarté Microblink, avec des flows d’identification et d’enrôlement faciles à comprendre par un agent terrain.

---

## 1. Vision générale

AMO ID Santé est une application mobile utilisée par des agents habilités pour :

1. **Identifier rapidement un assuré** par visage, QR code / carte, ou recherche manuelle.
2. **Générer un QR temporaire** imprimable ou partageable en cas de perte ou indisponibilité de la carte AMO.
3. **Enrôler ou compléter un dossier bénéficiaire** avec vérification d’identité, informations administratives, informations médicales utiles, capture faciale et validation.
4. **Journaliser toutes les actions sensibles** : vérification, identification, génération/scan de QR temporaire, consultation de dossier, création ou modification de dossier.

L’application doit rester :

- **simple** : chaque écran doit avoir une seule intention principale ;
- **guidée** : l’agent doit toujours savoir quoi faire ensuite ;
- **professionnelle** : grands espaces, typographie lisible, couleurs institutionnelles, pas d’interface chargée ;
- **sécurisée** : permissions, consentement, masquage des données sensibles, audit trail ;
- **préparée pour les API** : le backend n’est pas encore connecté, donc l’app doit fonctionner avec des services mockés mais une architecture prête pour l’intégration API.

---

## 2. Problèmes observés dans les écrans actuels

### 2.1 Home

Points positifs :

- Bonne base visuelle : fond clair, cartes arrondies, lisibilité correcte.
- La séparation **Identification** / **Administration** est pertinente.
- Le message “Vérification rapide, sécurisée et journalisée” renforce bien la promesse produit.

À corriger :

- Les textes des cartes sont parfois tronqués : “Liste des bénéficiai…”, “rechercher par …”. Les titres importants ne doivent jamais être tronqués.
- L’action “Identifier un assuré” mélange déjà plusieurs options dans le sous-texte. Elle doit ouvrir une page de choix dédiée.
- Les cartes doivent avoir une hiérarchie plus nette : icône, titre, description courte, chevron.
- La Home ne doit pas contenir trop d’actions secondaires. Les 3 actions principales suffisent : Identifier, Nouvel enrôlement, Liste bénéficiaires.

### 2.2 Vérification d’identité enrôlement

Points positifs :

- Le choix NINA / Carte biométrique est clair.
- L’idée de vérifier avant de commencer le dossier est bonne.

À corriger :

- La screen doit être plus cadrée : expliquer que cette étape permet d’éviter les doublons.
- Le bloc “Astuce : essayez…” doit disparaître en mode production. Il peut être visible uniquement en mode démo/dev.
- Le bouton Vérifier doit être désactivé tant que la valeur saisie n’est pas valide.
- Il faut prévoir les états : chargement, bénéficiaire trouvé, dossier inexistant, doublon possible, erreur réseau.

### 2.3 Informations obligatoires

À corriger :

- Ne pas mettre le **Numéro AMO** dans le formulaire si ce numéro est généré automatiquement.
- Remplacer la saisie libre de la date de naissance par un **DatePicker / calendrier**.
- Améliorer le téléphone : indicatif pays séparé + numéro à droite.
- Grouper les champs en sections : Identité, Contact, Adresse, Référence administrative.
- Ajouter un indicateur de progression : Étape 2/5.
- Garder uniquement les champs vraiment nécessaires à l’enrôlement initial.

### 2.4 Informations facultatives

À corriger :

- Les champs actuels ne sont pas assez orientés santé / urgence.
- Certains champs comme Profession et Employeur peuvent être secondaires ou réservés à l’administration, pas prioritaires pour le terrain.
- Les informations de santé doivent être strictement facultatives, confirmées, consenties et modifiables plus tard.
- L’écran doit être renommé en **Informations complémentaires** ou **Informations santé et urgence** selon le contexte.

### 2.5 Capture faciale

Points positifs :

- Le cadre de capture est compréhensible.
- Le statut “Analyse en cours” est une bonne idée.
- Le message sur la non-conservation de l’image brute est important.

À corriger :

- Ajouter un écran de préparation avant la caméra : lumière, lunettes, visage centré, consentement.
- Ajouter des **indications vocales** synchronisées avec les instructions texte.
- Prévoir un vrai flow liveness : visage centré, cligner lentement, regarder à gauche/droite, rester immobile.
- Gérer clairement l’échec : raison lisible + bouton Réessayer + aide.
- La capture doit se comporter différemment selon le contexte : identification directe, vérification de dossier, ou enrôlement.

---

## 3. Architecture des flows depuis la Home

## 3.1 Home — actions principales

La Home doit afficher exactement ces actions :

1. **Identifier un assuré**
   - But : retrouver un assuré déjà existant.
   - Ouvre : `IdentificationStartScreen`.

2. **Nouvel enrôlement**
   - But : créer ou compléter un dossier bénéficiaire.
   - Ouvre : `EnrollmentIntroScreen` puis `IdentityVerificationScreen`.

3. **Liste des bénéficiaires**
   - But : consulter les dossiers autorisés.
   - Ouvre : `BeneficiaryListScreen`.

La Home ne doit pas lancer directement une caméra. Elle doit rediriger vers un écran de choix ou d’introduction pour éviter les erreurs terrain.

---

# 4. Flow 1 — Identifier un assuré

## 4.1 Objectif

Permettre à l’agent d’identifier rapidement une personne déjà enrôlée avec l’une des 3 méthodes suivantes :

1. **Scanner le visage**
2. **Scanner le QR code / la carte**
3. **Rechercher manuellement** avec NINA, carte biométrique ou numéro AMO

## 4.2 Écran de départ : `IdentificationStartScreen`

Titre : **Identifier un assuré**

Sous-texte :
> Choisissez une méthode d’identification. Chaque action sera journalisée.

Cartes d’action :

1. **Scanner le visage**
   - Icône : visage / biométrie
   - Description : “Identifier l’assuré par reconnaissance faciale.”
   - Redirection : `FaceIdentificationScreen`

2. **Scanner QR code / carte**
   - Icône : QR / carte
   - Description : “Lire une carte AMO, QR code ou support numérique.”
   - Redirection : `QrCardScanScreen`

3. **Recherche manuelle**
   - Icône : recherche / clavier
   - Description : “Saisir NINA, numéro de carte biométrique ou numéro AMO.”
   - Redirection : `ManualIdentificationScreen`

Règle UX : ne pas afficher plus de 3 méthodes sur cet écran.

## 4.3 Méthode A — Scanner le visage

Écran : `FaceIdentificationScreen`

Étapes :

1. Demander permission caméra si nécessaire.
2. Afficher une carte de préparation :
   - “Placez la personne face à la caméra.”
   - “Évitez les reflets, les contre-jours et les mouvements.”
   - “Aucune image brute n’est stockée après analyse.”
3. Lancer la capture.
4. Exécuter les consignes liveness :
   - “Positionnez le visage dans le cadre.”
   - “Restez immobile.”
   - “Clignez des yeux lentement.”
   - “Regardez légèrement à gauche.”
   - “Regardez légèrement à droite.”
5. Afficher le résultat.

Résultats possibles :

- **Assuré identifié** : ouvrir `IdentificationResultScreen`.
- **Plusieurs correspondances possibles** : ouvrir `PossibleMatchesScreen`.
- **Aucune correspondance** : afficher échec + proposer QR / recherche manuelle.
- **Qualité insuffisante** : proposer de refaire la capture.
- **Erreur réseau** : conserver la tentative localement si la règle métier l’autorise, sinon afficher erreur claire.

## 4.4 Méthode B — Scanner QR code / carte

Écran : `QrCardScanScreen`

Étapes :

1. Demander permission caméra si nécessaire.
2. Afficher cadre QR/carte.
3. Lire le QR code ou code carte.
4. Vérifier auprès du service local/mock/API.
5. Afficher résultat.

Règles :

- Le scan QR ne suffit pas à confirmer l’identité physique si le contexte exige une vérification biométrique.
- Après scan QR réussi, proposer :
  - “Voir le dossier”
  - “Vérifier le visage”
  - “Annuler”

## 4.5 Méthode C — Recherche manuelle

Écran : `ManualIdentificationScreen`

Champs :

- Type de recherche : NINA / Carte biométrique / Numéro AMO
- Valeur saisie

Règles :

- Formater automatiquement les valeurs si possible.
- Désactiver le bouton tant que la saisie est invalide.
- Afficher une erreur précise : “Numéro trop court”, “Format invalide”, “Dossier introuvable”.

## 4.6 Écran résultat identification

Écran : `IdentificationResultScreen`

Afficher :

- Statut global : **Assuré identifié**, **Droits actifs**, **Droits expirés**, **À vérifier**, **Dossier bloqué**.
- Photo officielle ou avatar sécurisé.
- Nom complet.
- NINA partiellement masqué.
- Numéro AMO.
- Date de naissance.
- Statut d’éligibilité.
- Dernière vérification.
- Actions :
  - “Vérifier visage”
  - “Voir informations autorisées”
  - “Journaliser la prise en charge”

Règle sécurité : ne pas afficher toutes les informations sensibles dès l’écran résultat. Les informations médicales ou administratives avancées doivent être derrière une autorisation explicite.

---

# 4 bis. Flow — Générer un QR temporaire

## 4 bis.1 Objectif

Permettre à un agent habilité (enrôlement ou point de soin) de délivrer une **attestation QR temporaire** lorsque l’assuré a perdu, abîmé ou n’a pas encore reçu sa carte AMO.

Accès : action **« Générer un QR temporaire »** depuis `HomeScreen`.

## 4 bis.2 Parcours

1. `TemporaryQrHomeScreen` — introduction, cas d’usage, rappel sécurité.
2. `TemporaryQrSearchScreen` — recherche bénéficiaire, motif, durée (24 h / 72 h / 7 jours).
3. `TemporaryQrFaceCaptureScreen` — capture faciale obligatoire avant génération.
4. `TemporaryQrPreviewScreen` — aperçu attestation imprimable + actions partager / imprimer.
5. `TemporaryQrConfirmationScreen` — confirmation, référence audit, retour accueil.

## 4 bis.3 Règles UI

- Le QR affiché ne contient **aucune donnée médicale** — identifiant opaque signé côté backend (mock en phase UI).
- Afficher clairement la **date d’expiration** et la mention « vérification faciale obligatoire au point de soin ».
- Masquer partiellement le numéro AMO sur l’attestation (`AMO-****-XXXX`).
- Refuser la génération si droits suspendus ou dossier incomplet (sans biométrie).
- Partager / imprimer via capture de `TemporaryQrAttestationCard` (PNG).
- Chaque génération doit produire une **référence audit** visible en confirmation.

## 4 bis.4 Intégration scan

Un QR temporaire généré doit être **lisible** par `QrCardScanScreen`, puis couplé à une vérification faciale — jamais validé seul.

---

# 5. Flow 2 — Nouvel enrôlement

## 5.1 Objectif

Créer ou compléter un dossier bénéficiaire avec un parcours guidé :

1. Introduction
2. Vérification d’identité
3. Informations obligatoires
4. Informations complémentaires / santé et urgence
5. Capture faciale
6. Récapitulatif
7. Validation / synchronisation

## 5.2 Écran d’introduction : `EnrollmentIntroScreen`

Garder l’idée actuelle, mais améliorer la hiérarchie.

Titre : **Enrôler ou compléter un dossier**

Texte :
> Commencez par vérifier l’identité du bénéficiaire afin d’éviter les doublons. Vous pourrez ensuite compléter les informations et effectuer la capture faciale.

Bouton principal : **Démarrer l’enrôlement**

Note :
> En cas de perte réseau, la saisie peut être conservée localement puis synchronisée selon les règles de sécurité.

---

## 5.3 Étape 1 — Vérification d’identité

Écran : `EnrollmentIdentityCheckScreen`

Titre : **Vérification d’identité**

Sous-texte :
> Vérifiez si le bénéficiaire existe déjà à partir du NINA ou du numéro de carte biométrique.

Options :

- NINA
- Carte biométrique

Ne pas mettre “Numéro AMO” ici pour un nouvel enrôlement si le numéro AMO est généré automatiquement plus tard.

États :

1. **Dossier existant**
   - Message : “Un dossier existe déjà pour cette identité.”
   - Actions : “Compléter le dossier”, “Voir le dossier”, “Annuler”.

2. **Aucun dossier trouvé**
   - Message : “Aucun dossier existant n’a été trouvé.”
   - Action : “Créer un nouveau dossier”.

3. **Doublon possible**
   - Message : “Des informations proches existent déjà.”
   - Action : “Comparer les dossiers”.

4. **Erreur réseau**
   - Message : “Impossible de vérifier maintenant.”
   - Action : “Réessayer” ou “Créer un dossier provisoire” si autorisé.

Règle : l’écran ne doit jamais faire croire qu’un dossier est unique si la vérification backend n’a pas été réalisée.

---

## 5.4 Étape 2 — Informations obligatoires

Écran : `MandatoryInfoScreen`

Structure recommandée :

### Section A — Identité

Champs :

- Prénom(s)
- Nom
- Date de naissance avec DatePicker
- Sexe, si nécessaire métier
- NINA ou carte biométrique récupéré depuis l’étape précédente, affiché en lecture seule

### Section B — Contact

Champs :

- Téléphone principal avec indicatif pays
- Adresse de résidence
- Commune / Ville / Région, si nécessaire

### Section C — Référence administrative

Champs possibles selon métier :

- Type de bénéficiaire : assuré principal / ayant droit / autre
- Régime ou organisme, si nécessaire
- Pièce justificative, si prévue plus tard

À retirer de cette screen :

- Numéro AMO si généré automatiquement
- Champs de santé
- Informations facultatives
- Champs non nécessaires à la validation minimale

Règles UI :

- Utiliser un composant `DateInput` ouvrant un calendrier.
- Utiliser un composant `PhoneInput` avec indicatif séparé.
- Afficher les erreurs sous chaque champ.
- Le bouton “Continuer” reste désactivé tant que les champs obligatoires ne sont pas valides.
- Prévoir autosave local.

---

## 5.5 Étape 3 — Informations complémentaires / santé et urgence

Nom recommandé : **Santé et urgence**

Objectif : collecter uniquement les informations utiles en cas de prise en charge ou d’urgence.

Principe : tout est facultatif, confirmé et modifiable plus tard.

### Champs recommandés

#### Contact d’urgence

- Nom complet
- Lien avec le bénéficiaire
- Téléphone avec indicatif
- Autorisation de contact en cas d’urgence : oui/non

#### Informations médicales utiles

- Groupe sanguin, si connu
- Allergies connues
- Maladies chroniques importantes
- Traitements en cours
- Handicap ou condition nécessitant une attention spéciale
- Notes médicales importantes

#### Informations de prise en charge

- Établissement de suivi habituel, si utile
- Médecin référent, si confirmé
- Numéro de dossier externe, si le métier le prévoit

### Champs à éviter au départ

- Profession
- Employeur
- Téléphone secondaire, sauf si réellement utile
- Informations trop larges ou non exploitables
- Documents médicaux complexes tant que la gouvernance d’accès n’est pas claire

Règles sécurité :

- Afficher un encart : “Ces informations sont sensibles. Ne les renseignez que si elles sont confirmées et autorisées.”
- Ajouter une case : “Le bénéficiaire accepte de renseigner ces informations complémentaires.”
- Ne jamais obliger l’agent à renseigner des informations médicales pour finaliser l’enrôlement.
- Prévoir masquage et accès par rôle côté backend.

---

## 5.6 Étape 4 — Capture faciale enrôlement

Écran : `EnrollmentFaceCaptureScreen`

Avant la capture, afficher une page courte :

Titre : **Préparer la capture faciale**

Checklist :

- Le visage est bien éclairé.
- La personne regarde la caméra.
- Le visage n’est pas coupé.
- Les lunettes avec reflets sont retirées si nécessaire.
- Une seule personne est visible.

Bouton : **Démarrer la capture**

Pendant capture :

- Cadre visage visible.
- Statut en haut : “Positionnement”, “Analyse en cours”, “Capture réussie”, “Nouvelle tentative”.
- Instruction texte au centre/bas.
- Instruction vocale activable/désactivable.

Consignes vocales recommandées :

1. “Positionnez le visage dans le cadre.”
2. “Restez immobile.”
3. “Clignez des yeux lentement.”
4. “Regardez légèrement à gauche.”
5. “Regardez légèrement à droite.”
6. “Capture réussie.”
7. En échec : “La capture n’a pas abouti. Repositionnez le visage et réessayez.”

Règles :

- Toujours afficher la même instruction en texte et en vocal.
- Le vocal ne doit pas être trop bavard.
- Ajouter un bouton pour couper le son.
- Autoriser 3 tentatives avant d’afficher une aide plus complète.

---

## 5.7 Étape 5 — Récapitulatif

Écran : `EnrollmentReviewScreen`

Afficher :

- Identité
- Contact
- Références administratives
- Statut capture faciale
- Informations complémentaires renseignées ou non

Actions :

- Modifier une section
- Valider l’enrôlement
- Enregistrer en brouillon

Règles :

- Le récapitulatif ne doit pas afficher trop d’informations médicales en clair. Utiliser un résumé du type : “3 informations santé renseignées”.
- La validation finale doit déclencher la journalisation.

---

## 5.8 Étape 6 — Confirmation

Écran : `EnrollmentSuccessScreen`

Afficher :

- Dossier créé ou complété.
- Numéro AMO généré, si disponible.
- Statut de synchronisation : synchronisé / en attente / erreur.
- Actions : “Voir le dossier”, “Nouvel enrôlement”, “Retour accueil”.

---

# 6. Règles design system

## 6.1 Couleurs

Conserver une palette institutionnelle sobre.

- Vert principal : `#0B6B43`
- Vert foncé : `#064B32`
- Vert clair : `#E7F6EF`
- Texte principal : `#0B1B34`
- Texte secondaire : `#6B7280`
- Fond écran : `#F5F7FB`
- Blanc carte : `#FFFFFF`
- Bordure : `#E3E8EF`
- Erreur : `#B42318`
- Alerte : `#B54708`
- Succès : `#067647`

## 6.2 Typographie

- Titre écran : 28–32 px, bold.
- Titre section : 16–18 px, bold, uppercase possible pour Home uniquement.
- Titre carte : 18–22 px, bold.
- Texte secondaire : 15–17 px, regular.
- Bouton : 16–18 px, semibold.

Règle : éviter les titres tronqués. Un titre peut passer sur 2 lignes.

## 6.3 Espacement

- Padding horizontal écran : 24 px.
- Espacement entre sections : 28–36 px.
- Padding carte : 20–24 px.
- Radius carte : 24–32 px.
- Radius bouton : 16–18 px.
- Hauteur bouton : 56–64 px.
- Touch target minimal : 48 px.

## 6.4 Composants obligatoires

Créer ou stabiliser ces composants :

- `ScreenContainer`
- `AppHeader`
- `BackButton`
- `ActionCard`
- `InfoCard`
- `PrimaryButton`
- `SecondaryButton`
- `SegmentedControl`
- `TextInputField`
- `DateInput`
- `PhoneInput`
- `StatusBadge`
- `StepIndicator`
- `CameraFrame`
- `ResultState`
- `SensitiveInfoNotice`

Règle : aucune screen ne doit recréer son propre style de bouton, input ou carte si un composant existe déjà.

---

# 7. Règles navigation

Routes recommandées :

```txt
HomeScreen
LoginScreen

IdentificationStartScreen
FaceIdentificationScreen
QrCardScanScreen
ManualIdentificationScreen
IdentificationResultScreen
PossibleMatchesScreen

EnrollmentIntroScreen
EnrollmentIdentityCheckScreen
MandatoryInfoScreen
ComplementaryHealthInfoScreen
EnrollmentFaceCaptureScreen
EnrollmentReviewScreen
EnrollmentSuccessScreen

BeneficiaryListScreen
BeneficiaryDetailScreen
```

Règles :

- Home → Identifier un assuré → écran de choix des 3 méthodes.
- Home → Nouvel enrôlement → intro enrôlement → vérification identité.
- Home → Liste bénéficiaires → liste filtrée par droits agent.
- Une capture faciale ne doit jamais être appelée sans contexte.
- Chaque écran sensible doit avoir retour arrière + confirmation si des données non sauvegardées existent.

---

# 8. Règles métier à respecter

## 8.1 Identification

- Identifier ≠ enrôler.
- L’identification concerne un bénéficiaire déjà présent dans le système.
- Si aucun dossier n’est trouvé, proposer d’aller vers “Nouvel enrôlement”, mais ne pas créer automatiquement.

## 8.2 Enrôlement

- Toujours commencer par vérifier NINA ou carte biométrique.
- Éviter les doublons.
- Le numéro AMO est généré après validation ou synchronisation, pas saisi manuellement.
- Les informations de santé sont facultatives.
- La capture faciale est obligatoire uniquement si la règle métier le décide.

## 8.3 Données sensibles

- Les données biométriques et médicales doivent être traitées comme hautement sensibles.
- Ne jamais afficher plus d’informations que nécessaire.
- Prévoir journalisation : qui, quoi, quand, où, pourquoi.
- Prévoir mode hors ligne uniquement si les règles de sécurité sont claires.

---

# 9. États à implémenter sur chaque screen importante

Chaque screen doit gérer :

- État initial
- Chargement
- Succès
- Échec métier
- Erreur réseau
- Données invalides
- Mode offline
- Brouillon local si applicable

Exemples :

- Vérification identité : `idle`, `checking`, `found`, `notFound`, `possibleDuplicate`, `networkError`.
- Capture faciale : `permissionRequired`, `ready`, `detecting`, `liveness`, `success`, `failed`, `tooManyAttempts`.
- Formulaire : `empty`, `dirty`, `valid`, `invalid`, `savingDraft`, `draftSaved`.

---

# 10. Préparation API / architecture code

Même si le backend n’est pas encore prêt, le code doit être structuré comme si les API existaient.

## 10.1 Services recommandés

```txt
src/services/identity.service.ts
src/services/enrollment.service.ts
src/services/biometric.service.ts
src/services/beneficiary.service.ts
src/services/audit.service.ts
src/services/offline-sync.service.ts
```

Chaque service doit avoir une interface claire et une implémentation mock.

Exemple :

```ts
export interface IdentityService {
  checkIdentity(payload: IdentityCheckPayload): Promise<IdentityCheckResult>;
  identifyByManualSearch(payload: ManualSearchPayload): Promise<IdentificationResult>;
  identifyByQr(payload: QrScanPayload): Promise<IdentificationResult>;
  identifyByFace(payload: FaceCapturePayload): Promise<IdentificationResult>;
}
```

Règle : les screens ne doivent pas contenir la logique métier directement. Elles appellent des hooks ou services.

## 10.2 Hooks recommandés

```txt
src/hooks/useIdentityCheck.ts
src/hooks/useEnrollmentDraft.ts
src/hooks/useFaceCapture.ts
src/hooks/useQrScanner.ts
src/hooks/useBeneficiarySearch.ts
src/hooks/useAuditLog.ts
```

## 10.3 Modèles mock

Prévoir des données mock réalistes :

- Bénéficiaire existant
- Nouveau bénéficiaire
- Dossier incomplet
- Dossier bloqué
- Droits actifs
- Droits expirés
- Capture réussie
- Capture échouée
- Réseau indisponible

---

# 11. Prompt Cursor recommandé

À utiliser dans Cursor pour refondre les flows :

```txt
Tu travailles sur l’app mobile React Native AMO ID Santé.
Le backend n’est pas encore connecté. Tu dois préparer les interfaces, les actions, la navigation, les états et les services mockés pour une future intégration API.

Respecte strictement le document AMO_ID_Flows_UI_Rules_Cursor.md.

Objectif immédiat : refondre les flows Home, Identification assuré et Nouvel enrôlement.

Règles obligatoires :
- Depuis Home, “Identifier un assuré” ouvre une page de choix avec 3 méthodes : visage, QR/carte, recherche manuelle.
- Depuis Home, “Générer un QR temporaire” ouvre le flow dédié : recherche assuré → capture faciale → aperçu attestation → partage/impression → confirmation.
- Chaque méthode a sa screen dédiée et ses états propres.
- “Nouvel enrôlement” commence par une intro puis une vérification d’identité NINA / carte biométrique.
- Le numéro AMO n’est pas saisi dans le formulaire obligatoire, il est généré après validation.
- La date de naissance utilise un DatePicker.
- Le téléphone utilise un composant PhoneInput avec indicatif pays séparé.
- Les informations facultatives deviennent “Santé et urgence” avec contact d’urgence, allergies, groupe sanguin, maladies chroniques, traitements et notes importantes.
- La capture faciale intègre des indications texte + vocales et un vrai flow liveness.
- Toutes les actions sensibles doivent prévoir audit log.
- Les screens doivent être simples, lisibles, professionnelles, cohérentes, sans titres tronqués.
- Utilise les composants communs existants ou crée-les proprement.
- Ne mélange pas logique métier, UI et mock data.
- Prépare les services dans src/services et les hooks dans src/hooks.

Commence par auditer les fichiers existants, puis propose un plan de modification avant de coder.
```

---

# 12. Priorité de développement

## Sprint UI 1 — Navigation et Home

- Corriger Home.
- Créer `IdentificationStartScreen`.
- Brancher les routes.
- Éviter les textes tronqués.

## Sprint UI 2 — Identification assuré

- Créer les 3 méthodes d’identification.
- Préparer les résultats.
- Ajouter états d’erreur et chargement.

## Sprint UI 3 — Enrôlement

- Améliorer vérification identité.
- Refaire formulaire obligatoire.
- Remplacer date et téléphone.
- Retirer numéro AMO du formulaire.

## Sprint UI 4 — Santé et urgence

- Remplacer informations facultatives.
- Ajouter consentement.
- Ajouter champs santé utiles.

## Sprint UI 5 — Capture faciale

- Ajouter préparation capture.
- Ajouter indications vocales.
- Ajouter états liveness.
- Améliorer échec / retry.

## Sprint UI 6 — Récapitulatif et validation

- Créer écran récapitulatif.
- Créer confirmation.
- Préparer synchronisation mockée.

---

# 13. Critères d’acceptation

Une livraison est acceptée si :

- Un agent comprend immédiatement quoi faire sur chaque screen.
- Aucun titre principal n’est tronqué.
- Les boutons sont visibles et accessibles.
- Les champs obligatoires sont clairement distingués des facultatifs.
- Les informations sensibles ont un message de prudence.
- Chaque flow peut fonctionner en mode mock sans backend.
- Les erreurs sont compréhensibles par un non-technicien.
- Les futurs appels API sont isolés dans des services.
- La navigation est claire et testable.
