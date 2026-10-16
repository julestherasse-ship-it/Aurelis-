# Stripe — activation Aurelis (lundi)

**Aucun paiement réel tant que `AURELIS_LIVE_ENABLED=false` ou `STRIPE_MODE≠live`.**

## 1. Récupérer les clés Stripe

1. Ouvrir [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Finaliser la vérification d’identité / entreprise (Belgique)
3. **Mode test** : Developers → API keys → `pk_test_…` + `sk_test_…`
4. **Mode live** (après validation compte) : bascule « Viewing test data » OFF → `pk_live_…` + `sk_live_…`
5. Developers → Webhooks → Add endpoint → secret `whsec_…`

## 2. Variables Vercel (projet Aurelis AI)

Projet Vercel de **aurelis-ai** (pas aurelis.ink) :

| Variable | Exemple | Notes |
|----------|---------|--------|
| `STRIPE_MODE` | `test` puis `live` | `off` = prélancement |
| `STRIPE_SECRET_KEY` | `sk_test_…` / `sk_live_…` | **Server only** |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_…` / `pk_live_…` | Public OK |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` | Endpoint production |
| `AURELIS_LIVE_ENABLED` | `false` → `true` | Dernière étape |

Ne jamais committer ces valeurs dans Git.

## 3. Webhook production

- URL : `https://<votre-domaine-aurelis-ai>/api/payments/webhook`
- Événements minimum :
  - `checkout.session.completed`
  - `checkout.session.async_payment_succeeded`
  - `checkout.session.async_payment_failed`
  - `payment_intent.payment_failed`
  - `charge.refunded`
- Copier le **Signing secret** → `STRIPE_WEBHOOK_SECRET`

## 4. Vérification du compte Stripe

Checklist Dashboard :

- [ ] Entreprise / représentant vérifiés
- [ ] Compte bancaire de versement ajouté
- [ ] Pays = Belgique (ou correct)
- [ ] « Charges enabled » / paiements carte actifs
- [ ] Pas de blocage « Restricted »

## 5. Contrôle avant paiements réels

1. `STRIPE_MODE=test` + clés test → créer un devis ACCEPTED TEST → bouton « Encaisser acompte »
2. Carte test `4242…` → vérifier webhook + page `/payments`
3. Double envoi webhook → pas de double crédit (idempotence)
4. Remplir Paramètres → Entreprise (BCE, TVA, adresse)
5. Appliquer migration `019_commercial_payments.sql` sur Supabase
6. Seulement alors : `STRIPE_MODE=live` + clés live + webhook live + `AURELIS_LIVE_ENABLED=true`

## 6. Règles de sécurité

- Les montants viennent **uniquement** du devis serveur
- `/pay/success` **ne confirme pas** le paiement
- Clé live refusée si `STRIPE_MODE=test` (et inversement)
- `AURELIS_LIVE_ENABLED=true` seul **ne suffit pas**
