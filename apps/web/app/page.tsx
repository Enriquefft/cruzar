import type { Metadata } from "next";
import { CohortStatus } from "@/components/cohort-status";
import { CounterBand } from "@/components/counter";
import { EmailCta } from "@/components/email-cta";
import { Hero } from "@/components/hero";
import { Quote } from "@/components/quote";
import { getPublicCounter, type PublicCounter } from "@/lib/counter";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Cruzar — postulación autónoma a roles remotos en USD",
  description:
    "Diagnóstico, validación en escenarios reales y postulación autónoma a empresas que contratan en USD. Cobramos solo cuando firmas oferta.",
};

const COUNTER_MIN_PROFILES = 3;

export default async function LandingPage() {
  let counter: PublicCounter | null = null;
  try {
    counter = await getPublicCounter();
  } catch {
    counter = null;
  }

  const hasLiveCounter = counter !== null && counter.studentsProfiled >= COUNTER_MIN_PROFILES;

  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)] selection:bg-[color:var(--brand-ink)] selection:text-[color:var(--brand-paper)]">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-10">
        <Hero />
        {hasLiveCounter && counter ? <CounterBand counter={counter} /> : <CohortStatus />}
        <Quote />
        <EmailCta />
      </div>
    </main>
  );
}
