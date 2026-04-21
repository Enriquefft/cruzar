"use client";

import { useCallback, useId, useState } from "react";
import { z } from "zod";
import { signInWithGoogle, signInWithMagicLink } from "@/lib/auth-client";

const emailSchema = z.email();

type CtaStatus =
  | { kind: "idle" }
  | { kind: "pending"; via: "email" | "google" }
  | { kind: "sent" }
  | { kind: "error"; message: string };

function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    const candidate = (err as { message: unknown }).message;
    if (typeof candidate === "string") return candidate;
  }
  return "";
}

function isRateLimitError(raw: string): boolean {
  const lower = raw.toLowerCase();
  return (
    lower.includes("rate limit") ||
    lower.includes("too many") ||
    lower.includes("try again later") ||
    lower.includes("429")
  );
}

export function EmailCta() {
  const inputId = useId();
  const helpId = `${inputId}-help`;
  const errId = `${inputId}-err`;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<CtaStatus>({ kind: "idle" });

  const pending = status.kind === "pending";
  const emailPending = status.kind === "pending" && status.via === "email";
  const googlePending = status.kind === "pending" && status.via === "google";
  const sent = status.kind === "sent";
  const errorMessage = status.kind === "error" ? status.message : null;

  const onGoogleClick = useCallback(async () => {
    if (pending) return;
    setStatus({ kind: "pending", via: "google" });
    try {
      await signInWithGoogle();
    } catch {
      setStatus({
        kind: "error",
        message: "No pudimos iniciar con Google. Intenta con tu correo.",
      });
    }
  }, [pending]);

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (pending) return;

      const trimmed = email.trim();
      const parsed = emailSchema.safeParse(trimmed);
      if (!parsed.success) {
        setStatus({ kind: "error", message: "Ingresa un correo válido." });
        return;
      }

      setStatus({ kind: "pending", via: "email" });
      try {
        await signInWithMagicLink(parsed.data);
        setStatus({ kind: "sent" });
      } catch (err) {
        const raw = extractErrorMessage(err);
        if (isRateLimitError(raw)) {
          setStatus({
            kind: "error",
            message: "Ya te enviamos un enlace reciente. Revisa tu correo o espera unos minutos.",
          });
        } else {
          setStatus({
            kind: "error",
            message: "No pudimos enviar el enlace. Inténtalo de nuevo.",
          });
        }
      }
    },
    [email, pending],
  );

  return (
    <section
      aria-labelledby="cta-heading"
      className="mx-auto max-w-3xl border-t border-zinc-200 py-12 md:py-16"
    >
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <h2 id="cta-heading" className="text-xl font-semibold tracking-tight text-zinc-950">
            Empieza tu diagnóstico.
          </h2>
          <p id={helpId} className="text-sm text-zinc-600">
            Déjanos tu correo y te enviamos un enlace para entrar. Sin contraseñas.
          </p>
        </div>

        {errorMessage ? (
          <div
            role="alert"
            id={errId}
            className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900"
          >
            {errorMessage}
          </div>
        ) : null}

        {sent ? (
          <div className="flex flex-col gap-2">
            <div
              role="status"
              className="rounded-md border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900"
            >
              Revisa tu correo. Enviamos el enlace a <span className="font-medium">{email}</span>.
            </div>
            <p className="px-1 text-xs text-zinc-500">
              Miura te escribirá por WhatsApp en las próximas 24h.
            </p>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={onGoogleClick}
              disabled={pending}
              aria-disabled={pending}
              aria-label="Continuar con Google"
              className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-md border border-zinc-300 bg-white px-6 text-base font-medium text-zinc-950 transition-colors hover:bg-zinc-50 focus-visible:border-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-950/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {googlePending ? (
                <>
                  <Spinner />
                  <span>Conectando con Google...</span>
                </>
              ) : (
                <>
                  <GoogleIcon />
                  <span>Continuar con Google</span>
                </>
              )}
            </button>

            <div
              aria-hidden="true"
              className="flex items-center gap-3 text-xs uppercase tracking-wide text-zinc-500"
            >
              <span className="h-px flex-1 bg-zinc-200" />
              <span>o</span>
              <span className="h-px flex-1 bg-zinc-200" />
            </div>

            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor={inputId} className="sr-only">
                Correo
              </label>
              <input
                id={inputId}
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu@correo.com"
                aria-describedby={errorMessage ? errId : helpId}
                aria-invalid={errorMessage !== null ? true : undefined}
                disabled={pending}
                className="h-12 w-full rounded-md border border-zinc-300 bg-white px-4 text-base text-zinc-950 outline-none placeholder:text-zinc-400 focus-visible:border-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-950/10 disabled:opacity-50 sm:flex-1"
              />
              <button
                type="submit"
                disabled={pending}
                aria-disabled={pending}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-zinc-950 px-6 text-base font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {emailPending ? (
                  <>
                    <Spinner />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <span>Enviar enlace</span>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-4 w-4 animate-spin"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <title>Cargando</title>
      <circle cx="8" cy="8" r="6" className="opacity-25" />
      <path d="M14 8a6 6 0 0 0-6-6" strokeLinecap="round" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" className="h-5 w-5">
      <title>Google</title>
      <path
        fill="#4285F4"
        d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9086c1.7018-1.5668 2.6836-3.874 2.6836-6.615Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.4673-.8059 5.9564-2.1805l-2.9086-2.2581c-.8059.54-1.8368.8591-3.0477.8591-2.344 0-4.3282-1.5831-5.0359-3.7104H.9573v2.3318C2.4382 15.9832 5.4818 18 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.9641 10.71c-.18-.54-.2823-1.1168-.2823-1.71 0-.5932.1023-1.17.2823-1.71V4.9582H.9573C.3477 6.1731 0 7.5477 0 9c0 1.4523.3477 2.8268.9573 4.0418L3.9641 10.71Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.9641 7.29C4.6718 5.1627 6.6559 3.5795 9 3.5795Z"
      />
    </svg>
  );
}
