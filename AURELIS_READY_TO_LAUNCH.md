# Aurelis — Ready to Launch (16 octobre 2026)

Ouverture cible : **lundi 19 octobre 2026**.  
Ce rapport est factuel. Rien n’est marqué VERT s’il dépend encore d’un compte externe non branché.

---

## VERT — OPÉRATIONNEL (code prêt / testable sans activation live)

| Élément | Réalisé | Testé | Fonctionne | Reste | Humain ? |
|---------|---------|-------|------------|-------|----------|
| Site aurelis.ink identité noir/or + FR/EN | Oui (repo Aurelis-) | Build + prod visuelle antérieure | Oui en prod | Aligner or exact `#D4AF37` si pas encore poussé | Non |
| 4 offres catalogue centralisées AI | `src/lib/commercial/offers.ts` | tests unitaires | Oui côté code | Rester aligné avec `assets/offers-catalog.js` public | Non |
| Tunnel lead → `/api/inbound/website-offer` | Oui | E2E historiques | Code OK | **Supabase egress** peut bloquer la prod | Oui si quota |
| Pipeline Sales + devis DRAFT | Oui | sales tests / e2e | Oui si DB OK | Envoi devis manuel | Non |
| Live gate `AURELIS_LIVE_ENABLED` | Oui | tests commercial | Bloque live par défaut | Config lundi | Oui |
| Stripe Checkout + webhooks (code) | Oui (`src/lib/payments/*`) | unitaires gate ; **pas de paiement Stripe réel sans clés test** | Code prêt | Clés + migration 019 | Oui |
| Dashboard `/payments` + `/orders` | Oui | typecheck à valider | UI auth | Données après 1er paiement | Non |
| Pages `/pay/success` & `/cancel` (non confirmatoires) | Oui | — | Oui | — | Non |
| Docs `STRIPE_ACTIVATION.md` + `AURELIS_LANCEMENT_LUNDI.md` | Oui | — | — | Suivre lundi | Oui |

---

## ORANGE — PRÊT À CONFIGURER (développé, activation externe)

| Élément | Réalisé | Testé | Fonctionne | Reste | Humain ? | Coût typique |
|---------|---------|-------|------------|-------|----------|--------------|
| Stripe test / live | Intégration complète | Non sans vos clés | Non jusqu’à clés | Dashboard Stripe + Vercel env | **Oui** | ~1,4 % + 0,25 € / carte UE (Stripe) |
| Webhook Stripe prod | Route + idempotence | Non sans endpoint | Non | Créer endpoint | **Oui** | Inclus Stripe |
| E-mails transactionnels (Resend) | Templates + envoi conditionnel | Non sans API key | Silent no-op si absent | `RESEND_API_KEY` + from | **Oui** | Resend free puis ~$0+/mois |
| Profil légal BCE/TVA | Formulaire + gate devis | — | Champs vides | Securex lundi | **Oui** | Securex / notaire (hors tech) |
| Ingest secret site → AI | Code | — | Selon Vercel | Aligner secrets | **Oui** | — |
| Migration `019_commercial_payments.sql` | Fichier prêt | Non appliquée ici | Tables absentes tant que SQL non joué | SQL Editor Supabase | **Oui** | Inclus Supabase |
| GA4 / Google Ads tags | Préparé côté site (consent) | Pas d’ads lancées | Tracking non activé | Consent + IDs | **Oui** | Ads budget séparé |
| Aurelis AI / Jarvis commercial | Ingest + brief + DRAFT | Partiel | Dépend runtime AI | Ne valide pas devis/paiements | Non pour garde-fous |

---

## ROUGE — BLOQUANT / INCOMPLET pour « vendre et encaisser » lundi matin

| Élément | État | Action |
|---------|------|--------|
| Paiements réels | **Désactivés** (`AURELIS_LIVE_ENABLED=false`, `STRIPE_MODE=off` recommandé) | Activation volontaire après checklist |
| Facturation Peppol B2B | **Non opérationnelle** (connecteur documenté seulement) | Prestataire + comptable |
| Validation juridique CGV / mentions | Brouillons / pages existantes **non validées avocat** | Revue juridique BE |
| TVA internationale auto | **Pas d’auto-application multi-pays** | Validation comptable avant ventes hors BE |
| Persistance leads en prod | Historiquement bloquée (quota Supabase) | Vérifier quota / plan Supabase **avant** lundi |
| Clés Stripe dans cet environnement agent | **Absentes** (volontaire) | Aucun faux « test Stripe réussi » |

---

## Coûts mensuels récurrents estimés (hors ads)

| Service | Usage | Ordre de grandeur |
|---------|-------|-------------------|
| Vercel (aurelis + aurelis-ai) | Hébergement | Plan actuel / Pro si besoin |
| Supabase | CRM / auth / DB | Free → Pro si egress |
| Stripe | Paiements | % + fixe par transaction |
| Resend (ou équivalent) | E-mails transactionnels | Free tier possible |
| Domaine aurelis.ink | DNS | ~10–20 €/an |
| Peppol access point | Factures B2B | Selon prestataire (souvent inclus logiciel compta) |
| Google Ads | **Ne pas lancer** tant que consent + tracking OK | Budget pub séparé |

---

## Actions précises pour lundi (après Securex)

1. Noter BCE, TVA, adresse, IBAN  
2. Remplir Paramètres → Entreprise (Aurelis AI)  
3. Appliquer migration 019 sur Supabase  
4. Vérifier quota Supabase + ingest secret  
5. Configurer Stripe test → 1 paiement Signature fictif  
6. Brancher Resend (optionnel mais recommandé)  
7. Planifier Peppol avec comptable  
8. Revue avocat pages légales  
9. Seulement alors : Stripe live + `AURELIS_LIVE_ENABLED=true`  
10. Premier devis client réel → acceptation → acompte

---

## Verdict

**Le développement commercial critique (catalogue, tunnel, devis, Stripe code, live gate, dashboards, docs) est en place sur la branche `feature/commercial-launch-oct2026`.**

**Aurelis n’est PAS « live pour encaisser » tant que Stripe, Supabase, profil légal et `AURELIS_LIVE_ENABLED` ne sont pas activés par vous.**  
Lundi doit être principalement **configuration et activations**, pas une réécriture du système — à condition d’appliquer la migration 019 et de lever le blocage Supabase si toujours présent.
