/**
 * Tunnel de conversion aurelis.ink → /api/leads → Aurelis AI
 * FR / EN, anti-doublon, honeypot, événements analytics.
 */
(function () {
  "use strict";

  var OFFERS = {
    "Aurelis Essential": { fr: "990 € HTVA", en: "€990 excl. VAT" },
    "Aurelis Signature": { fr: "2 490 € HTVA", en: "€2,490 excl. VAT" },
    "Aurelis Prestige": { fr: "4 490 € HTVA", en: "€4,490 excl. VAT" },
    "Aurelis Elite": { fr: "À partir de 7 490 € HTVA", en: "From €7,490 excl. VAT" },
  };

  /* Aligne les prix sur le catalogue central si présent */
  if (typeof window !== "undefined" && window.AurelisOffers && window.AurelisOffers.byName) {
    Object.keys(window.AurelisOffers.byName).forEach(function (name) {
      var row = window.AurelisOffers.byName[name];
      if (row && row.priceLabel) {
        OFFERS[name] = {
          fr: row.priceLabel.fr,
          en: row.priceLabel.en,
        };
      }
    });
  }

  var I18N = {
    fr: {
      close: "Fermer",
      eyebrow: "Démarrer un projet",
      title: "Parlez-nous de votre <em>ambition</em>",
      lead: "Quelques précisions pour préparer un échange sérieux. Aucun devis définitif n’est envoyé automatiquement.",
      metaFallback: "Prix indicatif",
      name: "Nom",
      namePh: "Votre nom",
      company: "Entreprise",
      companyPh: "Nom de l’entreprise",
      email: "E-mail",
      emailPh: "vous@entreprise.com",
      country: "Pays",
      countryPh: "Belgique, France…",
      projectType: "Type de projet",
      choose: "Choisir…",
      types: ["Site vitrine", "Refonte de site", "E-commerce", "Application web", "Autre"],
      budget: "Budget envisagé",
      budgets: [
        "Moins de 1 000 €",
        "1 000 € – 2 500 €",
        "2 500 € – 5 000 €",
        "5 000 € – 10 000 €",
        "Plus de 10 000 €",
        "À définir ensemble",
      ],
      needs: "Description des besoins",
      needsPh: "Objectifs, délais, éléments déjà en place…",
      desiredDate: "Date souhaitée",
      desiredPh: "Ex. dès que possible, octobre 2026…",
      offerLabel: "Offre",
      consent:
        "J’accepte que mes informations soient transmises à Aurelis pour être recontacté(e). Aucun devis définitif ni contrat ne sera envoyé sans validation humaine.",
      submit: "Envoyer ma demande",
      submitting: "Envoi en cours…",
      cancel: "Annuler",
      hint: "Réponse humaine sous 24 h · Données traitées de façon confidentielle",
      successTitle: "Demande bien reçue",
      successDefault: "Merci. Votre projet est enregistré. Nous vous recontactons sous 24 heures.",
      successDup: "Votre demande était déjà enregistrée. Nous vous recontactons bientôt.",
      errRequired: "Merci de compléter tous les champs obligatoires.",
      errNetwork: "Connexion impossible. Vérifiez votre réseau puis réessayez.",
      errGeneric: "L’envoi a échoué. Réessayez dans un instant.",
      langLabel: "Langue",
    },
    en: {
      close: "Close",
      eyebrow: "Start a project",
      title: "Tell us about your <em>ambition</em>",
      lead: "A few details to prepare a serious conversation. No final quote is sent automatically.",
      metaFallback: "Indicative price",
      name: "Name",
      namePh: "Your name",
      company: "Company",
      companyPh: "Company name",
      email: "Email",
      emailPh: "you@company.com",
      country: "Country",
      countryPh: "Belgium, France, UK…",
      projectType: "Project type",
      choose: "Choose…",
      types: ["Brochure website", "Website redesign", "E-commerce", "Web application", "Other"],
      budget: "Expected budget",
      budgets: [
        "Under €1,000",
        "€1,000 – €2,500",
        "€2,500 – €5,000",
        "€5,000 – €10,000",
        "Over €10,000",
        "To define together",
      ],
      needs: "Needs description",
      needsPh: "Goals, timing, assets already available…",
      desiredDate: "Desired date",
      desiredPh: "e.g. as soon as possible, October 2026…",
      offerLabel: "Offer",
      consent:
        "I agree that my details may be sent to Aurelis so I can be contacted. No final quote or contract will be sent without human validation.",
      submit: "Send my request",
      submitting: "Sending…",
      cancel: "Cancel",
      hint: "Human reply within 24h · Data handled confidentially",
      successTitle: "Request received",
      successDefault: "Thank you. Your project is recorded. We will contact you within 24 hours.",
      successDup: "Your request was already recorded. We will contact you soon.",
      errRequired: "Please complete all required fields.",
      errNetwork: "Connection failed. Check your network and try again.",
      errGeneric: "Sending failed. Please try again shortly.",
      langLabel: "Language",
    },
  };

  var STORAGE_OFFER = "aurelis-offer";
  var STORAGE_PRICE = "aurelis-offer-price";
  var STORAGE_IDEMPOTENCY = "aurelis-lead-idempotency";
  var endpoint = "/api/leads";
  var submitting = false;
  var lastFocus = null;
  var formStarted = false;

  function lang() {
    if (window.AurelisLocale && window.AurelisLocale.getLang) return window.AurelisLocale.getLang();
    return (document.documentElement.lang || "fr").slice(0, 2) === "en" ? "en" : "fr";
  }

  function t() {
    return I18N[lang()] || I18N.fr;
  }

  function priceFor(offer) {
    var row = OFFERS[offer];
    if (!row) return "";
    return row[lang()] || row.fr;
  }

  function detectLanguage() {
    return lang();
  }

  function readStoredOffer() {
    var offer = null;
    var price = null;
    try {
      offer = sessionStorage.getItem(STORAGE_OFFER);
      price = sessionStorage.getItem(STORAGE_PRICE);
    } catch (err) {
      /* noop */
    }
    var params = new URLSearchParams(window.location.search);
    if (params.get("offre") || params.get("offer")) offer = params.get("offre") || params.get("offer");
    if (params.get("prix") || params.get("price")) price = params.get("prix") || params.get("price");
    if (offer && OFFERS[offer] && !price) price = priceFor(offer);
    return { offer: offer && OFFERS[offer] ? offer : null, price: price || "" };
  }

  function persistOffer(offer, price) {
    if (!offer || !OFFERS[offer]) return;
    try {
      sessionStorage.setItem(STORAGE_OFFER, offer);
      sessionStorage.setItem(STORAGE_PRICE, price || priceFor(offer));
    } catch (err) {
      /* noop */
    }
  }

  function getIdempotencyKey(email, offer) {
    var key = "lead:" + String(email || "").toLowerCase() + ":" + String(offer || "");
    try {
      var cached = sessionStorage.getItem(STORAGE_IDEMPOTENCY);
      if (cached && cached.indexOf(key) === 0) return cached.split("|")[1];
      var id =
        (window.crypto && crypto.randomUUID && crypto.randomUUID()) ||
        "id-" + Date.now() + "-" + Math.random().toString(16).slice(2);
      sessionStorage.setItem(STORAGE_IDEMPOTENCY, key + "|" + id);
      return id;
    } catch (err) {
      return "id-" + Date.now();
    }
  }

  function optionsHtml(list, copy) {
    return (
      '<option value="">' +
      copy.choose +
      "</option>" +
      list
        .map(function (item) {
          return "<option>" + item + "</option>";
        })
        .join("")
    );
  }

  function offerOptionsHtml(selected, copy) {
    var html = '<option value="">' + copy.choose + "</option>";
    Object.keys(OFFERS).forEach(function (name) {
      html +=
        '<option value="' +
        name +
        '"' +
        (selected === name ? " selected" : "") +
        ">" +
        name +
        " — " +
        priceFor(name) +
        "</option>";
    });
    return html;
  }

  function ensureModal() {
    var existing = document.getElementById("leadModal");
    if (existing) existing.remove();

    var copy = t();
    var wrap = document.createElement("div");
    wrap.id = "leadModal";
    wrap.className = "lead-modal";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-labelledby", "leadModalTitle");
    wrap.hidden = true;
    wrap.innerHTML =
      '<div class="lead-modal__backdrop" data-lead-close="1"></div>' +
      '<div class="lead-modal__panel">' +
      '<button type="button" class="lead-modal__close" data-lead-close="1" aria-label="' +
      copy.close +
      '">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      "</button>" +
      '<div class="lead-modal__form-view" id="leadFormView">' +
      '<p class="lead-modal__eyebrow">' +
      copy.eyebrow +
      "</p>" +
      '<h2 class="lead-modal__title" id="leadModalTitle">' +
      copy.title +
      "</h2>" +
      '<p class="lead-modal__lead">' +
      copy.lead +
      "</p>" +
      '<div class="lead-modal__summary" id="leadOfferSummary">' +
      '<strong id="leadOfferName">—</strong>' +
      '<span id="leadOfferMeta">' +
      copy.metaFallback +
      "</span>" +
      "</div>" +
      '<form class="lead-form" id="leadForm" novalidate>' +
      '<input type="hidden" name="priceLabel" id="leadPrice">' +
      '<input type="hidden" name="language" id="leadLanguage">' +
      '<div class="lead-hp" aria-hidden="true"><label>Website <input type="text" name="companyWebsiteConfirm" tabindex="-1" autocomplete="off"></label></div>' +
      '<div class="lead-field"><label for="leadOfferSelect">' +
      copy.offerLabel +
      '</label><select id="leadOfferSelect" name="offer" required></select></div>' +
      '<div class="lead-form__row lead-form__row--2">' +
      '<div class="lead-field"><label for="leadName">' +
      copy.name +
      '</label><input id="leadName" name="contactName" type="text" required maxlength="120" autocomplete="name" placeholder="' +
      copy.namePh +
      '"></div>' +
      '<div class="lead-field"><label for="leadCompany">' +
      copy.company +
      '</label><input id="leadCompany" name="company" type="text" required maxlength="120" autocomplete="organization" placeholder="' +
      copy.companyPh +
      '"></div></div>' +
      '<div class="lead-form__row lead-form__row--2">' +
      '<div class="lead-field"><label for="leadEmail">' +
      copy.email +
      '</label><input id="leadEmail" name="email" type="email" required maxlength="160" autocomplete="email" placeholder="' +
      copy.emailPh +
      '"></div>' +
      '<div class="lead-field"><label for="leadCountry">' +
      copy.country +
      '</label><input id="leadCountry" name="country" type="text" required maxlength="80" autocomplete="country-name" placeholder="' +
      copy.countryPh +
      '"></div></div>' +
      '<div class="lead-form__row lead-form__row--2">' +
      '<div class="lead-field"><label for="leadProjectType">' +
      copy.projectType +
      '</label><select id="leadProjectType" name="projectType" required>' +
      optionsHtml(copy.types, copy) +
      "</select></div>" +
      '<div class="lead-field"><label for="leadBudget">' +
      copy.budget +
      '</label><select id="leadBudget" name="budget" required>' +
      optionsHtml(copy.budgets, copy) +
      "</select></div></div>" +
      '<div class="lead-field"><label for="leadNeeds">' +
      copy.needs +
      '</label><textarea id="leadNeeds" name="needs" required maxlength="4000" placeholder="' +
      copy.needsPh +
      '"></textarea></div>' +
      '<div class="lead-field"><label for="leadDesiredDate">' +
      copy.desiredDate +
      '</label><input id="leadDesiredDate" name="desiredDate" type="text" required maxlength="80" placeholder="' +
      copy.desiredPh +
      '"></div>' +
      '<label class="lead-consent"><input type="checkbox" name="consent" id="leadConsent" value="1" required><span>' +
      copy.consent +
      "</span></label>" +
      '<div class="lead-form__error" id="leadFormError" role="alert"></div>' +
      '<div class="lead-form__actions">' +
      '<button type="submit" class="btn btn-gold" id="leadSubmit">' +
      copy.submit +
      "</button>" +
      '<button type="button" class="btn btn-ghost" data-lead-close="1">' +
      copy.cancel +
      "</button></div>" +
      '<p class="lead-form__hint">' +
      copy.hint +
      "</p></form></div>" +
      '<div class="lead-success" id="leadSuccess" hidden>' +
      '<div class="lead-success__mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></div>' +
      "<h3>" +
      copy.successTitle +
      '</h3><p id="leadSuccessMsg">' +
      copy.successDefault +
      '</p><button type="button" class="btn btn-gold" data-lead-close="1">' +
      copy.close +
      "</button></div></div>";

    document.body.appendChild(wrap);
    return wrap;
  }

  function setSummary(offer, price) {
    var copy = t();
    var nameEl = document.getElementById("leadOfferName");
    var metaEl = document.getElementById("leadOfferMeta");
    var select = document.getElementById("leadOfferSelect");
    var l = detectLanguage();
    if (select) select.innerHTML = offerOptionsHtml(offer, copy);
    if (nameEl) nameEl.textContent = offer || "Aurelis";
    if (metaEl) {
      metaEl.textContent =
        (price || (offer ? priceFor(offer) : copy.metaFallback)) +
        " · " +
        copy.langLabel +
        " : " +
        l.toUpperCase();
    }
    var priceInput = document.getElementById("leadPrice");
    var langInput = document.getElementById("leadLanguage");
    if (priceInput) priceInput.value = price || (offer ? priceFor(offer) : "");
    if (langInput) langInput.value = l;

    if (select) {
      select.onchange = function () {
        var v = select.value;
        var p = priceFor(v);
        if (priceInput) priceInput.value = p;
        if (nameEl) nameEl.textContent = v || "Aurelis";
        if (metaEl) {
          metaEl.textContent =
            (p || copy.metaFallback) + " · " + copy.langLabel + " : " + l.toUpperCase();
        }
        if (v) persistOffer(v, p);
      };
    }
  }

  function openModal(offer, price, opts) {
    opts = opts || {};
    formStarted = false;
    var modal = ensureModal();
    lastFocus = document.activeElement;
    if (offer) persistOffer(offer, price);
    setSummary(offer || null, price || (offer ? priceFor(offer) : ""));

    var formView = document.getElementById("leadFormView");
    var success = document.getElementById("leadSuccess");
    var form = document.getElementById("leadForm");
    var err = document.getElementById("leadFormError");
    if (formView) formView.style.display = "";
    if (success) {
      success.hidden = true;
      success.classList.remove("is-visible");
    }
    if (form) {
      form.reset();
      setSummary(offer || null, price || (offer ? priceFor(offer) : ""));
      form.addEventListener(
        "focusin",
        function onStart() {
          if (formStarted) return;
          formStarted = true;
          if (window.AurelisAnalytics) {
            window.AurelisAnalytics.formStart(offer || (form.elements.offer && form.elements.offer.value) || "");
          }
        },
        { once: true },
      );
    }
    if (err) {
      err.textContent = "";
      err.classList.remove("is-visible");
    }

    if (opts.appointment && window.AurelisAnalytics) {
      window.AurelisAnalytics.appointment(offer || "");
    }
    if (offer && window.AurelisAnalytics) {
      window.AurelisAnalytics.offerClick(offer);
    }

    modal.hidden = false;
    requestAnimationFrame(function () {
      modal.classList.add("is-open");
    });
    document.body.classList.add("lead-modal-open");
    var first = document.getElementById(offer ? "leadName" : "leadOfferSelect");
    if (first) setTimeout(function () { first.focus(); }, 50);
  }

  function closeModal() {
    var modal = document.getElementById("leadModal");
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.classList.remove("lead-modal-open");
    setTimeout(function () {
      modal.hidden = true;
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }, 320);
  }

  function showError(message) {
    var err = document.getElementById("leadFormError");
    if (!err) return;
    err.textContent = message;
    err.classList.add("is-visible");
  }

  function validateForm(form) {
    var required = [
      "contactName",
      "company",
      "email",
      "country",
      "projectType",
      "needs",
      "budget",
      "desiredDate",
      "offer",
    ];
    var ok = true;
    required.forEach(function (name) {
      var el = form.elements[name];
      if (!el) return;
      var empty = !String(el.value || "").trim();
      if (el.classList) el.classList.toggle("is-invalid", empty);
      if (empty) ok = false;
    });
    var consent = form.elements.consent;
    if (consent && !consent.checked) ok = false;
    var email = String(form.elements.email.value || "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      form.elements.email.classList.add("is-invalid");
      ok = false;
    }
    return ok;
  }

  async function submitForm(form) {
    var copy = t();
    if (submitting) return;
    if (!validateForm(form)) {
      showError(copy.errRequired);
      return;
    }

    var offer = String(form.elements.offer.value).trim();
    var payload = {
      contactName: String(form.elements.contactName.value).trim(),
      company: String(form.elements.company.value).trim(),
      email: String(form.elements.email.value).trim().toLowerCase(),
      country: String(form.elements.country.value).trim(),
      projectType: String(form.elements.projectType.value).trim(),
      needs: String(form.elements.needs.value).trim(),
      budget: String(form.elements.budget.value).trim(),
      desiredDate: String(form.elements.desiredDate.value).trim(),
      offer: offer,
      priceLabel: String(form.elements.priceLabel.value).trim() || priceFor(offer),
      language: String(form.elements.language.value).trim() || detectLanguage(),
      consent: true,
      companyWebsiteConfirm: String(form.elements.companyWebsiteConfirm.value || ""),
      idempotencyKey: getIdempotencyKey(form.elements.email.value, offer),
    };

    submitting = true;
    var btn = document.getElementById("leadSubmit");
    if (btn) {
      btn.disabled = true;
      btn.textContent = copy.submitting;
    }
    var errEl = document.getElementById("leadFormError");
    if (errEl) errEl.classList.remove("is-visible");

    try {
      var response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Idempotency-Key": payload.idempotencyKey,
        },
        body: JSON.stringify(payload),
      });

      var data = null;
      try {
        data = await response.json();
      } catch (err) {
        data = null;
      }

      if (!response.ok || !data || !data.ok) {
        var baseErr = (data && data.error) || copy.errGeneric;
        if (response.status === 503 || response.status === 502) {
          baseErr +=
            lang() === "en"
              ? " You can also reach us at 0495 38 03 29 or julestherasse@gmail.com."
              : " Vous pouvez aussi nous joindre au 0495 38 03 29 ou julestherasse@gmail.com.";
        }
        showError(baseErr);
        return;
      }

      var formView = document.getElementById("leadFormView");
      var success = document.getElementById("leadSuccess");
      var msg = document.getElementById("leadSuccessMsg");
      if (formView) formView.style.display = "none";
      if (msg) {
        msg.textContent =
          data.message || (data.duplicate ? copy.successDup : copy.successDefault);
      }
      if (success) {
        success.hidden = false;
        success.classList.add("is-visible");
      }
      if (window.AurelisAnalytics) {
        window.AurelisAnalytics.formSuccess({
          offer: offer,
          id: data.id,
          duplicate: data.duplicate,
          qualified: !!(data.opportunityId || data.accepted),
        });
      }
      try {
        sessionStorage.removeItem(STORAGE_OFFER);
        sessionStorage.removeItem(STORAGE_PRICE);
      } catch (err) {
        /* noop */
      }
    } catch (err) {
      showError(copy.errNetwork);
    } finally {
      submitting = false;
      if (btn) {
        btn.disabled = false;
        btn.textContent = copy.submit;
      }
    }
  }

  function offerFromElement(el) {
    if (!el) return null;
    var offer = el.getAttribute("data-offer");
    if (!offer) {
      var card = el.closest("[data-offer]");
      if (card) offer = card.getAttribute("data-offer");
    }
    var price = el.getAttribute("data-price");
    if (!price) {
      var card2 = el.closest("[data-offer]");
      if (card2) price = card2.getAttribute("data-price");
    }
    if (!price && offer) price = priceFor(offer);
    return offer && OFFERS[offer] ? { offer: offer, price: price || priceFor(offer) } : null;
  }

  function onCtaClick(e) {
    var target = e.target.closest(
      ".pricing-cta, #selectionCta, #finalCta, [data-lead-open], [data-appointment]",
    );
    if (!target) return;
    var info = offerFromElement(target);
    if (!info) {
      var stored = readStoredOffer();
      if (stored.offer) info = stored;
    }
    e.preventDefault();
    if (window.AurelisAnalytics && info && info.offer) {
      window.AurelisAnalytics.offerClick(info.offer);
    }
    openModal(info && info.offer ? info.offer : null, info && info.price ? info.price : "", {
      appointment: target.hasAttribute("data-appointment") || target.id === "finalCta",
    });
  }

  function bind() {
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-lead-close]")) {
        e.preventDefault();
        closeModal();
        return;
      }
      onCtaClick(e);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        var modal = document.getElementById("leadModal");
        if (modal && modal.classList.contains("is-open")) closeModal();
      }
    });

    document.addEventListener("submit", function (e) {
      if (e.target && e.target.id === "leadForm") {
        e.preventDefault();
        submitForm(e.target);
      }
      if (e.target && e.target.id === "form") {
        e.preventDefault();
        openModal(null, "", { appointment: true });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }

  window.AurelisLeadFunnel = {
    open: openModal,
    close: closeModal,
    persistOffer: persistOffer,
  };
})();
