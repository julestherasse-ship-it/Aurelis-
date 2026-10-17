import { readFileSync } from "node:fs";
import vm from "node:vm";

const code = readFileSync(new URL("../assets/offer-assistant.js", import.meta.url), "utf8");
const window = {
  AurelisOffers: {
    byId: {
      essential: { name: "Aurelis Essential", priceLabel: { fr: "990", en: "990" }, benefit: { fr: "b", en: "b" }, features: { fr: ["a"], en: ["a"] } },
      signature: { name: "Aurelis Signature", priceLabel: { fr: "2490", en: "2490" }, benefit: { fr: "b", en: "b" }, features: { fr: ["a"], en: ["a"] } },
      prestige: { name: "Aurelis Prestige", priceLabel: { fr: "4490", en: "4490" }, benefit: { fr: "b", en: "b" }, features: { fr: ["a"], en: ["a"] } },
      elite: { name: "Aurelis Elite", priceLabel: { fr: "7490", en: "7490" }, benefit: { fr: "b", en: "b" }, features: { fr: ["a"], en: ["a"] } },
    },
  },
};
const document = { readyState: "complete", getElementById: () => null, addEventListener: () => {} };
vm.runInNewContext(code, { window, document, console });
const r = window.AurelisOfferAssistant.recommend;
const cases = [
  ["essential", { business: "solo", hasSite: "no", goal: "presence", features: "contact", budget: "1k" }],
  ["signature", { business: "growth", hasSite: "basic", goal: "services", features: "multi", budget: "3k" }],
  ["elite", { business: "complex", hasSite: "yes", goal: "custom", features: "platform", budget: "10k" }],
];
let ok = true;
for (const [expect, answers] of cases) {
  const got = r(answers);
  console.log(expect, "->", got);
  if (got !== expect) ok = false;
}
if (!ok) process.exit(1);
console.log("smoke-offer-assistant OK");
