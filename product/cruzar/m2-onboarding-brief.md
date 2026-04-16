# M2 — `/onboarding` Design Brief

**Date:** 2026-04-15
**Companion:** [architecture.md §Flow 1](./architecture.md#flow-1--onboarding) + [adr/07](./adr/07-english-cert-pre-required.md) + [roadmap.md M2](./roadmap.md#m2--onboarding--2h).
**Voice:** sober, confident, bilingual-aware. **Spanish copy** (no `apps/brand/` exists yet — declare default). House line: *"Construimos tu perfil para que las empresas te paguen lo que vales."*

---

## 1. Flow

Single-column page at `/onboarding`, no branching URLs, no wizard. Authenticated student lands here from magic-link callback. Order top-to-bottom:

1. Hero (one sentence + one paragraph).
2. Identity (read-only, prefilled from session).
3. Contact (WhatsApp).
4. Local salary (optional).
5. English cert — `kind` selector reveals score/level/issued_at/upload. Level auto-derives. Below-B2 → inline blocker + submit disabled.
6. Consent toggle.
7. Submit.

**Submit success:** server action returns `{ ok: true }` → `router.push("/onboarding/thanks")`.
**Rejection paths:** below-B2 (client-side block), Zod fail (server returns `{ ok: false, fieldErrors }` → render under fields), generic failure (`Alert variant="destructive"` above submit: *"Algo salió mal. Inténtalo de nuevo."*).

---

## 2. Sections + fields

Schema constraints quoted from `apps/web/schemas/student.ts` + `english-cert.ts`.

### Identity (read-only)

| Field | Primitive | Validation | Copy |
|---|---|---|---|
| `email` | `Input` (disabled, type=email) | `z.email()` (already validated by Better Auth) | Label *"Correo"*. Helper *"Tu sesión está vinculada a este correo."* |
| `name` | `Input` (text) | `z.string().min(1)` | Label *"Nombre completo"*. Placeholder *"María Fernanda Rojas"*. Error *"Necesitamos tu nombre completo como aparece en tu certificado."* |

### Contact

| `whatsapp` | `Input type=tel inputmode=tel` | `z.string().min(5)` | Label *"WhatsApp"*. Placeholder *"+51 999 999 999"*. Helper *"Miura te escribirá aquí dentro de 24h para iniciar tu intake."*. Error *"Necesitamos un número con código de país."* |

### Local salary (optional)

| `local_salary_usd` | `Input type=number min=1 step=1 inputmode=numeric` | `z.number().int().positive().optional()` | Label *"Salario mensual local (USD, opcional)"*. Helper *"Lo usamos para calcular tu salary delta. No lo compartimos."*. Error *"Ingresa un entero positivo en USD, o déjalo vacío."* |

### English certification

Order: `kind` → `score` → derived `level` → `issued_at` → upload.

| Field | Primitive | Validation | Copy |
|---|---|---|---|
| `kind` | `Select` | `englishCertKindSchema` (`ielts \| toefl \| cambridge \| aprendly \| other`) | Label *"Tipo de certificación"*. Placeholder *"Selecciona tu certificación"*. Options: IELTS / TOEFL iBT / Cambridge (FCE / CAE / CPE) / Aprendly / Otra. |
| `score` | `Input` (text) | `z.string().min(1)` | Label + placeholder change with `kind` (see §3). Error *"Ingresa tu puntaje exactamente como aparece en tu certificado."* |
| `level` | `Badge` (read-only when derivation succeeds) or `Select` (when `mapCertToCefr` returns `null`) | `englishLevelSchema` (`A2 \| B1 \| B2 \| C1 \| C2`) | Label *"Nivel CEFR"*. Editable helper *"No pudimos derivar tu nivel — selecciónalo del certificado."* |
| `issued_at` | `Input type=date` | `z.iso.date()` | Label *"Fecha de emisión"*. Helper *"Tal como aparece en el certificado."* |
| `attestation` | Custom dropzone (§4) | `attestation_r2_key: z.string().min(1)` (server-side, after upload) | Label *"Sube tu certificado"*. Helper *"PDF, PNG o JPEG, máximo 10 MB. Lo verificamos manualmente."* Error *"Necesitamos el comprobante."* |

### Consent

| `consent_public_profile` | `Checkbox` | `z.boolean()` (default `false`) | Label *"Permito que mi perfil sea público en `/p/<slug>`"*. Helper *"Recomendado: tu perfil público te trae oportunidades pasivas. Puedes desactivarlo después."* Not required to submit. |

---

## 3. CEFR score-to-level interaction

Load-bearing logic. Behavior:

1. On `kind` change: reset `score`, clear derived `level`, swap placeholder/label per table below.
2. On `score` change (debounced 250ms): call `mapCertToCefr(kind, score)` from `@/lib/cefr-map`.
3. If returns a `CefrLevel`: render next to score input as `Badge` (`secondary` for B2+, `destructive` for `<B2`), persist as form's `level`, **read-only**.
4. If returns `null` (`aprendly`, `other`, or unparseable): render editable `Select` for `level`.
5. If `meetsB2(level)` is false: render inline `Alert variant="destructive"` below score row:
   > **Nivel inferior a B2.** Los roles remotos requieren B2+ verificable. Completa una certificación B2+ y vuelve.
6. Submit `disabled` until `meetsB2(level) === true` **and** `formState.isValid === true`.

**Per-`kind` score copy:**

| `kind` | Label | Placeholder | Helper |
|---|---|---|---|
| `ielts` | *"Puntaje IELTS"* | *"6.5"* | *"Overall band score (4.0 – 9.0)."* |
| `toefl` | *"Puntaje TOEFL iBT"* | *"95"* | *"Total score (0 – 120)."* |
| `cambridge` | *"Examen Cambridge"* | *"FCE / CAE / CPE"* | *"Nombre del examen aprobado."* |
| `aprendly` | *"Resultado Aprendly"* | *"B2 / C1 / C2"* | *"Nivel según Aprendly. Verificación manual."* |
| `other` | *"Puntaje / nivel"* | *"B2"* | *"Nivel exacto que tu certificación te otorga."* |

---

## 4. Attestation upload

**Accept:** `image/png`, `image/jpeg`, `application/pdf`. Reject others with *"Solo aceptamos PDF, PNG o JPEG."*
**Size cap:** **10 MB** client-side AND server-side (Architecture §Rate limits). Reject larger with *"El archivo supera los 10 MB."*

**Presigned PUT flow (R2 is private; bytes never traverse Vercel):**

1. **Get URL.** Client calls server action `requestAttestationUploadUrl({ filename, mime, size })`. Server validates MIME + size, generates key `attestations/<student_id>/<uuid>.<ext>`, returns `{ url, key, expiresIn: 300 }` from `@aws-sdk/s3-request-presigner.getSignedUrl(PutObjectCommand, { expiresIn: 300 })`.
2. **PUT directly to R2.** Client `XMLHttpRequest.open("PUT", url)` with `Content-Type: file.type`. Use `XHR` (not `fetch`) for `upload.onprogress` events.
3. **Carry the key.** Store returned `key` in form's `attestation_r2_key` field. The submit action receives the key, re-validates the prefix, and runs a HEAD against R2 to confirm the object exists before persisting.

**Progress UI:** determinate `Progress` bar with percent + Cancel button (calls `xhr.abort()`, clears the field). On error: *"No pudimos subir tu certificado. Reintentar."*

---

## 5. Submit behavior

- **One submit button.** Label *"Enviar y empezar mi intake"*, full-width on mobile, `h-11`, `variant="default"`.
- **Client validation first.** `react-hook-form` + `@hookform/resolvers/zod`, composite schema = `studentSchema.pick({ name, whatsapp, local_salary_usd, consent_public_profile })` ∪ `englishCertSchema.pick({ kind, score, level, issued_at, attestation_r2_key })`. Do **not** call the server action when `formState.isValid === false`.
- **Server action `submitOnboarding`.** Re-parses the same composite schema (defense in depth). Upserts `students` row (FK to Better Auth `user.id`), inserts `english_certs` (`verified=false`). Returns `{ ok: true }`. Client redirects.
- **Inline errors.** `FormMessage` under each offending field. On invalid submit, focus first error (§8).
- **Generic server error.** `Alert variant="destructive"` above the submit button until next attempt.

---

## 6. `/onboarding/thanks`

Single column, centered. No nav, no CTAs.

**h1 (32px desktop / 28px mobile):** *"Estás dentro."*

**Paragraph (16px):** *"Miura te escribirá por WhatsApp dentro de las próximas 24 horas para iniciar tu intake. Es una conversación de 4 rondas a lo largo de 1–2 días. Cuando termine, tu perfil estará listo y empezamos a postular por ti. Mientras tanto, mantén tu WhatsApp activo."*

---

## 7. Visual + polish

**shadcn primitives:** `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, `Input`, `Select`, `Checkbox`, `Button`, `Alert`, `Badge`, `Progress`, `Card`, `Separator`. **No FileUpload in shadcn** — build `apps/web/components/attestation-dropzone.tsx`: dashed border (`border-2 border-dashed rounded-lg p-8`); click → native picker (`<input type="file" accept="image/png,image/jpeg,application/pdf" hidden />`); drag-over highlight (`data-[drag-over=true]:bg-muted`); on selected → filename + size + remove + `Progress`; on uploaded → filename + size + check + change.

**Type scale** (Tailwind v4 defaults — declared since `apps/brand/` not authored): Hero h1 `text-3xl md:text-4xl font-semibold tracking-tight`; Section h2 `text-xl font-semibold`; Form label `text-sm font-medium`; Body/helper `text-sm text-muted-foreground`; Error `text-sm text-destructive`; Submit `h-11 text-base font-medium`.

**Spacing:** sections `space-y-8`, fields `space-y-4`. Page `px-4 md:px-8 py-12 max-w-2xl mx-auto`.

**Async states:** presigned URL fetch → dropzone shows *"Preparando subida..."* + spinner / on error *"No pudimos preparar la subida. Reintentar."*. File PUT → `Progress` + percent + Cancel / on error *"No pudimos subir tu certificado. Reintentar."*. Form submit → button spinner + *"Enviando..."*, disabled / on error `Alert` above submit (§5).

**Mobile:** single column always; touch targets ≥ 44px (`h-11`); dropzone tap opens native picker (iOS Safari + Chrome Android honor `accept`); date input uses native picker.

---

## 8. Accessibility

- Every input has a `<FormLabel>` linked via `htmlFor` (shadcn `FormItem` wires this); `FormMessage` renders `aria-describedby`.
- On invalid submit, focus first error via RHF `setFocus(firstErrorField)`. Announce error count via visually-hidden `<div aria-live="polite">`.
- Contrast ≥ 4.5:1 on body text.
- Dropzone keyboard-operable: `tabIndex={0}`, `role="button"`, `aria-label="Sube tu certificado en PDF, PNG o JPEG"`, Enter/Space opens picker. On select, screen reader announces filename + size via `aria-live="polite"`.
- B2-blocker `Alert` carries `role="alert"`.
- Disabled submit: `aria-disabled="true"` + visually-hidden *"Completa los campos requeridos y un certificado B2+."*

---

## 9. Things to NOT do

- No multi-step wizard. Single page.
- No real-time CEFR evaluation (Phase 1 per ADR-07). No mic, no Deepgram.
- No OAuth login button here. `/onboarding` is post-auth; magic link only.
- No "subir después" option. Attestation required at submit.
- No `/onboarding/thanks` CTAs to `/profile` / `/status`.
- No client-side `attestation_r2_key` derivation. Server-generated only.
- No optimistic UI on submit. Wait for server confirmation.

---

## 10. Out of scope (M2)

Explicitly out: social logins (Google/LinkedIn/Apple), referral codes, institutional dropdown (Aprendly/UTEC/etc.), degree/major/graduation year, years of experience, LinkedIn/GitHub/portfolio URLs (intake collects these), profile photo, salary expectation field (only current local salary), i18n / language toggle (Spanish only), long-form rationale beyond the inline blocker copy, "save as draft" persistence, voice cert recording fallback, multiple attestations, "skip cert, send via WhatsApp".
