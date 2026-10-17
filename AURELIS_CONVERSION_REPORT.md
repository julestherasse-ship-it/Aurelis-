# Aurelis — Conversion Master Report

**Date :** 17 octobre 2026  
**Périmètre :** `aurelis.ink` (repo Aurelis-)  
**Règles :** pas de dark patterns · pas de faux avis · paiements live non activés · FR prioritaire + EN aligné

---

## 1. Problèmes identifiés (audit)

| Problème | Impact conversion | Correction |
|----------|-------------------|------------|
| Hero trop poétique / message « sites internet » moins explicite | Compréhension 5s incomplète | Nouveau hero : activité + bénéfice + prix + CTA |
| Offres centrées features techniques | Faible désir d’achat B2B | Positionnement + bénéfice client par offre |
| Portfolio = galerie, pas preuve commerciale | Confiance insuffisante | Titre « Imaginez… » + CTA « Je veux un site de cette qualité » |
| Choix parmi 4 offres sans guide | Hésitation / abandon | Assistant déterministe + « Aidez-moi à choisir » |
| Formulaire long dès l’ouverture | Friction lead | Champs essentiels visibles ; pays/budget/délai en option avec défauts |
| FAQ commercial incomplète | Objections non traitées | FAQ élargie (paiement, propriété, mobile, corrections, international) |
| CTA mobile peu accessible | Abandon mobile | Barre sticky discrète « Créer mon site » |
| Messages bénéfices absents | Valeur perçue faible | Section problème → solution → action |

Références CRO utilisées (principes, non copie) : clarté offre/prix, preuve par livrables, formulaire court + attente post-submit, comparaison lisible, pas de fausse rareté (Demand Designer / Hallam / bonnes pratiques B2B services).

---

## 2. Modifications effectuées

- `index.html` — hero, bénéfices, folio, offres, assistant, FAQ, sticky mobile, assets
- `en/index.html` (+ `scripts/generate-en-home.mjs`) — miroir EN
- `assets/offers-catalog.js` — positionnement / audience / bénéfice FR+EN
- `assets/offer-assistant.js` — questionnaire déterministe
- `assets/conversion.css` — styles conversion (noir/or)
- `assets/lead-funnel.js` — tunnel simplifié + confirmation honnête
- `scripts/build.mjs` — contrôles build mis à jour
- `scripts/smoke-offer-assistant.mjs` — smoke recommandation

---

## 3. Améliorations commerciales

1. **Clarté 5 secondes** : Aurelis crée des sites · premium · dès 990 € HTVA · CTA unique  
2. **Valeur perçue** : bénéfices entreprise, pas jargon  
3. **Preuve** : réalisations réelles Mr Gaston / Bryan Burger / Trans Delivery  
4. **Décision** : 4 cartes + 1 comparateur + assistant  
5. **Risque réduit** : FAQ + devis humain + acompte 50/50 transparent  
6. **Friction** : formulaire allégé, pas de compte obligatoire  

---

## 4. Résultats des tests

| Test | Résultat |
|------|----------|
| `npm run build` / `node scripts/build.mjs` | OK |
| Smoke assistant Essential / Signature / Elite | OK (`scripts/smoke-offer-assistant.mjs`) |
| Tests utilisateurs réels | **Non réalisés** (pas de panel utilisateur) |
| Scénarios restaurateur / PME / premium | Parcours code prêts — observations = simulations logiques, pas d’études terrain |
| Paiement Stripe réel | Non testé / volontairement désactivé |

---

## 5. À configurer encore (humain)

- GA4 / Google Ads IDs dans `assets/config.js` + consentement mesure
- Migration / ingest Supabase si quota encore saturé
- Stripe live + `AURELIS_LIVE_ENABLED` (voir `STRIPE_ACTIVATION.md`)
- Validation juridique FAQ / CGV

---

## 6. Hypothèses A/B post-lancement (sans gagnant déclaré)

1. Hero CTA « Créer mon site » vs ouverture formulaire immédiat  
2. Assistant avant vs après les offres  
3. Sticky mobile on/off  
4. Badge Prestige « Notre sélection premium » vs neutre  

Mesurer : clics CTA, démarrages formulaire, leads réussis, répartition par offre.

---

## 7. Fonctionnalités réellement opérationnelles

| Élément | État |
|---------|------|
| Hero CRO FR/EN | Code prêt |
| Offres + catalogue central | Code prêt |
| Assistant de choix | Code prêt (déterministe) |
| Formulaire lead simplifié | Code prêt (dépend API/DB) |
| FAQ commerciale | Code prêt |
| Sticky mobile | Code prêt |
| Analytics events (dataLayer) | Prêt ; GA4/Ads si IDs + consent |
| Paiements live | **Non activés** |
| Aurelis AI chat commercial embarqué | Non ajouté (évite double IA) ; formulaire autonome |

---

## Événements analytics préparés

`offer_click`, `cta_click`, `generate_lead_start`, `generate_lead`, `offer_assistant_start`, `offer_assistant_answer`, `offer_assistant_recommend`, `qualified_lead` (si API), `book_appointment`.

Aucun événement publicitaire forcé sans consentement.
