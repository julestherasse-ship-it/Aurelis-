/**
 * Génère landings Ads, pages légales et squelette EN.
 * Source unique = ce fichier (maintenable).
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://aurelis.ink";

const WORKS = [
  {
    nameFr: "Mr Gaston",
    nameEn: "Mr Gaston",
    fr: "Restauration sur mesure — identité immersive, carte & commande.",
    en: "Custom restaurant site — immersive brand, menu & ordering.",
    href: "/realisations/mr-gaston/",
  },
  {
    nameFr: "Bryan Burger",
    nameEn: "Bryan Burger",
    fr: "Site restauration rapide — offre & expérience mobile.",
    en: "Fast-food website — menu clarity & mobile experience.",
    href: "https://bryan-burger.vercel.app/",
  },
  {
    nameFr: "Trans Delivery",
    nameEn: "Trans Delivery",
    fr: "Site transport & livraison — crédibilité et prise de contact.",
    en: "Transport & delivery site — credibility and contact.",
    href: "https://transport-delivery.vercel.app/",
  },
];

const OFFERS = [
  { name: "Aurelis Essential", priceFr: "990 € HTVA", priceEn: "€990 excl. VAT", tier: "01" },
  { name: "Aurelis Signature", priceFr: "2 490 € HTVA", priceEn: "€2,490 excl. VAT", tier: "02" },
  { name: "Aurelis Prestige", priceFr: "4 490 € HTVA", priceEn: "€4,490 excl. VAT", tier: "03", featured: true },
  { name: "Aurelis Elite", priceFr: "À partir de 7 490 € HTVA", priceEn: "From €7,490 excl. VAT", tier: "04" },
];

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function shell({ lang, title, description, canonical, altLangHref, altLang, body, jsonLd }) {
  const isEn = lang === "en";
  const home = isEn ? "/en/" : "/";
  const offers = isEn ? "/en/offers/" : "/offres/";
  const privacy = isEn ? "/en/privacy-policy/" : "/politique-confidentialite/";
  const legal = isEn ? "/en/legal-notice/" : "/mentions-legales/";
  const nav = isEn
    ? `<a href="${home}">Home</a><a href="${offers}">Offers</a><a href="/en/business-website/">Business sites</a><a href="#contact" class="nav-cta">Contact</a>`
    : `<a href="${home}">Accueil</a><a href="${offers}">Offres</a><a href="/creation-site-web-entreprise/">Sites entreprise</a><a href="#contact" class="nav-cta">Contact</a>`;
  const footerAbout = isEn
    ? "Premium web studio for businesses that need a credible, fast and conversion-minded website."
    : "Agence web premium pour les entreprises qui veulent un site crédible, rapide et orienté conversion.";
  const legalLabel = isEn ? "Legal notice" : "Mentions légales";
  const privacyLabel = isEn ? "Privacy policy" : "Confidentialité";

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="${lang}" href="${canonical}">
  <link rel="alternate" hreflang="${altLang}" href="${altLangHref}">
  <link rel="alternate" hreflang="x-default" href="${altLang === "en" ? canonical : altLangHref}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:locale" content="${isEn ? "en_GB" : "fr_BE"}">
  <meta name="robots" content="index,follow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/lead-funnel.css">
  <link rel="stylesheet" href="/assets/site-ui.css">
  <link rel="stylesheet" href="/assets/landing.css">
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{--noir:#080808;--noir-soft:#121212;--blanc-casse:#f5f2eb;--blanc-muted:#e8e4db;--or:#c9a962;--or-light:#dfc88a;--text-muted:#86817c;--font-display:'Cormorant Garamond',Georgia,serif;--font-body:Outfit,system-ui,sans-serif;--header-h:86px;--ease:cubic-bezier(.22,1,.36,1)}
    body{font-family:var(--font-body);background:var(--noir);color:var(--blanc-casse);line-height:1.7;font-weight:300;-webkit-font-smoothing:antialiased}
    a{color:inherit;text-decoration:none}button{font-family:inherit;cursor:pointer;border:none;background:none}
    .container{width:min(1100px,90%);margin:0 auto}
    .header{position:fixed;inset:0 0 auto;z-index:100;background:rgba(8,8,8,.72);backdrop-filter:blur(14px);border-bottom:1px solid rgba(245,242,235,.06)}
    .header-inner{width:min(1200px,92%);margin:0 auto;min-height:var(--header-h);display:flex;align-items:center;gap:1rem}
    .logo{font-family:var(--font-display);font-size:1.55rem;letter-spacing:.04em}.logo span{color:var(--or)}
    .nav{margin-left:auto;display:flex;gap:1.25rem;align-items:center;font-size:.84rem}
    .nav a{color:var(--text-muted)}.nav a:hover,.nav-cta{color:var(--blanc-casse)}
    .nav-cta{border:1px solid rgba(201,169,98,.45);padding:.45rem .85rem}
    .burger{display:none;width:2rem;height:2rem;margin-left:.5rem}
    .burger span{display:block;height:1px;background:var(--blanc-casse);margin:6px 0}
    .btn{display:inline-flex;align-items:center;gap:.5rem;padding:.85rem 1.25rem;font-size:.82rem;letter-spacing:.08em;text-transform:uppercase}
    .btn-gold{background:var(--or);color:#111}.btn-ghost{border:1px solid rgba(245,242,235,.2);color:var(--blanc-casse)}
    .label{display:inline-flex;align-items:center;gap:.8rem;font-size:.68rem;letter-spacing:.32em;text-transform:uppercase;color:var(--or);margin-bottom:1rem}
    .label::before{content:'';width:28px;height:1px;background:var(--or)}
    .title{font-family:var(--font-display);font-size:clamp(1.8rem,4vw,2.6rem);font-weight:500;line-height:1.15;margin-bottom:.75rem}
    .title em{font-style:italic;color:var(--or-light)}
    .desc{color:var(--text-muted);max-width:48ch}
    .footer{border-top:1px solid rgba(245,242,235,.08);padding:3rem 0 2rem;margin-top:2rem}
    .footer-grid{display:grid;gap:1.5rem}
    @media(min-width:800px){.footer-grid{grid-template-columns:1.4fr 1fr 1fr 1fr}}
    .footer-col h4{font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--or);margin-bottom:.8rem}
    .footer-col a,.footer-col span,.footer-brand p{display:block;color:var(--text-muted);font-size:.9rem;margin-bottom:.35rem}
    .footer-bottom{margin-top:2rem;padding-top:1rem;border-top:1px solid rgba(245,242,235,.06);display:flex;flex-wrap:wrap;gap:1rem;justify-content:space-between;color:var(--text-muted);font-size:.8rem}
    @media(max-width:820px){
      .nav{display:none;position:absolute;top:var(--header-h);left:0;right:0;background:#0c0c0c;flex-direction:column;padding:1.25rem;border-bottom:1px solid rgba(245,242,235,.08)}
      .nav.open{display:flex}.burger{display:block}
    }
  </style>
  ${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ""}
</head>
<body>
  <header class="header"><div class="header-inner">
    <a href="${home}" class="logo">Aure<span>lis</span></a>
    <nav class="nav" id="nav">${nav}</nav>
    <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
  </div></header>
  ${body}
  <footer class="footer"><div class="container">
    <div class="footer-grid">
      <div class="footer-brand"><a href="${home}" class="logo">Aure<span>lis</span></a><p>${footerAbout}</p></div>
      <div class="footer-col"><h4>Contact</h4><span>Jules Therasse</span><a href="tel:+32495380329">0495 38 03 29</a><a href="mailto:julestherasse@gmail.com">julestherasse@gmail.com</a></div>
      <div class="footer-col"><h4>${isEn ? "Explore" : "Explorer"}</h4><a href="${offers}">${isEn ? "Offers" : "Offres"}</a><a href="${home}">${isEn ? "Home" : "Accueil"}</a></div>
      <div class="footer-col"><h4>${isEn ? "Legal" : "Légal"}</h4><a href="${legal}">${legalLabel}</a><a href="${privacy}">${privacyLabel}</a></div>
    </div>
    <div class="footer-bottom"><p>&copy; ${new Date().getFullYear()} Aurelis</p><p>aurelis.ink</p></div>
  </div></footer>
  <script src="/assets/config.js" defer></script>
  <script src="/assets/locale.js" defer></script>
  <script src="/assets/analytics.js" defer></script>
  <script src="/assets/consent.js" defer></script>
  <script src="/assets/lead-funnel.js" defer></script>
  <script>
    document.getElementById('burger')?.addEventListener('click',function(){document.getElementById('nav').classList.toggle('open');});
    var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});},{threshold:.12});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
  </script>
</body>
</html>`;
}

function worksBlock(lang) {
  return WORKS.map((w) => {
    const name = lang === "en" ? w.nameEn : w.nameFr;
    const desc = lang === "en" ? w.en : w.fr;
    return `<article class="lp-work reveal"><a href="${w.href}" target="_blank" rel="noopener"><strong>${esc(name)}</strong><span>${esc(desc)}</span></a></article>`;
  }).join("");
}

function offersBlock(lang, names) {
  const list = OFFERS.filter((o) => names.includes(o.name));
  return list
    .map((o) => {
      const price = lang === "en" ? o.priceEn : o.priceFr;
      const cta = lang === "en" ? "Start my project" : "Démarrer mon projet";
      return `<article class="pricing-card${o.featured ? " pricing-card--featured" : ""} reveal">
      <div class="pricing-tier">${o.tier}</div>
      <h3 class="pricing-name">${o.name}</h3>
      <div class="pricing-price">${esc(price)}</div>
      <a href="#" class="btn ${o.featured ? "btn-gold" : "btn-ghost"} pricing-cta" data-offer="${o.name}" data-price="${esc(price)}" data-lead-open="1">${cta}</a>
    </article>`;
    })
    .join("");
}

function landing(def) {
  const isEn = def.lang === "en";
  const args = def.arguments
    .map((a) => `<article class="lp-card reveal"><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p></article>`)
    .join("");
  const contactTitle = isEn ? "Let’s discuss your <em>project</em>" : "Parlons de <em>votre projet</em>";
  const contactDesc = isEn
    ? "Share your goals. A human reply within 24 hours. No automated final quote."
    : "Expliquez votre contexte. Réponse humaine sous 24 h. Aucun devis définitif automatique.";
  const ctaPrimary = isEn ? "Start my project" : "Démarrer mon projet";
  const ctaSecondary = isEn ? "View offers" : "Voir les offres";
  const worksTitle = isEn ? "Relevant <em>work</em>" : "Réalisations <em>pertinentes</em>";
  const offersTitle = isEn ? "Offers that <em>fit</em>" : "Offres <em>adaptées</em>";
  const argsTitle = isEn ? "Why this approach <em>works</em>" : "Des arguments <em>concrets</em>";

  const body = `
  <section class="lp-hero" style="--lp-image:url('${def.image}')">
    <div class="lp-hero__bg" aria-hidden="true"></div>
    <div class="lp-hero__content">
      <div class="label">${esc(def.eyebrow)}</div>
      <h1>${def.h1}</h1>
      <p>${esc(def.lead)}</p>
      <div class="lp-actions">
        <a href="#contact" class="btn btn-gold" data-lead-open="1" data-appointment="1">${ctaPrimary}</a>
        <a href="${isEn ? "/en/offers/" : "/offres/"}" class="btn btn-ghost">${ctaSecondary}</a>
      </div>
    </div>
  </section>
  <section class="lp-section">
    <div class="container">
      <div class="section-head reveal"><div class="label">${isEn ? "Approach" : "Approche"}</div><h2 class="title">${argsTitle}</h2></div>
      <div class="lp-grid lp-grid--3">${args}</div>
    </div>
  </section>
  <section class="lp-section lp-section--alt">
    <div class="container">
      <div class="section-head reveal"><div class="label">${isEn ? "Work" : "Portfolio"}</div><h2 class="title">${worksTitle}</h2><p class="desc">${isEn ? "Live examples — no invented case studies." : "Exemples en ligne — aucun cas inventé."}</p></div>
      <div class="lp-grid lp-grid--3" style="margin-top:1.5rem">${worksBlock(def.lang)}</div>
    </div>
  </section>
  <section class="lp-section lp-offers">
    <div class="container">
      <div class="section-head reveal"><div class="label">${isEn ? "Pricing" : "Tarifs"}</div><h2 class="title">${offersTitle}</h2></div>
      <div class="lp-grid lp-grid--3" style="margin-top:1.5rem">${offersBlock(def.lang, def.offers)}</div>
    </div>
  </section>
  <section class="lp-section lp-section--alt" id="contact">
    <div class="container lp-grid lp-grid--2">
      <div class="reveal">
        <div class="label">Contact</div>
        <h2 class="title">${contactTitle}</h2>
        <p class="desc" style="margin-bottom:1.5rem">${contactDesc}</p>
        <p style="color:var(--text-muted)">Jules Therasse<br><a href="tel:+32495380329">0495 38 03 29</a><br><a href="mailto:julestherasse@gmail.com">julestherasse@gmail.com</a></p>
      </div>
      <div class="reveal">
        <a href="#" class="btn btn-gold" data-lead-open="1" data-appointment="1" style="margin-bottom:1rem">${ctaPrimary}</a>
        <p class="desc">${isEn ? "The form keeps your language and selected offer." : "Le formulaire conserve votre langue et l’offre choisie."}</p>
      </div>
    </div>
  </section>`;

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: def.title,
    description: def.description,
    url: def.canonical,
    inLanguage: def.lang,
    isPartOf: { "@type": "WebSite", name: "Aurelis", url: SITE },
    provider: {
      "@type": "Organization",
      name: "Aurelis",
      url: SITE,
      email: "julestherasse@gmail.com",
      telephone: "+32495380329",
    },
  });

  return shell({
    lang: def.lang,
    title: def.title,
    description: def.description,
    canonical: def.canonical,
    altLangHref: def.alt,
    altLang: def.lang === "fr" ? "en" : "fr",
    body,
    jsonLd,
  });
}

const landings = [
  {
    lang: "fr",
    path: "creation-site-web-entreprise/index.html",
    title: "Création de site web pour entreprises | Aurelis",
    description:
      "Création de sites web pour entreprises : structure claire, design soigné, performance et prise de contact. Offres Aurelis transparentes.",
    canonical: `${SITE}/creation-site-web-entreprise/`,
    alt: `${SITE}/en/business-website/`,
    eyebrow: "Sites pour entreprises",
    h1: "Un site web qui présente votre entreprise avec <em>clarté</em>.",
    lead: "Aurelis conçoit des sites vitrines professionnels pour les entreprises qui veulent inspirer confiance dès la première visite — sans promesse de ranking magique.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=70",
    offers: ["Aurelis Essential", "Aurelis Signature", "Aurelis Prestige"],
    arguments: [
      { title: "Message net", text: "Une architecture de pages qui explique qui vous êtes, ce que vous faites et comment vous contacter." },
      { title: "Crédibilité visuelle", text: "Typographie, rythme et direction artistique alignés sur une image d’entreprise sérieuse." },
      { title: "Prêt pour la demande", text: "Formulaire de projet connecté à Aurelis pour recevoir des prospects même hors ligne." },
    ],
  },
  {
    lang: "en",
    path: "en/business-website/index.html",
    title: "Business website design | Aurelis",
    description:
      "Business website design with clear structure, refined visuals and fast contact. Transparent Aurelis offers for companies.",
    canonical: `${SITE}/en/business-website/`,
    alt: `${SITE}/creation-site-web-entreprise/`,
    eyebrow: "Business websites",
    h1: "A website that presents your company with <em>clarity</em>.",
    lead: "Aurelis designs professional brochure sites for companies that need trust from the first visit — with no magical ranking promises.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=70",
    offers: ["Aurelis Essential", "Aurelis Signature", "Aurelis Prestige"],
    arguments: [
      { title: "Clear message", text: "A page structure that states who you are, what you do, and how to reach you." },
      { title: "Visual credibility", text: "Typography and art direction aligned with a serious business image." },
      { title: "Lead-ready", text: "A project form connected to Aurelis so enquiries arrive even when you are offline." },
    ],
  },
  {
    lang: "fr",
    path: "refonte-site-web/index.html",
    title: "Refonte de site web | Aurelis",
    description:
      "Refonte de site web : moderniser l’image, clarifier le parcours, améliorer la performance et les contacts. Devis après échange.",
    canonical: `${SITE}/refonte-site-web/`,
    alt: `${SITE}/en/website-redesign/`,
    eyebrow: "Refonte",
    h1: "Moderniser un site existant sans perdre <em>l’essentiel</em>.",
    lead: "Nous reprenons votre site actuel pour le rendre plus clair, plus rapide et plus convaincant — en conservant ce qui fonctionne déjà.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=70",
    offers: ["Aurelis Signature", "Aurelis Prestige", "Aurelis Elite"],
    arguments: [
      { title: "Audit du parcours", text: "Repérage des frictions : navigation confuse, contenus datés, appels à l’action faibles." },
      { title: "Nouveau design utile", text: "Une refonte orientée compréhension et conversion, pas seulement un habillage esthétique." },
      { title: "Migration maîtrisée", text: "Contenus, redirections et SEO technique traités avec méthode pour limiter les pertes inutiles." },
    ],
  },
  {
    lang: "en",
    path: "en/website-redesign/index.html",
    title: "Website redesign | Aurelis",
    description:
      "Website redesign: refresh your brand presence, clarify the journey, improve performance and contact. Quote after a first call.",
    canonical: `${SITE}/en/website-redesign/`,
    alt: `${SITE}/refonte-site-web/`,
    eyebrow: "Redesign",
    h1: "Modernise an existing site without losing what <em>matters</em>.",
    lead: "We rebuild your current website to make it clearer, faster and more convincing — keeping what already works.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=70",
    offers: ["Aurelis Signature", "Aurelis Prestige", "Aurelis Elite"],
    arguments: [
      { title: "Journey review", text: "Find friction: confusing navigation, outdated content, weak calls to action." },
      { title: "Useful redesign", text: "A redesign aimed at clarity and conversion, not decoration alone." },
      { title: "Controlled migration", text: "Content, redirects and technical SEO handled carefully to avoid unnecessary losses." },
    ],
  },
  {
    lang: "fr",
    path: "creation-site-premium/index.html",
    title: "Création de site premium | Aurelis",
    description:
      "Création de site premium : direction artistique soignée, interactions fines, performance et image haut de gamme. Offres Prestige & Elite.",
    canonical: `${SITE}/creation-site-premium/`,
    alt: `${SITE}/en/premium-website/`,
    eyebrow: "Premium",
    h1: "Une présence digitale à la hauteur d’une marque <em>exigeante</em>.",
    lead: "Pour les entreprises et maisons qui refusent le template générique : direction artistique, motion mesuré et expérience soignée.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=70",
    offers: ["Aurelis Prestige", "Aurelis Elite"],
    arguments: [
      { title: "Direction artistique", text: "Composition, typographie et image pensées comme une identité — pas comme un thème WordPress." },
      { title: "Motion utile", text: "Animations au service de la hiérarchie et de la présence, sans surcharge." },
      { title: "Exigence de livraison", text: "Itérations encadrées, validation humaine des devis, accompagnement jusqu’à la mise en ligne." },
    ],
  },
  {
    lang: "en",
    path: "en/premium-website/index.html",
    title: "Premium website design | Aurelis",
    description:
      "Premium website design: careful art direction, refined motion, performance and high-end presence. Prestige & Elite offers.",
    canonical: `${SITE}/en/premium-website/`,
    alt: `${SITE}/creation-site-premium/`,
    eyebrow: "Premium",
    h1: "A digital presence worthy of a <em>demanding</em> brand.",
    lead: "For companies that refuse generic templates: art direction, measured motion and a carefully crafted experience.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=70",
    offers: ["Aurelis Prestige", "Aurelis Elite"],
    arguments: [
      { title: "Art direction", text: "Layout, type and imagery treated as identity — not as a theme." },
      { title: "Useful motion", text: "Animation that supports hierarchy and presence, without noise." },
      { title: "Delivery discipline", text: "Scoped iterations, human quote validation, support through launch." },
    ],
  },
];

function legalPage(lang) {
  const isEn = lang === "en";
  const path = isEn ? "en/legal-notice/index.html" : "mentions-legales/index.html";
  const canonical = isEn ? `${SITE}/en/legal-notice/` : `${SITE}/mentions-legales/`;
  const alt = isEn ? `${SITE}/mentions-legales/` : `${SITE}/en/legal-notice/`;
  const title = isEn ? "Legal notice | Aurelis" : "Mentions légales | Aurelis";
  const description = isEn
    ? "Legal notice for aurelis.ink — publisher, contact and liability."
    : "Mentions légales du site aurelis.ink — éditeur, contact et responsabilité.";
  const body = isEn
    ? `<main class="legal-page"><div class="container">
      <h1>Legal notice</h1>
      <h2>Publisher</h2>
      <p>Website published by Jules Therasse — Aurelis.</p>
      <p>Email: <a href="mailto:julestherasse@gmail.com">julestherasse@gmail.com</a><br>Phone: <a href="tel:+32495380329">0495 38 03 29</a></p>
      <h2>Hosting</h2>
      <p>Hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.</p>
      <h2>Intellectual property</h2>
      <p>Texts, visuals and code of this site are protected. Reproduction without authorisation is not allowed, except for short quotations with source credit.</p>
      <h2>Liability</h2>
      <p>Information is provided in good faith. Aurelis does not guarantee search-engine rankings or commercial results.</p>
    </div></main>`
    : `<main class="legal-page"><div class="container">
      <h1>Mentions légales</h1>
      <h2>Éditeur</h2>
      <p>Site édité par Jules Therasse — Aurelis.</p>
      <p>Email : <a href="mailto:julestherasse@gmail.com">julestherasse@gmail.com</a><br>Téléphone : <a href="tel:+32495380329">0495 38 03 29</a></p>
      <h2>Hébergement</h2>
      <p>Hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.</p>
      <h2>Propriété intellectuelle</h2>
      <p>Les contenus de ce site sont protégés. Toute reproduction non autorisée est interdite, hors courtes citations avec mention de la source.</p>
      <h2>Responsabilité</h2>
      <p>Les informations sont fournies de bonne foi. Aurelis ne garantit pas un positionnement Google ni un résultat commercial.</p>
    </div></main>`;

  write(
    path,
    shell({
      lang,
      title,
      description,
      canonical,
      altLangHref: alt,
      altLang: isEn ? "fr" : "en",
      body,
      jsonLd: null,
    }),
  );
}

function privacyPage(lang) {
  const isEn = lang === "en";
  const path = isEn ? "en/privacy-policy/index.html" : "politique-confidentialite/index.html";
  const canonical = isEn ? `${SITE}/en/privacy-policy/` : `${SITE}/politique-confidentialite/`;
  const alt = isEn ? `${SITE}/politique-confidentialite/` : `${SITE}/en/privacy-policy/`;
  const title = isEn ? "Privacy policy | Aurelis" : "Politique de confidentialité | Aurelis";
  const description = isEn
    ? "How Aurelis processes contact data, cookies and measurement tools."
    : "Comment Aurelis traite les données de contact, cookies et outils de mesure.";
  const body = isEn
    ? `<main class="legal-page"><div class="container">
      <h1>Privacy policy</h1>
      <h2>Controller</h2>
      <p>Jules Therasse — Aurelis · <a href="mailto:julestherasse@gmail.com">julestherasse@gmail.com</a></p>
      <h2>Data collected</h2>
      <p>When you submit a project form: name, company, email, country, project details, budget, desired date, selected offer and language.</p>
      <h2>Purpose</h2>
      <ul><li>Respond to your request</li><li>Prepare a human-validated commercial follow-up</li><li>Measure site performance only with consent</li></ul>
      <h2>Cookies &amp; measurement</h2>
      <p>Essential cookies keep the site working. Audience measurement (GA4) and advertising conversion tags load only after you accept measurement in the consent banner. You can refuse without blocking the site.</p>
      <h2>Retention</h2>
      <p>Enquiry data is kept for the time needed to handle the commercial relationship, then archived or deleted according to applicable rules.</p>
      <h2>Your rights</h2>
      <p>You may request access, rectification or deletion by emailing <a href="mailto:julestherasse@gmail.com">julestherasse@gmail.com</a>.</p>
    </div></main>`
    : `<main class="legal-page"><div class="container">
      <h1>Politique de confidentialité</h1>
      <h2>Responsable</h2>
      <p>Jules Therasse — Aurelis · <a href="mailto:julestherasse@gmail.com">julestherasse@gmail.com</a></p>
      <h2>Données collectées</h2>
      <p>Via le formulaire de projet : nom, entreprise, e-mail, pays, besoins, budget, date souhaitée, offre choisie et langue.</p>
      <h2>Finalités</h2>
      <ul><li>Répondre à votre demande</li><li>Préparer un suivi commercial validé par un humain</li><li>Mesurer l’audience uniquement avec consentement</li></ul>
      <h2>Cookies et mesure</h2>
      <p>Les cookies essentiels assurent le fonctionnement du site. La mesure d’audience (GA4) et les balises de conversion publicitaire ne se chargent qu’après acceptation dans la bannière. Vous pouvez refuser sans bloquer le site.</p>
      <h2>Durée</h2>
      <p>Les demandes sont conservées le temps nécessaire au suivi commercial, puis archivées ou supprimées selon les règles applicables.</p>
      <h2>Vos droits</h2>
      <p>Accès, rectification ou suppression sur demande à <a href="mailto:julestherasse@gmail.com">julestherasse@gmail.com</a>.</p>
    </div></main>`;

  write(
    path,
    shell({
      lang,
      title,
      description,
      canonical,
      altLangHref: alt,
      altLang: isEn ? "fr" : "en",
      body,
      jsonLd: null,
    }),
  );
}

function write(rel, content) {
  const full = join(root, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, "utf8");
  console.log("wrote", rel);
}

function writeRobots() {
  writeFileSync(
    join(root, "robots.txt"),
    `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`,
    "utf8",
  );
  console.log("wrote robots.txt");
}

for (const def of landings) write(def.path, landing(def));
legalPage("fr");
legalPage("en");
privacyPage("fr");
privacyPage("en");
writeRobots();
// sitemap.xml est maintenu à part (hreflang xhtml complets)

console.log("generate-pages OK");
