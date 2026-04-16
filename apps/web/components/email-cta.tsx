"use client";

import { useCallback, useId, useState } from "react";
import { z } from "zod";
import { signInWithMagicLink } from "@/lib/auth-client";

const emailSchema = z.email();

type CtaStatus =
  | { kind: "idle" }
  | { kind: "pending" }
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

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (status.kind === "pending") return;

      const trimmed = email.trim();
      const parsed = emailSchema.safeParse(trimmed);
      if (!parsed.success) {
        setStatus({ kind: "error", message: "Ingresa un correo válido." });
        return;
      }

      setStatus({ kind: "pending" });
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
    [email, status.kind],
  );

  const pending = status.kind === "pending";
  const sent = status.kind === "sent";
  const errorMessage = status.kind === "error" ? status.message : null;

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
              {pending ? (
                <>
                  <Spinner />
                  <span>Enviando...</span>
                </>
              ) : (
                <span>Enviar enlace</span>
              )}
            </button>
          </form>
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
