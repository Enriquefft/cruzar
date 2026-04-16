import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CohortRow,
  CvHeaderBlock,
  EditorialSectionHeader,
  EmailSignature,
  FieldSectionHeader,
  FooterColophon,
  PlacementStatusBadge,
  PricingLine,
  ProofLedger,
  StatHero,
  StudentQuote,
  VerificationStamp,
  WordmarkHeading,
} from "@/components/patterns";
import { PRICING, PROOF, QUOTE } from "@/lib/content";

/**
 * /system/patterns — Cruzar pattern-layer showcase.
 *
 * Each block renders a pattern at realistic densities + the props
 * signature as code. Patterns are the layer between raw shadcn
 * primitives (`/system/*` everywhere else) and full pages — they
 * encode product knowledge so consuming surfaces compose them.
 */

function PatternBlock({
  no,
  title,
  description,
  signature,
  children,
}: {
  no: string;
  title: string;
  description: string;
  signature: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5 border-t border-border pt-10 first:border-t-0 first:pt-0">
      <header className="flex flex-col gap-2">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {no} · Pattern
        </p>
        <h2 className="font-serif text-2xl font-medium tracking-[-0.012em]">
          {title}
        </h2>
        <p className="max-w-[68ch] text-sm text-muted-foreground">
          {description}
        </p>
      </header>
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
        {children}
      </div>
      <pre className="overflow-x-auto rounded-md border border-border bg-muted/50 px-4 py-3 font-mono text-[0.72rem] leading-relaxed text-foreground">
        {signature}
      </pre>
    </section>
  );
}

export default function PatternsPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 md:px-10">
      {/* ─── Masthead ─── */}
      <header className="flex flex-col gap-3">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          § VIII · Patterns
        </p>
        <h1 className="font-serif text-4xl font-normal leading-[0.95] tracking-[-0.02em] md:text-5xl">
          Cruzar compositions
        </h1>
        <p className="max-w-[68ch] text-muted-foreground">
          The layer between raw shadcn primitives and full pages. Each pattern
          encodes product knowledge — the meaning of a placement status, the
          locked treatment of the wordmark, the editorial rhythm of a stat
          hero — so consuming surfaces compose them rather than re-inventing
          their internals.
        </p>
      </header>

      {/* 1 — WordmarkHeading */}
      <PatternBlock
        no="1"
        title="WordmarkHeading"
        description="Renders the locked Cruzar wordmark with Literata Regular, ACCENT period and tracking -0.045em (Capa 1). Use anywhere the wordmark appears as text. For pixel-perfect SVG embedding (favicons, OG cards, email PNGs), use Logotype."
        signature={`type Props = {
  as?: "h1" | "h2" | "h3" | "div";
  size?: number | "display1" | "display2" | "display3";
  inverted?: boolean;
};`}
      >
        <div className="flex flex-col gap-6">
          <WordmarkHeading size="display1" />
          <WordmarkHeading as="h2" size="display2" />
          <WordmarkHeading as="h3" size="display3" />
          <WordmarkHeading as="div" size={20} />
        </div>
      </PatternBlock>

      {/* 2 — StatHero */}
      <PatternBlock
        no="2"
        title="StatHero"
        description="Number-protagonist composition. Editorial: huge serif figure + descriptive sentence. Field: compact mono figure with operator caption. Optional sub-stats arranged beneath a hairline."
        signature={`type Props = {
  value: string | number;
  unit?: string;
  caption: ReactNode;
  subStats?: Array<{ label: string; value: string }>;
  register?: "editorial" | "field";
};`}
      >
        <div className="flex flex-col gap-12">
          <StatHero
            register="editorial"
            value={PROOF.placedThisCohort}
            unit="of 47"
            caption={
              <>
                students placed into international remote roles this cohort,
                each verified by signed offer letter and first-payroll screenshot.
              </>
            }
            subStats={[
              { label: "Avg. salary delta", value: `+$${PROOF.averageSalaryDeltaUsd.toLocaleString("en-US")}/mo` },
              { label: "Avg. multiple", value: `${PROOF.averageSalaryMultiple.toFixed(1)}×` },
              { label: "Partner universities", value: `${PROOF.partnerUniversities}` },
            ]}
          />
          <StatHero
            register="field"
            value={`${PROOF.placedThisCohort}`}
            unit="placed"
            caption="cohort 02 — verified, remote, signed offer letter held on file"
            subStats={[
              { label: "delta_avg", value: `+$${PROOF.averageSalaryDeltaUsd.toLocaleString("en-US")}/mo` },
              { label: "mult_avg", value: `${PROOF.averageSalaryMultiple.toFixed(1)}×` },
            ]}
          />
        </div>
      </PatternBlock>

      {/* 3 — ProofLedger */}
      <PatternBlock
        no="3"
        title="ProofLedger"
        description="Asymmetric multi-metric ledger: 1 lead cell (wide, on PAPER) + up to 3 small support cells, separated by hairlines. Field register tints the lead figure with SIGNAL."
        signature={`type Props = {
  lead: { label: string; value: string; unit?: string };
  support: Array<{ label: string; value: string; unit?: string }>;
  register?: "editorial" | "field";
};`}
      >
        <div className="flex flex-col gap-12">
          <ProofLedger
            register="editorial"
            lead={{
              label: "Avg. salary delta",
              value: `+$${PROOF.averageSalaryDeltaUsd.toLocaleString("en-US")}`,
              unit: "/mo",
            }}
            support={[
              { label: "Multiple", value: PROOF.averageSalaryMultiple.toFixed(1), unit: "×" },
              { label: "Cohort", value: `${PROOF.cohortSizeStudents}` },
              { label: "Partners", value: `${PROOF.partnerUniversities}` },
            ]}
          />
          <ProofLedger
            register="field"
            lead={{
              label: "delta_avg_usd",
              value: `+${PROOF.averageSalaryDeltaUsd.toLocaleString("en-US")}`,
              unit: "/mo",
            }}
            support={[
              { label: "mult_avg", value: PROOF.averageSalaryMultiple.toFixed(1), unit: "×" },
              { label: "n_cohort", value: `${PROOF.cohortSizeStudents}` },
              { label: "n_unis", value: `${PROOF.partnerUniversities}` },
            ]}
          />
        </div>
      </PatternBlock>

      {/* 4 — StudentQuote */}
      <PatternBlock
        no="4"
        title="StudentQuote"
        description="Magazine pull quote with attribution. Editorial: Literata at large with hung indent and curly quotes. Field: Geologica with hairline brackets and ID-style attribution."
        signature={`type Props = {
  text: ReactNode;
  attribution: string;
  lang?: "es" | "en";
  register?: "editorial" | "field";
};`}
      >
        <div className="flex flex-col gap-12">
          <StudentQuote
            register="editorial"
            lang="es"
            text={QUOTE.es}
            attribution={QUOTE.attribution}
          />
          <StudentQuote
            register="field"
            lang="en"
            text={QUOTE.en}
            attribution={QUOTE.attribution}
          />
        </div>
      </PatternBlock>

      {/* 5 — PricingLine */}
      <PatternBlock
        no="5"
        title="PricingLine"
        description="Editorial pricing sentence. The price range is bold-tabular within a serif sentence; the trigger condition is built into the same line. Pass langPrimary to render both ES and EN stacked."
        signature={`type Props = {
  range: { min: number; max: number };
  currency: string;
  trigger: string;
  langPrimary?: "es" | "en";
};`}
      >
        <div className="flex flex-col gap-10">
          <PricingLine
            range={{ min: PRICING.studentFlat.min, max: PRICING.studentFlat.max }}
            currency={PRICING.studentFlat.currency}
            trigger={PRICING.studentFlat.trigger}
          />
          <PricingLine
            langPrimary="es"
            range={{ min: PRICING.studentFlat.min, max: PRICING.studentFlat.max }}
            currency={PRICING.studentFlat.currency}
            trigger="sólo cuando se firma el contrato internacional"
          />
        </div>
      </PatternBlock>

      {/* 6 — PlacementStatusBadge */}
      <PatternBlock
        no="6"
        title="PlacementStatusBadge"
        description="Semantic badge for the six application states. Each maps to a specific Badge variant + lucide icon; bilingual copy via the lang prop. Rejected uses ghost (not destructive) — the brand voice never frames a closed application as user failure."
        signature={`type PlacementStatus = "applied" | "viewed" | "interview" | "offer" | "signed" | "rejected";
type Props = { status: PlacementStatus; lang?: "es" | "en" };`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <PlacementStatusBadge status="applied" />
            <PlacementStatusBadge status="viewed" />
            <PlacementStatusBadge status="interview" />
            <PlacementStatusBadge status="offer" />
            <PlacementStatusBadge status="signed" />
            <PlacementStatusBadge status="rejected" />
          </div>
          <div className="flex flex-wrap gap-2">
            <PlacementStatusBadge status="applied" lang="es" />
            <PlacementStatusBadge status="viewed" lang="es" />
            <PlacementStatusBadge status="interview" lang="es" />
            <PlacementStatusBadge status="offer" lang="es" />
            <PlacementStatusBadge status="signed" lang="es" />
            <PlacementStatusBadge status="rejected" lang="es" />
          </div>
        </div>
      </PatternBlock>

      {/* 7 — VerificationStamp */}
      <PatternBlock
        no="7"
        title="VerificationStamp"
        description="The cruzar.io/v/<hash> mark used on CVs and externally-shared artifacts. Inline placement for masthead pinning; footer placement for stacked PDF endcaps. Hash always set in mono."
        signature={`type Props = {
  hash: string;
  placement?: "inline" | "footer";
  lang?: "es" | "en";
};`}
      >
        <div className="flex flex-col gap-6">
          <VerificationStamp hash="m4xq7p2k" placement="inline" />
          <VerificationStamp hash="m4xq7p2k" placement="inline" lang="es" />
          <VerificationStamp hash="m4xq7p2k" placement="footer" />
        </div>
      </PatternBlock>

      {/* 8 — CohortRow */}
      <PatternBlock
        no="8"
        title="CohortRow"
        description="A single row in the operator placement tracker. Composes Avatar + role + PlacementStatusBadge + delta + days. Renders inside a parent <Table><TableBody>."
        signature={`type Props = {
  initials: string;
  role: string;
  status: PlacementStatus;
  salaryDelta?: number;
  daysToOffer?: number;
  lang?: "es" | "en";
};`}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12" />
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Delta</TableHead>
              <TableHead className="text-right">Days</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <CohortRow
              initials="MR"
              role="Frontend Engineer · US remote"
              status="signed"
              salaryDelta={3120}
              daysToOffer={41}
            />
            <CohortRow
              initials="JC"
              role="Data Analyst · EU remote"
              status="interview"
              salaryDelta={2840}
            />
            <CohortRow
              initials="AV"
              role="Customer Success · LATAM+US"
              status="viewed"
              salaryDelta={2200}
            />
            <CohortRow
              initials="DF"
              role="Backend Engineer · US remote"
              status="offer"
              salaryDelta={3540}
              daysToOffer={53}
            />
            <CohortRow
              initials="LP"
              role="Design Engineer · US remote"
              status="applied"
            />
            <CohortRow
              initials="SR"
              role="QA Engineer · US remote"
              status="rejected"
            />
          </TableBody>
        </Table>
      </PatternBlock>

      {/* 9 — EditorialSectionHeader */}
      <PatternBlock
        no="9"
        title="EditorialSectionHeader"
        description="The § <num> + hairline + uppercase eyebrow rail used across editorial surfaces. The § glyph carries the lone editorial accent permitted on most surfaces."
        signature={`type Props = {
  no: string;
  label: string;
  lang?: "es" | "en";
};`}
      >
        <div className="flex flex-col gap-4">
          <EditorialSectionHeader no="I" label="Foundations" />
          <EditorialSectionHeader no="II" label="Cohort 02 — Verified Proof" />
          <EditorialSectionHeader no="III" label="In the words of — cohort 02" lang="en" />
        </div>
      </PatternBlock>

      {/* 10 — FieldSectionHeader */}
      <PatternBlock
        no="10"
        title="FieldSectionHeader"
        description="Operator-grade equivalent: monospace §<NN> + uppercase mono label + optional status indicator (active / nominal / alert). Avoids ACCENT entirely; SIGNAL appears only when status is set."
        signature={`type Props = {
  no: string;
  label: string;
  status?: "active" | "nominal" | "alert";
};`}
      >
        <div className="flex flex-col gap-4">
          <FieldSectionHeader no="01" label="Identity" status="active" />
          <FieldSectionHeader no="02" label="Promesa" status="nominal" />
          <FieldSectionHeader no="03" label="Pipeline" status="alert" />
          <FieldSectionHeader no="04" label="Colophon" />
        </div>
      </PatternBlock>

      {/* 11 — CvHeaderBlock */}
      <PatternBlock
        no="11"
        title="CvHeaderBlock"
        description="Top-of-CV masthead. Wordmark inline + verification stamp on one baseline; candidate name (Geologica), role (mono), locale (mono caps) below. Pairs with the field-register CV template."
        signature={`type Props = {
  name: string;
  role: string;
  locale: { city: string; country: string };
  verificationHash?: string;
};`}
      >
        <CvHeaderBlock
          name="Mariana Reyes"
          role="Frontend Engineer"
          locale={{ city: "Lima", country: "Peru" }}
          verificationHash="m4xq7p2k"
        />
      </PatternBlock>

      {/* 12 — EmailSignature */}
      <PatternBlock
        no="12"
        title="EmailSignature"
        description="The locked email signature format from brand-guidelines G.1. Wordmark inline at 18px; no quote, no mobile disclaimer, no social icons (G.2)."
        signature={`type Props = {
  name: string;
  role: string;
  email: string;
};`}
      >
        <EmailSignature
          name="Enrique Flores-Talavera"
          role="Co-founder · Product & Engineering"
          email="enrique@cruzar.io"
        />
      </PatternBlock>

      {/* 13 — FooterColophon */}
      <PatternBlock
        no="13"
        title="FooterColophon"
        description="Wordmark + meaning + canonical metadata strip at the bottom of every editorial surface (and field-register CV). Editorial uses serif italic for the meaning; field swaps to mono."
        signature={`type Props = {
  register?: "editorial" | "field";
};`}
      >
        <div className="flex flex-col gap-12">
          <FooterColophon register="editorial" />
          <FooterColophon register="field" />
        </div>
      </PatternBlock>
    </div>
  );
}
