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
  email: "julestherasse@gmail.com",
  founder: "Jules Therasse",

  /**
   * Identité légale — laisser vide jusqu’à obtention officielle.
   * Miroir des champs Aurelis AI → Paramètres → Entreprise.
   */
  company: {
    commercialName: "",
    legalName: "",
    addressLine: "",
    postalCode: "",
    city: "",
    country: "Belgique",
    companyNumber: "",
    vatNumber: "",
    iban: "",
    paymentTerms: "",
    /** true uniquement quand BCE + TVA + adresse sont officiels */
    legalReady: false,
  },

  /** Laisser vide jusqu’à activation réelle — aucun script pub sans ID + consentement */
  ga4MeasurementId: "",
  googleAdsId: "",
  googleAdsConversionLabel: "",

  /** Flags produit — ne pas activer en prod avant go-live validé */
  flags: {
    paymentsEnabled: false,
    realQuotesEnabled: false,
    adsLive: false,
    autoEmailsEnabled: false,
  },
};
