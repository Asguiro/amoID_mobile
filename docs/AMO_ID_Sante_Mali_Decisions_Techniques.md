---
title: "AMO ID Santé Mali — Décisions techniques MVP"
subtitle: "Architecture, hébergement et choix technologiques validés"
version: "V1.0"
date_document: "2026-06-30"
statut: "Décisions validées — base pour la mise en œuvre"
---

# AMO ID Santé Mali — Décisions techniques MVP

> Ce document complète la spécification produit (`Spec_AMO_ID_Sante_Mali_MVP_IA.md`). Il fige les choix techniques retenus pour la mise en place du backend, de l'application mobile et de la reconnaissance faciale, avec les contraintes et points de vigilance identifiés à date.

## 1. Principe directeur

Le MVP doit être livrable sans frais d'infrastructure récurrents, avec une stack 100 % environnement Node (NestJS, React Native), et rester crédible pour un pilote terrain démontrable face à la CANAM / AMO.

## 2. Reconnaissance faciale

### 2.1 Décision

- Moteur de reconnaissance faciale : **CompreFace** (Exadel), open-source, licence Apache 2.0, auto-hébergé.
- Fonctions utilisées : détection de visage, contrôle qualité, vérification 1:1, recherche/identification 1:N, gestion de collections de gabarits.
- Détection de vivacité (anti-spoofing) : **non fournie nativement par CompreFace**, donc implémentée côté mobile, on-device, via ML Kit (défi de capture : clignement ou légère rotation de la tête avant validation).

### 2.2 Pourquoi pas une API cloud (AWS Rekognition, Azure Face)

- AWS Rekognition : gratuit seulement 12 mois après création du compte, plafonné à 1 000 images/mois ; payant au-delà, ce qui ne correspond pas à l'exigence de fonctionnement sans frais.
- Azure Face API : accès restreint (politique de Responsible AI renforcée).
- CompreFace évite aussi l'envoi de données biométriques sensibles à un tiers externe, ce qui sert l'exigence de confidentialité de la section 12 du spec.

### 2.3 Hébergement de CompreFace

- CompreFace nécessite environ 2 Go de RAM minimum (plusieurs conteneurs Docker : API, core, admin, DB interne) → incompatible avec les hébergeurs gratuits classiques limités à 512 Mo (ex. Render free).
- Option retenue : **Oracle Cloud Infrastructure — Always Free** (instance Ampere A1, architecture ARM), qui reste gratuite à vie dans la limite de 2 OCPU / 12 Go RAM (limite réduite courant 2026, auparavant 4 OCPU / 24 Go).
- Points de vigilance à vérifier au moment du déploiement :
  - Carte bancaire exigée à la création du compte Oracle (vérification d'identité uniquement, aucun débit tant que l'usage reste dans les limites Always Free).
  - Disponibilité de capacité variable selon la région (privilégier une région européenne en cas d'indisponibilité).
  - Compatibilité ARM des images Docker CompreFace à confirmer lors de l'installation.

## 3. Backend

### 3.1 Décision

- Framework : **NestJS** + **Prisma** (ORM).
- Hébergement de l'API : **Render** (plan free).
- Base de données et stockage de fichiers : **Supabase** (Postgres managé + Storage), plan free.

### 3.2 Justification (comparatif réalisé)

| Critère | Render free | Supabase free |
|---|---|---|
| Calcul applicatif | 512 Mo RAM / 0,1 CPU, mise en veille après 15 min d'inactivité (redémarrage 30-60s) | Non conçu pour héberger une API Node |
| Base de données | Postgres free **supprimée après 30 jours** | Postgres dédié 500 Mo, **persiste indéfiniment**, mise en pause (pas de suppression) après 7 jours d'inactivité |
| Stockage fichiers | Système de fichiers éphémère (perdu à chaque redéploiement) | Storage dédié, 1 Go gratuit |

Conclusion : l'API tourne sur Render (la mise en veille est acceptable pour un pilote/démo), mais les données persistantes (bénéficiaires, gabarits, logs, QR) sont hébergées sur Supabase pour éviter toute perte de données automatique.

## 4. Mode hors-ligne (offline)

### 4.1 Décision

Pas de synchronisation bidirectionnelle complète (pas de moteur type WatermelonDB avec résolution de conflits) pour le MVP. Approche simplifiée retenue :

- **Cache local en lecture seule** : dernier référentiel de bénéficiaires/données consultées, stocké en SQLite sur l'appareil.
- **File d'attente d'actions hors-ligne** : les actions réalisées sans réseau (enrôlement, vérification) sont stockées localement puis envoyées au backend dès le retour de connexion, via un endpoint de synchronisation dédié.
- En cas de conflit (dossier modifié entre-temps par un autre agent), l'action est rejetée avec notification à l'agent plutôt qu'une fusion automatique silencieuse.

### 4.2 Justification

Une synchronisation bidirectionnelle complète multiplierait significativement le temps de développement du MVP (modélisation double schéma, résolution de conflits, tests réseau intensifs) sans être indispensable pour démontrer la valeur du pilote. L'approche simplifiée couvre les scénarios concrets du spec (zone sans réseau, synchronisation différée — section 13) à un coût de développement bien plus maîtrisé.

## 5. Architecture cible — vue d'ensemble

| Composant | Hébergement | Rôle |
|---|---|---|
| API NestJS + Prisma | Render (free) | Logique métier, authentification, rôles, orchestration |
| Base de données Postgres | Supabase (free) | Données persistantes (bénéficiaires, agents, logs, QR temporaires) |
| Stockage de fichiers | Supabase Storage (free) | Photos de référence, attestations QR imprimables |
| Moteur de reconnaissance faciale | CompreFace sur Oracle Cloud Always Free | Capture, comparaison 1:1 / 1:N, gestion des gabarits |
| Application mobile/tablette | React Native | Enrôlement, identification, QR temporaire, mode hors-ligne |
| Détection de vivacité | ML Kit (on-device, intégré à l'app) | Anti-spoofing avant envoi de l'image au backend |

Principe : le mobile ne parle jamais directement à CompreFace. Tous les appels biométriques transitent par l'API NestJS, qui conserve le contrôle d'accès, la journalisation et l'application des seuils de confiance — conformément à l'exigence de traçabilité de la section 12 du spec.

## 6. Modules backend (NestJS)

Périmètre fonctionnel directement dérivé des sections 5, 6 et 7 du spec :

| Module | Rôle |
|---|---|
| `auth` | Connexion agent, JWT, PIN/OTP, gestion des appareils autorisés (enrôlés, identifiables, révocables) |
| `users` | Comptes agents et rôles (admin CANAM, superviseur régional, agent d'enrôlement, agent point de soin, superviseur établissement, auditeur) |
| `beneficiaries` | Création/complément de dossier, recherche (numéro AMO, NINA, nom, téléphone), gestion ouvrant droit / ayant droit |
| `biometrics` | Capture, appel à CompreFace, contrôle qualité, stockage du gabarit chiffré, comparaison 1:1 / 1:N |
| `eligibility` | Lecture du statut AMO (actif, suspendu, à mettre à jour) — pour le MVP, lecture d'une table locale ou d'un import contrôlé, en l'absence de spécification d'une interconnexion réelle avec CANAM/INPS/CMSS |
| `temporary-qr` | Génération signée, expiration paramétrable, révocation, journal d'usage |
| `audit` | Journal immuable des actions sensibles |
| `establishments` | Hôpitaux, cliniques, pharmacies conventionnés et leurs accès |
| `sync` | Endpoint de réception de la file d'attente d'actions hors-ligne envoyée par le mobile |

## 7. Application mobile (React Native)

- Codebase unique, adaptation responsive smartphone + tablette (navigation stack depuis l'accueil hub).
- Écrans et navigation conditionnés par le rôle de l'agent connecté.
- Capture caméra avec contrôle qualité (luminosité, netteté) et défi de vivacité ML Kit avant tout envoi au serveur.
- Stockage local SQLite pour le cache en lecture et la file d'attente d'actions hors-ligne (voir section 4).
- Service de synchronisation déclenché au retour réseau.

## 8. Flux biométriques

**Enrôlement** (section 6.1 du spec) : capture mobile → contrôle qualité local → envoi à l'API → l'API transmet à CompreFace pour création du gabarit dans la collection du bénéficiaire → stockage du gabarit + métadonnées (score qualité, appareil, agent) ; la photo brute n'est pas conservée au-delà du nécessaire (principe de minimisation, section 12).

**Vérification au point de soin** (section 6.2 du spec) : capture en direct → défi de vivacité ML Kit (rejet immédiat côté app si échec) → envoi à l'API → comparaison CompreFace (1:N ou 1:1 si un identifiant est déjà fourni) → croisement avec le module `eligibility` → retour d'un statut à l'agent (confirmé / douteux / échec, droits actifs / suspendus) → journalisation systématique.

## 9. QR temporaire

- Génération d'un jeton signé (JWT/JWS, clé privée côté serveur), payload minimal sans donnée médicale (identifiant bénéficiaire opaque, date d'expiration, type de QR).
- Durée de validité configurable par l'administrateur.
- Vérification au scan : signature valide + non-expiration + non-révocation (table de révocation) + obligation de coupler à une vérification faciale avant validation finale (section 6.4 du spec, étape 22).

## 10. Points ouverts / à valider à l'étape de mise en œuvre

- Disponibilité régionale et compatibilité ARM confirmée pour l'instance Oracle Cloud hébergeant CompreFace.
- Modalités exactes d'interconnexion avec les référentiels CANAM / INPS / CMSS pour le module `eligibility` (non définies dans le spec actuel, donc non présumées ici).
- Choix de la librairie de capture caméra côté React Native (à arbitrer à l'étape de structuration de l'app mobile).
