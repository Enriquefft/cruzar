import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthedHeader } from "@/components/authed-header";
import { auth } from "@/lib/auth";
import { OnboardingForm } from "./onboarding-form";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.email) {
    redirect("/");
  }

  const email = session.user.email;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AuthedHeader email={email} active="onboarding" />
      <main>
        <div className="mx-auto max-w-2xl px-4 py-12 md:px-8">
          <header className="mb-10 space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Construimos tu perfil para que las empresas te paguen lo que vales.
            </h1>
            <p className="text-sm text-muted-foreground md:text-base">
              Completa los datos a continuación y sube tu certificado de inglés. Miura te escribirá
              por WhatsApp dentro de las próximas 24 horas para iniciar tu intake.
            </p>
          </header>
          <OnboardingForm initialEmail={email} />
        </div>
      </main>
    </div>
  );
}
