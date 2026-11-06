import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "assets", "preview-3");
const preview = join(root, "preview-3");
const classic = join(root, "site-classique");
const cache = join(root, "node_modules", ".cache", "aurelis-preview");
for (const directory of [output, preview, classic, cache]) mkdirSync(directory, { recursive: true });

await build({ entryPoints: [join(root, "src-preview", "client.tsx")], outfile: join(output, "landing.js"), bundle: true, minify: true, jsx: "automatic", platform: "browser", define: { "process.env.NODE_ENV": '"production"' }, legalComments: "inline" });
const server = join(cache, "server.cjs");
await build({ entryPoints: [join(root, "src-preview", "server.tsx")], outfile: server, bundle: true, packages: "external", jsx: "automatic", platform: "node", format: "cjs" });
const { renderPreview } = await import(pathToFileURL(server).href);
const originalCss = readFileSync(join(root, "src-preview", "aurelis.css"), "utf8");
const marker = "/* ===== Aurelis marketing motion ===== */";
if (!originalCss.includes(marker)) throw new Error("Aurelis 3.0 CSS marker missing");
const css = readFileSync(join(root, "src-preview", "base.css"), "utf8") + originalCss.slice(originalCss.indexOf(marker)) + readFileSync(join(root, "src-preview", "commercial.css"), "utf8");
writeFileSync(join(output, "landing.css"), css, "utf8");

const html = `<!doctype html>
<html lang="fr"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow"><meta name="theme-color" content="#070706">
<title>Aurelis 3.0 — Prévisualisation</title>
<meta name="description" content="Prévisualisation de la nouvelle vitrine Aurelis.">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' fill='%23070706'/%3E%3Cpath d='M24 7 41 24 24 41 7 24Z M29 7 46 24 29 41 12 24Z' fill='none' stroke='%23d8ba86'/%3E%3C/svg%3E">
<link rel="preload" href="/assets/fonts-3/geist-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts-3/cormorant-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/preview-3/landing.css">
<link rel="stylesheet" href="/assets/lead-funnel.css"><link rel="stylesheet" href="/assets/site-ui.css">
<noscript><style>.aurelis-reveal { opacity: 1; transform: none; }.aurelis-cinema-message,.aurelis-transition-sub { opacity: 1; }</style></noscript>
<script defer src="/assets/config.js"></script><script defer src="/assets/offers-catalog.js"></script>
<script defer src="/assets/analytics.js"></script><script defer src="/assets/consent.js"></script>
<script defer src="/assets/lead-funnel.js"></script><script defer src="/assets/preview-3/landing.js"></script>
</head><body>
<aside class="preview-notice">Prévisualisation : les demandes ne sont pas envoyées.</aside>
<div id="aurelis-preview-root">${renderPreview()}</div>
<noscript>JavaScript est nécessaire pour le formulaire. Vous pouvez nous joindre par téléphone ou email.</noscript>
</body></html>`;
writeFileSync(join(preview, "index.html"), html, "utf8");

// Preserve access to the existing assistant, FAQ and audit fallback when the
// new homepage is eventually promoted. It is not an additional SEO landing.
const originalHome = readFileSync(join(root, "index.html"), "utf8");
writeFileSync(join(classic, "index.html"), originalHome.replace("<head>", '<head>\n  <meta name="robots" content="noindex, nofollow">'), "utf8");
const preservedHome = readFileSync(join(root, "index.html"), "utf8");
if (!preservedHome.includes("Création de sites internet premium") || /name="robots" content="noindex/.test(preservedHome)) {
  throw new Error("L'accueil de production a été modifié par le build de prévisualisation.");
}
console.log("Aurelis 3.0 preview and classic home generated; production home unchanged.");
