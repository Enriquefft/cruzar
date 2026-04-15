/**
 * Shared brand content. Each direction renders the SAME facts in its own visual language,
 * so comparison between directions isolates aesthetic decisions, not copy choices.
 */

export const BRAND = {
  name: "Cruzar",
  meaning: "verb · español · to cross",
  taglineEs: "Cruza del salario local al internacional.",
  taglineEn: "Cross from local pay to global pay.",
  promiseEs:
    "Diagnóstico, validación en escenarios reales y postulación autónoma a empleos remotos internacionales.",
  promiseEn:
    "Diagnosis, real-scenario validation, and autonomous applications to international remote jobs.",
} as const;

export const PROOF = {
  placedThisCohort: 12,
  averageSalaryDeltaUsd: 2840,
  averageSalaryMultiple: 4.1,
  cohortSizeStudents: 47,
  partnerUniversities: 3,
  countryReach: ["US", "DE", "ES", "MX", "CA"],
} as const;

export const QUOTE = {
  es: "Pasé de ganar S/. 2.400 a USD 3.100 al mes en 11 semanas. La diferencia paga mi casa, mi familia y un fondo de emergencia que nunca tuve.",
  en: "I went from earning S/. 2,400 to USD 3,100 a month in 11 weeks. The delta pays for my home, my family, and the first emergency fund I've ever had.",
  attribution: "U0 — backend engineer, cohort 02",
} as const;

export const PRICING = {
  studentFlat: { min: 800, max: 1500, currency: "USD", trigger: "on placement only" },
  institutionAnchor: { min: 5000, max: 20000, currency: "USD", per: "year, outcomes-capped" },
} as const;

export const DIRECTIONS = [
  {
    slug: "editorial",
    name: "Editorial Institutional",
    role: "primary",
    oneLiner: "The Economist meets Stripe docs. Numbers as protagonist.",
    audience: "Rector-facing. Pitch deck, landing top-fold, MoUs.",
  },
  {
    slug: "field-report",
    name: "Field Report",
    role: "secondary",
    oneLiner: "Operator-grade. Dense, mono data. Every pixel earns its place.",
    audience: "Operator dashboards, CV templates, employer-facing emails.",
  },
] as const;

/** Archived directions — not routed, referenced for future mining. */
export const ARCHIVED_DIRECTIONS = [
  {
    slug: "muralist",
    name: "Muralist Modernism",
    note: "Poster-strong, product-weak; mine the numbered-section rails.",
  },
] as const;

export type DirectionSlug = (typeof DIRECTIONS)[number]["slug"];
