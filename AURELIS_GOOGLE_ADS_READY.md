# Aurelis — Rapport de lancement Google Ads Ready

**Date :** 20 octobre 2026  
**Restore Git :** `restore/pre-google-ads-ready-20261020-1907`  
**Branche :** `main`  
**Site :** https://aurelis.ink/  
**Landing Ads :** https://aurelis.ink/creation-site-internet/  

---

## VERT — Opérationnel

- Identité **noir & or**, hero FR commercial clair (titre + sous-titre + dès 990 € HTVA + CTAs).
- Quatre offres cohérentes : Essential 990 · Signature 2 490 · Prestige 4 490 · Elite dès 7 490 € HTVA.
- Comparateur unique + limites / démarrage par offre + frais additionnels explicites.
- Portfolio réel : **Mr Gaston**, **Bryan Burger**, Trans Delivery (captures locales).
- Tunnel formulaire → `/api/leads` → Aurelis AI (secret ingest **configuré** sur Vercel aurelis + aurelis-ai).
- Confirmation UI **uniquement** si enregistrement réel (honeypot / nil UUID rejetés).
- Consentement cookies + **Consent Mode v2** (denied par défaut).
- Analytics prêt : `generate_lead` = conversion primaire (pas les clics CTA).
- Landing Search Ads `/creation-site-internet/` (conversion-focused).
- Brouillon campagne Search BE-FR : `GOOGLE_ADS_CAMPAIGN_DRAFT.md` (**non activé**).
- Mentions légales : placeholders BCE/TVA (aucun numéro inventé).
- Stripe : documentation activation (`STRIPE_ACTIVATION.md`) — mode test / flags off.
- Build production `npm run build` : OK.
- Point de restauration Git créé.

---

## ORANGE — Nécessite configuration humaine

| Élément | Action |
|---------|--------|
| GA4 Measurement ID | Créer propriété → coller dans `assets/config.js` → `ga4MeasurementId` |
| Google Ads ID + label conversion | Compte Ads BE → `googleAdsId` / `googleAdsConversionLabel` |
| `flags.adsLive` | Passer à `true` **seulement** après go-live Ads |
| E-mail pro Aurelis | Créer / vérifier DNS → `emailProfessional` ; garder Gmail tant que non vérifié |
| BCE + TVA + siège | Après Securex → `config.js` + Aurelis AI Paramètres + mentions |
| Stripe live | Compte vérifié BE + webhooks + `AURELIS_LIVE_ENABLED` (voir STRIPE_ACTIVATION.md) |
| Keyword Planner | Affiner volumes CPC une fois le compte Ads lié à la facturation |
| Extension FR (pays) | Après validation campagne Belgique |

---

## ROUGE — Bloque ou limite le lancement

| Problème | Impact | Mitigation |
|----------|--------|------------|
| Paiements réels non activés | Pas d’acompte en ligne | **Intentionnel** jusqu’à Stripe live + devis validé |
| Google Ads non diffusé | Pas de trafic payant | **Intentionnel** — draft only |
| Mentions sans BCE/TVA | Conformité facturation incomplete | Remplir après Securex |

---

## Ce qui a été amélioré (cette passe)

1. Accueil FR : copy exacte + parcours clarifié (réalisations → bénéfices → offres → audit → assistant).
2. Offres enrichies (limites, comment démarrer, frais).
3. Landing Ads dédiée `/creation-site-internet/`.
4. Consent Mode v2 + conversion lead strictement post-enregistrement.
5. Secrets Vercel `AURELIS_AI_URL` + `AURELIS_WEBSITE_INGEST_SECRET` (aurelis + aurelis-ai).
6. Docs campagne + checklist.
7. Commit `eadbece` + deploy prod aurelis.ink + aurelis-ai.

---

## Checklist mise en production (humaine)

1. [ ] Securex → BCE + TVA obtenus  
2. [ ] Remplir `config.js` company.* + Aurelis AI Paramètres  
3. [x] Redéployer aurelis.ink + aurelis-ai  
4. [x] Tester leads fictifs → `accepted:true` + opportunityId (4 offres)  
5. [ ] Créer GA4 + Ads → IDs dans config → redéployer  
6. [ ] Tag Assistant : consent refuse → pas de tags pubs ; accept → OK  
7. [ ] Conversion Ads = `generate_lead` uniquement  
8. [ ] Activer campagne Search BE-FR avec plafond budget  
9. [ ] Stripe : rester en test jusqu’à devis + compte vérifié  
10. [ ] Vérifier les 4 leads fictifs dans le dashboard Sales (nettoyage si besoin)

---

## Tests effectués (données fictives) — post-deploy

| Test | Résultat |
|------|----------|
| Build production | PASS |
| https://aurelis.ink/ hero + 990 € | PASS (200) |
| https://aurelis.ink/creation-site-internet/ | PASS (200) |
| https://aurelis.ink/en/ | PASS (200) |
| E-mail invalide | 400 |
| Honeypot | `accepted:false` + nil id |
| Essential / Signature / Prestige / Elite | **PASS** `accepted:true` + `opportunityId` |
| Campagne Ads lancée | Non (volontaire) |
| Paiement réel | Non (volontaire) |
