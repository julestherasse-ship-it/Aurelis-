/**
 * Mesure Aurelis — compatible GA4 / Google Ads.
 * Aucun script tiers chargé sans consentement de mesure.
 *
 * Événements standard :
 * - offer_click
 * - generate_lead_start (formulaire commencé)
 * - generate_lead (formulaire envoyé)
 * - book_appointment (demande de rendez-vous)
 * - qualified_lead (si le CRM le signale côté réponse API)
 */
(function () {
  "use strict";

  var enabled = false;
  var queue = [];

  function cfg() {
    return window.AURELIS_CONFIG || {};
  }

  function pushDataLayer(event, params) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: event }, params || {}));
  }

  function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  function loadScripts() {
    var c = cfg();
    if (!c.ga4MeasurementId && !c.googleAdsId) {
      // Mode prêt : events en dataLayer uniquement (GTM / debug).
      enabled = true;
      flush();
      return;
    }

    if (c.ga4MeasurementId) {
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(c.ga4MeasurementId);
      document.head.appendChild(s);
      gtag("js", new Date());
      gtag("config", c.ga4MeasurementId, { anonymize_ip: true, send_page_view: true });
    }

    if (c.googleAdsId) {
      gtag("config", c.googleAdsId);
    }

    enabled = true;
    flush();
  }

  function flush() {
    while (queue.length) {
      var item = queue.shift();
      send(item.name, item.params);
    }
  }

  function send(name, params) {
    params = params || {};
    pushDataLayer(name, params);

    if (!enabled) {
      queue.push({ name: name, params: params });
      return;
    }

    var c = cfg();
    if (typeof window.gtag === "function" || c.ga4MeasurementId || c.googleAdsId) {
      try {
        gtag("event", name, params);
      } catch (err) {
        /* noop */
      }
    }

    if (name === "generate_lead" && c.googleAdsId && c.googleAdsConversionLabel) {
      try {
        gtag("event", "conversion", {
          send_to: c.googleAdsId + "/" + c.googleAdsConversionLabel,
          value: params.value || 0,
          currency: params.currency || "EUR",
        });
      } catch (err) {
        /* noop */
      }
    }
  }

  function track(name, params) {
    if (window.AurelisConsent && !window.AurelisConsent.hasMeasurementConsent()) {
      // File d’attente jusqu’au consentement (pas d’envoi réseau).
      queue.push({ name: name, params: params || {} });
      pushDataLayer(name + "_queued", params || {});
      return;
    }
    if (!enabled) loadScripts();
    send(name, params);
  }

  function enable() {
    if (enabled) return;
    loadScripts();
  }

  window.AurelisAnalytics = {
    enable: enable,
    track: track,
    offerClick: function (offer) {
      track("offer_click", { offer_name: offer || "", engagement_type: "offer" });
    },
    ctaClick: function (ctaId) {
      var id = ctaId || "cta";
      track("cta_click", { cta_id: id, engagement_type: "cta" });
      // Alias événements conversion (même pipeline, pas de double système)
      if (id === "hero_creer_mon_site" || id === "hero_create_site" || id === "nav_creer_mon_site") {
        track("hero_create_site", { cta_id: id });
      }
      if (id.indexOf("audit") !== -1 || id === "hero_free_audit") {
        track("hero_free_audit", { cta_id: id });
      }
      if (id.indexOf("folio_") === 0 || id.indexOf("portfolio_") === 0) {
        track("portfolio_click", { cta_id: id });
      }
      if (id.indexOf("offer_") === 0) {
        track("offer_click", { offer_name: id.replace(/^offer_/, ""), engagement_type: "offer" });
      }
      if (id.indexOf("contact_") === 0) {
        track("contact_start", { cta_id: id });
      }
    },
    formStart: function (offer) {
      track("generate_lead_start", { offer_name: offer || "" });
      track("contact_start", { offer_name: offer || "" });
    },
    formSuccess: function (data) {
      data = data || {};
      track("generate_lead", {
        offer_name: data.offer || "",
        lead_id: data.id || "",
        duplicate: !!data.duplicate,
        currency: "EUR",
        intent: data.intent || "project",
      });
      track(data.intent === "audit" ? "audit_submit" : "lead_submit", {
        offer_name: data.offer || "",
        lead_id: data.id || "",
      });
      if (data.qualified) {
        track("qualified_lead", { lead_id: data.id || "", offer_name: data.offer || "" });
      }
    },
    appointment: function (offer) {
      track("book_appointment", { offer_name: offer || "" });
    },
  };

  // Page view logique (sans tiers si pas de consentement / pas d’ID)
  document.addEventListener("DOMContentLoaded", function () {
    pushDataLayer("page_view_ready", {
      page_path: location.pathname,
      page_lang: document.documentElement.lang || "fr",
    });
    if (window.AurelisConsent && window.AurelisConsent.hasMeasurementConsent()) {
      enable();
    }
  });
})();
