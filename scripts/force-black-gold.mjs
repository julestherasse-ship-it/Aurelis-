/**
 * Force black/gold on public site:
 * - self-contain tokens inside atelier.css
 * - cache-bust CSS links
 * - inject critical force overrides
 * - always-dark header
 * - shorten asset cache
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE_BUST = "bg20261010c";

const TOKENS = `/**
 * Aurelis — design tokens (inlined into atelier for deploy reliability)
 */
:root {
  --aurelis-black: #060606;
  --aurelis-black-soft: #0b0b0b;
  --aurelis-surface: #111111;
  --aurelis-surface-elevated: #161616;
  --aurelis-gold: #c9a96e;
  --aurelis-gold-light: #dfc78f;
  --aurelis-gold-dark: #8f7040;
  --aurelis-ivory: #f5f2ea;
  --aurelis-muted: #a7a29a;
  --aurelis-gold-line: rgba(201, 169, 110, 0.18);
  --aurelis-gold-line-strong: rgba(201, 169, 110, 0.32);
  --aurelis-gold-glow: rgba(201, 169, 110, 0.12);
  --aurelis-gold-metal: linear-gradient(115deg, #8f7040 0%, #c9a96e 28%, #e2c990 48%, #c9a96e 68%, #a3844f 100%);
  --aurelis-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --aurelis-ease-soft: cubic-bezier(0.33, 1, 0.68, 1);
  --aurelis-duration: 0.35s;
  --aurelis-duration-slow: 0.55s;
  --aurelis-radius: 6px;
  --aurelis-radius-lg: 10px;
  --aurelis-header-h: 86px;
  --aurelis-header-h-compact: 72px;
  --aurelis-font-display: "Cormorant Garamond", Georgia, "Times New Roman", serif;
  --aurelis-font-body: "Outfit", system-ui, -apple-system, sans-serif;

  --noir: #080808;
  --noir-soft: #0b0b0b;
  --noir-card: #111111;
  --noir-elevated: #161616;
  --blanc-casse: #f5f2ea;
  --blanc-muted: #ebe6dc;
  --or: #c9a96e;
  --or-light: #dfc78f;
  --or-dim: rgba(201, 169, 110, 0.12);
  --text-muted: #a7a29a;
  --font-display: var(--aurelis-font-display);
  --font-body: var(--aurelis-font-body);
  --ease: var(--aurelis-ease);
  --transition: var(--aurelis-duration-slow) var(--aurelis-ease);
  --header-h: var(--aurelis-header-h);

  --ink: #060606;
  --ink-soft: #0b0b0b;
  --ink-elevated: #161616;
  --ink-muted: #a7a29a;
  --paper: #f5f2ea;
  --gold: #c9a96e;
  --gold-soft: #dfc78f;
  --gold-line: rgba(201, 169, 110, 0.18);
  --ease-out: var(--aurelis-ease);
  --ease-soft: var(--aurelis-ease-soft);
}
`;

const FORCE_CSS = `
/* FORCE BLACK & GOLD — critical overrides (must win over stale cached CSS) */
html, body, body.atelier {
  background: #060606 !important;
  color: #f5f2ea !important;
}
body.atelier .header,
.header,
.header.scrolled,
.header:not(.is-dark),
.header.is-dark {
  background: rgba(6, 6, 6, 0.88) !important;
  border-bottom: 1px solid rgba(201, 169, 110, 0.18) !important;
  color: #f5f2ea !important;
}
body.atelier .header .logo,
body.atelier .header .nav a,
.header .logo,
.header .nav a {
  color: #a7a29a !important;
}
body.atelier .header .logo,
.header .logo {
  color: #f5f2ea !important;
}
body.atelier .header .logo span,
.header .logo span {
  color: #c9a96e !important;
  background: none !important;
  -webkit-text-fill-color: #c9a96e !important;
}
body.atelier .header .nav a:hover,
.header .nav a:hover {
  color: #dfc78f !important;
}
body.atelier .header .nav-cta,
.header .nav-cta {
  background: #c9a96e !important;
  color: #0a0908 !important;
  border: 1px solid rgba(223, 199, 143, 0.35) !important;
}
body.atelier .header .burger span,
.header .burger span {
  background: #f5f2ea !important;
}
body.atelier .hero,
.hero {
  background: #060606 !important;
  color: #f5f2ea !important;
}
body.atelier .hero h1,
.hero h1 {
  color: #f5f2ea !important;
}
body.atelier .hero h1 em,
.hero h1 em {
  color: #dfc78f !important;
  background: none !important;
  -webkit-text-fill-color: #dfc78f !important;
}
body.atelier .hero-sub,
.hero-sub {
  color: #a7a29a !important;
}
body.atelier .hero-media,
.hero-media {
  background:
    radial-gradient(ellipse 55% 45% at 78% 35%, rgba(201,169,110,0.1), transparent 58%),
    linear-gradient(165deg, #0a0a0a 0%, #060606 48%, #0e0e0e 100%) !important;
}
body.atelier .section-light,
body.atelier .folio,
body.atelier .offers-atelier,
.section-light,
.folio,
.offers-atelier {
  background: #0b0b0b !important;
  color: #f5f2ea !important;
}
body.atelier .section-light .title,
body.atelier .folio .title,
body.atelier .offers-atelier .title,
.section-light .title,
.folio .title {
  color: #f5f2ea !important;
}
body.atelier .section-alt,
body.atelier .section-ink,
.section-alt,
.section-ink {
  background: #060606 !important;
  color: #f5f2ea !important;
}
body.atelier .btn-gold,
.btn-gold,
.nav-cta {
  background: #c9a96e !important;
  color: #0a0908 !important;
}
body.atelier .btn-ghost,
.btn-ghost {
  background: transparent !important;
  border: 1px solid rgba(201,169,110,0.35) !important;
  color: #f5f2ea !important;
}
body.atelier .footer,
.footer {
  background: #060606 !important;
  border-top: 1px solid rgba(201,169,110,0.18) !important;
  color: #a7a29a !important;
}
`;

// 1) Rewrite tokens file + prepend into atelier
fs.writeFileSync(path.join(root, "assets/aurelis-tokens.css"), TOKENS, "utf8");
let atelier = fs.readFileSync(path.join(root, "assets/atelier.css"), "utf8").replace(/\r\n/g, "\n");
if (!atelier.includes("--aurelis-black: #060606")) {
  atelier = atelier.replace(
    /\/\* Tokens:[\s\S]*?\*\/\n\n/,
    TOKENS + "\n",
  );
  if (!atelier.includes("--aurelis-black: #060606")) {
    atelier = TOKENS + "\n" + atelier;
  }
}
// harden critical colors with hex fallbacks not only vars
atelier = atelier.replace(
  /body\.atelier \{\n  background: var\(--aurelis-black\);\n  color: var\(--aurelis-ivory\);\n\}/,
  `body.atelier {\n  background: #060606;\n  background: var(--aurelis-black, #060606);\n  color: #f5f2ea;\n  color: var(--aurelis-ivory, #f5f2ea);\n}`,
);
atelier = atelier.replace(
  /body\.atelier \.hero \{\n  min-height: 100vh;\n  min-height: 100dvh;\n  background: var\(--aurelis-black\);\n  color: var\(--aurelis-ivory\);/,
  `body.atelier .hero {\n  min-height: 100vh;\n  min-height: 100dvh;\n  background: #060606 !important;\n  background: var(--aurelis-black, #060606) !important;\n  color: #f5f2ea !important;\n  color: var(--aurelis-ivory, #f5f2ea) !important;`,
);
atelier = atelier.replace(
  /body\.atelier \.header \{\n  background: rgba\(6, 6, 6, 0\.72\);/,
  `body.atelier .header {\n  background: rgba(6, 6, 6, 0.88) !important;`,
);
fs.writeFileSync(path.join(root, "assets/atelier.css"), atelier, "utf8");

function bust(html) {
  let h = html.replace(/\r\n/g, "\n");
  h = h.replace(/\/assets\/(aurelis-tokens|aurelis-luxury|atelier|site-ui|lead-funnel|landing)\.css(\?v=[^"']*)?/g, `/assets/$1.css?v=${CACHE_BUST}`);
  // inject force CSS once before </head>
  if (!h.includes("FORCE BLACK & GOLD")) {
    h = h.replace("</head>", `<style id="aurelis-force-theme">${FORCE_CSS}</style>\n</head>`);
  } else {
    h = h.replace(/<style id="aurelis-force-theme">[\s\S]*?<\/style>/, `<style id="aurelis-force-theme">${FORCE_CSS}</style>`);
  }
  // always-dark header
  h = h.replace(
    /var dark = false;/,
    `var dark = true; /* always dark luxury header */`,
  );
  // theme-color
  h = h.replace(/content="#080808"/g, 'content="#060606"');
  return h;
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".git") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name.endsWith(".html") || e.name.endsWith(".mjs")) out.push(full);
  }
  return out;
}

for (const full of walk(root)) {
  const rel = path.relative(root, full).replace(/\\/g, "/");
  if (!rel.endsWith(".html") && !rel.includes("generate-")) continue;
  let text = fs.readFileSync(full, "utf8");
  const next = bust(text);
  if (next !== text.replace(/\r\n/g, "\n") && next !== text) {
    fs.writeFileSync(full, next, "utf8");
    console.log("forced", rel);
  }
}

// vercel cache shorten for CSS
const vercelPath = path.join(root, "vercel.json");
const vercel = {
  buildCommand: "npm run build",
  outputDirectory: ".",
  framework: null,
  cleanUrls: true,
  trailingSlash: false,
  headers: [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
    {
      source: "/assets/(.*)\\.css",
      headers: [{ key: "Cache-Control", value: "public, max-age=60, must-revalidate" }],
    },
    {
      source: "/assets/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
      ],
    },
  ],
};
fs.writeFileSync(vercelPath, JSON.stringify(vercel, null, 2) + "\n", "utf8");
console.log("vercel.json cache updated");
console.log("FORCE BLACK GOLD done", CACHE_BUST);
