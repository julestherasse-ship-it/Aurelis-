/**
 * Configuration publique Aurelis (pas de secrets).
 *
 * Après immatriculation belge : renseigner `company.*` (BCE, TVA, siège)
 * puis mettre à jour les pages légales et redéployer.
 * Ne jamais inventer de numéros d’entreprise ou de TVA.
 */
window.AURELIS_CONFIG = {
  siteUrl: "https://aurelis.ink",
  phone: "+32495380329",
  phoneDisplay: "0495 38 03 29",
  /** Adresse opérationnelle actuelle — conserver jusqu’à vérification de l’e-mail pro */
  email: "julestherasse@gmail.com",
  /** À renseigner après création / vérification DNS (ex. contact@aurelis.ink) — ne pas inventer */
  emailProfessional: "",
  founder: "Jules Therasse",

  /**
   * Identité légale — laisser vide jusqu’à obtention officielle (Securex).
   * Miroir des champs Aurelis AI → Paramètres → Entreprise.
   */
  company: {
    commercialName: "",
    legalName: "",
    addressLine: "",
    postalCode: "",
    city: "Mons",
    country: "Belgique",
    companyNumber: "",
    vatNumber: "",
    iban: "",
    paymentTerms: "50% à l’acceptation du devis · 50% avant livraison",
    /** true uniquement quand BCE + TVA + adresse sont officiels */
    legalReady: false,
  },

  /** Laisser vide jusqu’à activation réelle — aucun script pub sans ID + consentement */
  ga4MeasurementId: "",
  googleAdsId: "",
  googleAdsConversionLabel: "",
  /** Landing Ads principale (Search BE francophone) */
  adsLandingPath: "/creation-site-internet/",

  /** Flags produit — ne pas activer en prod avant go-live validé */
  flags: {
    paymentsEnabled: false,
    realQuotesEnabled: false,
    adsLive: false,
    autoEmailsEnabled: false,
  },
};
