/**
 * Assistant de choix Aurelis — logique déterministe transparente.
 * Ne pousse jamais systématiquement vers l’offre la plus chère.
 */
(function () {
  "use strict";

  var I18N = {
    fr: {
      title: "Quel site internet est fait pour votre entreprise ?",
      lead: "Répondez à quelques questions et découvrez la solution adaptée à votre projet.",
      q1: "Quel type d’entreprise possédez-vous ?",
      q2: "Avez-vous déjà un site internet ?",
      q3: "Quel est votre objectif principal ?",
      q4: "De quelles fonctionnalités avez-vous besoin ?",
      q5: "Quel budget envisagez-vous ?",
      next: "Continuer",
      back: "Retour",
      restart: "Recommencer",
      resultTitle: "Recommandation",
      resultLead: "D’après vos besoins, <strong>{offer}</strong> semble être une bonne solution pour votre entreprise.",
      why: "Pourquoi cette offre",
      limits: "Limites à connaître",
      price: "Tarif",
      start: "Démarrer avec cette offre",
      other: "Voir les autres offres",
      compare: "Comparer les offres",
      business: [
        { v: "solo", l: "Indépendant / freelance" },
        { v: "small", l: "Petite entreprise / commerce" },
        { v: "growth", l: "Entreprise en développement" },
        { v: "brand", l: "Marque / enseigne premium" },
        { v: "complex", l: "Projet technique / e-commerce / plateforme" },
      ],
      hasSite: [
        { v: "no", l: "Non, je démarre" },
        { v: "basic", l: "Oui, un site basique à améliorer" },
        { v: "yes", l: "Oui, un site déjà développé" },
      ],
      goals: [
        { v: "presence", l: "Être présent et crédible en ligne" },
        { v: "services", l: "Présenter plusieurs services / pages" },
        { v: "convert", l: "Convertir plus de visiteurs en contacts" },
        { v: "custom", l: "Créer une expérience vraiment sur mesure" },
      ],
      features: [
        { v: "contact", l: "Contact simple et présentation" },
        { v: "multi", l: "Plusieurs pages et contenus" },
        { v: "advanced", l: "Animations, conversion, intégrations" },
        { v: "platform", l: "Boutique, espace client ou automatisations" },
      ],
      budgets: [
        { v: "1k", l: "Environ 1 000 €" },
        { v: "3k", l: "Environ 2 500 – 3 000 €" },
        { v: "5k", l: "Environ 4 500 – 5 000 €" },
        { v: "10k", l: "5 000 € et plus / sur mesure" },
      ],
      reasons: {
        essential: [
          "Budget adapté à une première présence professionnelle",
          "Besoin principal : crédibilité et contact",
          "Périmètre vitrine d’une page",
        ],
        signature: [
          "Vous voulez présenter plusieurs services",
          "Budget cohérent avec une présence multi-pages",
          "Design personnalisé sans complexité extrême",
        ],
        prestige: [
          "Objectif de différenciation et de conversion",
          "Besoin d’une expérience plus immersive",
          "Budget aligné avec une offre haut de gamme",
        ],
        elite: [
          "Fonctionnalités avancées ou plateforme",
          "Périmètre trop spécifique pour un package standard",
          "Devis personnalisé nécessaire avant engagement",
        ],
      },
      limitText: {
        essential: "Une page : idéal pour démarrer, moins adapté si vous avez beaucoup de services à présenter.",
        signature: "Jusqu’à 5 pages : excellent pour la plupart des entreprises ; projets très immersifs → Prestige.",
        prestige: "Package riche, mais pas une plateforme e-commerce complète (voir Elite).",
        elite: "Prix « à partir de » : le montant final dépend du périmètre validé ensemble.",
      },
    },
    en: {
      title: "Which website is right for your business?",
      lead: "Answer a few questions and discover the solution that fits your project.",
      q1: "What type of business do you run?",
      q2: "Do you already have a website?",
      q3: "What is your main goal?",
      q4: "Which features do you need?",
      q5: "What budget are you considering?",
      next: "Continue",
      back: "Back",
      restart: "Start over",
      resultTitle: "Recommendation",
      resultLead: "Based on your needs, <strong>{offer}</strong> looks like a strong fit for your business.",
      why: "Why this offer",
      limits: "Good to know",
      price: "Price",
      start: "Start with this offer",
      other: "See other offers",
      compare: "Compare offers",
      business: [
        { v: "solo", l: "Independent / freelancer" },
        { v: "small", l: "Small business / shop" },
        { v: "growth", l: "Growing company" },
        { v: "brand", l: "Premium brand" },
        { v: "complex", l: "Technical / e-commerce / platform" },
      ],
      hasSite: [
        { v: "no", l: "No — starting fresh" },
        { v: "basic", l: "Yes — a basic site to improve" },
        { v: "yes", l: "Yes — an existing developed site" },
      ],
      goals: [
        { v: "presence", l: "Be present and credible online" },
        { v: "services", l: "Present several services / pages" },
        { v: "convert", l: "Convert more visitors into contacts" },
        { v: "custom", l: "Create a truly bespoke experience" },
      ],
      features: [
        { v: "contact", l: "Simple contact and presentation" },
        { v: "multi", l: "Multiple pages and content" },
        { v: "advanced", l: "Motion, conversion, integrations" },
        { v: "platform", l: "Shop, client area or automations" },
      ],
      budgets: [
        { v: "1k", l: "Around €1,000" },
        { v: "3k", l: "Around €2,500 – €3,000" },
        { v: "5k", l: "Around €4,500 – €5,000" },
        { v: "10k", l: "€5,000+ / bespoke" },
      ],
      reasons: {
        essential: [
          "Budget suited to a first professional presence",
          "Main need: credibility and contact",
          "One-page showcase scope",
        ],
        signature: [
          "You need to present several services",
          "Budget fits a multi-page presence",
          "Custom design without extreme complexity",
        ],
        prestige: [
          "Differentiation and conversion goals",
          "Need for a more immersive experience",
          "Budget aligned with a premium package",
        ],
        elite: [
          "Advanced features or platform needs",
          "Too specific for a standard package",
          "Custom quote required before commitment",
        ],
      },
      limitText: {
        essential: "One page: ideal to start; less suited if you have many services to present.",
        signature: "Up to 5 pages: great for most businesses; highly immersive work → Prestige.",
        prestige: "Rich package, but not a full e-commerce platform (see Elite).",
        elite: "“From” pricing: the final amount depends on the validated scope.",
      },
    },
  };

  function lang() {
    if (window.AurelisLocale && window.AurelisLocale.getLang) return window.AurelisLocale.getLang();
    return (document.documentElement.lang || "fr").slice(0, 2) === "en" ? "en" : "fr";
  }

  function t() {
    return I18N[lang()] || I18N.fr;
  }

  function track(name, params) {
    if (window.AurelisAnalytics && window.AurelisAnalytics.track) {
      window.AurelisAnalytics.track(name, params || {});
    }
  }

  /**
   * Scoring déterministe — Elite seulement si besoin plateforme/complexe + budget.
   * Prestige si conversion/marque + budget 5k.
   * Signature si multi-pages / croissance / ~3k.
   * Essential sinon (budget bas ou présence simple).
   */
  function recommend(answers) {
    var score = { essential: 0, signature: 0, prestige: 0, elite: 0 };

    if (answers.business === "solo" || answers.business === "small") score.essential += 2;
    if (answers.business === "growth") score.signature += 2;
    if (answers.business === "brand") score.prestige += 2;
    if (answers.business === "complex") score.elite += 3;

    if (answers.hasSite === "no") score.essential += 1;
    if (answers.hasSite === "basic") score.signature += 1;
    if (answers.hasSite === "yes") score.prestige += 1;

    if (answers.goal === "presence") score.essential += 2;
    if (answers.goal === "services") score.signature += 2;
    if (answers.goal === "convert") score.prestige += 2;
    if (answers.goal === "custom") {
      score.prestige += 1;
      score.elite += 2;
    }

    if (answers.features === "contact") score.essential += 2;
    if (answers.features === "multi") score.signature += 2;
    if (answers.features === "advanced") score.prestige += 2;
    if (answers.features === "platform") score.elite += 3;

    if (answers.budget === "1k") {
      score.essential += 4;
      score.signature -= 1;
      score.prestige -= 2;
      score.elite -= 3;
    }
    if (answers.budget === "3k") {
      score.signature += 4;
      score.essential += 1;
      score.prestige -= 1;
      score.elite -= 2;
    }
    if (answers.budget === "5k") {
      score.prestige += 4;
      score.signature += 1;
      score.elite += 1;
    }
    if (answers.budget === "10k") {
      score.elite += 3;
      score.prestige += 2;
      score.signature += 1;
    }

    // Garde-fou : budget 1k → jamais Elite/Prestige
    if (answers.budget === "1k") {
      return "essential";
    }
    // Plateforme + budget haut → Elite
    if (answers.features === "platform" && (answers.budget === "10k" || answers.business === "complex")) {
      return "elite";
    }

    var order = ["essential", "signature", "prestige", "elite"];
    var best = "signature";
    var bestScore = -999;
    order.forEach(function (id) {
      if (score[id] > bestScore) {
        bestScore = score[id];
        best = id;
      }
    });
    return best;
  }

  function offerById(id) {
    if (!window.AurelisOffers || !window.AurelisOffers.byId) return null;
    return window.AurelisOffers.byId[id] || null;
  }

  function mount(root) {
    if (!root) return;
    var copy = t();
    var step = 0;
    var answers = {};
    var questions = [
      { key: "business", label: copy.q1, options: copy.business },
      { key: "hasSite", label: copy.q2, options: copy.hasSite },
      { key: "goal", label: copy.q3, options: copy.goals },
      { key: "features", label: copy.q4, options: copy.features },
      { key: "budget", label: copy.q5, options: copy.budgets },
    ];

    function render() {
      copy = t();
      if (step >= questions.length) {
        renderResult();
        return;
      }
      var q = questions[step];
      var opts = q.options
        .map(function (o) {
          var selected = answers[q.key] === o.v ? " is-selected" : "";
          return (
            '<button type="button" class="oa-option' +
            selected +
            '" data-value="' +
            o.v +
            '">' +
            o.l +
            "</button>"
          );
        })
        .join("");

      root.innerHTML =
        '<div class="oa-card">' +
        '<p class="oa-step">' +
        (step + 1) +
        " / " +
        questions.length +
        "</p>" +
        "<h3 class=\"oa-q\">" +
        q.label +
        "</h3>" +
        '<div class="oa-options" role="group">' +
        opts +
        "</div>" +
        '<div class="oa-nav">' +
        (step > 0
          ? '<button type="button" class="btn btn-ghost" data-oa-back="1">' + copy.back + "</button>"
          : "<span></span>") +
        "</div></div>";

      root.querySelectorAll(".oa-option").forEach(function (btn) {
        btn.addEventListener("click", function () {
          answers[q.key] = btn.getAttribute("data-value");
          track("offer_assistant_answer", { step: step + 1, key: q.key, value: answers[q.key] });
          step += 1;
          render();
        });
      });
      var back = root.querySelector("[data-oa-back]");
      if (back) {
        back.addEventListener("click", function () {
          step = Math.max(0, step - 1);
          render();
        });
      }
    }

    function renderResult() {
      copy = t();
      var id = recommend(answers);
      var offer = offerById(id);
      if (!offer) {
        root.innerHTML = "<p class=\"oa-error\">Catalogue indisponible.</p>";
        return;
      }
      var L = lang() === "en" ? "en" : "fr";
      var reasons = (copy.reasons[id] || [])
        .map(function (r) {
          return "<li>" + r + "</li>";
        })
        .join("");
      var features = (offer.features[L] || [])
        .slice(0, 5)
        .map(function (f) {
          return "<li>" + f + "</li>";
        })
        .join("");

      track("offer_assistant_recommend", { offer: offer.name, offer_id: id });

      root.innerHTML =
        '<div class="oa-card oa-result">' +
        '<p class="oa-kicker">' +
        copy.resultTitle +
        "</p>" +
        "<h3>" +
        copy.resultLead.replace("{offer}", offer.name) +
        "</h3>" +
        '<p class="oa-price"><span>' +
        copy.price +
        "</span> " +
        offer.priceLabel[L] +
        "</p>" +
        '<p class="oa-benefit">' +
        (offer.benefit[L] || "") +
        "</p>" +
        "<h4>" +
        copy.why +
        "</h4><ul>" +
        reasons +
        "</ul>" +
        "<ul class=\"oa-features\">" +
        features +
        "</ul>" +
        '<p class="oa-limit"><strong>' +
        copy.limits +
        " — </strong>" +
        (copy.limitText[id] || "") +
        "</p>" +
        '<div class="oa-actions">' +
        '<a href="#offres" class="btn btn-gold" data-offer="' +
        offer.name +
        '" data-price="' +
        offer.priceLabel[L] +
        '" data-lead-open="1" data-track-cta="assistant_start">' +
        copy.start +
        "</a>" +
        '<a href="#offres" class="btn btn-ghost" data-track-cta="assistant_other">' +
        copy.other +
        "</a>" +
        '<a href="#comparateur" class="btn btn-ghost" data-track-cta="assistant_compare">' +
        copy.compare +
        "</a>" +
        '<button type="button" class="btn btn-ghost" data-oa-restart="1">' +
        copy.restart +
        "</button>" +
        "</div></div>";

      var restart = root.querySelector("[data-oa-restart]");
      if (restart) {
        restart.addEventListener("click", function () {
          step = 0;
          answers = {};
          track("offer_assistant_restart", {});
          render();
        });
      }
    }

    track("offer_assistant_start", {});
    render();
  }

  function init() {
    var root = document.getElementById("offerAssistant");
    if (root) mount(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.AurelisOfferAssistant = { recommend: recommend, mount: mount };
})();
