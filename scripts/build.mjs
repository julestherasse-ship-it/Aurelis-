import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function run(script) {
  const result = spawnSync(process.execPath, [join(root, 'scripts', script)], {
    stdio: 'inherit',
    cwd: root,
  });
  if (result.status !== 0) process.exit(result.status || 1);
}

run('generate-pages.mjs');
run('generate-en-home.mjs');

const htmlPath = join(root, 'index.html');
const offresPath = join(root, 'offres', 'index.html');
const enHome = join(root, 'en', 'index.html');
const enOffers = join(root, 'en', 'offers', 'index.html');

const requiredFiles = [
  htmlPath,
  offresPath,
  enHome,
  enOffers,
  join(root, 'api', 'leads.js'),
  join(root, 'assets', 'locale.js'),
  join(root, 'assets', 'consent.js'),
  join(root, 'assets', 'analytics.js'),
  join(root, 'assets', 'lead-funnel.js'),
  join(root, 'sitemap.xml'),
  join(root, 'robots.txt'),
  join(root, 'creation-site-web-entreprise', 'index.html'),
  join(root, 'refonte-site-web', 'index.html'),
  join(root, 'creation-site-premium', 'index.html'),
  join(root, 'en', 'business-website', 'index.html'),
  join(root, 'en', 'website-redesign', 'index.html'),
  join(root, 'en', 'premium-website', 'index.html'),
  join(root, 'mentions-legales', 'index.html'),
  join(root, 'politique-confidentialite', 'index.html'),
];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    console.error('Build failed: missing', file);
    process.exit(1);
  }
}

const html = readFileSync(htmlPath, 'utf8');
const offres = readFileSync(offresPath, 'utf8');
const en = readFileSync(enHome, 'utf8');

const requiredHome = [
  "id: 'restaurant'",
  "id: 'fastfood'",
  "id: 'coiffure'",
  "id: 'beaute'",
  "id: 'transport'",
  'Bryan Burger',
  'Trans Delivery',
  'id="offres"',
  'Aurelis Essential',
  'hreflang="en"',
  '/assets/locale.js',
  '/assets/consent.js',
  '/assets/analytics.js',
  'data-lead-open',
  'id="confiance"',
];

const requiredOffres = [
  'Aurelis Essential',
  'Démarrer mon projet',
  'hreflang="en"',
  '/assets/lead-funnel.js',
];

const requiredEn = [
  'lang="en"',
  'hreflang="fr"',
  'Start my project',
  'Bryan Burger',
  '/assets/consent.js',
];

const forbidden = [
  "id: 'dentaire'",
  'Marc Lefèvre',
  'Sophie Bernard',
  'Pierre Dubois',
  '98% Clients satisfaits',
  '50+ Sites livrés',
  'Maison Rivage',
  'Le Jardin Secret',
  'Maison Élégance',
  'Client réel',
];

const priceTokensFr = ['990 €', '2 490 €', '4 490 €', '7 490 €'];
const priceTokensEn = ['€990', '€2,490', '€4,490', '€7,490'];
// Catalogue complet : home + offres (+ funnel). Les landings peuvent n’afficher qu’un sous-ensemble.
const catalogFr = [html, offres, readFileSync(join(root, 'assets', 'lead-funnel.js'), 'utf8')];
const catalogEn = [en, readFileSync(enOffers, 'utf8'), readFileSync(join(root, 'assets', 'lead-funnel.js'), 'utf8')];

const missingPricesFr = priceTokensFr.filter((token) => catalogFr.some((page) => !page.includes(token)));
const missingPricesEn = priceTokensEn.filter((token) => catalogEn.some((page) => !page.includes(token)));

const missingHome = requiredHome.filter((token) => !html.includes(token));
const missingOffres = requiredOffres.filter((token) => !offres.includes(token));
const missingEn = requiredEn.filter((token) => !en.includes(token));
const presentForbidden = forbidden.filter((token) => html.includes(token) || offres.includes(token) || en.includes(token));

if (
  missingHome.length ||
  missingOffres.length ||
  missingEn.length ||
  presentForbidden.length ||
  missingPricesFr.length ||
  missingPricesEn.length
) {
  if (missingHome.length) console.error('Build failed — homepage:', missingHome.join(', '));
  if (missingOffres.length) console.error('Build failed — /offres:', missingOffres.join(', '));
  if (missingEn.length) console.error('Build failed — /en:', missingEn.join(', '));
  if (presentForbidden.length) console.error('Build failed — contenu non vérifié:', presentForbidden.join(', '));
  if (missingPricesFr.length) console.error('Build failed — prix FR manquants:', missingPricesFr.join(', '));
  if (missingPricesEn.length) console.error('Build failed — prix EN manquants:', missingPricesEn.join(', '));
  process.exit(1);
}

console.log('Aurelis build OK');
console.log('Locales: FR + EN');
console.log('Landings: business / redesign / premium');
console.log('SEO: sitemap.xml · robots.txt · hreflang · consent-ready analytics');
