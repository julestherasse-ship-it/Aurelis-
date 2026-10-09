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
  <meta name="description" content="Aurelis builds modern, fast, custom websites. Professional site from €990 excl. VAT. Essential, Signature, Prestige and Elite offers.">
  <link rel="canonical" href="https://aurelis.ink/en/">
  <link rel="alternate" hreflang="en" href="https://aurelis.ink/en/">
  <link rel="alternate" hreflang="fr" href="https://aurelis.ink/">
  <link rel="alternate" hreflang="x-default" href="https://aurelis.ink/">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_GB">
  <meta property="og:title" content="Aurelis — Premium website design">
  <meta property="og:description" content="Modern custom websites. Your professional site from €990 excl. VAT.">
  <meta property="og:url" content="https://aurelis.ink/en/">
  <meta name="robots" content="index,follow">
  <meta name="theme-color" content="#080808">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/lead-funnel.css">
  <link rel="stylesheet" href="/assets/site-ui.css">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Aurelis","url":"https://aurelis.ink/","email":"julestherasse@gmail.com","telephone":"+32495380329","founder":{"@type":"Person","name":"Jules Therasse"}}</script>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{--noir:#080808;--noir-soft:#121212;--blanc-casse:#f5f2eb;--blanc-muted:#f0ebe3;--or:#d4b56a;--or-light:#e8d09a;--text-muted:#b0aaa2;--font-display:'Cormorant Garamond',Georgia,serif;--font-body:Outfit,system-ui,sans-serif;--header-h:86px;--ease:cubic-bezier(.22,1,.36,1)}
    body{font-family:var(--font-body);background:var(--noir);color:var(--blanc-casse);line-height:1.7;font-weight:300;-webkit-font-smoothing:antialiased}
    a{color:inherit;text-decoration:none}button{font-family:inherit;cursor:pointer;border:none;background:none}
    .container{width:min(1100px,90%);margin:0 auto}
    .header{position:fixed;inset:0 0 auto;z-index:100;background:rgba(8,8,8,.72);backdrop-filter:blur(14px);border-bottom:1px solid rgba(212,181,106,.08)}
    .header-inner{width:min(1200px,92%);margin:0 auto;min-height:var(--header-h);display:flex;align-items:center;gap:1rem}
    .logo{font-family:var(--font-display);font-size:1.55rem}.logo span{color:var(--or)}
    .nav{margin-left:auto;display:flex;gap:1.1rem;align-items:center;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase}
    .nav a{color:var(--text-muted)}.nav-cta{color:#111!important;background:var(--or);padding:.55rem .95rem;font-weight:600}
    .burger{display:none}.btn{display:inline-flex;align-items:center;gap:.5rem;padding:.95rem 1.4rem;font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;font-weight:600}
    .btn-gold{background:var(--or);color:#111;box-shadow:0 12px 32px rgba(212,181,106,.28)}.btn-ghost{border:1px solid rgba(245,242,235,.22)}
    .btn-cta-xl{padding:1.1rem 2.2rem}
    .label{display:inline-flex;align-items:center;gap:.8rem;font-size:.68rem;letter-spacing:.28em;text-transform:uppercase;color:var(--or);margin-bottom:1rem;justify-content:center;font-weight:600}
    .title{font-family:var(--font-display);font-size:clamp(1.9rem,4vw,2.9rem);font-weight:500;line-height:1.15;margin-bottom:.75rem}
    .title em{font-style:italic;color:var(--or-light)}
    .desc{color:var(--text-muted);max-width:48ch}.desc-center{margin:0 auto;text-align:center}
    .section{padding:4.5rem 0}.section-alt{background:var(--noir-soft)}.section-head{text-align:center;margin-bottom:2.25rem}
    .hero{position:relative;min-height:100vh;min-height:100dvh;display:flex;align-items:center;overflow:hidden;padding:calc(var(--header-h) + 2rem) 0 3rem}
    .hero-media{position:absolute;inset:0;background:radial-gradient(ellipse 55% 50% at 85% 20%,rgba(212,181,106,.16),transparent 55%),linear-gradient(165deg,#0c0b09,var(--noir))}
    .hero-media img{width:100%;height:100%;object-fit:cover;opacity:.25}
    .hero-media::after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,rgba(8,8,8,.94) 0%,rgba(8,8,8,.75) 45%,rgba(8,8,8,.5) 100%)}
    .hero-shell{position:relative;z-index:2;width:min(1200px,90%);margin:0 auto;display:grid;grid-template-columns:1.05fr .95fr;gap:2.5rem;align-items:center}
    .hero-eyebrow{font-size:.68rem;letter-spacing:.28em;text-transform:uppercase;color:var(--or);font-weight:600;margin-bottom:1.2rem}
    .hero h1{font-family:var(--font-display);font-size:clamp(2.5rem,5.5vw,4.4rem);font-weight:500;line-height:1.06;max-width:11ch;margin-bottom:1.1rem}
    .hero h1 em{font-style:italic;color:var(--or-light);display:block}
    .hero-sub{color:var(--blanc-muted);max-width:38ch;margin-bottom:1.35rem;font-size:1.08rem}
    .hero-price{display:inline-flex;flex-wrap:wrap;gap:.5rem;align-items:baseline;margin-bottom:1.6rem;padding:.8rem 1.1rem;border:1px solid rgba(212,181,106,.35);background:rgba(212,181,106,.08)}
    .hero-price strong{font-family:var(--font-display);font-size:1.45rem;color:var(--or-light);font-weight:500}
    .hero-price span{font-size:.78rem;color:var(--blanc-muted)}
    .hero-actions{display:flex;flex-wrap:wrap;gap:.8rem}
    .hero-devices{position:relative;min-height:320px}
    .device{position:absolute;background:#141414;border:1px solid rgba(212,181,106,.22);box-shadow:0 24px 50px rgba(0,0,0,.5);overflow:hidden}
    .device-bar{display:flex;gap:.3rem;align-items:center;padding:.5rem .7rem;background:#1a1a1a;border-bottom:1px solid rgba(245,242,235,.06)}
    .device-bar i{width:7px;height:7px;border-radius:50%;background:#3a3a3a;display:block}
    .device img{width:100%;aspect-ratio:16/10;object-fit:cover;display:block}
    .device-main{width:min(100%,400px);right:6%;top:6%;transform:rotate(-1.5deg);z-index:3}
    .device-side{width:min(55%,230px);left:0;bottom:0;transform:rotate(2deg);z-index:2}
    .quality-grid,.pricing-grid,.why-grid-4,.steps-grid{display:grid;gap:1.15rem}
    @media(min-width:900px){.quality-grid{grid-template-columns:repeat(3,1fr)}.pricing-grid{grid-template-columns:repeat(4,1fr)}.why-grid-4{grid-template-columns:repeat(4,1fr)}.steps-grid{grid-template-columns:repeat(3,1fr)}}
    .quality-card,.pricing-card,.why-card,.step-card{border:1px solid rgba(212,181,106,.14);background:#0d0d0d;padding:0;overflow:hidden}
    .quality-meta,.pricing-card,.why-card,.step-card{padding:1.25rem}
    .quality-meta .kicker,.audience,.pricing-tier{font-size:.62rem;letter-spacing:.18em;text-transform:uppercase;color:var(--or);margin-bottom:.45rem;font-weight:600;display:block}
    .quality-meta h3,.pricing-name,.why-card h3,.step-card h3{font-family:var(--font-display);font-size:1.4rem;font-weight:500;margin-bottom:.4rem}
    .quality-meta p,.pricing-tagline,.why-card p,.step-card p,.pricing-features{color:var(--text-muted);font-size:.9rem}
    .pricing-features{list-style:none;margin:0 0 1.1rem;padding:0}.pricing-features li{padding:.28rem 0;border-bottom:1px solid rgba(245,242,235,.05)}
    .pricing-price{font-family:var(--font-display);font-size:1.7rem;color:var(--or-light);margin:.35rem 0 .5rem}
    .pricing-card--featured{border-color:rgba(212,181,106,.45);background:linear-gradient(175deg,rgba(38,32,22,.98),rgba(12,11,9,.99))}
    .pricing-ribbon{display:inline-block;font-size:.56rem;letter-spacing:.16em;text-transform:uppercase;color:#111;background:linear-gradient(90deg,var(--or),var(--or-light));padding:.35rem .65rem;margin-bottom:.55rem;font-weight:600}
    .pricing-note{text-align:center;color:var(--text-muted);font-size:.8rem;margin-top:1.5rem;max-width:56ch;margin-inline:auto}
    .step-card::before{content:attr(data-step);display:block;font-family:var(--font-display);font-size:1.8rem;color:var(--or);margin-bottom:.75rem}
    .footer{border-top:1px solid rgba(245,242,235,.08);padding:3rem 0 2rem}.footer-grid{display:grid;gap:1.25rem}@media(min-width:800px){.footer-grid{grid-template-columns:1.4fr 1fr 1fr 1fr}}
    .footer-col h4{font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--or);margin-bottom:.7rem}
    .footer-col a,.footer-col span,.footer-brand p{display:block;color:var(--text-muted);font-size:.9rem;margin-bottom:.3rem}
    .footer-bottom{margin-top:1.5rem;padding-top:1rem;border-top:1px solid rgba(245,242,235,.06);color:var(--text-muted);font-size:.8rem;display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap}
    .faq h3{font-family:var(--font-display);font-weight:500;margin:1.2rem 0 .4rem}.faq p{color:var(--text-muted)}
    .reveal{opacity:0;transform:translateY(14px);transition:.5s ease}.reveal.visible{opacity:1;transform:none}
    @media(max-width:900px){.hero-shell{grid-template-columns:1fr}.hero-devices{display:none}.nav{display:none;position:absolute;top:var(--header-h);left:0;right:0;background:#0c0c0c;flex-direction:column;padding:1rem}.nav.open{display:flex}.burger{display:block;width:2rem;height:2rem}.burger span{display:block;height:1px;background:#fff;margin:6px 0}.hero{min-height:auto}}
    @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}.reveal{opacity:1;transform:none}}
  </style>
</head>
<body>
  <header class="header"><div class="header-inner">
    <a href="/en/" class="logo">Aure<span>lis</span></a>
    <nav class="nav" id="nav">
      <a href="#top">Home</a>
      <a href="#offers">Offers</a>
      <a href="#work">Work</a>
      <a href="#services">Services</a>
      <a href="#contact">Contact</a>
      <a href="#offers" class="nav-cta" data-lead-open="1" data-track-cta="nav_create_site">Create my website</a>
    </nav>
    <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
  </div></header>

  <section class="hero" id="top">
    <div class="hero-media" aria-hidden="true">
      <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=70" alt="" width="2000" height="1333" fetchpriority="high" decoding="async">
    </div>
    <div class="hero-shell">
      <div>
        <p class="hero-eyebrow">Premium website design agency</p>
        <h1>Your website.<em>Our expertise.</em></h1>
        <p class="hero-sub">We build modern, fast, custom websites that give your business a clear edge online.</p>
        <div class="hero-price"><strong>Professional website from €990 excl. VAT</strong><span>Clear offers · No online payment yet</span></div>
        <div class="hero-actions">
          <a href="#offers" class="btn btn-gold btn-cta-xl" data-lead-open="1" data-track-cta="hero_create_site">Create my website</a>
          <a href="#work" class="btn btn-ghost" data-track-cta="hero_work">Discover our work</a>
        </div>
      </div>
      <div class="hero-devices" aria-hidden="true">
        <a class="device device-main" href="https://bryan-burger.vercel.app/" target="_blank" rel="noopener noreferrer" tabindex="-1">
          <div class="device-bar"><i></i><i></i><i></i></div>
          <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=70" alt="" width="900" height="560" decoding="async">
        </a>
        <a class="device device-side" href="https://transport-delivery.vercel.app/" target="_blank" rel="noopener noreferrer" tabindex="-1">
          <div class="device-bar"><i></i><i></i><i></i></div>
          <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&q=70" alt="" width="700" height="440" decoding="async">
        </a>
      </div>
    </div>
  </section>

  <section class="section section-alt" id="work">
    <div class="container">
      <div class="section-head reveal"><div class="label">Visible quality</div><h2 class="title">Websites built to <em>convince</em></h2><p class="desc desc-center">Real Aurelis projects and demos — never invented anonymous clients.</p></div>
      <div class="quality-grid">
        <a class="quality-card reveal" href="https://bryan-burger.vercel.app/" target="_blank" rel="noopener noreferrer"><div class="device-bar"><i></i><i></i><i></i></div><img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=75" alt="Bryan Burger" width="1000" height="625" loading="lazy"><div class="quality-meta"><div class="kicker">Live project</div><h3>Bryan Burger</h3><p>Fast food — clear menu, mobile-first, instant contact.</p></div></a>
        <a class="quality-card reveal" href="https://transport-delivery.vercel.app/" target="_blank" rel="noopener noreferrer"><div class="device-bar"><i></i><i></i><i></i></div><img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=75" alt="Trans Delivery" width="1000" height="625" loading="lazy"><div class="quality-meta"><div class="kicker">Live project</div><h3>Trans Delivery</h3><p>Transport &amp; logistics — professional credibility and contact.</p></div></a>
        <a class="quality-card reveal" href="https://aurelis-demo-coiffeur-hzng7c525-julestherasse-9969s-projects.vercel.app/" target="_blank" rel="noopener noreferrer"><div class="device-bar"><i></i><i></i><i></i></div><img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=75" alt="Salon demo" width="1000" height="625" loading="lazy"><div class="quality-meta"><div class="kicker">Aurelis demo</div><h3>Premium salon</h3><p>Model site for a high-end salon — clearly labelled as a demonstration.</p></div></a>
      </div>
    </div>
  </section>

  <section class="section" id="offers">
    <div class="container">
      <div class="section-head reveal"><div class="label">Offers</div><h2 class="title">The website you <em>need</em>.</h2><p class="desc desc-center">From a professional one-pager to a fully custom digital experience.</p></div>
      <div class="pricing-grid">
        <article class="pricing-card reveal"><div class="pricing-tier">01</div><h3 class="pricing-name">Aurelis Essential</h3><div class="pricing-price">€990 excl. VAT</div><span class="audience">Independents &amp; small businesses</span><p class="pricing-tagline">A clean, credible one-page presence.</p><ul class="pricing-features"><li>One-page showcase website</li><li>Professional design</li><li>Desktop, tablet and mobile</li><li>Contact form</li><li>Basic SEO</li><li>Social links</li><li>One round of revisions</li></ul><a href="#" class="btn btn-ghost" data-offer="Aurelis Essential" data-price="€990 excl. VAT" data-lead-open="1">Choose this offer</a></article>
        <article class="pricing-card reveal"><div class="pricing-tier">02</div><h3 class="pricing-name">Aurelis Signature</h3><div class="pricing-price">€2,490 excl. VAT</div><span class="audience">Growing companies</span><p class="pricing-tagline">A fuller image, up to 5 pages.</p><ul class="pricing-features"><li>Up to 5 pages</li><li>Custom design</li><li>Elegant animations</li><li>Initial SEO</li><li>Custom forms</li><li>Analytics tools</li><li>Two rounds of revisions</li></ul><a href="#" class="btn btn-ghost" data-offer="Aurelis Signature" data-price="€2,490 excl. VAT" data-lead-open="1">Choose this offer</a></article>
        <article class="pricing-card pricing-card--featured reveal"><div class="pricing-ribbon">Our pick</div><div class="pricing-tier">03</div><h3 class="pricing-name">Aurelis Prestige</h3><div class="pricing-price">€4,490 excl. VAT</div><span class="audience">Premium brands</span><p class="pricing-tagline">High-end experience, up to 10 pages.</p><ul class="pricing-features"><li>Up to 10 pages</li><li>High-end design</li><li>Advanced animations</li><li>Interactive experiences</li><li>In-depth technical SEO</li><li>Conversion optimisation</li><li>Business integrations (quote)</li><li>Three rounds of revisions</li></ul><a href="#" class="btn btn-gold" data-offer="Aurelis Prestige" data-price="€4,490 excl. VAT" data-lead-open="1">Choose this offer</a></article>
        <article class="pricing-card reveal"><div class="pricing-tier">04</div><h3 class="pricing-name">Aurelis Elite</h3><div class="pricing-price">From €7,490 excl. VAT</div><span class="audience">E-commerce &amp; bespoke</span><p class="pricing-tagline">Complex architecture, platform or shop.</p><ul class="pricing-features"><li>Bespoke development</li><li>E-commerce or web platform</li><li>Admin area as needed</li><li>Secure payments if required</li><li>AI integrations</li><li>Automations</li><li>Personalised support</li></ul><a href="#" class="btn btn-ghost" data-offer="Aurelis Elite" data-price="From €7,490 excl. VAT" data-lead-open="1">Choose this offer</a></article>
      </div>
      <p class="pricing-note">Prices exclude VAT. Hosting, domains, maintenance and third-party services billed separately. No online payment on this site yet — you start with a project request.</p>
    </div>
  </section>

  <section class="section section-alt" id="services">
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

  <section class="section" id="process">
    <div class="container">
      <div class="section-head reveal"><div class="label">How it works</div><h2 class="title">Your new website in <em>3 steps</em>.</h2></div>
      <div class="steps-grid">
        <article class="step-card reveal" data-step="01"><h3>Tell us about your project.</h3><p>Pick an offer and describe your needs. Aurelis receives your request.</p></article>
        <article class="step-card reveal" data-step="02"><h3>We build your website.</h3><p>After a human conversation, we create an experience suited to your business.</p></article>
        <article class="step-card reveal" data-step="03"><h3>Your site goes live.</h3><p>After validation and finalisation, your website is published.</p></article>
      </div>
      <p style="text-align:center;margin-top:2rem"><a href="#offers" class="btn btn-gold btn-cta-xl" data-lead-open="1">Create my website</a></p>
    </div>
  </section>

  <section class="section section-alt" id="faq">
    <div class="container faq" style="max-width:760px">
      <div class="section-head reveal"><div class="label">FAQ</div><h2 class="title">Common <em>questions</em></h2></div>
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

  <section class="section" id="contact">
    <div class="container reveal">
      <div class="label" style="justify-content:flex-start">Contact</div>
      <h2 class="title">Let’s talk about your <em>website</em></h2>
      <p class="desc" style="margin-bottom:1.25rem">Jules Therasse — Founder of Aurelis<br><a href="tel:+32495380329" style="color:var(--or)">0495 38 03 29</a> · <a href="mailto:julestherasse@gmail.com" style="color:var(--or)">julestherasse@gmail.com</a></p>
      <a href="#" class="btn btn-gold btn-cta-xl" data-lead-open="1" data-track-cta="contact_create_site">Create my website</a>
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
