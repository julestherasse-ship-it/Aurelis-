# Aurelis 3.0 — intégration de prévisualisation

Cette branche part de `main` du dépôt public `julestherasse-ship-it/Aurelis-`, au commit `9d81506b37ad79342eb7a8f4db0fb3f799963bf4`. Elle **ne remplace pas la page d'accueil officielle** : le build conserve `/` et génère la nouvelle vitrine sur `/preview-3/` avec `noindex, nofollow` et un avertissement de prévisualisation. `/site-classique/` reproduit l'accueil actuel en `noindex` afin de garder accessibles l'assistant d'offres et la FAQ.

La vitrine est issue du composant et des styles Aurelis 3.0 de `aurelis-ai`, rendus statiquement puis hydratés côté navigateur avec React et GSAP. Le catalogue existant `assets/offers-catalog.js` reste la source des offres, prix et prestations. Les études créatives restent distinctes des trois réalisations réelles. Le formulaire de projet utilise `/api/leads` ; l'audit gratuit utilise le tunnel historique. Pages FR/EN, landing pages, API et backend Aurelis AI ne sont pas remplacés. La bannière de consentement et le suivi existant sont réutilisés.

## Sécurité et limites

- `/api/leads` refuse toute requête POST si `VERCEL_ENV` n'est pas `production`. Le contrôle s'exécute **côté serveur avant toute requête sortante**, même si une URL ou un secret de production sont disponibles en prévisualisation. Les variables système Vercel sont activées sur le projet officiel ; ne pas les désactiver.
- Les formulaires de prévisualisation indiquent que l'envoi est désactivé. Ils ne valident pas une réception réelle : les réponses positives et les erreurs du backend sont testées avec un faux service local/intercepté, sans écrire dans un CRM ou effectuer de paiement.
- Les tests ne démontrent pas le fonctionnement de bout en bout d'une réception réelle : pour cela, configurer et confirmer séparément une destination de staging isolée, puis tester sur celle-ci sans modifier la production. Aucun mode de paiement, DNS ou secret n'est modifié ici.
- Les versions originales non enregistrées dans `C:\Aurelis-public` et `C:\aurelis-ai` n'ont pas été fusionnées dans cette copie. Après examen, la gestion des corps déjà analysés par Vercel a été reprise de manière ciblée et testée ; les autres changements locaux sur `api/leads.js`, `analytics.js` et `lead-funnel.js` doivent être examinés séparément avant toute intégration future.

## Reproduire les contrôles locaux

1. `npm ci`
2. `npm test` — garde-fou d'API, contrat simulé et build officiel + prévisualisation.
3. `node scripts/serve-preview-test.cjs` — serveur local, qui force `VERCEL_ENV=preview`.
4. Dans un autre terminal : `npm run test:preview -- --output <nouveau-dossier-temporaire>` — Chrome système, sans utiliser le dossier `test-results` d'un autre projet.

## Avant toute promotion, après validation explicite

Cette branche n'est **pas** un déploiement de production prêt à promouvoir directement : sa racine est encore l'ancien site, et la page 3.0 est volontairement marquée `noindex`. Une fois la prévisualisation approuvée :

1. Vérifier à nouveau `main`, la production Vercel, les changements non enregistrés des autres travaux et la sauvegarde ; résoudre manuellement toute divergence sans reset ni force-push.
2. Dans une branche isolée, produire une nouvelle racine à partir de la même vitrine en supprimant uniquement l'avertissement et le `noindex` propres à la prévisualisation. Conserver et tester les balises SEO de l'accueil actuel (canonical, hreflang, Open Graph/Twitter et données structurées), ainsi que ses ancres et parcours historiques ; garder les pages de détail et le site classique nécessaires.
3. Adapter les vérifications du build historique qui exigent actuellement le contenu de l'ancien `index.html`, sans en retirer les garanties métier. Refaire les tests, l'audit SEO, l'accessibilité, les performances et un déploiement de prévisualisation du candidat exact. Vérifier le rendu et tous les formulaires avec une destination de staging isolée.
4. Après les contrôles et l'accord explicite, intégrer proprement à `main` du dépôt officiel, déployer sur le projet Vercel `aurelis` sans toucher aux variables, paiements ou DNS, puis contrôler le domaine HTTPS, les pages, la console et les journaux. Ne pas effectuer de vraie commande ni de paiement test réel.

## Retour arrière

Le point de restauration distant `backup/aurelis-ink-before-3-20261102-6e2fed52` pointe vers `9d81506b37ad79342eb7a8f4db0fb3f799963bf4`, ancien déploiement `dpl_3oBw47Utc35RVkc5yU13aMBfF2hg`. Pour une panne urgente après promotion, utiliser le rollback Vercel vers ce déploiement après vérification de sa disponibilité. Ensuite synchroniser Git avec un commit de revert approprié sur `main` (sans reset ni force-push) et revérifier les formulaires, les pages et le domaine. Une copie locale Git complète a aussi été vérifiée dans `C:\Users\32495\AppData\Local\Temp\opencode\aurelis-ink-restore-f8f23a650bbb\aurelis-ink-pre-3.bundle` ; ce répertoire temporaire peut être nettoyé par le système.
