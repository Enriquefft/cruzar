// Barrel export for every Cruzar pattern in @cruzar/brand/patterns.
//
// Patterns are Cruzar-specific compositions of shadcn primitives. They
// encode product knowledge (what a "placement status badge" means, how
// a "stat hero" looks) so consuming surfaces compose them rather than
// re-inventing their internal logic.
//
// Consumers: `import { StatHero, PlacementStatusBadge } from "@cruzar/brand/patterns"`.
// Tree-shaking-aware consumers can import a single pattern via
// `import { StatHero } from "@cruzar/brand/patterns/StatHero"` (see package.json exports).
//
// When adding a new pattern under components/patterns/, append its
// `export *` line below (alphabetical) and add a showcase block in
// app/system/patterns/page.tsx.

export * from "./CohortRow";
export * from "./CvHeaderBlock";
export * from "./EditorialSectionHeader";
export * from "./EmailSignature";
export * from "./FieldSectionHeader";
export * from "./FooterColophon";
export * from "./PlacementStatusBadge";
export * from "./PricingLine";
export * from "./ProofLedger";
export * from "./StatHero";
export * from "./StudentQuote";
export * from "./VerificationStamp";
export * from "./WordmarkHeading";
