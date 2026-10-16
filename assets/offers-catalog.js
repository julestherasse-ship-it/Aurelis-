/**
 * Catalogue commercial Aurelis — source unique FR/EN.
 * Utilisé par le funnel et les pages offres pour éviter les écarts de prix.
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
      tagline: {
        fr: "Pour indépendants et entreprises qui veulent une présence nette et crédible.",
        en: "For independents and businesses that need a clear, credible presence.",
      },
      features: {
        fr: [
          "Site vitrine d'une page",
          "Design professionnel",
          "Adaptation ordinateur, tablette et mobile",
          "Formulaire de contact",
          "SEO de base",
          "Réseaux sociaux",
          "Une série de corrections",
        ],
        en: [
          "One-page showcase website",
          "Professional design",
          "Desktop, tablet and mobile adaptation",
          "Contact form",
          "Basic SEO",
          "Social links",
          "One round of revisions",
        ],
      },
    },
    {
      id: "signature",
      name: "Aurelis Signature",
      featured: false,
      price: { amount: 2490, from: false },
      priceLabel: { fr: "2 490 € HTVA", en: "€2,490 excl. VAT" },
      tagline: {
        fr: "Pour entreprises ambitieuses qui souhaitent une image complète et distinctive.",
        en: "For ambitious businesses that want a fuller, distinctive image.",
      },
      features: {
        fr: [
          "Jusqu'à 5 pages",
          "Design personnalisé",
          "Animations élégantes",
          "SEO initial",
          "Formulaires personnalisés",
          "Outils d'analyse",
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
    },
    {
      id: "prestige",
      name: "Aurelis Prestige",
      featured: true,
      badge: { fr: "Notre sélection", en: "Our pick" },
      price: { amount: 4490, from: false },
      priceLabel: { fr: "4 490 € HTVA", en: "€4,490 excl. VAT" },
      tagline: {
        fr: "Pour marques premium qui exigent une expérience digitale d'exception.",
        en: "For premium brands that demand an exceptional digital experience.",
      },
      features: {
        fr: [
          "Jusqu'à 10 pages",
          "Design haut de gamme",
          "Animations avancées",
          "Expériences interactives",
          "SEO technique approfondi",
          "Optimisation des conversions",
          "Intégrations métier définies au devis",
          "Trois séries de corrections",
        ],
        en: [
          "Up to 10 pages",
          "High-end design",
          "Advanced animations",
          "Interactive experiences",
          "In-depth technical SEO",
          "Conversion optimisation",
          "Business integrations defined in the quote",
          "Three rounds of revisions",
        ],
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
      tagline: {
        fr: "Pour projets complexes et internationaux nécessitant une architecture sur mesure.",
        en: "For complex and international projects that need a bespoke architecture.",
      },
      features: {
        fr: [
          "Développement sur mesure",
          "E-commerce ou plateforme web",
          "Espace administrateur selon les besoins",
          "Paiements sécurisés si nécessaires",
          "Intégrations IA",
          "Automatisations",
          "Accompagnement personnalisé",
        ],
        en: [
          "Bespoke development",
          "E-commerce or web platform",
          "Admin area as needed",
          "Secure payments if required",
          "AI integrations",
          "Automations",
          "Personalised support",
        ],
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
  OFFERS.forEach(function (o) {
    byName[o.name] = o;
  });

  global.AurelisOffers = {
    list: OFFERS,
    byName: byName,
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
