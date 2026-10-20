/**
 * Catalogue commercial Aurelis — source unique FR/EN.
 * Prix, positionnement, bénéfices et fonctionnalités pour conversion.
 */
(function (global) {
  "use strict";

  var OFFERS = [
    {
      id: "essential",
      name: "Aurelis Essential",
      featured: false,
      price: { amount: 990, from: false },
      priceLabel: { fr: "990 € HTVA", en: "€990 excl. VAT" },
      positioning: {
        fr: "L’essentiel pour une présence professionnelle.",
        en: "The essentials for a professional presence.",
      },
      audience: {
        fr: "Indépendants et petites entreprises",
        en: "Independents and small businesses",
      },
      benefit: {
        fr: "Un site vitrine clair et professionnel, sans investissement disproportionné.",
        en: "A clear, professional showcase site — without an oversized investment.",
      },
      tagline: {
        fr: "Pour indépendants et entreprises qui veulent une présence nette et crédible.",
        en: "For independents and businesses that need a clear, credible presence.",
      },
      features: {
        fr: [
          "Site vitrine d’une page",
          "Design professionnel",
          "Responsive mobile",
          "Formulaire de contact",
          "SEO de base",
          "Intégration des réseaux sociaux",
          "Une série de corrections",
        ],
        en: [
          "One-page showcase website",
          "Professional design",
          "Mobile responsive",
          "Contact form",
          "Basic SEO",
          "Social media integration",
          "One round of revisions",
        ],
      },
      budgetHint: { fr: "1 000 € – 2 500 €", en: "€1,000 – €2,500" },
      limits: {
        fr: [
          "Une seule page",
          "Pas d’animations avancées",
          "Une seule série de corrections",
        ],
        en: [
          "Single page only",
          "No advanced animations",
          "One revision round only",
        ],
      },
      howToStart: {
        fr: "Choisissez Essential → décrivez votre activité → nous vous recontactons sous 24 h.",
        en: "Choose Essential → describe your business → we reply within 24 hours.",
      },
    },
    {
      id: "signature",
      name: "Aurelis Signature",
      featured: false,
      price: { amount: 2490, from: false },
      priceLabel: { fr: "2 490 € HTVA", en: "€2,490 excl. VAT" },
      positioning: {
        fr: "Donnez une nouvelle dimension à votre entreprise.",
        en: "Give your business a stronger digital dimension.",
      },
      audience: {
        fr: "Entreprises souhaitant une présence plus complète",
        en: "Businesses that need a fuller online presence",
      },
      benefit: {
        fr: "Valoriser plusieurs services et construire une identité digitale plus forte.",
        en: "Present several services and build a stronger digital identity.",
      },
      tagline: {
        fr: "Pour entreprises ambitieuses qui souhaitent une image complète et distinctive.",
        en: "For ambitious businesses that want a fuller, distinctive image.",
      },
      features: {
        fr: [
          "Jusqu’à 5 pages",
          "Design personnalisé",
          "Animations élégantes",
          "SEO initial",
          "Formulaires personnalisés",
          "Outils d’analyse",
          "Deux séries de corrections",
        ],
        en: [
          "Up to 5 pages",
          "Custom design",
          "Elegant animations",
          "Initial SEO",
          "Custom forms",
          "Analytics tools",
          "Two rounds of revisions",
        ],
      },
      budgetHint: { fr: "2 500 € – 5 000 €", en: "€2,500 – €5,000" },
      limits: {
        fr: [
          "Maximum 5 pages",
          "Hors e-commerce / plateforme complexe",
          "Deux séries de corrections",
        ],
        en: [
          "Up to 5 pages",
          "No e-commerce / complex platform",
          "Two revision rounds",
        ],
      },
      howToStart: {
        fr: "Choisissez Signature → précisez vos pages et objectifs → devis après échange.",
        en: "Choose Signature → outline pages and goals → quote after a human call.",
      },
    },
    {
      id: "prestige",
      name: "Aurelis Prestige",
      featured: true,
      badge: { fr: "Notre sélection premium", en: "Our premium pick" },
      price: { amount: 4490, from: false },
      priceLabel: { fr: "4 490 € HTVA", en: "€4,490 excl. VAT" },
      positioning: {
        fr: "Une expérience digitale à la hauteur de votre ambition.",
        en: "A digital experience that matches your ambition.",
      },
      audience: {
        fr: "Marques et entreprises qui veulent se différencier",
        en: "Brands that want to stand out",
      },
      benefit: {
        fr: "Une expérience plus immersive, pensée pour inspirer confiance et conversion.",
        en: "A more immersive experience designed for trust and conversion.",
      },
      tagline: {
        fr: "Pour marques premium qui exigent une expérience digitale d’exception.",
        en: "For premium brands that demand an exceptional digital experience.",
      },
      features: {
        fr: [
          "Jusqu’à 10 pages",
          "Design haut de gamme",
          "Animations avancées",
          "Interactions personnalisées",
          "SEO technique approfondi",
          "Optimisation des conversions",
          "Intégrations définies au devis",
          "Trois séries de corrections",
        ],
        en: [
          "Up to 10 pages",
          "High-end design",
          "Advanced animations",
          "Custom interactions",
          "In-depth technical SEO",
          "Conversion optimisation",
          "Integrations defined in the quote",
          "Three rounds of revisions",
        ],
      },
      budgetHint: { fr: "5 000 € – 10 000 €", en: "€5,000 – €10,000" },
      limits: {
        fr: [
          "Maximum 10 pages (extensions au devis)",
          "Intégrations métier définies avant signature",
          "Trois séries de corrections incluses",
        ],
        en: [
          "Up to 10 pages (extensions quoted separately)",
          "Business integrations defined before signature",
          "Three revision rounds included",
        ],
      },
      howToStart: {
        fr: "Choisissez Prestige → décrivez l’expérience souhaitée → devis détaillé après audit.",
        en: "Choose Prestige → describe the experience you want → detailed quote after review.",
      },
    },
    {
      id: "elite",
      name: "Aurelis Elite",
      featured: false,
      price: { amount: 7490, from: true },
      priceLabel: {
        fr: "À partir de 7 490 € HTVA",
        en: "From €7,490 excl. VAT",
      },
      positioning: {
        fr: "Votre projet, sans les limites d’une solution standard.",
        en: "Your project — beyond a standard package.",
      },
      audience: {
        fr: "Entreprises aux besoins complexes",
        en: "Businesses with complex needs",
      },
      benefit: {
        fr: "Une solution sur mesure adaptée aux objectifs réels du projet.",
        en: "A bespoke solution shaped around the real project goals.",
      },
      tagline: {
        fr: "Pour projets complexes et internationaux nécessitant une architecture sur mesure.",
        en: "For complex and international projects that need a bespoke architecture.",
      },
      features: {
        fr: [
          "Architecture sur mesure",
          "E-commerce ou plateforme web",
          "Fonctionnalités avancées",
          "Intégrations IA",
          "Automatisations",
          "Espace administrateur selon les besoins",
          "Accompagnement personnalisé",
        ],
        en: [
          "Bespoke architecture",
          "E-commerce or web platform",
          "Advanced features",
          "AI integrations",
          "Automations",
          "Admin area as needed",
          "Personalised support",
        ],
      },
      budgetHint: { fr: "Plus de 10 000 €", en: "Over €10,000" },
      requiresCustomQuote: true,
      limits: {
        fr: [
          "Périmètre défini sur devis uniquement",
          "Délais et budget validés avant démarrage",
          "Pas de prix catalogue fixe",
        ],
        en: [
          "Scope defined by quote only",
          "Timeline and budget approved before start",
          "No fixed catalogue price",
        ],
      },
      howToStart: {
        fr: "Choisissez Elite → exposez vos contraintes → cadrage + devis sur mesure.",
        en: "Choose Elite → share constraints → scoping workshop + custom quote.",
      },
    },
  ];

  var NOTE = {
    fr: "Tarifs hors TVA. Hébergement, domaines, maintenance et services tiers facturés séparément selon devis.",
    en: "Prices exclude VAT. Hosting, domains, maintenance and third-party services are billed separately as quoted.",
  };

  var DEPOSIT = {
    depositPercent: 50,
    balancePercent: 50,
    label: {
      fr: "50 % à l’acceptation du devis · 50 % avant la livraison finale",
      en: "50% on quote acceptance · 50% before final delivery",
    },
  };

  var EXTRAS = [
    {
      id: "hosting",
      fr: "Hébergement — facturé séparément selon devis",
      en: "Hosting — billed separately as quoted",
    },
    {
      id: "domain",
      fr: "Nom de domaine — enregistrement / renouvellement au devis",
      en: "Domain — registration / renewal as quoted",
    },
    {
      id: "maintenance",
      fr: "Maintenance — forfait optionnel après livraison",
      en: "Maintenance — optional post-delivery plan",
    },
    {
      id: "third_party",
      fr: "Services tiers (outils, API, publicité) — hors catalogue",
      en: "Third-party services (tools, APIs, ads) — outside catalogue",
    },
  ];

  var byName = {};
  var byId = {};
  OFFERS.forEach(function (o) {
    byName[o.name] = o;
    byId[o.id] = o;
  });

  global.AurelisOffers = {
    list: OFFERS,
    byName: byName,
    byId: byId,
    note: NOTE,
    deposit: DEPOSIT,
    extras: EXTRAS,
    priceFor: function (name, lang) {
      var row = byName[name];
      if (!row) return "";
      return row.priceLabel[lang === "en" ? "en" : "fr"] || "";
    },
  };
})(typeof window !== "undefined" ? window : globalThis);
