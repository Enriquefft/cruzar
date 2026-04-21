import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthedHeader } from "@/components/authed-header";
import { db } from "@/db/client";
import { students } from "@/db/schema";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";

export default async function OnboardingThanksPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id || !session.user.email) redirect("/");

  const email = session.user.email;

  const rows = await db
    .select({
      public_slug: students.public_slug,
      consent_public_profile: students.consent_public_profile,
    })
    .from(students)
    .where(eq(students.id, session.user.id))
    .limit(1);

  const row = rows[0];
  const publicUrl =
    row?.consent_public_profile && row.public_slug
      ? `${env().BETTER_AUTH_URL}/p/${row.public_slug}`
      : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AuthedHeader email={email} active="profile" />
      <main className="mx-auto flex max-w-xl flex-col items-center justify-center px-4 py-16 text-center md:px-8">
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight md:text-[32px]">
          Estás dentro.
        </h1>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          Miura te escribirá por WhatsApp en las próximas 24 horas para empezar tu intake. Es una
          conversación de 4 rondas, repartida en 1 o 2 días. Cuando termine, tu perfil queda listo y
          empezamos a postular por ti. Mientras tanto, mantén tu WhatsApp a la mano.
        </p>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Si no sabes de nosotros en 48 horas, escríbenos a{" "}
          <a href="mailto:enrique@cruzarapp.com" className="underline underline-offset-2">
            enrique@cruzarapp.com
          </a>
          .
        </p>
        {publicUrl ? (
          <div className="mt-8 w-full rounded-md border border-border bg-muted/30 p-4 text-left">
            <p className="text-sm font-medium">Tu página pública</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Se activa apenas tu perfil esté listo.
            </p>
            <a
              href={publicUrl}
              className="mt-2 block break-all font-mono text-sm underline underline-offset-2"
            >
              {publicUrl}
            </a>
          </div>
        ) : null}
      </main>
    </div>
  );
}
