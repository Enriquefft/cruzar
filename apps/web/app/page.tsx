import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { CohortStatus } from "@/components/cohort-status";
import { CounterBand } from "@/components/counter";
import { EmailCta } from "@/components/email-cta";
import { Hero } from "@/components/hero";
import { Quote } from "@/components/quote";
import { auth } from "@/lib/auth";
import { getPublicCounter, type PublicCounter } from "@/lib/counter";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Cruzar — postulación autónoma a roles remotos en USD",
  description:
    "Diagnóstico, validación en escenarios reales y postulación autónoma a empresas que contratan en USD. Cobramos solo cuando firmas oferta.",
};

const COUNTER_MIN_PROFILES = 3;

export default async function LandingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const sessionEmail = session?.user?.email ?? null;

  if (sessionEmail) {
    return (
      <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)] selection:bg-[color:var(--brand-ink)] selection:text-[color:var(--brand-paper)]">
        <div className="mx-auto w-full max-w-5xl px-6 md:px-10">
          <Hero returningUser={{ email: sessionEmail }} />
          <section
            aria-label="Ir a mi perfil"
            className="mx-auto max-w-3xl border-t border-[color:var(--brand-hairline)] py-10 md:py-14"
          >
            <Link
              href="/profile"
              className="inline-flex items-center rounded-md border border-[color:var(--brand-hairline-strong)] bg-[color:var(--brand-ink)] px-5 py-3 font-mono text-sm uppercase tracking-[0.14em] text-[color:var(--brand-paper)] transition hover:bg-[color:var(--brand-ink-soft)]"
            >
              Ir a mi perfil
            </Link>
          </section>
          <Quote />
        </div>
      </main>
    );
  }

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
