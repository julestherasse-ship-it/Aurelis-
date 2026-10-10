import fs from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const path = join(root, "index.html");
let html = fs.readFileSync(path, "utf8");

const start = html.indexOf('<section class="offers-atelier');
if (start < 0) {
  console.error("offers section not found");
  process.exit(1);
}

let depth = 0;
let i = start;
let end = -1;
while (i < html.length) {
  const open = html.indexOf("<section", i);
  const close = html.indexOf("</section>", i);
  if (close < 0) break;
  if (open >= 0 && open < close) {
    depth += 1;
    i = open + 8;
  } else {
    depth -= 1;
    i = close + 10;
    if (depth === 0) {
      end = i;
      break;
    }
  }
}

if (end < 0) {
  console.error("could not find end of offers section");
  process.exit(1);
}

const offers = html.slice(start, end);
html = html.slice(0, start) + html.slice(end);

if (!html.includes("<!-- OFFERS_PLACEHOLDER -->")) {
  console.error("placeholder missing");
  process.exit(1);
}

html = html.replace("<!-- OFFERS_PLACEHOLDER -->", offers.trim());
fs.writeFileSync(path, html);

const order = [...html.matchAll(/id="(accueil|realisations|secteurs|offres|services|methode|confiance|faq|contact)"/g)].map(
  (m) => m[1]
);
console.log("order:", order.join(" → "));
