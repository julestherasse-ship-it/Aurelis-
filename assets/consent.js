/**
 * Bannière de consentement cookies / mesure.
 * Aucun tracking publicitaire non essentiel avant acceptation.
 */
(function () {
  "use strict";

  var KEY = "aurelis-consent-v1";

  var COPY = {
    fr: {
      title: "Cookies et mesure",
      body: "Nous utilisons des cookies essentiels au fonctionnement du site. Avec votre accord, nous activons aussi la mesure d’audience (Google Analytics 4) et, le cas échéant, les balises de conversion Google Ads — uniquement pour améliorer Aurelis et mesurer les demandes de contact.",
      accept: "Accepter la mesure",
      refuse: "Refuser",
      more: "Politique de confidentialité",
      moreHref: "/politique-confidentialite/",
    },
    en: {
      title: "Cookies & measurement",
      body: "We use essential cookies for the site to work. With your consent, we also enable audience measurement (Google Analytics 4) and, when configured, Google Ads conversion tags — only to improve Aurelis and measure contact requests.",
      accept: "Accept measurement",
      refuse: "Refuse",
      more: "Privacy policy",
      moreHref: "/en/privacy-policy/",
    },
  };

  function lang() {
    if (window.AurelisLocale && window.AurelisLocale.getLang) return window.AurelisLocale.getLang();
    return (document.documentElement.lang || "fr").slice(0, 2) === "en" ? "en" : "fr";
  }

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  function write(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (err) {
      /* noop */
    }
    window.dispatchEvent(new CustomEvent("aurelis:consent", { detail: state }));
  }

  function hasMeasurementConsent() {
    var s = read();
    return !!(s && s.measurement === true);
  }

  function ensureBanner() {
    if (document.getElementById("consentBanner")) return;
    var existing = read();
    if (existing && typeof existing.measurement === "boolean") {
      if (existing.measurement && window.AurelisAnalytics) {
        window.AurelisAnalytics.enable();
      }
      return;
    }

    var t = COPY[lang()] || COPY.fr;
    var el = document.createElement("div");
    el.id = "consentBanner";
    el.className = "consent-banner";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-live", "polite");
    el.innerHTML =
      '<div class="consent-banner__inner">' +
      '<div class="consent-banner__copy">' +
      "<strong>" +
      t.title +
      "</strong>" +
      "<p>" +
      t.body +
      ' <a href="' +
      t.moreHref +
      '">' +
      t.more +
      "</a></p>" +
      "</div>" +
      '<div class="consent-banner__actions">' +
      '<button type="button" class="btn btn-ghost" data-consent="refuse">' +
      t.refuse +
      "</button>" +
      '<button type="button" class="btn btn-gold" data-consent="accept">' +
      t.accept +
      "</button>" +
      "</div>" +
      "</div>";

    document.body.appendChild(el);
    requestAnimationFrame(function () {
      el.classList.add("is-visible");
    });

    el.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-consent]");
      if (!btn) return;
      var accept = btn.getAttribute("data-consent") === "accept";
      write({
        measurement: accept,
        updatedAt: new Date().toISOString(),
      });
      el.classList.remove("is-visible");
      setTimeout(function () {
        el.remove();
      }, 350);
      // Consent Mode v2 update even before analytics scripts load
      try {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          window.dataLayer.push(arguments);
        }
        gtag("consent", "update", {
          ad_storage: accept ? "granted" : "denied",
          ad_user_data: accept ? "granted" : "denied",
          ad_personalization: accept ? "granted" : "denied",
          analytics_storage: accept ? "granted" : "denied",
        });
      } catch (err) {
        /* noop */
      }
      if (accept && window.AurelisAnalytics) window.AurelisAnalytics.enable();
    });
  }

  function init() {
    ensureBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.AurelisConsent = {
    hasMeasurementConsent: hasMeasurementConsent,
    read: read,
    openPreferences: function () {
      try {
        localStorage.removeItem(KEY);
      } catch (err) {
        /* noop */
      }
      ensureBanner();
    },
  };
})();
