"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { submitWebsiteOffer } from "./website-offer";
import type { WebsiteOfferActionResult } from "./website-offer";

type Offer = {
  name: string;
  priceEuros: number;
  pricePrefix?: string;
  pages: string;
  description: string;
  features: readonly string[];
  featured?: boolean;
};

type Props = { offers: Offer[] };

const navItems = [
  ["Studio", "#studio"],
  ["Réalisations", "#realisations"],
  ["Territoires", "#territoires"],
  ["Expertise", "#expertise"],
  ["Offres", "#offres"],
  ["Méthode", "#methode"],
] as const;

const steps = [
  { number: "01", title: "Éclaircir", body: "Nous partons de vos objectifs, de vos contraintes et des mots de votre métier. La direction naît du réel, pas d'un modèle prédéfini." },
  { number: "02", title: "Composer", body: "Nous dessinons une direction singulière : rythme, matière, typographie et interface. Chaque choix doit servir votre message." },
  { number: "03", title: "Construire", body: "Le design devient une expérience rapide, accessible et robuste. Le détail est travaillé sans alourdir le parcours." },
  { number: "04", title: "Amplifier", body: "Après la mise en ligne, votre socle peut évoluer avec vos besoins : contenu, visibilité, automatisation et intelligence artificielle." },
] as const;

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" className={`aurelis-arrow ${diagonal ? "is-diagonal" : ""}`}>
      <path d={diagonal ? "M3 15 15 3M6 3h9v9" : "M2 9h13M10 4l5 5-5 5"} />
    </svg>
  );
}

function Mark() {
  return <span className="aurelis-mark" aria-hidden="true"><span /><span /></span>;
}

function SignatureFilament({ id, className }: { id: string; className: string }) {
  const gradient = `aurelis-filament-${id}`;
  return (
    <svg className={`aurelis-filament ${className}`} viewBox="0 0 1000 360" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8d7149" stopOpacity="0" />
          <stop offset=".26" stopColor="#b99a68" stopOpacity=".7" />
          <stop offset=".51" stopColor="#f1d5a3" />
          <stop offset=".75" stopColor="#b99a68" stopOpacity=".65" />
          <stop offset="1" stopColor="#8d7149" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g stroke={`url(#${gradient})`} vectorEffect="non-scaling-stroke">
        <path d="M8 298C191 296 230 79 417 79c195 0 220 186 575 19" strokeWidth="1.25" />
        <path d="M8 306C193 304 235 88 417 88c193 0 228 186 575 18" strokeWidth=".6" opacity=".5" />
        <path d="m440 80 31-31 31 31-31 31z m16 0 31-31 31 31-31 31z" strokeWidth="1" opacity=".85" />
      </g>
    </svg>
  );
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <div className={`aurelis-reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

function formatPrice(priceEuros: number): string {
  return new Intl.NumberFormat("fr-BE").format(priceEuros);
}

function setupMagneticButtons(root: HTMLElement): () => void {
  const cleanups: Array<() => void> = [];
  const context = gsap.context(() => {
    root.querySelectorAll<HTMLElement>(".aurelis-magnetic").forEach((button) => {
      const moveX = gsap.quickTo(button, "x", { duration: 0.45, ease: "power3.out" });
      const moveY = gsap.quickTo(button, "y", { duration: 0.45, ease: "power3.out" });
      let bounds: DOMRect | null = null;
      const enter = (event: PointerEvent) => {
        if (event.pointerType === "mouse") bounds = button.getBoundingClientRect();
      };
      const move = (event: PointerEvent) => {
        if (!bounds || event.pointerType !== "mouse") return;
        moveX(gsap.utils.clamp(-5, 5, (event.clientX - bounds.left - bounds.width / 2) * 0.04));
        moveY(gsap.utils.clamp(-4, 4, (event.clientY - bounds.top - bounds.height / 2) * 0.04));
      };
      const leave = () => { bounds = null; moveX(0); moveY(0); };
      button.addEventListener("pointerenter", enter);
      button.addEventListener("pointermove", move, { passive: true });
      button.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        button.removeEventListener("pointerenter", enter);
        button.removeEventListener("pointermove", move);
        button.removeEventListener("pointerleave", leave);
      });
    });
  }, root);
  return () => {
    cleanups.forEach((cleanup) => cleanup());
    context.revert();
  };
}

function setupCinematicScroll(root: HTMLElement): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => undefined;

  gsap.registerPlugin(ScrollTrigger);
  const cinematicMobile = window.matchMedia("(max-width: 720px)").matches;
  const scrub = cinematicMobile ? 0.25 : 0.45;
  const cinematicTargets: HTMLElement[] = [];
  const markCinematic = (...elements: Array<HTMLElement | null>) => {
    elements.forEach((element) => {
      if (element && !element.classList.contains("aurelis-cinematic-target")) {
        element.classList.add("aurelis-cinematic-target");
        cinematicTargets.push(element);
      }
    });
  };
  let refreshFrame = 0;
  const context = gsap.context(() => {
    const intro = root.querySelector<HTMLElement>(".aurelis-cinema-intro");
    const introStage = root.querySelector<HTMLElement>(".aurelis-cinema-stage");
    const introLogo = root.querySelector<HTMLElement>(".aurelis-cinema-logo");
    const introFrame = root.querySelector<HTMLElement>(".aurelis-cinema-frame");
    const introLight = root.querySelector<HTMLElement>(".aurelis-cinema-light");
    const introMessage = root.querySelector<HTMLElement>(".aurelis-cinema-message");
    const introWash = root.querySelector<HTMLElement>(".aurelis-cinema-wash");
    const introFilament = root.querySelector<SVGElement>(".aurelis-filament--intro");

    if (intro && introStage && introLogo && introFrame && introLight && introMessage && introWash) {
      markCinematic(introLogo, introFrame, introLight, introMessage, introWash);
      const introTimeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: intro,
          start: "top top",
          end: "bottom bottom",
          scrub,
          pin: cinematicMobile ? false : introStage,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      introTimeline
        .fromTo(introLogo, { scale: 1, opacity: 1 }, { scale: cinematicMobile ? 4.4 : 6.8, opacity: 0.12, duration: 0.52 }, 0)
        .fromTo(introFrame, { scale: 0.55, rotation: -20, opacity: 0.35 }, { scale: 1.65, rotation: 18, opacity: 0.95, duration: 0.7 }, 0)
        .fromTo(introLight, { xPercent: -145, opacity: 0 }, { xPercent: 65, opacity: 1, duration: 0.24 }, 0.18)
        .fromTo(introMessage, { y: 90, opacity: 0, clipPath: "inset(100% 0 0 0)" }, { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", ease: "power2.out", duration: 0.25 }, 0.55)
        .to(introLogo, { xPercent: -30, yPercent: -220, scale: 1.25, opacity: 0.22, duration: 0.4 }, 0.62)
        .to(introWash, { opacity: 1, duration: 0.32 }, 0.72);
      if (introFilament) {
        introTimeline.fromTo(introFilament, { xPercent: -8, yPercent: 8, scale: 0.88, rotation: -5, opacity: 0.55 }, { xPercent: 6, yPercent: -6, scale: 1.12, rotation: 5, opacity: 0.85, duration: 0.85 }, 0);
      }
    }

    const transition = root.querySelector<HTMLElement>(".aurelis-transition-scene");
    const transitionStage = root.querySelector<HTMLElement>(".aurelis-transition-stage");
    const transitionShape = root.querySelector<HTMLElement>(".aurelis-transition-shape");
    const transitionTitle = root.querySelector<HTMLElement>(".aurelis-transition-title");
    const transitionSub = root.querySelector<HTMLElement>(".aurelis-transition-sub");
    const transitionWash = root.querySelector<HTMLElement>(".aurelis-transition-wash");
    const transitionFilament = root.querySelector<SVGElement>(".aurelis-filament--transition");

    if (transition && transitionStage && transitionShape && transitionTitle && transitionSub && transitionWash) {
      markCinematic(transitionShape, transitionTitle, transitionSub, transitionWash);
      const transitionTimeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: transition,
          start: "top top",
          end: "bottom bottom",
          scrub,
          pin: cinematicMobile ? false : transitionStage,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
        .fromTo(transitionShape, { scale: 0.3, rotation: -18, opacity: 0.28 }, { scale: cinematicMobile ? 3.2 : 4.8, rotation: 18, opacity: 0.92, duration: 0.68 }, 0)
        .fromTo(transitionTitle, { y: 80, opacity: 0 }, { y: 0, opacity: 1, ease: "power2.out", duration: 0.27 }, 0.2)
        .to(transitionTitle, { y: -120, opacity: 0, duration: 0.2 }, 0.62)
        .fromTo(transitionSub, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25 }, 0.58)
        .to(transitionWash, { opacity: 1, duration: 0.28 }, 0.82);
      if (transitionFilament) {
        transitionTimeline.fromTo(transitionFilament, { xPercent: -20, yPercent: 10, scale: 0.82, rotation: -8, opacity: 0.45 }, { xPercent: 14, yPercent: -4, scale: 1.16, rotation: 7, opacity: 0.8, duration: 0.85 }, 0);
      }
    }

    const portfolioStage = root.querySelector<HTMLElement>(".aurelis-portfolio-stage");
    const portfolioCards = gsap.utils.toArray<HTMLElement>(".aurelis-territory-card", portfolioStage ?? undefined);
    if (portfolioStage && portfolioCards.length > 0 && !cinematicMobile) {
      const desktop = window.matchMedia("(min-width: 981px)").matches;
      markCinematic(...portfolioCards);
      const portfolioTimeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: portfolioStage,
          start: "top top+=8%",
          end: desktop ? "+=185%" : "bottom 72%",
          scrub,
          pin: desktop ? portfolioStage : false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      portfolioTimeline
        .fromTo(portfolioCards[0], { x: -90, y: 90, scale: 0.82, rotation: -5, opacity: 0.68 }, { x: 0, y: 0, scale: 1, rotation: -2, opacity: 1, duration: 0.34 }, 0)
        .fromTo(portfolioCards[1], { x: 90, y: 120, scale: 0.78, rotation: 5, opacity: 0.68 }, { x: 0, y: 0, scale: 1, rotation: 2, opacity: 1, duration: 0.34 }, 0.22)
        .fromTo(portfolioCards[2], { x: -40, y: 150, scale: 0.76, rotation: -3, opacity: 0.68 }, { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, duration: 0.34 }, 0.48)
        .to(portfolioCards[0], { xPercent: -13, yPercent: -4, scale: 0.84, opacity: 0.74, duration: 0.25 }, 0.68)
        .to(portfolioCards[1], { xPercent: 10, yPercent: -3, scale: 0.9, opacity: 0.82, duration: 0.25 }, 0.68);
      portfolioCards.forEach((card, index) => {
        const artwork = card.querySelector<HTMLElement>(".aurelis-territory-artwork");
        const title = card.querySelector<HTMLElement>(".aurelis-territory-card-title");
        const start = index * 0.22;
        if (artwork) portfolioTimeline.fromTo(artwork, { scale: 1.1, yPercent: 3 }, { scale: 1, yPercent: 0, duration: 0.34 }, start);
        if (title) portfolioTimeline.fromTo(title, { yPercent: 32 }, { yPercent: 0, duration: 0.28, ease: "power2.out" }, start + 0.08);
      });
    }

    const expertiseList = root.querySelector<HTMLElement>(".aurelis-expertise-list");
    const expertiseItems = gsap.utils.toArray<HTMLElement>(".aurelis-expertise-item", expertiseList ?? undefined);
    if (expertiseList && expertiseItems.length > 0 && !cinematicMobile) {
      const desktop = window.matchMedia("(min-width: 981px)").matches;
      markCinematic(...expertiseItems);
      const expertiseTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: expertiseList,
          start: "top top+=12%",
          end: desktop ? "+=170%" : "bottom 72%",
          scrub,
          pin: desktop ? expertiseList : false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      expertiseItems.forEach((item, index) => {
        expertiseTimeline.fromTo(item, { x: index % 2 ? 24 : -24, opacity: 0.68 }, { x: 0, opacity: 1, duration: 0.28 }, index * 0.22);
      });
    }

    const intelligence = root.querySelector<HTMLElement>(".aurelis-intelligence");
    const intelligenceInner = root.querySelector<HTMLElement>(".aurelis-intelligence-inner");
    const intelligenceLines = root.querySelector<HTMLElement>(".aurelis-intelligence-lines");
    const intelligenceCopy = root.querySelector<HTMLElement>(".aurelis-intelligence-copy");
    const intelligenceNote = root.querySelector<HTMLElement>(".aurelis-intelligence-note");
    const intelligenceStrokes = gsap.utils.toArray<HTMLElement>(".aurelis-capability-line", intelligenceNote ?? undefined);
    if (intelligence && intelligenceInner && intelligenceLines && intelligenceCopy && intelligenceNote && !cinematicMobile) {
      markCinematic(intelligenceInner, intelligenceLines, intelligenceCopy, intelligenceNote);
      const intelligenceTimeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: intelligence,
          start: "top top",
          end: cinematicMobile ? "bottom 78%" : "+=145%",
          scrub,
          pin: cinematicMobile ? false : intelligence,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
        .fromTo(intelligenceInner, { y: 54, opacity: 1 }, { y: 0, opacity: 1, duration: 0.24, ease: "power2.out" }, 0)
        .fromTo(intelligenceLines, { scale: 0.58, rotation: 40, opacity: 0.22 }, { scale: 1.2, rotation: 102, opacity: 0.78, duration: 0.65 }, 0)
        .fromTo(intelligenceCopy, { y: 72 }, { y: 0, duration: 0.3, ease: "power2.out" }, 0.2)
        .fromTo(intelligenceNote, { x: 42 }, { x: 0, duration: 0.28, ease: "power2.out" }, 0.42)
        .to(intelligenceLines, { scale: 1.75, rotation: 138, opacity: 0.25, duration: 0.32 }, 0.68);
      intelligenceTimeline.fromTo(intelligenceStrokes, { scaleX: 0.2, opacity: 0.45 }, { scaleX: 1, opacity: 1, stagger: 0.1, duration: 0.22 }, 0.4);
    }

    const stepsRoot = root.querySelector<HTMLElement>(".aurelis-steps");
    const stepItems = gsap.utils.toArray<HTMLElement>(".aurelis-step", stepsRoot ?? undefined);
    if (stepsRoot && stepItems.length > 0 && !cinematicMobile) {
      const desktop = window.matchMedia("(min-width: 981px)").matches;
      markCinematic(...stepItems);
      const methodTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: stepsRoot,
          start: "top top+=12%",
          end: desktop ? "+=170%" : "bottom 75%",
          scrub,
          pin: desktop ? stepsRoot : false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      stepItems.forEach((item, index) => {
        methodTimeline.fromTo(item, { y: 34, opacity: 0.68, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.28 }, index * 0.24);
      });
    }

    const finalStage = root.querySelector<HTMLElement>(".aurelis-final-stage");
    const finalLight = root.querySelector<HTMLElement>(".aurelis-finale-light");
    const finalHeading = root.querySelector<HTMLElement>(".aurelis-contact-heading");
    const finalFilament = root.querySelector<SVGElement>(".aurelis-filament--finale");
    const finalBrand = root.querySelector<HTMLElement>(".aurelis-finale-brand");
    const finalLines = gsap.utils.toArray<HTMLElement>(".aurelis-final-line > span", finalHeading ?? undefined);
    if (finalStage && finalLight && finalHeading && !cinematicMobile) {
      markCinematic(finalLight, finalHeading);
      const finalTimeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: finalStage,
          start: "top top",
          end: "bottom bottom",
          scrub,
          pin: cinematicMobile ? false : finalStage,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
        .fromTo(finalLight, { scale: 0.18, opacity: 0, rotation: -20 }, { scale: 1.1, opacity: 0.78, rotation: 12, duration: 0.62 }, 0)
        .fromTo(finalHeading, { y: 70, opacity: 0.82, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }, 0.1)
        .to(finalLight, { scale: 2.9, opacity: 0.12, rotation: 32, duration: 0.38 }, 0.64);
      if (finalFilament) {
        finalTimeline.fromTo(finalFilament, { xPercent: 0, yPercent: 8, scale: 1.3, rotation: -12, opacity: 0.42 }, { xPercent: () => gsap.utils.clamp(20, 30, 30 - Math.max(0, 1200 - window.innerWidth) * 0.028), yPercent: -32, scale: 0.85, rotation: 0, opacity: 0.8, duration: 0.65 }, 0);
      }
      if (finalBrand) {
        finalTimeline.fromTo(finalBrand, { y: 12, opacity: 0.45 }, { y: 0, opacity: 0.9, duration: 0.3 }, 0.22);
      }
      finalTimeline.fromTo(finalLines, { yPercent: 55 }, { yPercent: 0, duration: 0.32, stagger: 0.12, ease: "power2.out" }, 0.18);
    }

    refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
  }, root);

  return () => {
    if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
    context.revert();
    cinematicTargets.forEach((element) => element.classList.remove("aurelis-cinematic-target"));
  };
}

function OfferForm({ offers, selectedOffer, setSelectedOffer }: Props & { selectedOffer: string; setSelectedOffer: (offer: string) => void }) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<WebsiteOfferActionResult | null>(null);
  const [consent, setConsent] = useState(false);
  const attempt = useRef<{ identity: string; key: string } | null>(null);
  const formStarted = useRef(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setResult(null);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const input: Record<string, unknown> = Object.fromEntries(form.entries());
    input.offer = selectedOffer;
    input.consent = consent;
    input.language = "fr";
    const identity = `${String(input.email).trim().toLowerCase()}:${selectedOffer}`;
    if (!attempt.current || attempt.current.identity !== identity) {
      attempt.current = { identity, key: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}` };
    }
    input.idempotencyKey = attempt.current.key;
    const response = await submitWebsiteOffer(input);
    setResult(response);
    setPending(false);
    if (response.ok) {
      attempt.current = null;
      formElement.reset();
      setConsent(false);
      if (!response.duplicate) window.AurelisAnalytics?.formSuccess({ offer: selectedOffer, id: response.id, duplicate: false, intent: "project" });
    }
  }

  return (
    <div className="aurelis-contact-layout">
      <div className="aurelis-contact-intro">
        <p className="aurelis-kicker">Un premier échange</p>
        <h2 className="aurelis-display aurelis-contact-title">Osez voir plus grand. Créons ce qui vous distingue.</h2>
        <p className="aurelis-lead">
          Décrivez votre projet avec vos mots. Nous reviendrons vers vous avec une première lecture claire, sans tunnel
          commercial ni promesse automatique.
        </p>
        <div className="aurelis-contact-details"><span className="aurelis-status-dot" aria-hidden="true" />Réponse humaine sous 24 heures ouvrées.</div>
        <a className="aurelis-contact-phone" href="tel:+32495380329" aria-label="Appeler Aurelis au 0495 38 03 29">
          <span>Parlons-en directement</span>
          <strong>0495 38 03 29</strong>
          <Arrow diagonal />
        </a>
        <div className="aurelis-contact-orbit" aria-hidden="true">
          <span className="aurelis-orbit-ring aurelis-orbit-ring-one" />
          <span className="aurelis-orbit-ring aurelis-orbit-ring-two" />
          <span className="aurelis-orbit-core">A</span>
        </div>
      </div>

        <form id="project-form" className="aurelis-form" method="post" action="/api/leads" onSubmit={handleSubmit} onFocus={() => { if (!formStarted.current) { formStarted.current = true; window.AurelisAnalytics?.formStart(selectedOffer); } }}>
        <div className="aurelis-form-heading">
          <div><p className="aurelis-kicker">Parlons du projet</p><h3 className="aurelis-display">Une direction à explorer ?</h3></div>
          <span className="aurelis-form-step">01 / 01</span>
        </div>
        <fieldset className="aurelis-offer-picker">
          <legend>La formule qui se rapproche de votre besoin</legend>
          <div className="aurelis-offer-options">
            {offers.map((offer) => (
              <label className={`aurelis-offer-option ${selectedOffer === offer.name ? "is-selected" : ""}`} key={offer.name}>
                <input type="radio" name="offer-choice" value={offer.name} checked={selectedOffer === offer.name} onChange={() => setSelectedOffer(offer.name)} />
                <span>{offer.name.replace("Aurelis ", "")}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="aurelis-form-grid">
          <label><span>Votre nom</span><input required name="contactName" autoComplete="name" placeholder="Prénom Nom" /></label>
          <label><span>Entreprise</span><input required name="company" autoComplete="organization" placeholder="Nom de votre entreprise" /></label>
        </div>
        <div className="aurelis-form-grid">
          <label><span>Email professionnel</span><input required type="email" name="email" autoComplete="email" placeholder="vous@entreprise.be" /></label>
          <label><span>Pays</span><input required name="country" autoComplete="country-name" defaultValue="Belgique" /></label>
        </div>
        <div className="aurelis-form-grid">
          <label>
            <span>Type de projet</span>
            <select required name="projectType" defaultValue=""><option value="" disabled>Choisir une catégorie</option><option>Création de site</option><option>Refonte de site</option><option>Identité digitale</option><option>Automatisation & IA</option><option>Autre projet</option></select>
          </label>
          <label>
            <span>Budget envisagé</span>
            <select required name="budget" defaultValue=""><option value="" disabled>Choisir une enveloppe</option><option>Moins de 1 000 €</option><option>1 000 – 3 000 €</option><option>3 000 – 7 000 €</option><option>Plus de 7 000 €</option><option>À définir ensemble</option></select>
          </label>
        </div>
        <div className="aurelis-form-grid aurelis-form-grid-last">
          <label>
            <span>Échéance souhaitée</span>
            <select required name="desiredDate" defaultValue=""><option value="" disabled>Choisir une période</option><option>Dès que possible</option><option>Dans les 1 à 3 mois</option><option>Dans 3 à 6 mois</option><option>Pas d’échéance fixe</option></select>
          </label>
          <label><span>Téléphone <em>(facultatif)</em></span><input name="phone" autoComplete="tel" placeholder="+32 ..." /></label>
        </div>
        <label className="aurelis-form-wide"><span>Ce que vous aimeriez construire</span><textarea required name="needs" rows={4} placeholder="Votre contexte, vos envies, vos questions…" /></label>
        <label className="aurelis-consent">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
          <span>J’accepte que ces informations soient utilisées pour traiter ma demande. <a href="/politique-confidentialite/">Politique de confidentialité</a></span>
        </label>
        <label className="aurelis-honeypot" aria-hidden="true">Ne pas remplir<input tabIndex={-1} autoComplete="off" name="companyWebsiteConfirm" /></label>
        {result ? <p className={`aurelis-form-message ${result.ok ? "is-success" : "is-error"}`} role="status">{result.ok ? result.message : result.error}</p> : null}
        <button className="aurelis-submit" type="submit" disabled={pending || !consent}>{pending ? "Transmission…" : "Envoyer ma demande"}<Arrow /></button>
        <p className="aurelis-form-note">Votre demande est enregistrée pour qualification humaine. Aucun devis définitif ni envoi automatique.</p>
      </form>
    </div>
  );
}

export function AurelisLanding({ offers }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(offers[1]?.name ?? offers[0]?.name ?? "Aurelis Signature");
  const [orbitPaused, setOrbitPaused] = useState(false);

  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>(".aurelis-site");
    if (!root) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 720px)");
    const desktopQuery = window.matchMedia("(min-width: 981px)");
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    let cleanupScrollScenes: () => void = () => undefined;
    let cleanupPointer: () => void = () => undefined;
    let observer: IntersectionObserver | null = null;

    const initializeMotion = () => {
      observer?.disconnect();
      observer = null;
      cleanupScrollScenes();

      const elements = Array.from(root.querySelectorAll<HTMLElement>(".aurelis-reveal"));
      if (reducedQuery.matches) {
        elements.forEach((element) => element.classList.add("is-visible"));
        return;
      }

      cleanupScrollScenes = setupCinematicScroll(root);
      observer = new IntersectionObserver(
        (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
      );
      elements.filter((element) => !element.classList.contains("aurelis-cinematic-target")).forEach((element) => observer?.observe(element));
    };

    const initializePointer = () => {
      cleanupPointer();
      cleanupPointer = !reducedQuery.matches && pointerQuery.matches ? setupMagneticButtons(root) : () => undefined;
    };
    const handleMediaChange = () => { initializeMotion(); initializePointer(); };
    initializeMotion();
    initializePointer();
    reducedQuery.addEventListener("change", handleMediaChange);
    mobileQuery.addEventListener("change", handleMediaChange);
    desktopQuery.addEventListener("change", handleMediaChange);
    pointerQuery.addEventListener("change", initializePointer);

    return () => {
      reducedQuery.removeEventListener("change", handleMediaChange);
      mobileQuery.removeEventListener("change", handleMediaChange);
      desktopQuery.removeEventListener("change", handleMediaChange);
      pointerQuery.removeEventListener("change", initializePointer);
      observer?.disconnect();
      cleanupPointer();
      cleanupScrollScenes();
    };
  }, []);

  // Démarrer l'animation uniquement lorsque le portfolio est proche de l'écran.
  // Les mouvements sont gérés par CSS (transform + opacity), sans boucle JS.
  useLayoutEffect(() => {
    const stage = document.querySelector<HTMLElement>(".aurelis-orbit-stage");
    if (!stage) return;
    if (!("IntersectionObserver" in window)) {
      stage.classList.add("is-in-view");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === stage) stage.classList.toggle("is-in-view", entry.isIntersecting);
        }
      },
      { rootMargin: "120px 0px 120px 0px", threshold: 0.01 },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <main className="aurelis-site" id="top">
      <div className="aurelis-noise" aria-hidden="true" />
      <div className="aurelis-progress" aria-hidden="true"><span /></div>
      <header className="aurelis-nav-wrap">
        <a className="aurelis-logo" href="#top" aria-label="Aurelis, retour en haut" onClick={closeMenu}>
          <Mark /><span>AURELIS</span>
        </a>
        <nav id="aurelis-navigation" className={`aurelis-nav ${menuOpen ? "is-open" : ""}`} aria-label="Navigation principale">
          {navItems.map(([label, href]) => <a key={href} href={href} onClick={closeMenu}>{label}</a>)}
          <a className="aurelis-nav-cta" href="#contact" onClick={closeMenu}>Parler du projet <Arrow /></a>
        </nav>
        <button className="aurelis-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="aurelis-navigation" onClick={() => setMenuOpen((open) => !open)}>
          <span className="sr-only">{menuOpen ? "Fermer le menu" : "Ouvrir le menu"}</span><i /><i />
        </button>
      </header>

      <section className="aurelis-cinema-intro" aria-label="Introduction Aurelis">
        <div className="aurelis-cinema-stage">
          <div className="aurelis-cinema-wash" aria-hidden="true" />
          <div className="aurelis-cinema-frame" aria-hidden="true"><span /><span /><span /></div>
          <SignatureFilament id="intro" className="aurelis-filament--intro" />
          <div className="aurelis-cinema-light" aria-hidden="true" />
          <p className="aurelis-cinema-prelude">Un studio digital pour les prochaines idées</p>
          <div className="aurelis-cinema-logo" aria-hidden="true">AURELIS</div>
          <div className="aurelis-cinema-message">
            <p className="aurelis-kicker">Entrer dans l’expérience</p>
            <h1 className="aurelis-display">Le digital<br /><em>avec une signature.</em></h1>
            <p>Faites défiler pour découvrir la direction.</p>
          </div>
          <div className="aurelis-cinema-index" aria-hidden="true">00 <span /> 01</div>
        </div>
      </section>

      <section className="aurelis-hero" id="accueil" aria-labelledby="hero-title">
        <div className="aurelis-hero-glow" aria-hidden="true" />
        <div className="aurelis-hero-orbit" aria-hidden="true"><span /><span /><span /></div>
        <div className="aurelis-hero-content">
          <p className="aurelis-kicker aurelis-hero-kicker"><span className="aurelis-live-dot" /> Studio digital indépendant <b>·</b> Design, technologie & IA</p>
          <h1 id="hero-title" className="aurelis-display aurelis-hero-title"><span>Le digital</span><span className="aurelis-hero-italic">avec une</span><span>signature.</span></h1>
          <div className="aurelis-hero-bottom">
            <p className="aurelis-hero-copy">Nous imaginons des expériences numériques qui donnent à votre entreprise une présence claire, singulière et prête pour la suite.</p>
            <div className="aurelis-hero-actions"><a className="aurelis-button aurelis-button-gold aurelis-magnetic" href="#contact">Définir un projet <Arrow /></a><a className="aurelis-text-link" href="#studio">Découvrir Aurelis <Arrow /></a></div>
          </div>
        </div>
        <div className="aurelis-scroll-cue" aria-hidden="true"><span />Faire défiler</div>
        <div className="aurelis-hero-index" aria-hidden="true">01 <span /> 10</div>
      </section>

      <div className="aurelis-ticker" aria-label="Domaines d’intervention">
        <div className="aurelis-ticker-track"><span>Stratégie</span><b>✦</b><span>Direction artistique</span><b>✦</b><span>Expériences web</span><b>✦</b><span>Intelligence artificielle</span><b>✦</b><span>Stratégie</span><b>✦</b><span>Direction artistique</span><b>✦</b><span>Expériences web</span><b>✦</b><span>Intelligence artificielle</span></div>
      </div>

      <section className="aurelis-section aurelis-manifesto" id="studio">
        <Reveal className="aurelis-section-intro"><p className="aurelis-kicker">01 — Le studio</p><p className="aurelis-section-aside">Pas de formule toute faite.<br />Une direction qui vous ressemble.</p></Reveal>
        <Reveal className="aurelis-manifesto-grid aurelis-reveal-slow">
          <h2 className="aurelis-display">Pas de vitrine<br /><em>interchangeable.</em></h2>
          <div className="aurelis-manifesto-copy"><p className="aurelis-big-copy">Aurelis assemble le fond et la forme pour créer des présences digitales qui ont quelque chose à dire.</p><p>Une stratégie lisible. Une identité qui tient. Une technologie qui sert le mouvement — pas l’inverse.</p><a className="aurelis-text-link" href="#expertise">Voir notre terrain de jeu <Arrow /></a></div>
        </Reveal>
      </section>

      <section className="aurelis-transition-scene" aria-label="Passage vers les territoires Aurelis">
        <div className="aurelis-transition-stage">
          <div className="aurelis-transition-wash" aria-hidden="true" />
          <div className="aurelis-transition-shape" aria-hidden="true"><span /><span /></div>
          <SignatureFilament id="transition" className="aurelis-filament--transition" />
          <div className="aurelis-transition-copy">
            <p className="aurelis-kicker">02 — Une présence en mouvement</p>
             <div className="aurelis-transition-title-mask"><h2 className="aurelis-display aurelis-transition-title">La forme attire.<br /><em>Le sens retient.</em></h2></div>
            <p className="aurelis-transition-sub">Chaque détail est une invitation à continuer.</p>
          </div>
          <span className="aurelis-transition-index" aria-hidden="true">01 <span /> 02</span>
        </div>
      </section>

      <section className="aurelis-section aurelis-territories" id="territoires">
        <Reveal className="aurelis-section-intro"><p className="aurelis-kicker">02 — Territoires de création</p><p className="aurelis-section-aside">Des études de direction.<br />Pas de faux cas clients.</p></Reveal>
        <div className="aurelis-portfolio-stage">
          <Reveal><div className="aurelis-territory-lead"><h2 className="aurelis-display">Trois façons<br />d’<em>ouvrir le champ.</em></h2><p>Nous préférons montrer des intentions plutôt que d’inventer des résultats. Voici les territoires créatifs que nous pouvons explorer avec vous.</p></div></Reveal>
          <SignatureFilament id="portfolio" className="aurelis-filament--portfolio" />
          <div className="aurelis-territory-grid">
            <Reveal className="aurelis-territory-card aurelis-territory-amber" delay={80}><div className="aurelis-territory-art"><div className="aurelis-territory-artwork" aria-hidden="true"><div className="aurelis-territory-artwork-inner"><span className="aurelis-art-word">FORME</span><span className="aurelis-art-circle" /></div></div></div><div className="aurelis-card-meta"><span>Étude de direction 01</span><Arrow diagonal /></div><h3 className="aurelis-display"><span className="aurelis-territory-card-title">Lignes de marque</span></h3><p>Identité digitale, langage visuel et présence éditoriale pour les marques qui veulent être reconnues.</p></Reveal>
            <Reveal className="aurelis-territory-card aurelis-territory-ink" delay={160}><div className="aurelis-territory-art"><div className="aurelis-territory-artwork" aria-hidden="true"><div className="aurelis-territory-artwork-inner"><span className="aurelis-art-grid" /><span className="aurelis-art-slice" /></div></div></div><div className="aurelis-card-meta"><span>Étude de direction 02</span><Arrow diagonal /></div><h3 className="aurelis-display"><span className="aurelis-territory-card-title">Interfaces vivantes</span></h3><p>Parcours, interactions et contenus structurés pour transformer une intention en expérience évidente.</p></Reveal>
            <Reveal className="aurelis-territory-card aurelis-territory-blue" delay={240}><div className="aurelis-territory-art"><div className="aurelis-territory-artwork" aria-hidden="true"><div className="aurelis-territory-artwork-inner"><span className="aurelis-art-orbit" /><span className="aurelis-art-spark">✦</span></div></div></div><div className="aurelis-card-meta"><span>Étude de direction 03</span><Arrow diagonal /></div><h3 className="aurelis-display"><span className="aurelis-territory-card-title">Systèmes intelligents</span></h3><p>Automatisations et IA utiles pour créer plus de clarté, de continuité et de temps retrouvé.</p></Reveal>
          </div>
        </div>
      </section>

      <section className="aurelis-section aurelis-real-work" id="realisations" aria-labelledby="real-work-title">
        <Reveal className="aurelis-section-intro"><p className="aurelis-kicker">Réalisations</p><p className="aurelis-section-aside">Trois sites livrés.<br />À découvrir en ligne.</p></Reveal>
        <Reveal className="aurelis-real-work-heading"><h2 id="real-work-title" className="aurelis-display">Des projets<br /><em>qui prennent vie.</em></h2><p>Découvrez les réalisations Aurelis, distinctes des études de direction présentées ci-dessus.</p></Reveal>
        <div className={`aurelis-orbit-stage${orbitPaused ? " is-paused" : ""}`} aria-label="Une planète animée présente successivement trois réalisations Aurelis">
          <div className="aurelis-orbit-universe" aria-hidden="true">
            <span className="aurelis-orbit-path aurelis-orbit-path-one" />
            <span className="aurelis-orbit-path aurelis-orbit-path-two" />
            <span className="aurelis-orbit-star aurelis-orbit-star-one" />
            <span className="aurelis-orbit-star aurelis-orbit-star-two" />
            <div className="aurelis-orbit-planet">
              <svg viewBox="0 0 200 200" className="aurelis-orbit-planet-art" focusable="false" aria-hidden="true">
                <defs>
                  <radialGradient id="aurelis-orbit-ocean" cx="30%" cy="23%" r="78%">
                    <stop offset="0" stopColor="#3a6267" />
                    <stop offset=".47" stopColor="#17343d" />
                    <stop offset="1" stopColor="#070d15" />
                  </radialGradient>
                  <radialGradient id="aurelis-orbit-luminous-shell" cx="28%" cy="21%" r="90%">
                    <stop offset="0" stopColor="#eddfb8" stopOpacity=".15" />
                    <stop offset=".6" stopColor="#08141e" stopOpacity="0" />
                    <stop offset="1" stopColor="#02050b" stopOpacity=".8" />
                  </radialGradient>
                  <linearGradient id="aurelis-orbit-land" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#dbc48e" />
                    <stop offset="1" stopColor="#7c704f" />
                  </linearGradient>
                  <clipPath id="aurelis-orbit-sphere-clip"><circle cx="100" cy="100" r="92" /></clipPath>
                  <g id="aurelis-orbit-world-map">
                    <path d="M35 34 54 24 69 30 80 25 89 37 77 45 76 54 64 61 66 75 53 84 44 70 29 65 24 49Z" />
                    <path d="m65 84 14 7 14 16-4 18-11 18-7 22-13 13-6-27-12-16 4-24Z" />
                    <path d="m101 27 22-11 19 8 19-3 21 17-7 21-17 9-6 19-17 9-9-18-13-4-9-22-14-13Z" />
                    <path d="m113 91 22-2 13 15-4 24-10 24-17 16-7-22-12-19 3-23Z" />
                    <path d="m160 130 17-5 17 16-4 19-18 4-15-14Z" />
                  </g>
                </defs>
                <circle cx="100" cy="100" r="92" fill="url(#aurelis-orbit-ocean)" stroke="#d0b782" strokeOpacity=".55" strokeWidth="1.5" />
                <g clipPath="url(#aurelis-orbit-sphere-clip)">
                  <g className="aurelis-orbit-continents" fill="url(#aurelis-orbit-land)" opacity=".8">
                    <use href="#aurelis-orbit-world-map" />
                    <use href="#aurelis-orbit-world-map" transform="translate(200 0)" />
                  </g>
                </g>
                <g clipPath="url(#aurelis-orbit-sphere-clip)" fill="none" stroke="#d9bf8e" strokeOpacity=".22" strokeWidth="1">
                  <ellipse cx="100" cy="100" rx="34" ry="92" />
                  <ellipse cx="100" cy="100" rx="67" ry="92" />
                  <path d="M8 100h184M19 65c48 17 114 17 162 0M19 135c48-17 114-17 162 0" />
                </g>
                <circle cx="100" cy="100" r="92" fill="url(#aurelis-orbit-luminous-shell)" pointerEvents="none" />
              </svg>
              <span className="aurelis-orbit-planet-specular" aria-hidden="true" />
            </div>
            <span className="aurelis-orbit-caption">AURELIS · UN MONDE DE POSSIBILITÉS</span>
          </div>
          <div className="aurelis-orbit-projects" role="group" aria-label="Aperçus animés des réalisations">
            <article className="aurelis-orbit-card aurelis-real-work-card">
              <a href="/realisations/mr-gaston/" data-track-cta="folio_mr_gaston">
                <img src="/assets/portfolio/mr-gaston/capture-desktop.jpg" alt="Capture du site Mr Gaston" width="1600" height="1000" loading="lazy" decoding="async" />
                <span>Restaurant · Mons</span><h3 className="aurelis-display">Mr Gaston</h3><span>Découvrir le projet <Arrow diagonal /></span>
              </a>
            </article>
            <article className="aurelis-orbit-card aurelis-real-work-card">
              <a href="https://bryan-burger.vercel.app/" target="_blank" rel="noopener noreferrer" data-track-cta="folio_bryan">
                <img src="/assets/portfolio/bryan-burger/capture-desktop.jpg" alt="Capture du site Bryan Burger" width="1400" height="900" loading="lazy" decoding="async" />
                <span>Restauration · Mons</span><h3 className="aurelis-display">Bryan Burger</h3><span>Voir le site <Arrow diagonal /></span>
              </a>
            </article>
            <article className="aurelis-orbit-card aurelis-real-work-card">
              <a href="https://transport-delivery.vercel.app/" target="_blank" rel="noopener noreferrer" data-track-cta="folio_trans">
                <img src="/assets/portfolio/trans-delivery/capture-desktop.png" alt="Capture du site Trans Delivery" width="1400" height="900" loading="lazy" decoding="async" />
                <span>Transport & logistique</span><h3 className="aurelis-display">Trans Delivery</h3><span>Voir le site <Arrow diagonal /></span>
              </a>
            </article>
          </div>
          <div className="aurelis-orbit-controls">
            <p>Des projets sélectionnés, des expériences singulières.</p>
            <button type="button" className="aurelis-orbit-pause" onClick={() => setOrbitPaused(!orbitPaused)} aria-pressed={orbitPaused}>
              {orbitPaused ? "Reprendre l’animation" : "Mettre en pause"}
            </button>
          </div>
        </div>
        <nav className="aurelis-orbit-index" aria-label="Accès direct aux trois réalisations">
          <a href="/realisations/mr-gaston/" data-track-cta="folio_mr_gaston_index"><span>01</span> Mr Gaston <Arrow diagonal /></a>
          <a href="https://bryan-burger.vercel.app/" target="_blank" rel="noopener noreferrer" data-track-cta="folio_bryan_index"><span>02</span> Bryan Burger <Arrow diagonal /></a>
          <a href="https://transport-delivery.vercel.app/" target="_blank" rel="noopener noreferrer" data-track-cta="folio_trans_index"><span>03</span> Trans Delivery <Arrow diagonal /></a>
        </nav>
      </section>

      <section className="aurelis-section aurelis-expertise" id="expertise">
        <span id="services" />
        <Reveal className="aurelis-section-intro"><p className="aurelis-kicker">03 — Expertise</p><p className="aurelis-section-aside">Une vision transversale.<br />Un seul fil conducteur.</p></Reveal>
        <Reveal className="aurelis-expertise-heading"><h2 className="aurelis-display">Penser loin.<br /><em>Construire juste.</em></h2><p>Chaque projet demande un équilibre différent. Nous réunissons les disciplines nécessaires, avec une obsession : rendre la prochaine action évidente.</p></Reveal>
        <div className="aurelis-expertise-list">
          <Reveal className="aurelis-expertise-item" delay={60}><span>01</span><h3 className="aurelis-display">Stratégie</h3><p>Positionnement, architecture de contenu et parcours de conversion.</p><Arrow /></Reveal>
          <Reveal className="aurelis-expertise-item" delay={120}><span>02</span><h3 className="aurelis-display">Design</h3><p>Direction artistique, identité d’interface et systèmes visuels cohérents.</p><Arrow /></Reveal>
          <Reveal className="aurelis-expertise-item" delay={180}><span>03</span><h3 className="aurelis-display">Technologie</h3><p>Développement rapide, accessible et durable, du prototype à la production.</p><Arrow /></Reveal>
          <Reveal className="aurelis-expertise-item" delay={240}><span>04</span><h3 className="aurelis-display">Intelligence</h3><p>IA, automatisations et données mises au service de vos équipes.</p><Arrow /></Reveal>
        </div>
      </section>

      <section className="aurelis-intelligence" aria-labelledby="intelligence-title">
        <div className="aurelis-intelligence-lines" aria-hidden="true"><span /><span /><span /><span /><svg className="aurelis-intelligence-network" viewBox="0 0 400 400" fill="none" focusable="false"><path d="M54 246 115 109 204 65 296 144 347 260 233 326 116 296 54 246Zm61-137 89 114 92-79M54 246l150-23 29 103m-29-103 143 37M116 296l88-73" /><circle cx="115" cy="109" r="4" /><circle cx="204" cy="223" r="7" /><circle cx="296" cy="144" r="4" /><circle cx="233" cy="326" r="4" /></svg></div>
        <Reveal className="aurelis-intelligence-inner">
          <div className="aurelis-intelligence-label"><span className="aurelis-live-dot" /> Aurelis Intelligence</div>
          <div className="aurelis-intelligence-copy"><h2 id="intelligence-title" className="aurelis-display">L’IA ne remplace pas<br /><em>la vision.</em></h2><p>Elle lui donne de l’amplitude.</p><a className="aurelis-button aurelis-button-outline aurelis-magnetic" href="#contact">Explorer un cas d’usage <Arrow /></a></div>
          <div className="aurelis-intelligence-note"><span>IA appliquée</span><p>Des systèmes conçus autour de vos données, de vos équipes et de décisions que vous gardez toujours en main.</p><ul className="aurelis-intelligence-capabilities"><li><i className="aurelis-capability-line" aria-hidden="true" />Données</li><li><i className="aurelis-capability-line" aria-hidden="true" />Automatisations</li><li><i className="aurelis-capability-line" aria-hidden="true" />Intelligence appliquée</li></ul></div>
        </Reveal>
      </section>

      <section className="aurelis-section aurelis-offers" id="offres">
        <Reveal className="aurelis-section-intro"><p className="aurelis-kicker">04 — Offres</p><p className="aurelis-section-aside">Un point de départ clair.<br />Un périmètre qui peut évoluer.</p></Reveal>
        <Reveal className="aurelis-offers-heading"><h2 className="aurelis-display">Choisir l’<em>impulsion.</em></h2><p>Quatre formats pour commencer au bon niveau. Les tarifs catalogue sont indicatifs : le périmètre exact est toujours confirmé ensemble.</p></Reveal>
        <div className="aurelis-offer-grid">
          {offers.map((offer, index) => (
            <Reveal className={`aurelis-offer-card ${offer.featured ? "is-featured" : ""}`} delay={index * 70} key={offer.name}>
              <div className="aurelis-offer-card-top"><span className="aurelis-offer-number">0{index + 1}</span><span>{offer.pages}</span></div>
              <h3 className="aurelis-display">{offer.name.replace("Aurelis ", "")}</h3>
              <p className="aurelis-offer-description">{offer.description}</p>
              <div className="aurelis-offer-price"><small>{offer.pricePrefix ?? "Tarif catalogue"}</small><strong>{formatPrice(offer.priceEuros)} <sup>€</sup></strong><span>HTVA</span></div>
              <ul>{offer.features.map((feature) => <li key={feature}><span>+</span>{feature}</li>)}</ul>
              <a className="aurelis-offer-link" href="#project-form" onClick={() => { setSelectedOffer(offer.name); window.AurelisAnalytics?.offerClick(offer.name); }}>Parler de cette formule <Arrow /></a>
            </Reveal>
          ))}
        </div>
        <p className="aurelis-section-footnote">Hébergement, domaine et maintenance ne sont pas inclus dans les tarifs catalogue. Un devis détaillé est établi après qualification du projet.</p>
        <div className="aurelis-commercial-links"><a className="aurelis-text-link" href="/offres/">Comparer les offres en détail <Arrow /></a><a className="aurelis-text-link" href="/site-classique/#assistant">Aidez-moi à choisir <Arrow /></a></div>
      </section>

      <section className="aurelis-section aurelis-audit" id="audit" aria-labelledby="audit-title">
        <Reveal><p className="aurelis-kicker">Audit gratuit</p><h2 id="audit-title" className="aurelis-display">Un regard neuf<br /><em>sur votre site.</em></h2><p>Clarté, design, mobile et crédibilité : échangeons sans engagement.</p><a href="/site-classique/#audit" className="aurelis-button aurelis-button-outline" data-audit-open="1" data-track-cta="audit_gratuit">Demander un audit gratuit <Arrow /></a></Reveal>
      </section>

      <section className="aurelis-section aurelis-method" id="methode">
        <Reveal className="aurelis-section-intro"><p className="aurelis-kicker">05 — Méthode</p><p className="aurelis-section-aside">Pas de boîte noire.<br />Chaque étape a son rythme.</p></Reveal>
        <Reveal className="aurelis-method-heading"><h2 className="aurelis-display">Du premier mot<br />à la <em>mise en mouvement.</em></h2><p>Une collaboration directe, des décisions visibles et assez d’espace pour bien faire les choses.</p></Reveal>
        <div className="aurelis-steps">{steps.map((step, index) => <Reveal className="aurelis-step" delay={index * 90} key={step.number}><span className="aurelis-step-number">{step.number}</span><h3 className="aurelis-display">{step.title}</h3><p>{step.body}</p><span className="aurelis-step-line" /></Reveal>)}</div>
      </section>

      <section className="aurelis-contact" id="contact" aria-labelledby="contact-title">
        <div className="aurelis-final-stage">
          <div className="aurelis-finale-light" aria-hidden="true"><span /><span /></div>
          <SignatureFilament id="finale" className="aurelis-filament--finale" />
          <div className="aurelis-finale-brand" aria-hidden="true"><Mark /><span>AURELIS</span></div>
          <div className="aurelis-contact-top"><p className="aurelis-kicker">06 — L’impulsion suivante</p><span className="aurelis-contact-count">AURELIS / 2026</span></div>
          <Reveal className="aurelis-contact-heading"><h2 id="contact-title" className="aurelis-display"><span className="aurelis-final-line"><span>DONNONS VIE</span></span>{" "}<span className="aurelis-final-line"><span><em>À VOTRE AMBITION.</em></span></span></h2><a className="aurelis-button aurelis-button-gold aurelis-final-cta aurelis-magnetic" href="#project-form">Démarrer un projet <Arrow /></a></Reveal>
        </div>
        <Reveal className="aurelis-contact-form-wrap aurelis-reveal-slow"><OfferForm offers={offers} selectedOffer={selectedOffer} setSelectedOffer={setSelectedOffer} /></Reveal>
      </section>

      <footer className="aurelis-footer">
        <div className="aurelis-footer-main"><a className="aurelis-logo" href="#top"><Mark /><span>AURELIS</span></a><p>Expériences digitales<br />et intelligence appliquée.</p><a className="aurelis-footer-top" href="#top">Retour en haut <Arrow diagonal /></a></div>
        <div className="aurelis-footer-bottom"><span>© {new Date().getFullYear()} Aurelis. Tous droits réservés.</span><a href="/mentions-legales/">Mentions légales</a><a href="/politique-confidentialite/">Confidentialité</a><a href="/en/" lang="en">English</a><a href="tel:+32495380329">0495 38 03 29</a><a href="mailto:julestherasse@gmail.com">Email</a><a href="/site-classique/#faq">Questions fréquentes</a><span className="aurelis-footer-location">Conçu avec intention <b>✦</b></span></div>
      </footer>
    </main>
  );
}
