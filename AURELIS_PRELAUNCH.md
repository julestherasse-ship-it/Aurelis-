# Aurelis — Rapport pré-lancement (audit technique & commercial)

**Rôle :** Directeur technique  
**Date :** 9 octobre 2026  
**Périmètre :** `aurelis.ink` (repo Aurelis) + `aurelis-ai` (`C:\aurelis-ai`, prod `https://aurelis-ai-kohl.vercel.app`)  
**Règles respectées :** aucun rebuild from scratch · aucun mélange avec projets clients · aucune modification destructive · aucun numéro d’entreprise inventé · aucun paiement réel · aucun devis réel envoyé · aucune publicité lancée  

---

## 1. Synthèse exécutive

| Domaine | État |
|---------|------|
| Site vitrine premium FR/EN + offres + landings Ads | **Opérationnel** |
| Tunnel formulaire → proxy `/api/leads` → Aurelis AI | **Code opérationnel**, **persistance bloquée** (Supabase egress quota) |
| CRM / pipeline / devis DRAFT / rendez-vous (Aurelis AI) | **Partiel** — UI & modèle prêts, envoi réel verrouillé |
| Paiements | **Absent** (volontairement) |
| Emails transactionnels automatiques | **Absent / flags off** |
| GA4 / Google Ads | **Préparé, non configuré** |
| Profil entreprise (BCE / TVA / IBAN) | **Prêt à remplir** après immatriculation (champs vides) |

**Verdict :** la plateforme peut être ouverte commercialement dès que (1) Supabase est rétabli, (2) le profil légal belge est renseigné, (3) les comptes GA4/Ads/email (optionnels) sont branchés. **Aucune reconstruction système n’est nécessaire.**

---

## 2. Audit détaillé (18 points)

### 2.1 Quatre offres commerciales — **OK**
| Offre | Prix catalogue |
|-------|----------------|
| Aurelis Essential | 990 € HTVA / €990 excl. VAT |
| Aurelis Signature | 2 490 € HTVA / €2,490 excl. VAT |
| Aurelis Prestige | 4 490 € HTVA / €4,490 excl. VAT |
| Aurelis Elite | À partir de 7 490 € HTVA / From €7,490 excl. VAT |

Affichées de façon cohérente sur home, `/offres`, `/en/offers`, landings et `lead-funnel.js`. Contrôle automatisé dans `npm run build`.

### 2.2 Portfolio & démonstrations — **OK (vérifiable)**
Projets **accessibles en ligne** :
- Bryan Burger — https://bryan-burger.vercel.app/ (HTTP 200)
- Trans Delivery — https://transport-delivery.vercel.app/ (HTTP 200)
- Démo salon Aurelis — URL Vercel dédiée (HTTP 200)

Contenus fictifs présentés comme clients réels ont été retirés (témoignages inventés, « Maison Rivage », etc.).

### 2.3 FR / EN — **OK**
- FR : `/`, `/offres`, landings, légal  
- EN : `/en`, `/en/offers`, landings, légal  
- Sélecteur FR/EN + persistance `localStorage`  
- Formulaire lead bilingue  

### 2.4 Formulaires de contact — **OK (UI + validation)**
Modal premium : offre, prix, langue, anti-doublon client, honeypot, consentement.  
CTA contact / rendez-vous ouvre le même tunnel (`data-lead-open` / `data-appointment`).

### 2.5 Enregistrement des prospects — **BLOQUÉ (infra)**
| Étape | Testé | Résultat |
|-------|-------|----------|
| Validation e-mail invalide | Oui | 400 |
| Honeypot | Oui | 200 `accepted:false` |
| POST réel ficif | Oui | **503** — message « service temporairement saturé » |
| Cause | Infra | Supabase `exceed_egress_quota` |

Le code d’ingestion (`/api/inbound/website-offer` + `ingestWebsiteOffer`) crée lead `WEBSITE_OFFER`, opportunité, activité et devis **DRAFT** — non rejouable tant que la base est saturée.

### 2.6 Connexion Aurelis AI — **OK côté code / partiel en prod**
- Proxy serveur `aurelis/api/leads.js` → `AURELIS_AI_URL` (défaut prod AI)  
- Secret optionnel `AURELIS_WEBSITE_INGEST_SECRET` (non exposé au navigateur)  
- Route publique AI : `POST|OPTIONS /api/inbound/website-offer`  
- Auth : `/api/sales`, `/dashboard` protégés (401 / 307 login) — **testé**

### 2.7 Système de rendez-vous — **PARTIEL**
- Modèle `SalesAppointment` + pages `/meetings`, `/sales/appointments`  
- Statuts : PROPOSED → CONFIRMED → …  
- Flags `autoBookingEnabled` présents, **envoi / sync calendrier externe non branché**  
- Sur le site public : événement analytics `book_appointment` + ouverture formulaire (pas de booking Calendly/Google Calendar)

### 2.8 Génération des devis — **PARTIEL (DRAFT only)**
- Génération DRAFT automatique possible à l’ingestion web + manuelle depuis opportunité  
- PDF route `/api/sales/quotes/[id]/pdf`  
- Passage READY/APPROVED/SENT **bloqué** si profil entreprise incomplet (`companyProfileGaps`)  
- `externalSendingEnabled` / envoi devis réel : **désactivé par design** jusqu’à validation humaine + profil légal

### 2.9 Paiements — **MANQUANT (volontaire)**
Aucun Stripe / Mollie / PayPal dans le code Sales.  
Champs `iban` + `paymentTerms` au profil entreprise pour facturation ultérieure — **pas d’encaissement en ligne**.

### 2.10 Tableau de bord commercial — **OK (auth requise)**
Aurelis AI : `/dashboard`, `/sales`, `/quotes`, `/leads`, `/crm`, `/morning`, `/meetings`, pipeline board.  
Non testé en session authentifiée dans cet audit (volontaire — pas d’exposition de données).

### 2.11 SEO technique — **OK**
Titles/metas, canonical, hreflang FR/EN, `sitemap.xml`, `robots.txt`, JSON-LD Organization, landings dédiées.  
Aucune promesse de ranking.

### 2.12 Préparation Google Ads — **PRÊT / NON BRANCHÉ**
Landings :
- FR : création site entreprise · refonte · site premium  
- EN : business-website · website-redesign · premium-website  

IDs Ads vides dans `assets/config.js`.

### 2.13 Suivi des conversions — **PRÊT / NON BRANCHÉ**
Événements : `offer_click`, `generate_lead_start`, `generate_lead`, `book_appointment`, `qualified_lead`.  
Chargement GA4/Ads **uniquement après consentement** mesure.  
Sans IDs : file `dataLayer` locale uniquement.

### 2.14 Sécurité des données — **OK (architecture)**
- Pas de clés API dans le navigateur (vérifié `config.js` prod)  
- `.env*` gitignored (sauf `.env.example`)  
- Proxy serveur pour l’ingest  
- Auth Supabase sur routes internes AI  
- Honeypot + rate-limit  

### 2.15 Performances mobiles — **OK (bonnes pratiques)**
CSS responsive, `prefers-reduced-motion`, images Unsplash avec `auto=format` / `q≈70` / `loading=lazy` (hors LCP).  
Pas de Lighthouse CI automatisé dans le repo (test manuel recommandé avant Ads).

### 2.16 Emails automatiques — **MANQUANT / FLAGS OFF**
`autoEmailEnabled`, `autoSmsEnabled`, `autoWhatsappEnabled`, `externalSendingEnabled` dans `SalesSettings` — **pas de provider email (Resend/SendGrid) branché** pour confirmation lead / envoi devis.

### 2.17 Sauvegardes — **PARTIEL (externe)**
- Données CRM : Supabase (sauvegardes à configurer côté projet Supabase)  
- Code : GitHub `Aurelis-` + déploiements Vercel  
- Export CRM API `/api/crm/export` (auth) — à vérifier en session  
- **Pas de runbook backup documenté** jusqu’ici (ajouté comme tâche P1)

### 2.18 Conformité technique RGPD — **PARTIEL → BONNE BASE**
- Bannière consentement mesure  
- Politique de confidentialité FR/EN  
- Mentions légales FR/EN (éditeur personne physique en attendant société)  
- Consentement explicite sur formulaire lead  
- À compléter post-immatriculation : BCE, TVA, DPO éventuel, registre des traitements, sous-traitants (Vercel, Supabase, GA)

---

## 3. Classification des fonctionnalités

### 3.1 Opérationnelles
- Site aurelis.ink FR/EN, offres, landings, SEO, consentement  
- Modal lead + validation + honeypot + rate-limit  
- Proxy `/api/leads`  
- Endpoint AI website-offer (code + auth publique)  
- Portfolio projets en ligne  
- Dashboard / Sales / Quotes / Appointments (UI, derrière auth)  
- Profil entreprise (formulaire Paramètres — champs vides)  
- Garde-fous : pas d’envoi devis sans validation / profil  

### 3.2 Partiellement développées
- Ingestion web → lead + opportunité + devis DRAFT (**code OK, DB saturée**)  
- Rendez-vous (CRUD interne sans sync calendrier)  
- Devis PDF / workflow READY→SENT (bloqué sans profil + envoi externe off)  
- Analytics conversion (code OK, IDs absents)  
- Mentions légales (sans BCE/TVA)  

### 3.3 Manquantes
- Passerelle de paiement  
- Emails transactionnels (confirmations, devis)  
- Module facturation électronique belge (Peppol / outils comptables)  
- Booking public auto-confirmé  
- CI Lighthouse / e2e Playwright  
- Runbook backup & PRA  
- Secret ingest obligatoire en prod (recommandé)  

---

## 4. Erreurs / risques identifiés

| ID | Priorité | Description | Impact |
|----|----------|-------------|--------|
| E1 | **P0** | Supabase `exceed_egress_quota` | Aucun prospect web enregistré |
| E2 | **P1** | `companyProfileGaps` n’exige pas encore BCE/TVA | Devis READY possibles sans n° belge |
| E3 | **P1** | Secret ingest optionnel | Surface publique rate-limitée seulement |
| E4 | **P2** | Pas de provider e-mail | Pas d’accusé de réception auto |
| E5 | **P2** | Pas de Lighthouse automatisé | Perf Ads non mesurée en CI |
| E6 | **P3** | Mentions légales = personne physique | À mettre à jour à l’immatriculation |

---

## 5. Intégrations nécessitant un compte externe

| Service | Usage | Statut |
|---------|-------|--------|
| Vercel | Hébergement site + AI | Actif |
| Supabase | Auth + DB CRM | Actif mais **quota egress saturé** |
| GitHub | Code Aurelis | Actif |
| Google Analytics 4 | Mesure audience | Compte à créer / ID à coller |
| Google Ads | Campagnes + conversions | Compte à créer — **ne pas lancer** avant go-live |
| Fournisseur e-mail (Resend / etc.) | Confirmations | Non branché |
| Calendrier (Google/Outlook) | Sync RDV | Non branché |
| PSP (Mollie recommandé BE) | Paiements | Non branché — **ne pas activer** |
| Outil comptable / Peppol | Factures BE | Post-immatriculation |

---

## 6. Éléments nécessitant un numéro d’entreprise (BCE) / TVA

À renseigner **uniquement après immatriculation** (champs déjà prévus, **laissés vides**) :

| Élément | Où |
|---------|----|
| Numéro d’entreprise (BCE) | Aurelis AI → Paramètres → Entreprise (`companyNumber`) |
| N° TVA (BE0…) | Idem (`vatNumber`) |
| Raison sociale / siège | Idem + mentions légales site |
| IBAN professionnel | Idem (`iban`) — pour mentions de paiement sur devis |
| Conditions de paiement | Idem (`paymentTerms`) |
| Factures / devis « officiels » | Workflow READY/SENT après profil complet |
| Google Ads facturation société | Compte Ads |
| Contrat hébergeur / sous-traitance | Docs juridiques |

**Ne jamais inventer ces numéros.** Tant qu’ils sont vides, seuls les devis **TEST / DRAFT** restent pertinents.

---

## 7. Préparation post-immatriculation (architecture)

### Déjà en place (Aurelis AI)
Formulaire `/parametres` → `agency_company_profile` :
`commercialName`, `legalName`, adresse, `companyNumber`, `vatNumber`, email, phone, website, `iban`, `paymentTerms`, validité devis.

### Ajouté côté site (placeholders vides)
`assets/config.js` → section `company` (tous champs `""`) pour alimenter facilement mentions légales / footer **après** obtention BCE/TVA, sans hardcoder de faux numéros.

### Procédure d’activation recommandée (J0 immatriculation)
1. Rétablir Supabase (quota / plan).  
2. Remplir Paramètres → Entreprise (BCE + TVA + adresse).  
3. Mettre à jour `assets/config.js` + régénérer pages légales / redéployer aurelis.ink.  
4. Optionnel : `AURELIS_WEBSITE_INGEST_SECRET` sur les deux projets Vercel.  
5. Coller IDs GA4 (Ads plus tard).  
6. Tester un lead fictif **isTest** → opportunité → devis DRAFT → (sans SENT).  
7. Activer e-mail / paiement seulement après validation humaine et conformité.

---

## 8. Tests effectués vs restants

### Réellement testés (données fictives)
- [x] Cohérence prix / 4 offres (build)  
- [x] HTTP 200 pages clés FR/EN + sitemap/robots  
- [x] Demos portfolio HTTP 200  
- [x] OPTIONS `/api/leads` → 204  
- [x] Validation formulaire (400)  
- [x] Honeypot (200 accepted false)  
- [x] POST lead réel → **503** (infra documentée)  
- [x] POST AI website-offer → **503**  
- [x] Auth AI (401/307)  
- [x] Absence de secrets dans `config.js` prod  

### Non testés (nécessitent config / session / quota OK)
- [ ] Enregistrement lead + opportunité + devis DRAFT bout-en-bout  
- [ ] Qualification CRM en UI authentifiée  
- [ ] Création rendez-vous + confirmation  
- [ ] PDF devis / passage READY  
- [ ] Export CRM  
- [ ] GA4 / Ads conversion (IDs)  
- [ ] E-mail transactionnel  
- [ ] Lighthouse mobile 90+  
- [ ] Paiement (N/A volontaire)  

### Parcours cible (statut)

```
Visiteur → Offre → Formulaire → Aurelis AI → Qualification → RDV → Brouillon devis
   OK         OK        OK          503 DB        Code prêt      Partiel     Code prêt (DRAFT)
```

---

## 9. Plan de finalisation par priorité

### P0 — Bloquants go-live commercial (réception prospects)
1. Lever le quota / plafond Supabase.  
2. Rejouer un test fictif bout-en-bout lead → DRAFT.  
3. Vérifier absence de leads test visibles « comme clients » en prod.

### P1 — Immatriculation & conformité
4. Remplir profil entreprise (BCE, TVA, adresse).  
5. Exiger BCE+TVA dans `companyProfileGaps` avant devis non-test READY.  
6. Mettre à jour mentions légales site via `AURELIS_CONFIG.company`.  
7. Activer secret ingest sur les deux Vercel.  
8. Documenter backup Supabase (rétention + restore test).

### P2 — Croissance & Ads (sans lancer)
9. Créer propriété GA4 + coller Measurement ID.  
10. Préparer compte Google Ads (sans campagne live).  
11. Brancher e-mail transactionnel (confirmation demande).  
12. Lighthouse mobile + corrections perf si besoin.

### P3 — Confort commercial
13. Sync calendrier RDV (optionnel).  
14. Mollie / PSP en **mode test** seulement, puis live post-TVA.  
15. Facturation Peppol / export comptable.  
16. E2E Playwright du tunnel.

---

## 10. Références techniques

| Composant | Emplacement |
|-----------|-------------|
| Site | `C:\Users\32495\OneDrive\Documents\Fichiers Outlook\aurelis` |
| AI | `C:\aurelis-ai` |
| Prod site | https://aurelis.ink |
| Prod AI | https://aurelis-ai-kohl.vercel.app |
| Proxy leads | `aurelis/api/leads.js` |
| Ingest | `aurelis-ai/src/app/api/inbound/website-offer/route.ts` |
| Profil société | `aurelis-ai/src/lib/sales/company-profile.ts` |
| Config publique site | `aurelis/assets/config.js` |

---

## 11. Engagement pré-lancement

- Aucune publicité payante lancée.  
- Aucun devis définitif envoyé automatiquement.  
- Aucun paiement réel activé.  
- Aucun numéro d’entreprise inventé.  
- Données de test à marquer `isTest` / e-mails `@example.com` uniquement.

**Objectif atteint si P0+P1 sont clos :** ouverture officielle d’Aurelis et activation des services commerciaux **sans reconstruire** le système.
