/**
 * Proxy serveur aurelis.ink → Aurelis AI.
 * Aucune clé n’est exposée au navigateur.
 *
 * Variables d’environnement Vercel (projet aurelis) :
 * - AURELIS_AI_URL          ex. https://aurelis-ai-kohl.vercel.app
 * - AURELIS_WEBSITE_INGEST_SECRET  (optionnel, doit matcher côté Aurelis AI)
 */

const MAX_BODY_BYTES = 40_000;
const DEFAULT_AI_URL = "https://aurelis-ai-kohl.vercel.app";

const RATE = new Map();

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

function allowRate(ip) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const max = 8;
  const entry = RATE.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  entry.count += 1;
  RATE.set(ip, entry);
  return entry.count <= max;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("payload_too_large"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Idempotency-Key");
    res.end();
    return;
  }

  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "Méthode non autorisée." });
    return;
  }

  if (!allowRate(clientIp(req))) {
    json(res, 429, { ok: false, error: "Trop de demandes. Réessayez un peu plus tard." });
    return;
  }

  let raw;
  try {
    raw = await readBody(req);
  } catch (error) {
    if (error && error.status === 413) {
      json(res, 413, { ok: false, error: "Demande trop volumineuse." });
      return;
    }
    json(res, 400, { ok: false, error: "Lecture de la demande impossible." });
    return;
  }

  let payload;
  try {
    payload = raw ? JSON.parse(raw) : null;
  } catch {
    json(res, 400, { ok: false, error: "Formulaire illisible." });
    return;
  }

  const base = (process.env.AURELIS_AI_URL || DEFAULT_AI_URL).replace(/\/$/, "");
  const target = `${base}/api/inbound/website-offer`;
  const secret = process.env.AURELIS_WEBSITE_INGEST_SECRET || "";

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (secret) headers["x-aurelis-ingest-secret"] = secret;
  if (typeof req.headers["x-idempotency-key"] === "string") {
    headers["X-Idempotency-Key"] = req.headers["x-idempotency-key"].slice(0, 80);
  }

  let upstream;
  try {
    upstream = await fetch(target, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
  } catch {
    json(res, 502, {
      ok: false,
      error: "Le service de réception Aurelis est temporairement indisponible.",
      integration: "aurelis-ai-unreachable",
    });
    return;
  }

  const text = await upstream.text().catch(() => "");
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!upstream.ok) {
    json(res, upstream.status >= 400 && upstream.status < 600 ? upstream.status : 502, {
      ok: false,
      error: (data && data.error) || "La demande n’a pas pu être transmise.",
      integration: "aurelis-ai-error",
    });
    return;
  }

  const accepted = Boolean(data && data.accepted);
  json(res, 200, {
    ok: true,
    accepted,
    id: data && data.id ? data.id : null,
    opportunityId: data && data.opportunityId ? data.opportunityId : null,
    quoteId: data && data.quoteId ? data.quoteId : null,
    duplicate: Boolean(data && data.duplicate),
    nextAction: data && data.nextAction ? data.nextAction : null,
    message:
      (data && data.message) ||
      (accepted
        ? "Demande bien reçue. Nous vous recontactons sous 24 heures."
        : "Demande prise en compte."),
    integration: "aurelis-ai",
  });
};
