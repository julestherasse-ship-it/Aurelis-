/**
 * Locale Aurelis — chemins FR/EN, persistance, sélecteur de langue.
 * Pas de redirection automatique pour les crawlers (SEO-safe).
 */
(function () {
  "use strict";

  var STORAGE_KEY = "aurelis-lang";

  var PATH_MAP = [
    { fr: "/", en: "/en/" },
    { fr: "/offres/", en: "/en/offers/" },
    { fr: "/offres", en: "/en/offers" },
    { fr: "/realisations/mr-gaston/", en: "/en/work/mr-gaston/" },
    { fr: "/realisations/mr-gaston", en: "/en/work/mr-gaston" },
    { fr: "/creation-site-web-entreprise/", en: "/en/business-website/" },
    { fr: "/creation-site-web-entreprise", en: "/en/business-website" },
    { fr: "/refonte-site-web/", en: "/en/website-redesign/" },
    { fr: "/refonte-site-web", en: "/en/website-redesign" },
    { fr: "/creation-site-premium/", en: "/en/premium-website/" },
    { fr: "/creation-site-premium", en: "/en/premium-website" },
    { fr: "/mentions-legales/", en: "/en/legal-notice/" },
    { fr: "/mentions-legales", en: "/en/legal-notice" },
    { fr: "/politique-confidentialite/", en: "/en/privacy-policy/" },
    { fr: "/politique-confidentialite", en: "/en/privacy-policy" },
  ];

  function normalizePath(pathname) {
    if (!pathname || pathname === "") return "/";
    if (pathname.length > 1 && pathname.endsWith("/")) return pathname;
    // Keep file-less clean URLs comparable
    return pathname;
  }

  function detectLangFromPath(pathname) {
    var p = normalizePath(pathname || window.location.pathname);
    if (p === "/en" || p.indexOf("/en/") === 0) return "en";
    return "fr";
  }

  function getStoredLang() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      if (v === "fr" || v === "en") return v;
    } catch (err) {
      /* noop */
    }
    return null;
  }

  function setStoredLang(lang) {
    if (lang !== "fr" && lang !== "en") return;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (err) {
      /* noop */
    }
  }

  function counterpartPath(pathname, targetLang) {
    var p = normalizePath(pathname || window.location.pathname);
    // Exact map
    for (var i = 0; i < PATH_MAP.length; i++) {
      var row = PATH_MAP[i];
      var fr = normalizePath(row.fr);
      var en = normalizePath(row.en);
      if (p === fr || p === fr.replace(/\/$/, "") || p + "/" === fr) {
        return targetLang === "en" ? row.en : row.fr;
      }
      if (p === en || p === en.replace(/\/$/, "") || p + "/" === en) {
        return targetLang === "en" ? row.en : row.fr;
      }
    }
    // Fallback: strip /en prefix or add it
    if (targetLang === "en") {
      if (p === "/" || p === "") return "/en/";
      if (p.indexOf("/en") === 0) return p;
      return "/en" + (p.startsWith("/") ? p : "/" + p);
    }
    if (p === "/en" || p === "/en/") return "/";
    if (p.indexOf("/en/") === 0) return p.slice(3) || "/";
    return p;
  }

  function switchTo(lang) {
    setStoredLang(lang);
    var next = counterpartPath(window.location.pathname, lang);
    var hash = window.location.hash || "";
    var search = window.location.search || "";
    window.location.href = next + search + hash;
  }

  function ensureSwitcher() {
    if (document.querySelector(".lang-switch")) return;
    var headerInner = document.querySelector(".header-inner") || document.querySelector("header .container");
    if (!headerInner) return;

    var current = detectLangFromPath(window.location.pathname);
    var wrap = document.createElement("div");
    wrap.className = "lang-switch";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", current === "en" ? "Language" : "Langue");

    var btnFr = document.createElement("button");
    btnFr.type = "button";
    btnFr.className = "lang-switch__btn" + (current === "fr" ? " is-active" : "");
    btnFr.textContent = "FR";
    btnFr.setAttribute("lang", "fr");
    btnFr.setAttribute("aria-pressed", current === "fr" ? "true" : "false");
    btnFr.addEventListener("click", function () {
      if (current === "fr") return;
      switchTo("fr");
    });

    var btnEn = document.createElement("button");
    btnEn.type = "button";
    btnEn.className = "lang-switch__btn" + (current === "en" ? " is-active" : "");
    btnEn.textContent = "EN";
    btnEn.setAttribute("lang", "en");
    btnEn.setAttribute("aria-pressed", current === "en" ? "true" : "false");
    btnEn.addEventListener("click", function () {
      if (current === "en") return;
      switchTo("en");
    });

    wrap.appendChild(btnFr);
    wrap.appendChild(btnEn);

    var burger = headerInner.querySelector(".burger");
    if (burger) headerInner.insertBefore(wrap, burger);
    else headerInner.appendChild(wrap);
  }

  function init() {
    var pathLang = detectLangFromPath(window.location.pathname);
    setStoredLang(pathLang);
    document.documentElement.setAttribute("lang", pathLang);
    document.documentElement.setAttribute("data-lang", pathLang);
    ensureSwitcher();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.AurelisLocale = {
    getLang: function () {
      return detectLangFromPath(window.location.pathname);
    },
    getStoredLang: getStoredLang,
    setStoredLang: setStoredLang,
    counterpartPath: counterpartPath,
    switchTo: switchTo,
    PATH_MAP: PATH_MAP,
  };
})();
