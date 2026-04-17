import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { StatusCounters } from "@/components/status-counters";
import { StatusTimeline } from "@/components/status-timeline";
import { db } from "@/db/client";
import { applications, statusEvents } from "@/db/schema";
import { auth } from "@/lib/auth";
import type { StatusEventKind } from "@/schemas/_shared";

export const dynamic = "force-dynamic";

const COUNTER_KINDS = ["applied", "viewed", "rejected", "interview_invited"] as const;
type CounterKind = (typeof COUNTER_KINDS)[number];

function computeCounters(
  events: ReadonlyArray<{ kind: StatusEventKind }>,
): Record<CounterKind, number> {
  const counts: Record<CounterKind, number> = {
    applied: 0,
    viewed: 0,
    rejected: 0,
    interview_invited: 0,
  };
  for (const event of events) {
    if (event.kind in counts) {
      counts[event.kind as CounterKind] += 1;
    }
  }
  return counts;
}

export default async function StatusPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/");
  }

  const studentId = session.user.id;

  const [studentApplications, studentEvents] = await Promise.all([
    db
      .select()
      .from(applications)
      .where(eq(applications.student_id, studentId))
      .orderBy(desc(applications.created_at)),
    db
      .select()
      .from(statusEvents)
      .where(eq(statusEvents.student_id, studentId))
      .orderBy(desc(statusEvents.created_at)),
  ]);

  if (studentApplications.length === 0) {
    return (
      <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
        <div className="mx-auto max-w-2xl px-6 py-16 md:px-10 md:py-24">
          <h1 className="font-serif text-3xl font-medium leading-tight tracking-tight text-[color:var(--brand-ink)] md:text-4xl">
            Estado de aplicaciones
          </h1>
          <div className="mt-10 rounded-lg border border-[color:var(--brand-hairline)] bg-[color:var(--brand-card)] px-6 py-10 md:px-10 md:py-14">
            <p className="text-base leading-relaxed text-[color:var(--brand-ink-soft)] md:text-lg md:leading-8">
              Aún no tienes aplicaciones en curso. Cuando Miura envíe tus primeras postulaciones,
              las verás aquí.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const counters = computeCounters(studentEvents);

  const applicationMap = new Map(studentApplications.map((a) => [a.id, a]));

  const eventsWithApplication = studentEvents.map((event) => ({
    ...event,
    application: event.application_id ? applicationMap.get(event.application_id) : undefined,
  }));

  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="mx-auto max-w-2xl px-6 py-16 md:px-10 md:py-24">
        <h1 className="font-serif text-3xl font-medium leading-tight tracking-tight text-[color:var(--brand-ink)] md:text-4xl">
          Estado de aplicaciones
        </h1>
        <div className="mt-10">
          <StatusCounters
            applied={counters.applied}
            viewed={counters.viewed}
            rejected={counters.rejected}
            interviewInvited={counters.interview_invited}
          />
        </div>
        <div className="mt-12">
          <StatusTimeline events={eventsWithApplication} />
        </div>
      </div>
    </main>
  );
}
