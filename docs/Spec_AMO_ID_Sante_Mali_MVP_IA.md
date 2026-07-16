---
title: "AMO ID Santé Mali"
subtitle: "Spécification produit, fonctionnelle et opérationnelle"
version: "V1.1 MVP"
date_document: "2026-06-12"
client_institution: "CANAM / AMO Mali et structures habilitées"
type_document: "Spécification produit, fonctionnelle et opérationnelle"
format_source: "DOCX"
format_sortie: "Markdown optimisé pour lecture par IA"
langue: "fr"
tags: ["AMO", "CANAM", "Mali", "biométrie faciale", "QR temporaire", "MVP", "santé", "assurance maladie"]
---

## Métadonnées de contact
- Badalabougou- Bamako-Mali
- Tel: 76 14 39 98
- Email: mamadoukkeita@gmail.com
- N° NIF: 085159368F
- Organisation: The Keita Organization

## Table des matières

- [1. Résumé exécutif](#1-résumé-exécutif)
- [2. Contexte AMO Mali et logique de complément](#2-contexte-amo-mali-et-logique-de-complément)
- [3. Objectifs](#3-objectifs)
- [4. Périmètre fonctionnel du MVP](#4-périmètre-fonctionnel-du-mvp)
- [5. Utilisateurs, rôles et droits](#5-utilisateurs-rôles-et-droits)
- [6. Parcours métier détaillés](#6-parcours-métier-détaillés)
  - [6.1 Enrôlement ou complément de dossier par agent CANAM / AMO](#61-enrôlement-ou-complément-de-dossier-par-agent-canam-amo)
  - [6.2 Vérification dans un hôpital, une clinique ou une pharmacie](#62-vérification-dans-un-hôpital-une-clinique-ou-une-pharmacie)
  - [6.3 Cas d’un ayant droit ou personne associée](#63-cas-dun-ayant-droit-ou-personne-associée)
  - [6.4 Génération d’un QR temporaire](#64-génération-dun-qr-temporaire)
- [7. Données à collecter pendant l’enrôlement](#7-données-à-collecter-pendant-lenrôlement)
  - [7.1 Données obligatoires](#71-données-obligatoires)
  - [7.2 Données facultatives de santé utiles](#72-données-facultatives-de-santé-utiles)
- [8. Identification faciale et vérification des droits](#8-identification-faciale-et-vérification-des-droits)
  - [8.1 Fonctionnement biométrique attendu](#81-fonctionnement-biométrique-attendu)
  - [8.2 Vérification des droits AMO](#82-vérification-des-droits-amo)
- [9. Carte AMO existante, carte temporaire et QR sécurisé](#9-carte-amo-existante-carte-temporaire-et-qr-sécurisé)
  - [9.1 Règles du QR temporaire](#91-règles-du-qr-temporaire)
- [10. Back-office léger CANAM / AMO](#10-back-office-léger-canam-amo)
- [11. Architecture cible simplifiée](#11-architecture-cible-simplifiée)
- [12. Sécurité, confidentialité et traçabilité](#12-sécurité-confidentialité-et-traçabilité)
- [13. Mode terrain, connectivité et exceptions](#13-mode-terrain-connectivité-et-exceptions)
- [14. Déploiement pilote et stratégie marché](#14-déploiement-pilote-et-stratégie-marché)
- [15. Indicateurs de réussite](#15-indicateurs-de-réussite)
- [16. Risques et mesures de mitigation](#16-risques-et-mesures-de-mitigation)
- [17. Évolutions possibles après obtention du marché](#17-évolutions-possibles-après-obtention-du-marché)
- [18. Annexes et sources publiques](#18-annexes-et-sources-publiques)
  - [18.1 Glossaire](#181-glossaire)

# AMO ID Santé Mali

*Spécification produit, fonctionnelle et opérationnelle*

> **Positionnement**  
> Cette version ne remplace pas la carte AMO, les référentiels CANAM, les processus INPS/CMSS ni les systèmes existants. Elle ajoute une couche mobile simple, contrôlée et traçable pour enrôler, identifier par visage, vérifier les droits et sécuriser l’usage de l’assurance maladie au point de soin.

| Élément | Description |
| --- | --- |
| Client / Institution | CANAM / AMO Mali et structures habilitées |
| Utilisateurs directs | Agents CANAM/AMO, agents d’accueil habilités, pharmacies, hôpitaux, cliniques et points de service conventionnés |
| Bénéficiaires | Assurés AMO et ayants droit, sans application directe obligatoire au démarrage |
| Périmètre MVP | Application mobile/tablette interne + back-office léger + API de vérification + QR temporaire |
| Version | V1.1 MVP |
| Date | 12 juin 2026 |

## 1. Résumé exécutif

AMO ID Santé Mali est une application interne destinée aux agents habilités de la CANAM / AMO et aux points de service conventionnés. Elle sert à enrôler ou compléter les profils des bénéficiaires, capturer leur biométrie faciale, puis permettre leur identification rapide dans une pharmacie, un hôpital, une clinique ou tout autre point de prise en charge AMO.

Le principe est volontairement simple : au lieu de demander uniquement une carte physique, l’agent peut vérifier la personne présente devant lui grâce au visage. Le système identifie le bénéficiaire, vérifie son statut dans les référentiels AMO disponibles, confirme s’il est ouvrant droit ou ayant droit, puis affiche uniquement les informations utiles à l’agent selon son rôle.

Cette proposition est conçue comme un ajout progressif à l’écosystème existant. Elle ne prétend pas remplacer la carte AMO, les bases de données CANAM, les procédures INPS/CMSS ou les systèmes de remboursement. Elle apporte une couche mobile moderne, utile immédiatement sur le terrain, avec un fort impact visible : réduction de l’usurpation de carte, accélération de l’identification, meilleure traçabilité des accès et possibilité de délivrer un QR temporaire en cas de perte de carte ou de besoin exceptionnel.

> **Proposition de valeur**  
> Une application mobile/tablette, contrôlée par la CANAM / AMO, permettant d’enrôler les bénéficiaires, de les identifier par reconnaissance faciale au point de soin, de vérifier leurs droits et de générer un QR temporaire sécurisé quand la carte physique n’est pas disponible.

| Acteur | Gain concret |
| --- | --- |
| CANAM / AMO | Meilleure maîtrise des identités, journalisation des vérifications, réduction des abus, base de décision pour un déploiement plus large. |
| Agent CANAM / AMO | Enrôlement structuré, capture faciale guidée, dossier bénéficiaire plus propre, recherche rapide. |
| Hôpital / clinique / pharmacie | Identification rapide du bénéficiaire, moins de dépendance à la carte physique, contrôle des droits avant prise en charge. |
| Bénéficiaire | Moins de blocage en cas d’oubli ou perte de carte, prise en charge plus fluide, possibilité d’informations médicales utiles en cas d’urgence. |

## 2. Contexte AMO Mali et logique de complément

La CANAM est chargée de la gestion du régime d’Assurance Maladie Obligatoire au Mali. Les organismes gestionnaires délégués participent à la gestion technique du régime, notamment l’INPS et la CMSS. Les missions de la CANAM couvrent notamment la centralisation des cotisations, l’immatriculation des assurés, la mise à jour des droits, la convention avec les formations de soins et le contrôle de la validité des prestations soumises à la prise en charge.

Le Mali dispose déjà de dispositifs d’identification et de carte AMO. Des sources publiques mentionnent l’existence de cartes biométriques AMO, leur production et leur distribution. La bonne stratégie n’est donc pas de présenter AMO ID Santé Mali comme une rupture brutale, mais comme une amélioration opérationnelle qui s’appuie sur l’existant et le rend plus efficace au point de service.

| Existant AMO | Apport de notre solution |
| --- | --- |
| Carte AMO et logique d’immatriculation | Vérification faciale en complément pour confirmer que le porteur est bien le bénéficiaire. |
| Référentiels CANAM / INPS / CMSS | Connexion ou import contrôlé pour vérifier l’éligibilité et éviter les données contradictoires. |
| Procédures de prise en charge | Contrôle mobile avant la prestation, avec preuve de vérification et historique consultable. |
| Points de soins conventionnés | Application simple sur tablette/mobile pour éviter un déploiement matériel lourd. |
| Production de cartes physiques | QR temporaire sécurisé lorsque la carte est perdue, indisponible, abîmée ou en attente. |

## 3. Objectifs

- Permettre aux agents CANAM / AMO d’enrôler ou compléter les dossiers des bénéficiaires depuis une tablette ou un smartphone autorisé.
- Capturer une biométrie faciale exploitable avec contrôle qualité minimum : visage visible, luminosité correcte, netteté, absence d’obstruction majeure.
- Identifier rapidement un bénéficiaire au point de soin par scan facial, avec ou sans présentation immédiate de la carte AMO.
- Vérifier le statut AMO, le type de bénéficiaire et le rattachement à l’ouvrant droit ou à l’organisme concerné.
- Permettre la délivrance d’un QR temporaire sécurisé en cas de perte de carte, indisponibilité, renouvellement ou besoin opérationnel.
- Tracer toutes les actions : enrôlement, modification, scan, vérification, échec, génération de QR temporaire, accès aux informations sensibles.
- Lancer un pilote crédible, peu coûteux et démontrable pour faciliter l’obtention du marché avant extension fonctionnelle.

## 4. Périmètre fonctionnel du MVP

| Inclus dans le MVP | Non inclus au démarrage |
| --- | --- |
| Application mobile/tablette interne pour agents habilités | Application grand public bénéficiaire complète. |
| Enrôlement bénéficiaire et ayants droit | Dossier médical complet ou parcours patient complet. |
| Capture faciale et identification par visage | Reconnaissance d’empreintes, iris ou carte NFC obligatoire. |
| Vérification simple des droits AMO | Facturation médicale complète et remboursement automatique. |
| QR temporaire signé et expirant | Portail national complet pour tous les partenaires. |
| Back-office léger : utilisateurs, bénéficiaires, logs, statistiques | Interopérabilité hospitalière avancée avec tous les SI. |
| Profil médical facultatif limité de type urgence | Dossier santé partagé national. |

## 5. Utilisateurs, rôles et droits

| Rôle | Utilisateur | Droits principaux |
| --- | --- | --- |
| Administrateur CANAM / AMO | Équipe centrale | Créer les établissements, valider les agents, suivre les logs, paramétrer les règles, suspendre un accès. |
| Superviseur régional | Antenne CANAM / AMO | Suivre les enrôlements, valider les corrections, contrôler l’activité locale. |
| Agent d’enrôlement | Agent CANAM / AMO | Créer ou compléter un dossier, capturer le visage, ajouter les informations facultatives, soumettre à validation. |
| Agent de point de soin | Hôpital, clinique, pharmacie conventionnée | Scanner le visage, consulter identité minimale, vérifier le statut, enregistrer une vérification. |
| Superviseur établissement | Responsable habilité | Gérer les agents du site, contrôler les vérifications, consulter les statistiques locales. |
| Auditeur / contrôleur | CANAM / AMO | Consulter les journaux, détecter les anomalies, préparer les rapports de contrôle. |

## 6. Parcours métier détaillés

### 6.1 Enrôlement ou complément de dossier par agent CANAM / AMO

1. L’agent se connecte sur l’application avec son compte professionnel et, idéalement, une double vérification OTP ou code PIN.
2. Il recherche le bénéficiaire par numéro AMO, numéro NINA si disponible, nom/prénom, téléphone ou autre identifiant autorisé.
3. Si le bénéficiaire existe déjà, l’agent ouvre le dossier et complète les informations manquantes. Si le dossier n’existe pas dans le périmètre autorisé, il crée une fiche provisoire à valider.
4. Il renseigne les informations obligatoires et, si nécessaire, les informations facultatives utiles : groupe sanguin confirmé, allergies, pathologies critiques, maladies héréditaires, contacts d’urgence.
5. Il capture le visage selon un guide simple : visage face caméra, bonne lumière, pas de lunettes noires, pas de masque, visage non flou.
6. Le système contrôle la qualité de la capture, enregistre le gabarit facial chiffré et associe le dossier au statut de validation prévu.
7. Le dossier est synchronisé avec le serveur central dès que le réseau est disponible.

### 6.2 Vérification dans un hôpital, une clinique ou une pharmacie

8. L’agent du point de soin ouvre l’application sur un appareil autorisé.
9. Il choisit « Identifier un bénéficiaire » puis capture le visage de la personne présente.
10. Le système cherche le bénéficiaire correspondant selon le mode autorisé : comparaison 1:N contrôlée, ou 1:1 si un QR/carte/numéro est présenté.
11. Le système affiche le résultat : identité probable, score de confiance, statut AMO, type de bénéficiaire, organisme de rattachement et lien éventuel avec l’ouvrant droit.
12. L’agent confirme ou rejette selon les règles. En cas de doute, il déclenche une vérification manuelle ou demande une pièce justificative.
13. La vérification est journalisée : agent, établissement, date, résultat, appareil, motif et statut final.

### 6.3 Cas d’un ayant droit ou personne associée

Le système doit gérer les bénéficiaires associés : enfants, conjoint, ascendants ou personnes à charge selon les règles AMO. Lorsqu’un ayant droit est identifié, l’application affiche clairement son lien avec l’ouvrant droit, son statut propre et les éventuelles restrictions de prise en charge.

14. L’agent scanne le visage de l’ayant droit.
15. Le système identifie la personne et affiche le dossier associé.
16. Le lien avec l’ouvrant droit est visible : nom de l’ouvrant droit, numéro AMO, organisme, statut de couverture.
17. Si l’ayant droit n’est plus couvert ou nécessite une mise à jour, l’application affiche une alerte simple et oriente vers la procédure CANAM / AMO.

### 6.4 Génération d’un QR temporaire

18. Le bénéficiaire déclare une perte, une carte abîmée, une carte en attente ou un besoin exceptionnel.
19. L’agent vérifie son identité par visage et contrôle son statut AMO.
20. Si les règles sont satisfaites, l’application génère un QR temporaire signé, limité dans le temps et lié au bénéficiaire.
21. Le QR peut être imprimé sur une attestation, envoyé par SMS sécurisé ou remis sous forme papier selon la procédure validée.
22. Au point de soin, le QR temporaire ne suffit pas seul : il doit être couplé à une vérification faciale ou à une validation d’agent selon le niveau de risque.

## 7. Données à collecter pendant l’enrôlement

### 7.1 Données obligatoires

| Catégorie | Données recommandées |
| --- | --- |
| Identité | Nom, prénom, sexe, date de naissance, lieu de naissance, nationalité si nécessaire. |
| Références AMO | Numéro AMO, organisme de rattachement, statut, ouvrant droit / ayant droit. |
| Contact | Téléphone, adresse, région/cercle/commune, personne à contacter si besoin. |
| Administratif | Pièce ou référence d’identité autorisée, NINA si l’intégration est autorisée, date d’enrôlement. |
| Biométrie | Photo de référence ou gabarit facial chiffré, score qualité, appareil utilisé, agent enrôleur. |

### 7.2 Données facultatives de santé utiles

Ces données ne doivent pas devenir un dossier médical complet. Elles servent uniquement à améliorer l’identification, l’urgence et la continuité de service lorsque la CANAM / AMO l’autorise.

| Donnée facultative | Règle recommandée |
| --- | --- |
| Groupe sanguin | À renseigner seulement s’il est confirmé par document ou source médicale fiable. |
| Allergies graves | Médicaments, aliments, piqûres, latex ou allergie critique. |
| Pathologies critiques | Diabète, épilepsie, asthme sévère, cardiopathie, insuffisance rénale, etc. |
| Maladies héréditaires ou chroniques | Uniquement si utile et avec niveau de confidentialité renforcé. |
| Traitements importants | Anticoagulants, insuline, traitements cardiaques, antirétroviraux, etc. |
| Contacts d’urgence | Nom, lien, téléphone, priorité de contact. |

> **Principe de prudence**  
> Les informations médicales facultatives doivent être minimisées, protégées, justifiées et consultables uniquement par les rôles habilités. Le MVP doit privilégier les informations d’urgence, pas le dossier médical complet.

## 8. Identification faciale et vérification des droits

### 8.1 Fonctionnement biométrique attendu

- Capture du visage en direct depuis l’application.
- Contrôle de qualité : luminosité, netteté, orientation du visage, distance caméra.
- Détection de vivacité minimum pour limiter l’usage d’une photo ou d’une vidéo.
- Comparaison avec le gabarit enregistré.
- Affichage d’un score ou d’un statut simple : confirmé, douteux, échec.
- Possibilité de procédure alternative pour les cas légitimes : blessure, âge, visage couvert pour raison médicale, appareil faible qualité.

### 8.2 Vérification des droits AMO

Après l’identification, le système doit interroger le référentiel disponible ou un cache validé pour confirmer les droits. Le résultat doit rester compréhensible pour l’agent : droits actifs, droits suspendus, dossier à mettre à jour, bénéficiaire non trouvé, ayant droit expiré, contrôle manuel requis.

| Statut affiché | Interprétation terrain |
| --- | --- |
| Identité confirmée + droits actifs | La prise en charge peut continuer selon les procédures AMO. |
| Identité confirmée + droits suspendus | L’agent informe le bénéficiaire et applique la procédure de régularisation. |
| Identité douteuse | Nouvelle capture ou contrôle manuel par superviseur. |
| Bénéficiaire non trouvé | Recherche par numéro AMO/NINA ou orientation vers agent CANAM / AMO. |
| Ayant droit associé | Afficher le lien avec l’ouvrant droit et vérifier le statut de couverture. |

## 9. Carte AMO existante, carte temporaire et QR sécurisé

Le MVP doit respecter la présence de la carte AMO. La carte reste un support officiel et pratique. Notre système ajoute trois compléments : la vérification faciale, le QR temporaire et la traçabilité.

| Support | Usage recommandé |
| --- | --- |
| Carte AMO existante | Support principal lorsque disponible. Peut-être couplé au scan facial pour réduire l’usurpation. |
| QR temporaire | Support de dépannage en cas de perte, renouvellement, carte abîmée, attente de carte ou besoin opérationnel validé. |
| Attestation imprimée avec QR | Remise par un agent habilité, validité courte, vérification obligatoire au point de soin. |
| QR numérique envoyé par SMS | Possible si le numéro est vérifié ; éviter d’y mettre des données sensibles en clair. |

### 9.1 Règles du QR temporaire

- QR signé cryptographiquement pour empêcher la falsification.
- Durée de validité courte : par exemple 24h, 72h, 7 jours ou durée définie par la CANAM selon le cas.
- Aucune donnée médicale sensible en clair dans le QR.
- Révocation possible depuis le back-office.
- Usage journalisé à chaque scan.
- Couplage recommandé avec capture faciale pour éviter qu’un QR imprimé soit utilisé par une autre personne.

## 10. Back-office léger CANAM / AMO

| Module | Fonctions MVP |
| --- | --- |
| Tableau de bord | Nombre d’enrôlements, vérifications, échecs biométriques, QR temporaires, établissements actifs. |
| Bénéficiaires | Recherche, consultation, statut, lien ouvrant droit / ayant droit, historique des vérifications. |
| Agents | Création, suspension, rôle, établissement, appareil autorisé, historique d’activité. |
| Établissements | Liste des hôpitaux, cliniques, pharmacies ou sites pilotes ; statut conventionné ; accès autorisés. |
| QR temporaires | Création, suivi, révocation, historique d’usage, motif de délivrance. |
| Audit | Journal des accès, modifications, scans, échecs, alertes et exports de contrôle. |
| Paramètres | Durées de validité, seuils biométriques, rôles, niveaux d’accès aux données facultatives. |

## 11. Architecture cible simplifiée

| Composant | Rôle |
| --- | --- |
| Application mobile/tablette | Enrôlement, capture faciale, identification, vérification droits, QR temporaire. |
| API sécurisée | Connexion entre application, serveur, référentiels et back-office. |
| Service identité | Gestion des profils, ayants droit, recherche et déduplication. |
| Service biométrique | Création et comparaison de gabarits faciaux, contrôle qualité et vivacité. |
| Service éligibilité | Lecture du statut AMO depuis référentiel ou import synchronisé. |
| Service QR | Génération, signature, expiration et révocation des QR temporaires. |
| Back-office web | Administration, supervision, audit, statistiques. |
| Base d’audit | Journal immuable ou fortement protégé de toutes les actions sensibles. |

> **Approche technique recommandée**  
> Démarrer avec une architecture modulaire mais simple : une application mobile/tablette Android prioritaire, un back-office web léger, une API sécurisée, une base centrale, un moteur facial et des connecteurs vers les données AMO disponibles. L’iOS peut être prévu sans être prioritaire au pilote.

## 12. Sécurité, confidentialité et traçabilité

- Authentification obligatoire des agents : identifiant, mot de passe fort, PIN appareil, OTP ou MFA selon disponibilité.
- Appareils autorisés : chaque téléphone/tablette doit être enrôlé, identifiable et révocable.
- Gestion stricte des rôles : l’agent d’accueil ne voit pas les mêmes informations qu’un superviseur ou un contrôleur CANAM.
- Chiffrement des communications et des données sensibles.
- Stockage sécurisé des gabarits biométriques ; éviter de conserver inutilement des photos brutes.
- QR signés et expirants, sans données sensibles en clair.
- Journalisation obligatoire : qui a fait quoi, quand, où, sur quel bénéficiaire et avec quel résultat.
- Alertes sur comportements suspects : scans répétés, échecs multiples, accès hors zone, usage anormal d’un agent ou d’un appareil.

| Donnée | Niveau de protection |
| --- | --- |
| Biométrie faciale | Très sensible : chiffrement, accès limité, journalisation, séparation logique. |
| Données médicales facultatives | Très sensible : accès par rôle, minimisation, justification. |
| Statut AMO | Sensible : consultation limitée au besoin de service. |
| Logs d’audit | Critique : non modifiables par les agents, conservation selon politique CANAM. |

## 13. Mode terrain, connectivité et exceptions

Le Mali impose une conception réaliste : réseau variable, appareils de qualité différente, agents avec niveaux numériques variés, files d’attente dans les structures de santé. Le MVP doit donc être simple, rapide et tolérant aux difficultés sans ouvrir la porte à la fraude.

| Situation terrain | Réponse du système |
| --- | --- |
| Pas de réseau | Autoriser uniquement les actions préparées ou cache récent ; synchronisation dès retour du réseau. |
| Caméra faible qualité | Guide de capture, reprise photo, contrôle qualité obligatoire. |
| Visage non reconnu | Nouvelle capture, recherche par numéro AMO, contrôle manuel superviseur. |
| Personne blessée ou visage bandé | Procédure alternative avec justification et validation agent habilité. |
| Carte perdue | Vérification faciale puis QR temporaire signé, durée limitée. |
| Doute sur usurpation | Blocage temporaire, alerte superviseur, audit. |

## 14. Déploiement pilote et stratégie marché

Pour obtenir le marché, il faut éviter de présenter un projet trop lourd au départ. La stratégie recommandée est de proposer une preuve de valeur rapide sur un périmètre pilote, puis d’étendre par étapes.

| Étape | Objectif | Livrables |
| --- | --- | --- |
| Étape 1 - Cadrage court | Valider règles métier, profils agents, données obligatoires, procédure QR temporaire. | Ateliers, maquettes, document de règles, plan pilote. |
| Étape 2 - Prototype démontrable | Montrer l’enrôlement, la capture visage, l’identification et le QR temporaire. | Application démo, back-office simple, scénario de présentation. |
| Étape 3 - Pilote terrain | Tester dans quelques sites : antenne CANAM, hôpital, pharmacie ou clinique. | MVP installé, formation agents, tableau de bord, rapport pilote. |
| Étape 4 - Extension contrôlée | Ajouter plus de sites et renforcer les intégrations. | Connecteurs, reporting, gestion avancée des droits, support. |

> **Argument commercial**  
> Le décideur n’a pas besoin d’acheter immédiatement une plateforme nationale lourde. Il peut commencer par un outil léger de vérification mobile, mesurer les résultats, sécuriser l’usage de la carte AMO et préparer progressivement une modernisation plus large.

## 15. Indicateurs de réussite

| Catégorie | Indicateurs |
| --- | --- |
| Adoption | Nombre d’agents actifs, établissements pilotes actifs, enrôlements réalisés, bénéficiaires vérifiés. |
| Performance | Temps moyen d’identification, taux de succès facial, taux d’échec, temps de réponse API. |
| Qualité des données | Dossiers complétés, doublons détectés, profils corrigés, ayants droit associés. |
| Contrôle | QR temporaires générés, QR révoqués, tentatives suspectes, scans échoués, accès audités. |
| Impact terrain | Réduction des blocages pour perte de carte, baisse des vérifications manuelles, satisfaction agents. |

## 16. Risques et mesures de mitigation

| Risque | Impact | Mitigation |
| --- | --- | --- |
| Le projet paraît trop ambitieux | Décision repoussée | Présenter le MVP léger comme première marche, avec extension progressive. |
| Données existantes incomplètes | Mauvaises vérifications | Prévoir un workflow de correction et de validation par agent habilité. |
| Fraude par photo | Usurpation possible | Détection de vivacité, contrôle qualité, supervision des échecs. |
| Mauvaise connectivité | Blocage au point de soin | Cache limité, file d’attente, QR temporaire signé, synchronisation différée. |
| Accès abusif aux données médicales | Risque de confidentialité | Minimisation, rôles stricts, audit, sanctions et formation. |
| Faible adoption par les agents | Sous-utilisation | Interface simple, formation courte, support pilote, procédures claires. |
| Échec biométrique légitime | Refus injustifié | Procédure alternative et contrôle manuel documenté. |

## 17. Évolutions possibles après obtention du marché

Une fois acceptée et validée sur le terrain, le système pourra évoluer sans changer de vision. Les modules suivants pourront être proposés par lots.

- Portail complet établissements : gestion des agents, dossiers, statistiques locales.
- Application bénéficiaire : QR personnel, historique des accès, notifications, réclamations.
- Feuilles de soins numériques et intégration remboursement.
- Module pharmacie : vérification ordonnance, délivrance, contrôle des répétitions.
- Mode urgence plus avancé : profil vital, contacts d’urgence, accès professionnel authentifié.
- Cartes NFC, bracelets QR ou supports physiques pour patients vulnérables.
- Anti-fraude avancée : scoring, anomalies géographiques, usage multiple, contrôle médical.
- Interopérabilité renforcée avec les systèmes CANAM, INPS, CMSS, NINA et SI hospitaliers.

## 18. Annexes et sources publiques

### 18.1 Glossaire

| Terme | Définition |
| --- | --- |
| AMO | Assurance Maladie Obligatoire. |
| CANAM | Caisse Nationale d’Assurance Maladie, gestionnaire du régime AMO au Mali. |
| INPS | Institut National de Prévoyance Sociale, organisme gestionnaire délégué. |
| CMSS | Caisse Malienne de Sécurité Sociale, organisme gestionnaire délégué. |
| Gabarit facial | Représentation numérique sécurisée du visage utilisé pour comparaison, à ne pas confondre avec une simple photo. |
| QR temporaire | QR code signé et expirant, délivré pour un usage limité. |
| MVP | Minimum Viable Product : version réduite mais exploitable pour pilote. |
