import { CheckIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

/**
 * /system/forms — composition at scale.
 *
 * Full Cruzar onboarding form driven by FieldGroup + Field + FieldSet. One
 * deliberate invalid state (score below cohort threshold) shows the
 * Field `data-invalid` + control `aria-invalid` + FieldDescription pattern.
 * The loading state on submit composes `Spinner` + `data-icon` + `disabled`
 * on the Button — per shadcn rules, Button has no isLoading prop.
 */

const ENGLISH_CERTS = [
  { label: "Seleccionar certificado", value: null },
  { label: "TOEFL iBT", value: "toefl" },
  { label: "IELTS Academic", value: "ielts" },
  { label: "Cambridge C1 Advanced", value: "cambridge-c1" },
  { label: "Cambridge C2 Proficiency", value: "cambridge-c2" },
  { label: "Duolingo English Test", value: "duolingo" },
] as const;

function Section({
  title,
  eyebrow,
  description,
  children,
}: {
  title: string;
  eyebrow: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6 border-t border-border pt-10 first:border-t-0 first:pt-0">
      <div className="flex flex-col gap-1">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="font-serif text-2xl font-medium tracking-[-0.012em]">
          {title}
        </h2>
        {description ? (
          <p className="max-w-[64ch] text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export default function FormsPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-16 md:px-10">
      {/* ─── Masthead ─── */}
      <header className="flex flex-col gap-3">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          § IV · Forms
        </p>
        <h1 className="font-serif text-4xl font-normal leading-[0.95] tracking-[-0.02em] md:text-5xl">
          Form composition
        </h1>
        <p className="max-w-[68ch] text-muted-foreground">
          Una intake real de cohort, montada sobre FieldGroup + FieldSet. Un campo
          muestra el estado inválido con <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">data-invalid</code>{" "}
          + <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">aria-invalid</code>. El botón de envío compone{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">Spinner + disabled</code>, nunca{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">isLoading</code>.
        </p>
      </header>

      {/* ─── Onboarding form ─── */}
      <Section
        eyebrow="1 · Onboarding"
        title="Intake cohort 02"
        description="Ejemplo real end-to-end: identidad → certificado → motivación → preferencias → consentimiento → envío."
      >
        <form
          aria-label="Onboarding Cruzar"
          className="rounded-xl border border-border bg-card p-6 md:p-8"
        >
          <FieldGroup>
            {/* Identity */}
            <FieldSet>
              <FieldLegend>Identidad</FieldLegend>
              <FieldDescription>
                Debe coincidir con tu pasaporte para los contratos internacionales.
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="onb-name">Nombre completo</FieldLabel>
                  <Input
                    id="onb-name"
                    placeholder="María Fernández Quispe"
                    autoComplete="name"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="onb-email">Email de contacto</FieldLabel>
                  <Input
                    id="onb-email"
                    type="email"
                    placeholder="maria@universidad.edu.pe"
                    autoComplete="email"
                  />
                  <FieldDescription>
                    Usaremos este email para enviar drafts y status.
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldSet>

            {/* English credential */}
            <FieldSet>
              <FieldLegend>Certificado de inglés</FieldLegend>
              <FieldDescription>
                Requerido para cohort 02 — sólo certificados verificables.
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel>Certificado</FieldLabel>
                  <Select items={ENGLISH_CERTS}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {ENGLISH_CERTS.filter((c) => c.value !== null).map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                {/* Invalid state — intentional demo */}
                <Field data-invalid>
                  <FieldLabel htmlFor="onb-score">Puntaje obtenido</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="onb-score"
                      type="number"
                      defaultValue="82"
                      aria-invalid
                    />
                    <InputGroupAddon align="inline-end">/ 120</InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    Por debajo del mínimo (95) para cohort 02 — puedes reintentar
                    en la siguiente convocatoria o enviar un certificado alterno.
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </FieldSet>

            {/* Motivation */}
            <Field>
              <FieldLabel htmlFor="onb-motivation">Motivación</FieldLabel>
              <Textarea
                id="onb-motivation"
                rows={5}
                placeholder="¿Por qué quieres cruzar al mercado remoto internacional? (≥ 3 oraciones)"
              />
              <FieldDescription>
                Contexto personal y profesional — máximo 800 caracteres.
              </FieldDescription>
            </Field>

            {/* Optional preference checkboxes */}
            <FieldSet>
              <FieldLegend variant="label">
                Preferencias opcionales
              </FieldLegend>
              <FieldDescription>
                Marca todas las que apliquen. Las usamos sólo como filtros iniciales.
              </FieldDescription>
              <FieldGroup className="gap-3">
                <Field orientation="horizontal">
                  <Checkbox id="pref-backend" defaultChecked />
                  <FieldLabel htmlFor="pref-backend" className="font-normal">
                    Roles backend
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="pref-frontend" />
                  <FieldLabel htmlFor="pref-frontend" className="font-normal">
                    Roles frontend
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="pref-fullstack" defaultChecked />
                  <FieldLabel htmlFor="pref-fullstack" className="font-normal">
                    Roles fullstack
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="pref-other" />
                  <FieldLabel htmlFor="pref-other" className="font-normal">
                    Otros (data, DevOps, mobile)
                  </FieldLabel>
                </Field>
              </FieldGroup>
            </FieldSet>

            {/* Privacy switch */}
            <Field orientation="horizontal">
              <Switch id="onb-privacy" defaultChecked />
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor="onb-privacy" className="font-normal">
                  Autorizo verificar mi oferta laboral
                </FieldLabel>
                <FieldDescription>
                  Cruzar confirmará tu contrato firmado y el primer payroll,
                  exclusivamente con tu consentimiento explícito.
                </FieldDescription>
              </div>
            </Field>

            {/* Submit row */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
              <span className="text-xs text-muted-foreground">
                Al enviar aceptas los{" "}
                <a href="#" className="underline underline-offset-4">
                  términos
                </a>{" "}
                de intake.
              </span>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" type="button">
                  Guardar borrador
                </Button>
                <Button type="submit">
                  <CheckIcon data-icon="inline-start" />
                  Enviar intake
                </Button>
              </div>
            </div>
          </FieldGroup>
        </form>
      </Section>

      {/* ─── Loading state ─── */}
      <Section
        eyebrow="2 · Loading"
        title="Submit · loading pattern"
        description="Button no tiene prop isLoading. Se compone: Spinner con data-icon + disabled. El texto cambia a la acción en progreso."
      >
        <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-card p-5">
          <Button disabled>
            <Spinner data-icon="inline-start" />
            Enviando intake…
          </Button>
          <Button variant="outline" disabled>
            <Spinner data-icon="inline-start" />
            Validando certificado…
          </Button>
          <Button variant="secondary" disabled>
            <Spinner data-icon="inline-start" />
            Guardando borrador…
          </Button>
        </div>
      </Section>

      {/* ─── Common patterns ─── */}
      <Section
        eyebrow="3 · Common patterns"
        title="Common patterns"
        description="Búsqueda con icono de prefijo, y confirmación de dos inputs que validan uno contra el otro."
      >
        {/* Search */}
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
          <span className="font-mono text-xs font-medium text-foreground">
            search · InputGroup + InputGroupAddon (inline-start icon)
          </span>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="search-role" className="sr-only">
                Buscar rol
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <SearchIcon />
                </InputGroupAddon>
                <InputGroupInput
                  id="search-role"
                  type="search"
                  placeholder="Buscar por stack, seniority o región…"
                />
              </InputGroup>
            </Field>
          </FieldGroup>
        </div>

        {/* Confirm email pair — validated */}
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
          <span className="font-mono text-xs font-medium text-foreground">
            confirm · two Inputs in a FieldSet (validated match)
          </span>
          <FieldSet>
            <FieldLegend variant="label">
              Confirma tu email de contacto
            </FieldLegend>
            <FieldDescription>
              Escribe el mismo email dos veces. Usamos este valor para los drafts
              y el email de bienvenida.
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="confirm-email-1">Email</FieldLabel>
                <Input
                  id="confirm-email-1"
                  type="email"
                  defaultValue="maria@universidad.edu.pe"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-email-2">Confirmar email</FieldLabel>
                <Input
                  id="confirm-email-2"
                  type="email"
                  defaultValue="maria@universidad.edu.pe"
                />
                <FieldDescription className="flex items-center gap-1.5 text-foreground">
                  <CheckIcon aria-hidden className="size-3.5" />
                  Los emails coinciden.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
        </div>

        {/* Confirm password pair — mismatch invalid */}
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
          <span className="font-mono text-xs font-medium text-foreground">
            confirm · mismatch (data-invalid on the second field)
          </span>
          <FieldSet>
            <FieldLegend variant="label">Elige tu contraseña</FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="pwd-1">Contraseña</FieldLabel>
                <Input id="pwd-1" type="password" defaultValue="********" />
              </Field>
              <Field data-invalid>
                <FieldLabel htmlFor="pwd-2">Confirmar contraseña</FieldLabel>
                <Input
                  id="pwd-2"
                  type="password"
                  defaultValue="*******"
                  aria-invalid
                />
                <FieldDescription>
                  Las contraseñas no coinciden — revisa cualquier espacio sobrante.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
        </div>
      </Section>
    </div>
  );
}
