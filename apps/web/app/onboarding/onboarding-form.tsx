"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { type CefrLevel, cefrLevels, mapCertToCefr, meetsB2 } from "@/lib/cefr-map";
import { attestationMimeTypeValues, type AttestationMimeType } from "@/lib/r2";
import { type EnglishCertKind, englishCertKindValues } from "@/schemas/_shared";
import { onboardingInputSchema, type OnboardingInput } from "@/schemas/onboarding";
import { requestAttestationUpload, submitOnboarding } from "./actions";

const MAX_BYTES = 10_000_000;

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
}

type AttestationStatus =
  | { kind: "idle" }
  | { kind: "preparing"; filename: string; sizeBytes: number }
  | { kind: "uploading"; filename: string; sizeBytes: number; percent: number }
  | { kind: "done"; filename: string; sizeBytes: number; key: string }
  | { kind: "error"; message: string };

interface FieldErrors {
  name?: string;
  whatsapp?: string;
  local_salary_usd?: string;
  kind?: string;
  score?: string;
  issued_at?: string;
  attestation_r2_key?: string;
  level?: string;
}

const kindLabels: Record<EnglishCertKind, { label: string; placeholder: string; helper: string }> =
  {
    ielts: {
      label: "Puntaje IELTS",
      placeholder: "6.5",
      helper: "Overall band score (4.0 – 9.0).",
    },
    toefl: {
      label: "Puntaje TOEFL iBT",
      placeholder: "95",
      helper: "Total score (0 – 120).",
    },
    cambridge: {
      label: "Examen Cambridge",
      placeholder: "FCE / CAE / CPE",
      helper: "Nombre del examen aprobado.",
    },
    aprendly: {
      label: "Resultado Aprendly",
      placeholder: "B2 / C1 / C2",
      helper: "Nivel según Aprendly. Verificación manual.",
    },
    other: {
      label: "Puntaje / nivel",
      placeholder: "B2",
      helper: "Nivel exacto que tu certificación te otorga.",
    },
  };

const kindOptions: ReadonlyArray<{ value: EnglishCertKind; label: string }> = [
  { value: "ielts", label: "IELTS" },
  { value: "toefl", label: "TOEFL iBT" },
  { value: "cambridge", label: "Cambridge (FCE / CAE / CPE)" },
  { value: "aprendly", label: "Aprendly" },
  { value: "other", label: "Otra" },
];

function isAttestationMime(value: string): value is AttestationMimeType {
  for (const allowed of attestationMimeTypeValues) {
    if (allowed === value) return true;
  }
  return false;
}

function isEnglishCertKind(value: string): value is EnglishCertKind {
  for (const allowed of englishCertKindValues) {
    if (allowed === value) return true;
  }
  return false;
}

function isCefrLevel(value: string): value is CefrLevel {
  for (const allowed of cefrLevels) {
    if (allowed === value) return true;
  }
  return false;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface OnboardingFormProps {
  initialEmail: string;
}

export function OnboardingForm({ initialEmail }: OnboardingFormProps) {
  const router = useRouter();
  const rootId = useId();

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [localSalaryInput, setLocalSalaryInput] = useState("");
  const [consentPublicProfile, setConsentPublicProfile] = useState(false);

  const [certKind, setCertKind] = useState<EnglishCertKind | "">("");
  const [score, setScore] = useState("");
  const [issuedAt, setIssuedAt] = useState("");
  const [manualLevel, setManualLevel] = useState<CefrLevel | "">("");

  const [attestation, setAttestation] = useState<AttestationStatus>({ kind: "idle" });
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitAttempts, setSubmitAttempts] = useState(0);

  const nameRef = useRef<HTMLInputElement | null>(null);
  const whatsappRef = useRef<HTMLInputElement | null>(null);
  const salaryRef = useRef<HTMLInputElement | null>(null);
  const kindRef = useRef<HTMLSelectElement | null>(null);
  const scoreRef = useRef<HTMLInputElement | null>(null);
  const issuedAtRef = useRef<HTMLInputElement | null>(null);
  const manualLevelRef = useRef<HTMLSelectElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropzoneRef = useRef<HTMLDivElement | null>(null);

  const debouncedScore = useDebounced(score, 250);

  const derivedLevel = useMemo<CefrLevel | null>(() => {
    if (certKind === "" || debouncedScore.trim().length === 0) return null;
    return mapCertToCefr(certKind, debouncedScore);
  }, [certKind, debouncedScore]);

  const effectiveLevel: CefrLevel | null =
    derivedLevel ?? (manualLevel === "" ? null : manualLevel);
  const needsManualLevel =
    certKind !== "" && debouncedScore.trim().length > 0 && derivedLevel === null;
  const levelBelowB2 = effectiveLevel !== null && !meetsB2(effectiveLevel);

  const resetAttestation = useCallback(() => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    setAttestation({ kind: "idle" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const startUpload = useCallback(async (file: File) => {
    if (file.size > MAX_BYTES) {
      setAttestation({ kind: "error", message: "El archivo supera los 10 MB." });
      return;
    }
    if (!isAttestationMime(file.type)) {
      setAttestation({ kind: "error", message: "Solo aceptamos PDF, PNG o JPEG." });
      return;
    }

    setAttestation({ kind: "preparing", filename: file.name, sizeBytes: file.size });

    let presigned: { url: string; key: string };
    try {
      presigned = await requestAttestationUpload({
        filename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
      });
    } catch {
      setAttestation({
        kind: "error",
        message: "No pudimos preparar la subida. Reintentar.",
      });
      return;
    }

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    xhr.open("PUT", presigned.url);
    xhr.setRequestHeader("Content-Type", file.type);

    xhr.upload.onprogress = (evt) => {
      if (!evt.lengthComputable) return;
      const percent = Math.round((evt.loaded / evt.total) * 100);
      setAttestation({
        kind: "uploading",
        filename: file.name,
        sizeBytes: file.size,
        percent,
      });
    };

    xhr.onload = () => {
      xhrRef.current = null;
      if (xhr.status >= 200 && xhr.status < 300) {
        setAttestation({
          kind: "done",
          filename: file.name,
          sizeBytes: file.size,
          key: presigned.key,
        });
      } else {
        setAttestation({
          kind: "error",
          message: "No pudimos subir tu certificado. Reintentar.",
        });
      }
    };

    xhr.onerror = () => {
      xhrRef.current = null;
      setAttestation({
        kind: "error",
        message: "No pudimos subir tu certificado. Reintentar.",
      });
    };

    xhr.onabort = () => {
      xhrRef.current = null;
    };

    setAttestation({
      kind: "uploading",
      filename: file.name,
      sizeBytes: file.size,
      percent: 0,
    });
    xhr.send(file);
  }, []);

  const handleFileSelect = useCallback(
    (file: File | null) => {
      if (!file) return;
      void startUpload(file);
    },
    [startUpload],
  );

  const [dragOver, setDragOver] = useState(false);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const attestationKey = attestation.kind === "done" ? attestation.key : null;

  const uploadInProgress = attestation.kind === "preparing" || attestation.kind === "uploading";

  const formReady =
    !uploadInProgress &&
    attestationKey !== null &&
    effectiveLevel !== null &&
    meetsB2(effectiveLevel);

  const liveMessage = useMemo(() => {
    if (attestation.kind === "uploading") {
      return `Subiendo ${attestation.filename}, ${attestation.percent}%.`;
    }
    if (attestation.kind === "done") {
      return `Certificado subido: ${attestation.filename}, ${formatBytes(attestation.sizeBytes)}.`;
    }
    if (attestation.kind === "error") {
      return attestation.message;
    }
    if (effectiveLevel) {
      return `Nivel CEFR detectado: ${effectiveLevel}.`;
    }
    return "";
  }, [attestation, effectiveLevel]);

  const focusFirstError = useCallback((errors: FieldErrors) => {
    if (errors.name) nameRef.current?.focus();
    else if (errors.whatsapp) whatsappRef.current?.focus();
    else if (errors.local_salary_usd) salaryRef.current?.focus();
    else if (errors.kind) kindRef.current?.focus();
    else if (errors.score) scoreRef.current?.focus();
    else if (errors.level) manualLevelRef.current?.focus();
    else if (errors.issued_at) issuedAtRef.current?.focus();
    else if (errors.attestation_r2_key) dropzoneRef.current?.focus();
  }, []);

  const buildInput = useCallback(():
    | { ok: true; value: OnboardingInput }
    | { ok: false; errors: FieldErrors } => {
    const errors: FieldErrors = {};

    if (certKind === "") {
      errors.kind = "Selecciona el tipo de certificación.";
    }

    let salaryValue: number | undefined;
    if (localSalaryInput.trim() !== "") {
      const parsed = Number(localSalaryInput);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        errors.local_salary_usd = "Ingresa un entero positivo en USD, o déjalo vacío.";
      } else {
        salaryValue = parsed;
      }
    }

    if (attestationKey === null) {
      errors.attestation_r2_key = "Necesitamos el comprobante.";
    }

    if (certKind !== "") {
      const candidate: OnboardingInput = {
        name,
        whatsapp,
        consent_public_profile: consentPublicProfile,
        ...(salaryValue !== undefined ? { local_salary_usd: salaryValue } : {}),
        english_cert: {
          kind: certKind,
          score,
          issued_at: issuedAt,
          attestation_r2_key: attestationKey ?? "",
        },
      };

      const result = onboardingInputSchema.safeParse(candidate);
      if (!result.success) {
        for (const issue of result.error.issues) {
          const path = issue.path;
          const head = path[0];
          if (head === "name")
            errors.name = "Necesitamos tu nombre completo como aparece en tu certificado.";
          else if (head === "whatsapp")
            errors.whatsapp = "Necesitamos un número con código de país.";
          else if (head === "local_salary_usd")
            errors.local_salary_usd = "Ingresa un entero positivo en USD, o déjalo vacío.";
          else if (head === "english_cert") {
            const sub = path[1];
            if (sub === "score")
              errors.score = "Ingresa tu puntaje exactamente como aparece en tu certificado.";
            else if (sub === "issued_at") errors.issued_at = "Tal como aparece en el certificado.";
            else if (sub === "attestation_r2_key")
              errors.attestation_r2_key = "Necesitamos el comprobante.";
          }
        }
        return { ok: false, errors };
      }

      if (Object.keys(errors).length > 0) {
        return { ok: false, errors };
      }

      return { ok: true, value: result.data };
    }

    return { ok: false, errors };
  }, [
    attestationKey,
    certKind,
    consentPublicProfile,
    issuedAt,
    localSalaryInput,
    name,
    score,
    whatsapp,
  ]);

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (submitting) return;
      setServerError(null);
      setSubmitAttempts((n) => n + 1);

      if (effectiveLevel === null || !meetsB2(effectiveLevel)) {
        setFieldErrors({ level: "Tu nivel CEFR debe ser B2 o superior." });
        manualLevelRef.current?.focus();
        return;
      }

      const built = buildInput();
      if (!built.ok) {
        setFieldErrors(built.errors);
        focusFirstError(built.errors);
        return;
      }

      setFieldErrors({});
      setSubmitting(true);
      try {
        const result = await submitOnboarding(built.value);
        if (result.success) {
          router.push("/onboarding/thanks");
        } else {
          setServerError(result.error);
          setSubmitting(false);
        }
      } catch {
        setServerError("Algo salió mal. Inténtalo de nuevo.");
        setSubmitting(false);
      }
    },
    [buildInput, effectiveLevel, focusFirstError, router, submitting],
  );

  const kindCopy = certKind === "" ? null : kindLabels[certKind];

  const nameErrId = `${rootId}-name-err`;
  const whatsappErrId = `${rootId}-whatsapp-err`;
  const salaryErrId = `${rootId}-salary-err`;
  const kindErrId = `${rootId}-kind-err`;
  const scoreErrId = `${rootId}-score-err`;
  const issuedAtErrId = `${rootId}-issued-err`;
  const levelErrId = `${rootId}-level-err`;
  const attestationErrId = `${rootId}-attestation-err`;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-10">
      <div aria-live="polite" className="sr-only">
        {liveMessage}
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Tu cuenta</h2>

        <div className="space-y-2">
          <label htmlFor={`${rootId}-email`} className="text-sm font-medium">
            Correo
          </label>
          <input
            id={`${rootId}-email`}
            type="email"
            value={initialEmail}
            disabled
            readOnly
            className="h-11 w-full rounded-md border border-input bg-muted/30 px-3 text-sm text-muted-foreground"
          />
          <p className="text-sm text-muted-foreground">Tu sesión está vinculada a este correo.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor={`${rootId}-name`} className="text-sm font-medium">
            Nombre completo
          </label>
          <input
            id={`${rootId}-name`}
            ref={nameRef}
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="María Fernanda Rojas"
            aria-invalid={fieldErrors.name !== undefined}
            aria-describedby={fieldErrors.name ? nameErrId : undefined}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {fieldErrors.name ? (
            <p id={nameErrId} className="text-sm text-destructive">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Contacto</h2>

        <div className="space-y-2">
          <label htmlFor={`${rootId}-whatsapp`} className="text-sm font-medium">
            WhatsApp
          </label>
          <input
            id={`${rootId}-whatsapp`}
            ref={whatsappRef}
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel"
            value={whatsapp}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/[^\d+\s]/g, "");
              setWhatsapp(cleaned);
            }}
            placeholder="+51 999 999 999"
            aria-invalid={fieldErrors.whatsapp !== undefined}
            aria-describedby={fieldErrors.whatsapp ? whatsappErrId : undefined}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <p className="text-sm text-muted-foreground">
            Miura te escribirá aquí dentro de 24h para iniciar tu intake.
          </p>
          {fieldErrors.whatsapp ? (
            <p id={whatsappErrId} className="text-sm text-destructive">
              {fieldErrors.whatsapp}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor={`${rootId}-salary`} className="text-sm font-medium">
            Salario mensual local (USD, opcional)
          </label>
          <input
            id={`${rootId}-salary`}
            ref={salaryRef}
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={localSalaryInput}
            onChange={(e) => setLocalSalaryInput(e.target.value)}
            placeholder="750"
            aria-invalid={fieldErrors.local_salary_usd !== undefined}
            aria-describedby={fieldErrors.local_salary_usd ? salaryErrId : undefined}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <p className="text-sm text-muted-foreground">
            Lo usamos para calcular tu salary delta. No lo compartimos.
          </p>
          {fieldErrors.local_salary_usd ? (
            <p id={salaryErrId} className="text-sm text-destructive">
              {fieldErrors.local_salary_usd}
            </p>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Certificación de inglés</h2>

        <div className="space-y-2">
          <label htmlFor={`${rootId}-kind`} className="text-sm font-medium">
            Tipo de certificación
          </label>
          <select
            id={`${rootId}-kind`}
            ref={kindRef}
            value={certKind}
            onChange={(e) => {
              const next = e.target.value;
              if (next === "") {
                setCertKind("");
              } else if (isEnglishCertKind(next)) {
                setCertKind(next);
              }
              setScore("");
              setManualLevel("");
            }}
            aria-invalid={fieldErrors.kind !== undefined}
            aria-describedby={fieldErrors.kind ? kindErrId : undefined}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Selecciona tu certificación</option>
            {kindOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {fieldErrors.kind ? (
            <p id={kindErrId} className="text-sm text-destructive">
              {fieldErrors.kind}
            </p>
          ) : null}
        </div>

        {kindCopy ? (
          <div className="space-y-2">
            <label htmlFor={`${rootId}-score`} className="text-sm font-medium">
              {kindCopy.label}
            </label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                id={`${rootId}-score`}
                ref={scoreRef}
                type="text"
                required
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder={kindCopy.placeholder}
                aria-invalid={fieldErrors.score !== undefined}
                aria-describedby={fieldErrors.score ? scoreErrId : undefined}
                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-1"
              />
              {effectiveLevel ? (
                <span
                  className={`inline-flex h-11 items-center rounded-md px-3 text-sm font-semibold transition-opacity duration-200 ${
                    meetsB2(effectiveLevel)
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-destructive text-destructive-foreground"
                  }`}
                  aria-label={`Nivel CEFR ${effectiveLevel}`}
                >
                  {effectiveLevel}
                </span>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">{kindCopy.helper}</p>
            {fieldErrors.score ? (
              <p id={scoreErrId} className="text-sm text-destructive">
                {fieldErrors.score}
              </p>
            ) : null}
          </div>
        ) : null}

        {needsManualLevel ? (
          <div className="space-y-2">
            <label htmlFor={`${rootId}-level`} className="text-sm font-medium">
              Nivel CEFR
            </label>
            <select
              id={`${rootId}-level`}
              ref={manualLevelRef}
              value={manualLevel}
              onChange={(e) => {
                const next = e.target.value;
                if (next === "") {
                  setManualLevel("");
                } else if (isCefrLevel(next)) {
                  setManualLevel(next);
                }
              }}
              aria-invalid={fieldErrors.level !== undefined}
              aria-describedby={fieldErrors.level ? levelErrId : undefined}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Selecciona tu nivel</option>
              {cefrLevels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
            <p className="text-sm text-muted-foreground">
              No pudimos derivar tu nivel — selecciónalo del certificado.
            </p>
            {fieldErrors.level ? (
              <p id={levelErrId} className="text-sm text-destructive">
                {fieldErrors.level}
              </p>
            ) : null}
          </div>
        ) : null}

        {levelBelowB2 ? (
          <div
            role="alert"
            className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive transition-opacity duration-200"
          >
            <strong className="font-semibold">Aún no estás listo para roles remotos.</strong> La
            mayoría de nuestros estudiantes llegan a B2 en 3-6 meses. Te avisaremos al email que
            registraste cuando certifiques.
          </div>
        ) : null}

        {kindCopy ? (
          <div className="space-y-2">
            <label htmlFor={`${rootId}-issued`} className="text-sm font-medium">
              Fecha de emisión
            </label>
            <input
              id={`${rootId}-issued`}
              ref={issuedAtRef}
              type="date"
              required
              value={issuedAt}
              onChange={(e) => setIssuedAt(e.target.value)}
              aria-invalid={fieldErrors.issued_at !== undefined}
              aria-describedby={fieldErrors.issued_at ? issuedAtErrId : undefined}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="text-sm text-muted-foreground">Tal como aparece en el certificado.</p>
            {fieldErrors.issued_at ? (
              <p id={issuedAtErrId} className="text-sm text-destructive">
                {fieldErrors.issued_at}
              </p>
            ) : null}
          </div>
        ) : null}

        {certKind !== "" && effectiveLevel !== null && meetsB2(effectiveLevel) ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Sube tu certificado</p>
            <div
              ref={dropzoneRef}
              role="button"
              tabIndex={0}
              aria-label="Sube tu certificado en PDF, PNG o JPEG"
              aria-describedby={fieldErrors.attestation_r2_key ? attestationErrId : undefined}
              data-drag-over={dragOver ? "true" : "false"}
              onClick={openFilePicker}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openFilePicker();
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files.item(0);
                handleFileSelect(file);
              }}
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-input bg-background p-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[drag-over=true]:bg-muted"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,application/pdf"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.item(0) ?? null;
                  handleFileSelect(file);
                }}
              />
              {attestation.kind === "idle" ? (
                <>
                  <span className="text-sm font-medium">Toca o arrastra tu certificado</span>
                  <span className="mt-1 text-sm text-muted-foreground">
                    PDF, PNG o JPEG, máximo 10 MB. Lo verificamos manualmente.
                  </span>
                </>
              ) : null}

              {attestation.kind === "preparing" ? (
                <span className="text-sm text-muted-foreground">
                  Preparando subida de {attestation.filename}...
                </span>
              ) : null}

              {attestation.kind === "uploading" ? (
                <div className="flex w-full flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate font-medium">{attestation.filename}</span>
                    <span className="text-muted-foreground">
                      {formatBytes(attestation.sizeBytes)} • {attestation.percent}%
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={attestation.percent}
                    className="h-2 w-full overflow-hidden rounded-full bg-muted"
                  >
                    <div
                      className="h-full bg-foreground transition-[width]"
                      style={{ width: `${attestation.percent}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetAttestation();
                    }}
                    className="self-start text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
                  >
                    Cancelar
                  </button>
                </div>
              ) : null}

              {attestation.kind === "done" ? (
                <div className="flex w-full items-center justify-between gap-3 text-sm">
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-medium">{attestation.filename}</span>
                    <span className="text-muted-foreground">
                      {formatBytes(attestation.sizeBytes)} • listo
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetAttestation();
                    }}
                    className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
                  >
                    Cambiar
                  </button>
                </div>
              ) : null}

              {attestation.kind === "error" ? (
                <div className="flex w-full flex-col gap-2 text-sm text-destructive">
                  <span>{attestation.message}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetAttestation();
                    }}
                    className="self-start underline underline-offset-2"
                  >
                    Reintentar
                  </button>
                </div>
              ) : null}
            </div>
            {fieldErrors.attestation_r2_key ? (
              <p id={attestationErrId} className="text-sm text-destructive">
                {fieldErrors.attestation_r2_key}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Adjuntarás tu certificado una vez que el sistema confirme tu nivel.
          </p>
        )}
      </section>

      <section className="space-y-2">
        <label htmlFor={`${rootId}-consent`} className="flex items-start gap-3">
          <input
            id={`${rootId}-consent`}
            type="checkbox"
            checked={consentPublicProfile}
            onChange={(e) => setConsentPublicProfile(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-input accent-foreground"
          />
          <span className="flex flex-col gap-1 text-sm">
            <span className="font-medium">
              Permito que mi perfil sea público en{" "}
              <code className="font-mono">/p/&lt;slug&gt;</code>.
            </span>
            <span className="text-muted-foreground">
              Recomendado: tu perfil público te trae oportunidades pasivas. Puedes desactivarlo
              después.
            </span>
          </span>
        </label>
      </section>

      {serverError ? (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
        >
          {serverError}
        </div>
      ) : null}

      {submitAttempts > 0 && Object.keys(fieldErrors).length > 0 ? (
        <div aria-live="polite" className="sr-only">
          Hay {Object.keys(fieldErrors).length} campo(s) por corregir.
        </div>
      ) : null}

      <div className="space-y-2">
        <button
          type="submit"
          disabled={!formReady || submitting}
          aria-disabled={!formReady || submitting}
          className="flex h-12 w-full items-center justify-center rounded-md bg-primary text-base font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Enviando..." : "Enviar y empezar mi intake"}
        </button>
        {!formReady ? (
          <span className="sr-only">Completa los campos requeridos y un certificado B2+.</span>
        ) : null}
      </div>
    </form>
  );
}
