import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(process.argv[2] || "");
if (!output || output === root || output.startsWith(root + "\\") || output.startsWith(root + "/")) {
  throw new Error("Le candidat de production doit être écrit hors du dépôt, pour ne pas remplacer aurelis.ink.");
}

const cache = join(root, "node_modules", ".cache", "aurelis-release");
mkdirSync(output, { recursive: true });
mkdirSync(cache, { recursive: true });

const server = join(cache, "server.cjs");
await build({
  entryPoints: [join(root, "src-preview", "server.tsx")],
  outfile: server,
  bundle: true,
  packages: "external",
  jsx: "automatic",
  platform: "node",
  format: "cjs",
});
const { renderPreview } = await import(pathToFileURL(server).href + "?release=" + Date.now());
const home = readFileSync(join(root, "index.html"), "utf8");
function pick(label, pattern) {
  const match = home.match(pattern);
  if (!match) throw new Error("Balise SEO manquante : " + label);
  return match[0];
}
const hreflang = [...home.matchAll(/<link rel="alternate" hreflang="[^"]+" href="https:\/\/aurelis\.ink\/[^"]*">/g)].map((match) => match[0]);
if (hreflang.length < 3) throw new Error("Balises hreflang incomplètes.");
const seo = [
  "<!doctype html>",
  '<html lang="fr"><head>',
  '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
  pick("title", /<title>[\s\S]*?<\/title>/),
  pick("description", /<meta name="description" content="[^"]*">/),
  pick("canonical", /<link rel="canonical" href="https:\/\/aurelis\.ink\/">/),
  ...hreflang,
  pick("og:type", /<meta property="og:type" content="[^"]*">/),
  pick("og:locale", /<meta property="og:locale" content="[^"]*">/),
  pick("og:title", /<meta property="og:title" content="[^"]*">/),
  pick("og:description", /<meta property="og:description" content="[^"]*">/),
  pick("og:url", /<meta property="og:url" content="https:\/\/aurelis\.ink\/">/),
  pick("og:image", /<meta property="og:image" content="https:\/\/aurelis\.ink\/[^"]*">/),
  pick("twitter:card", /<meta name="twitter:card" content="[^"]*">/),
  pick("twitter:title", /<meta name="twitter:title" content="[^"]*">/),
  pick("twitter:description", /<meta name="twitter:description" content="[^"]*">/),
  pick("twitter:image", /<meta name="twitter:image" content="https:\/\/aurelis\.ink\/[^"]*">/),
  '<meta name="robots" content="index, follow">',
  '<meta name="theme-color" content="#070706">',
  pick("données structurées", /<script type="application\/ld\+json">[\s\S]*?<\/script>/),
].join("\n");

const marker = "/* ===== Aurelis marketing motion ===== */";
const originalCss = readFileSync(join(root, "src-preview", "aurelis.css"), "utf8");
if (!originalCss.includes(marker)) throw new Error("Marqueur CSS Aurelis 3.0 absent.");
const css = readFileSync(join(root, "src-preview", "base.css"), "utf8")
  + originalCss.slice(originalCss.indexOf(marker))
  + readFileSync(join(root, "src-preview", "commercial.css"), "utf8");
const releaseCss = css.replace(/\.preview-notice\s*\{[^}]*\}\s*/g, "");
writeFileSync(join(output, "landing.css"), releaseCss, "utf8");
await build({
  entryPoints: [join(root, "src-preview", "client.tsx")],
  outfile: join(output, "landing.js"),
  bundle: true,
  minify: true,
  jsx: "automatic",
  platform: "browser",
  define: { "process.env.NODE_ENV": '"production"' },
  legalComments: "inline",
});

const html = `${seo}
<link rel="preload" href="/assets/fonts-3/geist-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts-3/cormorant-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="./landing.css">
<link rel="stylesheet" href="/assets/lead-funnel.css"><link rel="stylesheet" href="/assets/site-ui.css">
<noscript><style>.aurelis-reveal { opacity: 1; transform: none; }.aurelis-cinema-message,.aurelis-transition-sub { opacity: 1; }</style></noscript>
<script defer src="/assets/config.js"></script><script defer src="/assets/offers-catalog.js"></script>
<script defer src="/assets/analytics.js"></script><script defer src="/assets/consent.js"></script>
<script defer src="/assets/lead-funnel.js"></script><script defer src="./landing.js"></script>
</head><body>
<div id="aurelis-preview-root">${renderPreview()}</div>
<noscript>JavaScript est nécessaire pour le formulaire. Vous pouvez nous joindre par téléphone ou email.</noscript>
</body></html>`;
if (/noindex|Prévisualisation|preview-notice/i.test(html)) {
  throw new Error("Le candidat contient encore un marquage de prévisualisation.");
}
writeFileSync(join(output, "index.html"), html, "utf8");
console.log("Candidat de production écrit hors du dépôt : " + output);
