# AMO ID Santé Mali — Guide pour agents IA

> Ce fichier est lu automatiquement par Claude Code et les agents Cursor.
> Il résume le projet, les règles non négociables et la structure du repo.

## Ce que fait ce projet

Application interne pour agents CANAM/AMO (Mali) permettant :
- Enrôlement de bénéficiaires avec capture biométrique faciale
- Identification par reconnaissance faciale au point de soin
- Vérification du statut d'assurance maladie (AMO)
- Génération de QR temporaires sécurisés en cas de perte de carte

## Documents de référence
- `docs/Spec_AMO_ID_Sante_Mali_MVP_IA.md` — spécification produit complète
- `docs/AMO_ID_Sante_Mali_Decisions_Techniques.md` — décisions techniques validées
- `.cursor/rules/` — règles détaillées par domaine

## Structure du repo
```
amo-id-sante-mali/
  backend/           ← API NestJS + Prisma
    src/
      auth/
      users/
      beneficiaries/
      biometrics/
      eligibility/
      temporary-qr/
      audit/
      establishments/
      sync/
    prisma/
      schema.prisma
      migrations/
  mobile/            ← App React Native (smartphone + tablette)
    src/
      api/
      components/
      hooks/
      navigation/
      screens/
      offline/
      store/
      utils/
      constants/
      i18n/
  docs/              ← Spécification et décisions techniques
  .cursor/rules/     ← Règles Cursor par domaine
```

## Règles absolues — à ne JAMAIS violer

1. Le mobile ne parle JAMAIS directement à CompreFace — toujours via l'API NestJS
2. Aucune photo brute conservée après création d'un gabarit biométrique
3. Aucune donnée médicale ou biométrique en clair dans les logs, réponses API ou QR codes
4. La table `audit_logs` est append-only — jamais de UPDATE ou DELETE
5. Un QR temporaire ne peut jamais être validé seul sans vérification faciale couplée
6. TypeScript strict partout — pas de `any`
7. Ne pas inventer une décision non documentée — demander si le cas n'est pas couvert

## Stack
- Backend : NestJS + Prisma → Render (free)
- DB + Storage : Supabase (free)
- Biométrie : CompreFace sur Oracle Cloud Always Free
- Vivacité : ML Kit on-device (mobile)
- Mobile : React Native (iOS + Android, smartphone + tablette)
- Auth : JWT RS256 + appareils enrôlés
- QR : JWT/JWS signé RS256

## Langue
- Code et commentaires : anglais
- UI et messages utilisateur : français


Avant toute modification des écrans d’identification, d’enrôlement, de capture faciale ou de bénéficiaires, respecter strictement docs/AMO_ID_Flows_UI_Rules_Cursor.md.
