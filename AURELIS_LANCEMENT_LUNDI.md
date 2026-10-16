# Aurelis — Guide lundi 19 octobre 2026

Document simple. Faire dans l’ordre. Ne pas activer les paiements live avant la checklist E.

---

## A. INFORMATIONS SECUREX (Mons)

Après ouverture, récupérer et noter :

1. Nom légal exact de la société  
2. Nom commercial (si différent)  
3. Numéro d’entreprise (BCE)  
4. Numéro de TVA (BE0…)  
5. Adresse du siège  
6. E-mail et téléphone professionnels  
7. Régime TVA applicable (confirmation comptable)  
8. IBAN professionnel (utile Stripe + facturation)

**Ne rien inventer sur le site tant que ces infos ne sont pas officielles.**

---

## B. CONFIGURATION AURELIS

### Site public `aurelis.ink` (Vercel projet **aurelis**)

- Optionnel : mettre à jour `assets/config.js` (coordonnées affichées) après immatriculation  
- Vérifier `AURELIS_AI_URL` + `AURELIS_WEBSITE_INGEST_SECRET` (même secret que côté AI)

### Aurelis AI (Vercel projet **aurelis-ai**)

1. Ouvrir **Paramètres → Entreprise**  
2. Renseigner :
   - Nom légal / commercial  
   - Adresse, CP, ville, pays  
   - E-mail, téléphone  
   - Numéro d’entreprise  
   - Numéro TVA  
   - IBAN (optionnel)  
   - Conditions de paiement (ex. 50 % / 50 %)  
3. Variables Vercel utiles :
   - `AURELIS_REQUIRE_BELGIAN_COMPANY_IDS=1`  
   - `BUSINESS_*` (optionnel, miroir env)  
   - `AURELIS_ALLOWED_EMAILS` = votre e-mail  
4. Supabase SQL : exécuter `supabase/migrations/019_commercial_payments.sql` si pas déjà fait

---

## C. CONFIGURATION STRIPE

Suivre **`STRIPE_ACTIVATION.md`** dans ce dépôt.

Ordre recommandé :

1. Compte Stripe vérifié  
2. Clés **test** + webhook test  
3. Un paiement test Signature réussi  
4. Clés **live** + webhook live  
5. `STRIPE_MODE=live`  
6. **En dernier** : `AURELIS_LIVE_ENABLED=true`

---

## D. FACTURATION (Peppol)

1. Choisir un access point Peppol belge avec votre comptable  
2. Configurer après immatriculation  
3. Tester une facture B2B de test  
4. Documenter le prestataire (`PEPPOL_PROVIDER`)  
5. **Tant que non vérifié : ne pas écrire « facturation Peppol opérationnelle »**

Les devis Aurelis AI préparent les données ; le connecteur Peppol reste à brancher.

---

## E. TEST FINAL (checklist)

- [ ] https://aurelis.ink accessible (FR + EN)  
- [ ] 4 offres visibles (990 / 2490 / 4490 / dès 7490)  
- [ ] Formulaire « Créer mon site » → prospect dans `/leads`  
- [ ] Devis DRAFT créé (ou lead seul si Sales partiel)  
- [ ] `/payments` accessible (auth) — pas public  
- [ ] Stripe test : checkout acompte → webhook → statut commande  
- [ ] Double webhook : pas de double paiement  
- [ ] E-mails : si Resend configuré, confirmation reçue ; sinon documenter l’absence  
- [ ] Mentions légales / CGV présentes avec mention « à valider juridiquement »  
- [ ] `AURELIS_LIVE_ENABLED` encore `false` jusqu’à validation complète  
- [ ] Aucun blocage administratif Securex / Stripe / banque

---

## F. ACTIVATION COMMERCIALE

Mécanisme de sécurité :

```
AURELIS_LIVE_ENABLED=false   # défaut
STRIPE_MODE=off|test|live
```

Pour ouvrir les paiements réels :

1. Checklist E cochée  
2. Profil entreprise complet + BCE/TVA  
3. Stripe live « charges enabled »  
4. Webhook live OK  
5. Peppol au moins planifié / comptable OK pour B2B  
6. Passer `STRIPE_MODE=live`  
7. Passer `AURELIS_LIVE_ENABLED=true`  
8. Redéployer Aurelis AI  
9. Faire **un** petit test live contrôlé (ou premier client réel conscient)

**Un numéro TVA renseigné ne doit jamais activer les paiements tout seul.**
