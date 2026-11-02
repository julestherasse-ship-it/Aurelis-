export type WebsiteOfferActionResult =
  | { ok: true; duplicate: boolean; message: string; id: string | null }
  | { ok: false; error: string };

declare global {
  interface Window {
    AurelisAnalytics?: {
      formSuccess: (data: { offer: string; id: string | null; duplicate: boolean; intent: string }) => void;
      formStart: (offer: string) => void;
      offerClick: (offer: string) => void;
    };
  }
}

// Same-origin proxy used by the existing site; never expose the ingest secret.
export async function submitWebsiteOffer(input: Record<string, unknown>): Promise<WebsiteOfferActionResult> {
  try {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Idempotency-Key": String(input.idempotencyKey ?? ""),
      },
      body: JSON.stringify(input),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.ok) {
      return { ok: false, error: data?.error || "La demande n’a pas pu être transmise. Réessayez ou contactez-nous." };
    }
    const hasRealId = data.id && !/^0{8}-0{4}-/.test(String(data.id));
    if (!(data.accepted || data.duplicate || data.opportunityId || hasRealId)) {
      return { ok: false, error: "Votre demande n’a pas pu être enregistrée. Réessayez ou contactez-nous." };
    }
    return { ok: true, duplicate: Boolean(data.duplicate), message: data.message || "Votre demande a bien été enregistrée.", id: data.id || null };
  } catch {
    return { ok: false, error: "Le service de réception est temporairement indisponible. Réessayez ou contactez-nous." };
  }
}
