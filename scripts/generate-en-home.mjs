import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aurelis — Premium website design from €990 excl. VAT</title>
  <meta name="description" content="Aurelis designs high-end websites built to impress visitors and grow your business. Professional site from €990 excl. VAT.">
  <link rel="canonical" href="https://aurelis.ink/en/">
  <link rel="alternate" hreflang="en" href="https://aurelis.ink/en/">
  <link rel="alternate" hreflang="fr" href="https://aurelis.ink/">
  <link rel="alternate" hreflang="x-default" href="https://aurelis.ink/">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_GB">
  <meta property="og:title" content="Aurelis — Premium website design">
  <meta property="og:description" content="High-end custom websites. Your professional site from €990 excl. VAT.">
  <meta property="og:url" content="https://aurelis.ink/en/">
  <meta name="robots" content="index,follow">
  <meta name="theme-color" content="#080808">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/lead-funnel.css">
  <link rel="stylesheet" href="/assets/site-ui.css">
  <link rel="stylesheet" href="/assets/atelier.css">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Aurelis","url":"https://aurelis.ink/","email":"julestherasse@gmail.com","telephone":"+32495380329","founder":{"@type":"Person","name":"Jules Therasse"}}</script>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{--noir:#080808;--noir-soft:#121212;--blanc-casse:#f5f2eb;--blanc-muted:#f0ebe3;--or:#d4b56a;--or-light:#e8d09a;--text-muted:#b0aaa2;--font-display:'Cormorant Garamond',Georgia,serif;--font-body:Outfit,system-ui,sans-serif;--header-h:86px;--ease:cubic-bezier(.22,1,.36,1)}
    body{font-family:var(--font-body);background:var(--noir);color:var(--blanc-casse);line-height:1.7;font-weight:300;-webkit-font-smoothing:antialiased}
    a{color:inherit;text-decoration:none}button{font-family:inherit;cursor:pointer;border:none;background:none}img{max-width:100%;display:block}
    .container{width:min(1200px,90%);margin:0 auto}
    .header{position:fixed;inset:0 0 auto;z-index:100;background:rgba(8,8,8,.82);backdrop-filter:blur(14px);border-bottom:1px solid rgba(12,11,10,.06)}
    .header-inner{width:min(1200px,92%);margin:0 auto;min-height:var(--header-h);display:flex;align-items:center;gap:1rem}
    .logo{font-family:var(--font-display);font-size:1.55rem;color:#f5f2eb}.logo span{color:var(--or)}
    .nav{margin-left:auto;display:flex;gap:1.1rem;align-items:center;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase}
    .nav a{color:#b0aaa2}.nav-cta{color:#111!important;background:var(--or);padding:.55rem .95rem;font-weight:600}
    .burger{display:none;width:2rem;height:2rem}.burger span{display:block;height:1px;background:#0c0b0a;margin:6px 0}
    .btn{display:inline-flex;align-items:center;gap:.5rem;padding:.95rem 1.4rem;font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;font-weight:600}
    .btn-gold{background:var(--or);color:#080808}.btn-ghost{border:1px solid rgba(212,181,106,.35);color:#f5f2eb}
    .btn-cta-xl{padding:1.1rem 2.2rem}
    .label{display:inline-flex;align-items:center;gap:.8rem;font-size:.68rem;letter-spacing:.28em;text-transform:uppercase;color:#d4b56a;margin-bottom:1rem;font-weight:600}
    .title{font-family:var(--font-display);font-size:clamp(1.9rem,4vw,2.9rem);font-weight:500;line-height:1.15;margin-bottom:.75rem;color:#f5f2eb}
    .title em{font-style:italic}
    .desc{color:#b0aaa2;max-width:48ch}.desc-center{margin:0 auto;text-align:center}
    .section{padding:4.5rem 0}.section-alt{background:var(--noir-soft);color:var(--blanc-casse)}.section-alt .title,.section-alt h3{color:var(--blanc-casse)}.section-alt .desc,.section-alt p{color:var(--text-muted)}.section-head{margin-bottom:2.25rem}
    .hero{position:relative;min-height:100vh;min-height:100dvh;display:flex;align-items:center;overflow:hidden;padding:calc(var(--header-h) + 2rem) 0 3rem}
    .hero-media{position:absolute;inset:0}
    .hero-shell{position:relative;z-index:2;width:min(1280px,92%);margin:0 auto;display:grid;grid-template-columns:1.05fr .95fr;gap:2.5rem;align-items:center}
    .hero-eyebrow{font-size:.68rem;letter-spacing:.28em;text-transform:uppercase;color:#d4b56a;font-weight:600;margin-bottom:1.2rem}
    .hero h1{font-family:var(--font-display);font-size:clamp(2.5rem,5.5vw,4.8rem);font-weight:500;line-height:1.04;max-width:12ch;margin-bottom:1.1rem;color:#f5f2eb}
    .hero h1 em{font-style:italic}.hero-break{display:block}
    .hero-sub{color:#b0aaa2;max-width:42ch;margin-bottom:1.35rem;font-size:1.08rem}
    .hero-price{display:flex;flex-direction:column;gap:.35rem;margin-bottom:1.6rem}
    .hero-price strong{font-family:var(--font-display);font-size:1.55rem;color:#f5f2eb;font-weight:500}
    .hero-price strong span{color:#d4b56a;font-style:italic}
    .hero-price span{font-size:.78rem;color:#b0aaa2;letter-spacing:.06em;text-transform:uppercase}
    .hero-actions{display:flex;flex-wrap:wrap;gap:.8rem}
    .hero-devices{position:relative;min-height:360px}
    .device{position:absolute;background:#141414;border:1px solid rgba(12,11,10,.12);box-shadow:0 28px 60px rgba(12,11,10,.22);overflow:hidden;border-radius:10px}
    .device-bar{display:flex;gap:.3rem;align-items:center;padding:.5rem .7rem;background:#1a1a1a;border-bottom:1px solid rgba(245,242,235,.06)}
    .device-bar i{width:7px;height:7px;border-radius:50%;background:#3a3a3a;display:block}
    .device img{width:100%;aspect-ratio:16/10;object-fit:cover;object-position:top;display:block}
    .device-main{width:min(100%,420px);right:4%;top:4%;z-index:3}
    .device-side{width:min(55%,230px);left:0;bottom:8%;z-index:2}
    .device-phone{width:96px;right:0;bottom:0;z-index:4;border-radius:16px}
    .device-phone img{aspect-ratio:9/16}
    .pricing-grid{display:grid;gap:1px;background:rgba(12,11,10,.08);border:1px solid rgba(12,11,10,.08)}
    @media(min-width:960px){.pricing-grid{grid-template-columns:repeat(4,1fr)}.why-grid-4,.steps-grid{grid-template-columns:repeat(3,1fr)}}
    .why-grid-4,.steps-grid{display:grid;gap:1.15rem}
    @media(min-width:900px){.why-grid-4{grid-template-columns:repeat(4,1fr)}.steps-grid{grid-template-columns:repeat(3,1fr)}}
    .pricing-card{background:#141414;padding:1.5rem;display:flex;flex-direction:column}
    .pricing-card--featured{background:#181818;color:#f5f2eb;border:1px solid rgba(212,181,106,.35)}
    .pricing-tier,.audience{font-size:.62rem;letter-spacing:.18em;text-transform:uppercase;color:#d4b56a;margin-bottom:.45rem;font-weight:600;display:block}
    .pricing-name{font-family:var(--font-display);font-size:1.45rem;font-weight:500;margin-bottom:.35rem}
    .pricing-price{font-family:var(--font-display);font-size:2rem;margin:.35rem 0 .5rem;color:#f5f2eb}
    .pricing-card--featured .pricing-price{color:#e8d09a}
    .pricing-tagline,.pricing-features,.why-card p,.step-card p{color:#b0aaa2;font-size:.9rem}
    .pricing-card--featured .pricing-tagline,.pricing-card--featured .pricing-features,.pricing-card--featured .audience,.pricing-card--featured .pricing-name{color:rgba(243,238,230,.85)}
    .pricing-features{list-style:none;margin:0 0 1.1rem;padding:0;flex:1}.pricing-features li{padding:.28rem 0;border-bottom:1px solid rgba(12,11,10,.06)}
    .pricing-ribbon{display:inline-block;font-size:.56rem;letter-spacing:.16em;text-transform:uppercase;color:#111;background:linear-gradient(90deg,#d4b56a,#e8d09a);padding:.35rem .65rem;margin-bottom:.55rem;font-weight:600}
    .pricing-note{color:#b0aaa2;font-size:.8rem;margin-top:1.5rem;max-width:56ch}
    .why-card,.step-card{border-top:1px solid rgba(12,11,10,.12);padding:1.5rem 0}
    .why-card h3,.step-card h3{font-family:var(--font-display);font-size:1.4rem;font-weight:500;margin-bottom:.4rem;color:#f5f2eb}
    .footer{border-top:1px solid rgba(245,242,235,.08);padding:3rem 0 2rem;background:#080808;color:var(--blanc-casse)}
    .footer-grid{display:grid;gap:1.25rem}@media(min-width:800px){.footer-grid{grid-template-columns:1.4fr 1fr 1fr 1fr}}
    .footer-col h4{font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--or);margin-bottom:.7rem}
    .footer-col a,.footer-col span,.footer-brand p{display:block;color:var(--text-muted);font-size:.9rem;margin-bottom:.3rem}
    .footer-bottom{margin-top:1.5rem;padding-top:1rem;border-top:1px solid rgba(245,242,235,.06);color:var(--text-muted);font-size:.8rem;display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap}
    .footer .logo{color:var(--blanc-casse)}
    .faq h3{font-family:var(--font-display);font-weight:500;margin:1.2rem 0 .4rem;color:var(--blanc-casse)}.faq p{color:var(--text-muted)}
    .reveal{opacity:0;transform:translateY(18px);transition:.7s var(--ease)}.reveal.visible{opacity:1;transform:none}
    @media(max-width:900px){.hero-shell{grid-template-columns:1fr}.hero-devices{min-height:260px}.device-side{display:none}.device-main{position:relative;width:100%;right:auto;top:auto}.nav{display:none;position:absolute;top:var(--header-h);left:0;right:0;background:#080808;flex-direction:column;padding:1rem}.nav.open{display:flex}.burger{display:block;margin-left:auto}.hero{min-height:auto}}
    @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}.reveal{opacity:1;transform:none}}
  </style>
</head>
<body class="atelier">
  <header class="header" id="header"><div class="header-inner">
    <a href="/en/" class="logo">Aure<span>lis</span></a>
    <nav class="nav" id="nav">
      <a href="#top">Home</a>
      <a href="#work">Work</a>
      <a href="#offers">Offers</a>
      <a href="#services">Why Aurelis</a>
      <a href="#contact">Contact</a>
      <a href="#offers" class="nav-cta" data-lead-open="1" data-track-cta="nav_create_site">Create my website</a>
    </nav>
    <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
  </div></header>

  <section class="hero" id="top">
    <div class="hero-media" aria-hidden="true"></div>
    <div class="hero-shell">
      <div class="hero-copy">
        <p class="hero-eyebrow">Premium web agency</p>
        <h1>Aurelis builds <em>premium</em> websites<span class="hero-break">for ambitious businesses.</span></h1>
        <p class="hero-sub">High-end websites for brands and companies that care about craft, performance and human guidance. Request your project in minutes.</p>
        <div class="hero-price" role="status">
          <strong>Website design from <span>€990 excl. VAT</span></strong>
          <span>Clear offers · No online payment yet</span>
        </div>
        <div class="hero-actions">
          <a href="#offers" class="btn btn-gold btn-cta-xl" data-lead-open="1" data-track-cta="hero_create_site">Create my website</a>
          <a href="#work" class="btn btn-ghost" data-track-cta="hero_work">See our work</a>
        </div>
      </div>
      <div class="hero-devices" aria-hidden="true">
        <a class="device device-main" href="/en/work/mr-gaston/" tabindex="-1">
          <div class="device-bar"><i></i><i></i><i></i></div>
          <img src="/assets/portfolio/mr-gaston/capture-desktop.jpg" alt="" width="900" height="560" fetchpriority="high" decoding="async">
        </a>
        <a class="device device-side" href="https://bryan-burger.vercel.app/" target="_blank" rel="noopener noreferrer" tabindex="-1">
          <div class="device-bar"><i></i><i></i><i></i></div>
          <img src="/assets/portfolio/bryan-burger/capture-desktop.jpg" alt="" width="700" height="440" decoding="async">
        </a>
        <a class="device device-phone" href="/en/work/mr-gaston/" tabindex="-1">
          <img src="/assets/portfolio/mr-gaston/capture-mobile.jpg" alt="" width="400" height="700" decoding="async">
        </a>
      </div>
    </div>
  </section>

  <section class="folio section-light" id="work">
    <div class="folio-head reveal">
      <div class="label">Our work</div>
      <h2 class="title">Completed <em>projects.</em></h2>
      <p class="desc">Only delivered, live websites — large formats, real interfaces, no stock photography.</p>
    </div>
    <div class="folio-stage">
      <article class="folio-project folio-project--feature reveal">
        <a class="folio-visual" href="/en/work/mr-gaston/">
          <img src="/assets/portfolio/mr-gaston/capture-desktop.jpg" alt="Mr Gaston — desktop capture" width="1600" height="1000" fetchpriority="high" decoding="async">
          <span class="folio-stack" aria-hidden="true"><img src="/assets/portfolio/mr-gaston/capture-mobile.jpg" alt="" width="390" height="780" loading="lazy"></span>
        </a>
        <div class="folio-meta">
          <div class="folio-kicker">Flagship project</div>
          <h3>Mr Gaston</h3>
          <div class="folio-sector">Artisan restaurant — Mons</div>
          <p>An immersive digital world for an artisan friterie: identity, menu, atmosphere and ordering — designed to convince in seconds.</p>
          <ul class="folio-deliverables"><li>Identity &amp; design</li><li>Menu &amp; content</li><li>Mobile &amp; desktop</li><li>Ordering flow</li></ul>
          <a href="/en/work/mr-gaston/" class="folio-cta">Discover the project</a>
        </div>
      </article>
      <a class="folio-project reveal" href="https://bryan-burger.vercel.app/" target="_blank" rel="noopener noreferrer">
        <div class="folio-visual"><img src="/assets/portfolio/bryan-burger/capture-desktop.jpg" alt="Bryan Burger website" width="1400" height="900" loading="lazy"></div>
        <div class="folio-meta">
          <div class="folio-kicker">Live project</div>
          <h3>Bryan Burger</h3>
          <div class="folio-sector">Fast food — Mons</div>
          <p>Mobile-first website clarifying the menu and speeding up orders.</p>
          <ul class="folio-deliverables"><li>Clear menu</li><li>Mobile experience</li><li>Order path</li><li>Custom design</li></ul>
          <span class="folio-cta">Discover the project</span>
        </div>
      </a>
      <a class="folio-project folio-project--alt reveal" href="https://transport-delivery.vercel.app/" target="_blank" rel="noopener noreferrer">
        <div class="folio-visual"><img src="/assets/portfolio/trans-delivery/capture-desktop.png" alt="Trans Delivery website" width="1400" height="900" loading="lazy"></div>
        <div class="folio-meta">
          <div class="folio-kicker">Live project</div>
          <h3>Trans Delivery</h3>
          <div class="folio-sector">Transport &amp; logistics</div>
          <p>Professional credibility online: services, tracking and immediate contact.</p>
          <ul class="folio-deliverables"><li>Pro positioning</li><li>Services &amp; contact</li><li>Credibility</li><li>Responsive</li></ul>
          <span class="folio-cta">Discover the project</span>
        </div>
      </a>
    </div>
  </section>

  <section class="offers-atelier section-light" id="offers">
    <div class="section-head reveal">
      <div class="label">Offers</div>
      <h2 class="title">The website you <em>need</em>.</h2>
      <p class="desc">From a professional one-pager to a fully custom digital experience — compare, choose, start.</p>
    </div>
    <div class="pricing-grid" style="width:min(1280px,92%);margin:0 auto">
      <article class="pricing-card reveal"><div class="pricing-tier">01</div><h3 class="pricing-name">Aurelis Essential</h3><div class="pricing-price">€990 excl. VAT</div><span class="audience">Independents &amp; small businesses</span><p class="pricing-tagline">A clean, credible one-page presence.</p><ul class="pricing-features"><li>One-page showcase website</li><li>Professional design</li><li>Desktop, tablet and mobile</li><li>Contact form</li><li>Basic SEO</li><li>Social links</li><li>One round of revisions</li></ul><a href="#" class="btn btn-ghost" data-offer="Aurelis Essential" data-price="€990 excl. VAT" data-lead-open="1">Choose this offer</a></article>
      <article class="pricing-card reveal"><div class="pricing-tier">02</div><h3 class="pricing-name">Aurelis Signature</h3><div class="pricing-price">€2,490 excl. VAT</div><span class="audience">Growing companies</span><p class="pricing-tagline">A fuller image, up to 5 pages.</p><ul class="pricing-features"><li>Up to 5 pages</li><li>Custom design</li><li>Elegant animations</li><li>Initial SEO</li><li>Custom forms</li><li>Analytics tools</li><li>Two rounds of revisions</li></ul><a href="#" class="btn btn-ghost" data-offer="Aurelis Signature" data-price="€2,490 excl. VAT" data-lead-open="1">Choose this offer</a></article>
      <article class="pricing-card pricing-card--featured reveal"><div class="pricing-ribbon">Our pick</div><div class="pricing-tier">03</div><h3 class="pricing-name">Aurelis Prestige</h3><div class="pricing-price">€4,490 excl. VAT</div><span class="audience">Premium brands</span><p class="pricing-tagline">High-end experience, up to 10 pages.</p><ul class="pricing-features"><li>Up to 10 pages</li><li>High-end design</li><li>Advanced animations</li><li>Interactive experiences</li><li>In-depth technical SEO</li><li>Conversion optimisation</li><li>Business integrations (quote)</li><li>Three rounds of revisions</li></ul><a href="#" class="btn btn-gold" data-offer="Aurelis Prestige" data-price="€4,490 excl. VAT" data-lead-open="1">Choose this offer</a></article>
      <article class="pricing-card reveal"><div class="pricing-tier">04</div><h3 class="pricing-name">Aurelis Elite</h3><div class="pricing-price">From €7,490 excl. VAT</div><span class="audience">E-commerce &amp; bespoke</span><p class="pricing-tagline">Complex architecture, platform or shop.</p><ul class="pricing-features"><li>Bespoke development</li><li>E-commerce or web platform</li><li>Admin area as needed</li><li>Secure payments if required</li><li>AI integrations</li><li>Automations</li><li>Personalised support</li></ul><a href="#" class="btn btn-ghost" data-offer="Aurelis Elite" data-price="From €7,490 excl. VAT" data-lead-open="1">Choose this offer</a></article>
    </div>
    <p class="pricing-note" style="width:min(1280px,92%);margin:1.5rem auto 0">Prices exclude VAT. Hosting, domains, maintenance and third-party services billed separately. No online payment on this site yet — you start with a project request.</p>
  </section>

  <section class="section section-light" id="services">
    <div class="container">
      <div class="section-head reveal"><div class="label">Why Aurelis</div><h2 class="title">Why choose <em>Aurelis</em>?</h2></div>
      <div class="why-grid-4">
        <article class="why-card reveal"><div class="audience">01 — Premium design</div><h3>Premium design</h3><p>Modern, custom websites — not generic templates.</p></article>
        <article class="why-card reveal"><div class="audience">02 — Performance</div><h3>Performance</h3><p>Fast experiences adapted to every device.</p></article>
        <article class="why-card reveal"><div class="audience">03 — Support</div><h3>Support</h3><p>A dedicated contact throughout your project.</p></article>
        <article class="why-card reveal"><div class="audience">04 — Growth</div><h3>Growth</h3><p>Solutions built to grow with your business.</p></article>
      </div>
    </div>
  </section>

  <section class="section section-light" id="process">
    <div class="container">
      <div class="section-head reveal"><div class="label">How it works</div><h2 class="title">Your new website in <em>3 steps</em>.</h2></div>
      <div class="steps-grid">
        <article class="step-card reveal"><h3>Tell us about your project.</h3><p>Pick an offer and describe your needs. Aurelis receives your request.</p></article>
        <article class="step-card reveal"><h3>We build your website.</h3><p>After a human conversation, we create an experience suited to your business.</p></article>
        <article class="step-card reveal"><h3>Your site goes live.</h3><p>After validation and finalisation, your website is published.</p></article>
      </div>
      <p style="text-align:center;margin-top:2rem"><a href="#offers" class="btn btn-gold btn-cta-xl" data-lead-open="1">Create my website</a></p>
    </div>
  </section>

  <section class="section section-alt" id="faq">
    <div class="container faq" style="max-width:760px">
      <div class="section-head reveal"><div class="label">FAQ</div><h2 class="title" style="color:var(--blanc-casse)">Common <em>questions</em></h2></div>
      <div class="reveal">
        <h3>How much does a website cost?</h3>
        <p>Official offers start at €990 excl. VAT (Essential) up to Elite from €7,490 excl. VAT. Prestige at €4,490 excl. VAT is our recommended pick.</p>
        <h3>Can I pay online now?</h3>
        <p>Not yet. You start with a project request. We finalise scope and payment with you directly — no fake checkout.</p>
        <h3>How long does it take?</h3>
        <p>Typically 2 to 4 weeks after design validation for Essential and Signature; longer for Prestige or Elite.</p>
      </div>
    </div>
  </section>

  <section class="section section-alt" id="contact">
    <div class="container reveal">
      <div class="label" style="justify-content:flex-start">Contact</div>
      <h2 class="title" style="color:var(--blanc-casse)">Let’s talk about your <em>website</em></h2>
      <p class="desc" style="margin-bottom:1.25rem;color:var(--text-muted)">Jules Therasse — Founder of Aurelis<br><a href="tel:+32495380329" style="color:var(--or)">0495 38 03 29</a> · <a href="mailto:julestherasse@gmail.com" style="color:var(--or)">julestherasse@gmail.com</a></p>
      <a href="#" class="btn btn-gold btn-cta-xl" data-lead-open="1" data-track-cta="contact_create_site" style="background:var(--or);color:#111">Create my website</a>
    </div>
  </section>

  <footer class="footer"><div class="container">
    <div class="footer-grid">
      <div class="footer-brand"><a href="/en/" class="logo">Aure<span>lis</span></a><p>Premium website design agency — clear offers from €990 excl. VAT.</p></div>
      <div class="footer-col"><h4>Contact</h4><span>Jules Therasse</span><a href="tel:+32495380329">0495 38 03 29</a><a href="mailto:julestherasse@gmail.com">julestherasse@gmail.com</a></div>
      <div class="footer-col"><h4>Explore</h4><a href="#offers">Offers</a><a href="#work">Work</a><a href="/en/offers/">Full offers page</a></div>
      <div class="footer-col"><h4>Legal</h4><a href="/en/legal-notice/">Legal notice</a><a href="/en/privacy-policy/">Privacy</a><a href="/">Version française</a></div>
    </div>
    <div class="footer-bottom"><p>&copy; 2026 Aurelis</p><p>We sell websites — clearly.</p></div>
  </div></footer>

  <script src="/assets/config.js" defer></script>
  <script src="/assets/offers-catalog.js" defer></script>
  <script src="/assets/locale.js" defer></script>
  <script src="/assets/analytics.js" defer></script>
  <script src="/assets/consent.js" defer></script>
  <script src="/assets/lead-funnel.js" defer></script>
  <script>
    document.getElementById('burger')?.addEventListener('click', function () {
      document.getElementById('nav').classList.toggle('open');
    });
    var header = document.getElementById('header');
    function syncHeaderTheme() {
      if (!header) return;
      header.classList.toggle('scrolled', window.scrollY > 50);
      var probe = document.elementFromPoint(Math.min(120, window.innerWidth / 2), 72);
      var dark = false;
      while (probe && probe !== document.body) {
        if (probe.id === 'faq' || probe.id === 'contact' || probe.classList.contains('section-alt') || probe.classList.contains('footer')) { dark = true; break; }
        if (probe.classList.contains('hero') || probe.classList.contains('section-light') || probe.classList.contains('folio') || probe.classList.contains('offers-atelier')) { dark = false; break; }
        probe = probe.parentElement;
      }
      header.classList.toggle('is-dark', dark);
    }
    window.addEventListener('scroll', syncHeaderTheme, { passive: true });
    syncHeaderTheme();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
    document.querySelectorAll('[data-track-cta]').forEach(function (el) {
      el.addEventListener('click', function () {
        if (window.AurelisAnalytics && window.AurelisAnalytics.ctaClick) {
          window.AurelisAnalytics.ctaClick(this.getAttribute('data-track-cta') || 'cta');
        }
      });
    });
  </script>
</body>
</html>
`;

mkdirSync(join(root, "en"), { recursive: true });
writeFileSync(join(root, "en", "index.html"), html, "utf8");
console.log("wrote en/index.html");
