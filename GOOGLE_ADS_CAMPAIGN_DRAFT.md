# Aurelis — Brouillon campagne Google Search (NE PAS ACTIVER)

**Statut :** DRAFT ONLY — aucune diffusion, aucun budget engagé.  
**Marché initial :** Belgique francophone (Wallonie + Bruxelles FR).  
**Extension ultérieure :** France (après validation des résultats BE).  
**Landing page :** https://aurelis.ink/creation-site-internet/  
**Conversion primaire :** `generate_lead` = demande de projet **réellement enregistrée** (pas un clic CTA).

---

## 1. Structure campagne

| Champ | Valeur proposée |
|-------|-----------------|
| Type | Search — Réseau de Recherche uniquement |
| Nom | `BE-FR \| Search \| Creation site internet \| V1` |
| Objectif | Leads / Conversions |
| Budget journalier | À définir par Jules (ex. 15–25 €/jour) — **ne pas activer** |
| Enchères | Maximiser les conversions (après 30+ conversions) sinon CPC manuel prudent |
| Langue | Français |
| Localisation | Belgique — ciblage présence ou intérêt : Wallonie + Bruxelles |
| Exclusions géo | France (phase 1), monde hors BE |

---

## 2. Groupes d’annonces & mots-clés (exact / phrase)

### GA1 — Création site internet
- `[création site internet]`
- `"création site internet"`
- `[création de site internet]`
- `"création de site internet professionnel"`
- `[création site web professionnel]`
- `"création site vitrine"`
- `[création site internet entreprise]`

### GA2 — Agence web
- `[agence web]`
- `"agence web belgique"`
- `[agence création site internet]`
- `"agence web mons"`

### GA3 — Refonte
- `[refonte site internet]`
- `"refonte site web"`
- `[refaire mon site internet]`

> Vérifier volumes / CPC dans Keyword Planner une fois le compte Ads lié à un compte facturation belge.

---

## 3. Mots-clés négatifs (campagne)

```
emploi
stage
formation
cours
tutoriel
gratuit
télécharger
free
template
wordpress gratuit
wix
canva
job
offre d'emploi
salaire
```

---

## 4. Annonces RSA — variantes (FR)

Respecter limites Google (titres ~30 car., descriptions ~90 car.).

### Titres (mix)
1. Création de sites internet  
2. Site pro dès 990 € HTVA  
3. Agence web Aurelis — Mons  
4. Sites premium pour entreprises  
5. Demandez votre devis  
6. Réalisations consultables  
7. Mr Gaston & Bryan Burger  
8. Design noir & or premium  
9. Offres claires et transparentes  
10. Création site vitrine pro  
11. Belgique francophone  
12. Devis après échange humain  

### Descriptions
1. Sites internet professionnels dès 990 € HTVA. Design soigné, parcours mobile, devis humain.  
2. Découvrez nos réalisations (Mr Gaston, Bryan Burger) et démarrez votre projet en ligne.  
3. Essential, Signature, Prestige, Elite — choisissez l’offre adaptée à votre entreprise.  
4. Pas de paiement avant devis validé. Hébergement et domaines facturés séparément.  

### URL finale
`https://aurelis.ink/creation-site-internet/`

### Chemins d’affichage
`aurelis.ink` / `Création` / `Site internet`

---

## 5. Suivi conversions (à configurer — pas encore branché)

| Élément | Valeur |
|---------|--------|
| GA4 Measurement ID | *(à coller dans `assets/config.js` → ga4MeasurementId)* |
| Google Ads ID | *(AW-… dans googleAdsId)* |
| Label conversion | *(googleAdsConversionLabel)* |
| Événement site | `generate_lead` uniquement si lead enregistré |
| Ne pas convertir | `cta_click`, `offer_click`, simples vues de page |

Consent Mode v2 : `ad_storage` / `analytics_storage` = denied par défaut ; update après bannière.

---

## 6. Checklist avant activation (humaine)

- [ ] Compte Google Ads créé + facturation BE  
- [ ] GA4 propriété créée + ID dans config  
- [ ] Conversion `generate_lead` importée Ads ← GA4  
- [ ] Tag Ads / Consent Mode testés en Tag Assistant  
- [ ] Landing `/creation-site-internet/` live et formulaire OK  
- [ ] BCE / TVA renseignés (mentions & devis)  
- [ ] Budget plafonné + alerte dépense  
- [ ] **Décision explicite de Jules** pour passer `adsLive: true`

---

## 7. Interdits

- Ne pas activer la diffusion depuis ce document  
- Ne pas inventer de témoignages / stats dans les annonces  
- Ne pas envoyer de PII (e-mail, téléphone) dans les URLs GCLID / events  
