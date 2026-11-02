import "../assets/offers-catalog.js";
import { AurelisLanding } from "./aurelis-landing";

type CatalogOffer = {
  name: string;
  featured: boolean;
  price: { amount: number; from: boolean };
  features: { fr: string[] };
};

const descriptions: Record<string, { pages: string; description: string }> = {
  "Aurelis Essential": { pages: "1 page", description: "Une présence claire et maîtrisée pour lancer ou remettre votre activité en mouvement." },
  "Aurelis Signature": { pages: "Jusqu’à 5 pages", description: "Un site sur mesure pour les marques qui veulent être reconnues au premier regard." },
  "Aurelis Prestige": { pages: "Jusqu’à 10 pages", description: "Un territoire digital plus ample, pensé pour raconter, convaincre et évoluer." },
  "Aurelis Elite": { pages: "Sur mesure", description: "Un système digital complet pour les projets qui demandent une réponse entièrement dédiée." },
};

// The existing public catalog remains the source of truth for prices and scope.
const catalog = (globalThis as typeof globalThis & { AurelisOffers: { list: CatalogOffer[] } }).AurelisOffers;
const offers = catalog.list.map((offer) => ({
  name: offer.name,
  featured: offer.featured,
  priceEuros: offer.price.amount,
  pricePrefix: offer.price.from ? "À partir de" : undefined,
  features: offer.features.fr,
  ...descriptions[offer.name],
}));

export function PreviewApp() {
  return <AurelisLanding offers={offers} />;
}
