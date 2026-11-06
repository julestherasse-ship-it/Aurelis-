/**
 * Publier Aurelis 3.0 uniquement dans l'artefact de build Vercel.
 *
 * Le dépôt conserve l'accueil historique comme source pour les contrôles,
 * le SEO et la page /site-classique/. Aucune API, clé ni DNS n'est modifié.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const temp = mkdtempSync(join(tmpdir(), "aurelis3-published-"));
try {
  execFileSync(process.execPath, [join(root, "scripts", "build-release-candidate.mjs"), temp], {
    cwd: root,
    stdio: "inherit",
  });
  let html = readFileSync(join(temp, "index.html"), "utf8");
  html = html.replace('href="./landing.css"', 'href="/assets/aurelis-3/landing.css"');
  html = html.replace('src="./landing.js"', 'src="/assets/aurelis-3/landing.js"');

  // Un site public doit être indexable, garder les anciens tunnels et les
  // entrées de conversion, sans afficher de bandeau de prévisualisation.
  const checks = [
    ['SEO', html.includes('rel="canonical" href="https://aurelis.ink/"')],
    ['indexable', html.includes('name="robots" content="index, follow"')],
    ['site V3', html.includes('id="aurelis-preview-root"')],
    ['formulaire projet', html.includes('/api/leads')],
    ['mesure consentie', html.includes('/assets/analytics.js') && html.includes('/assets/consent.js')],
    ['CSS version 3', html.includes('/assets/aurelis-3/landing.css')],
    ['JS version 3', html.includes('/assets/aurelis-3/landing.js')],
    ['ancien site conservé', readFileSync(join(root, "site-classique/index.html"), "utf8").includes('aurelis')],
  ];
  const missing = checks.filter(([, ok]) => !ok).map(([label]) => label);
  if (missing.length) throw new Error("Publication bloquée : " + missing.join(", "));

  const assets = join(root, "assets", "aurelis-3");
  mkdirSync(assets, { recursive: true });
  copyFileSync(join(temp, "landing.js"), join(assets, "landing.js"));
  copyFileSync(join(temp, "landing.css"), join(assets, "landing.css"));
  writeFileSync(join(root, "index.html"), html, "utf8");
  console.log("Aurelis 3.0 : accueil public construit, /site-classique/ et /creation-site-internet/ conservés.");
} finally {
  rmSync(temp, { recursive: true, force: true });
}
