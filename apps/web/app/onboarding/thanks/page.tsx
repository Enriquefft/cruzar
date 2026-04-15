export default function OnboardingThanksPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 py-16 text-center md:px-8">
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight md:text-[32px]">
          Estás dentro.
        </h1>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          Miura te escribirá por WhatsApp dentro de las próximas 24 horas para iniciar tu intake. Es
          una conversación de 4 rondas a lo largo de 1–2 días. Cuando termine, tu perfil estará
          listo y empezamos a postular por ti. Mientras tanto, mantén tu WhatsApp activo.
        </p>
      </div>
    </main>
  );
}
