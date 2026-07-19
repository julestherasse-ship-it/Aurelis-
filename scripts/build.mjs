import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = join(root, 'index.html');

if (!existsSync(htmlPath)) {
  console.error('Build failed: index.html introuvable.');
  process.exit(1);
}

const html = readFileSync(htmlPath, 'utf8');
const required = [
  "id: 'restaurant'",
  "id: 'fastfood'",
  "id: 'coiffure'",
  "id: 'beaute'",
  "id: 'transport'",
  'Bryan Burger',
  'Trans Delivery',
];
const forbidden = ["id: 'dentaire'", "id: 'commerce'", "id: 'autres'", "id: 'artisan'"];

const missing = required.filter((token) => !html.includes(token));
const presentForbidden = forbidden.filter((token) => html.includes(token));

if (missing.length || presentForbidden.length) {
  if (missing.length) console.error('Build failed — manquant:', missing.join(', '));
  if (presentForbidden.length) console.error('Build failed — catégories interdites:', presentForbidden.join(', '));
  process.exit(1);
}

if (!html.includes('<!DOCTYPE html>') || !html.includes('initSectorRoulette')) {
  console.error('Build failed: structure HTML invalide.');
  process.exit(1);
}

console.log('Aurelis static build OK');
console.log('Categories: Restaurants · Fast-food · Salons de coiffure · Instituts de beauté · Transport');
console.log('Projects: Bryan Burger · Trans Delivery');
