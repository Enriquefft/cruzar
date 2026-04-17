import { DollarSignIcon, SearchIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

/**
 * /system/inputs — form primitives showcase.
 *
 * Every control lives inside the mandatory `FieldGroup > Field > FieldLabel`
 * structure. Validation rides `data-invalid` (Field) + `aria-invalid`
 * (control); disabled rides `data-disabled` (Field) + `disabled` (control).
 * InputGroup composes `InputGroupInput`, never raw `Input`.
 *
 * base-ui notes:
 *   - `Select` is base-variant — needs the `items` prop on the root plus
 *     a `{ value: null }` placeholder item.
 *   - `ToggleGroup` uses `defaultValue={[...]}` (array) + no `type` prop.
 */

const ENGLISH_CERTS = [
  { label: "Select certificate", value: null },
  { label: "TOEFL iBT", value: "toefl" },
  { label: "IELTS Academic", value: "ielts" },
  { label: "Cambridge C1 Advanced", value: "cambridge-c1" },
  { label: "Cambridge C2 Proficiency", value: "cambridge-c2" },
  { label: "Duolingo English Test", value: "duolingo" },
] as const;

function Showcase({
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
    <section className="flex flex-col gap-6 border-t border-border pt-8 first:border-t-0 first:pt-0">
      <div className="flex flex-col gap-1">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="font-serif text-2xl font-medium tracking-[-0.012em]">{title}</h2>
        {description ? (
          <p className="max-w-[64ch] text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
      <span className="font-mono text-xs font-medium text-foreground">{label}</span>
      {children}
    </div>
  );
}

export default function InputsPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 md:px-10">
      {/* ─── Masthead ─── */}
      <header className="flex flex-col gap-3">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          § III · Inputs
        </p>
        <h1 className="font-serif text-4xl font-normal leading-[0.95] tracking-[-0.02em] md:text-5xl">
          Input primitives
        </h1>
        <p className="max-w-[68ch] text-muted-foreground">
          Cada control vive dentro de{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">
            FieldGroup → Field
          </code>
          . El label, la descripción y los estados (
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">data-invalid</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">data-disabled</code>
          ) emanan del Field, nunca de un{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">div</code> crudo con
          spacing.
        </p>
      </header>

      {/* ─── Input ─── */}
      <Showcase eyebrow="1 · Input" title="Input">
        <Panel label="default">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="input-default">Nombre completo</FieldLabel>
              <Input id="input-default" placeholder="María Fernández" />
              <FieldDescription>Como aparece en tu pasaporte.</FieldDescription>
            </Field>
          </FieldGroup>
        </Panel>

        <Panel label="invalid · data-invalid + aria-invalid">
          <FieldGroup>
            <Field data-invalid>
              <FieldLabel htmlFor="input-invalid">Email</FieldLabel>
              <Input id="input-invalid" type="email" defaultValue="maria@gmail" aria-invalid />
              <FieldDescription>Email inválido — falta el dominio completo.</FieldDescription>
            </Field>
          </FieldGroup>
        </Panel>

        <Panel label="disabled · data-disabled + disabled">
          <FieldGroup>
            <Field data-disabled>
              <FieldLabel htmlFor="input-disabled">ID de cohort</FieldLabel>
              <Input id="input-disabled" defaultValue="cohort-02-2026" disabled />
              <FieldDescription>Asignado automáticamente.</FieldDescription>
            </Field>
          </FieldGroup>
        </Panel>

        <Panel label="cruzar intake question">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="intake-english">¿Cuál es tu nivel actual de inglés?</FieldLabel>
              <Input id="intake-english" placeholder="p. ej. C1 Advanced (178)" />
              <FieldDescription>
                Auto-validado contra tu certificado oficial en el paso 3.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </Panel>
      </Showcase>

      {/* ─── Textarea ─── */}
      <Showcase eyebrow="2 · Textarea" title="Textarea">
        <Panel label="default">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="ta-default">Motivación</FieldLabel>
              <Textarea
                id="ta-default"
                rows={4}
                placeholder="¿Por qué quieres cruzar al mercado remoto internacional?"
              />
              <FieldDescription>Máximo 500 caracteres.</FieldDescription>
            </Field>
          </FieldGroup>
        </Panel>

        <Panel label="invalid">
          <FieldGroup>
            <Field data-invalid>
              <FieldLabel htmlFor="ta-invalid">Motivación</FieldLabel>
              <Textarea id="ta-invalid" rows={4} defaultValue="quiero más dinero" aria-invalid />
              <FieldDescription>
                Muy corto — queremos entender tu contexto en al menos 2 oraciones.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </Panel>
      </Showcase>

      {/* ─── Select ─── */}
      <Showcase
        eyebrow="3 · Select"
        title="Select"
        description="Base-variant: requiere prop items en la raíz, con un item placeholder { value: null }."
      >
        <Panel label="default">
          <FieldGroup>
            <Field>
              <FieldLabel>Certificado de inglés</FieldLabel>
              <Select items={ENGLISH_CERTS}>
                <SelectTrigger>
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
              <FieldDescription>Sólo certificados verificables.</FieldDescription>
            </Field>
          </FieldGroup>
        </Panel>

        <Panel label="invalid">
          <FieldGroup>
            <Field data-invalid>
              <FieldLabel>Certificado de inglés</FieldLabel>
              <Select items={ENGLISH_CERTS}>
                <SelectTrigger aria-invalid>
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
              <FieldDescription>Requerido antes de avanzar al diagnóstico.</FieldDescription>
            </Field>
          </FieldGroup>
        </Panel>

        <Panel label="disabled">
          <FieldGroup>
            <Field data-disabled>
              <FieldLabel>Certificado de inglés</FieldLabel>
              <Select items={ENGLISH_CERTS} disabled>
                <SelectTrigger disabled>
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
              <FieldDescription>Bloqueado hasta subir evidencia del certificado.</FieldDescription>
            </Field>
          </FieldGroup>
        </Panel>
      </Showcase>

      {/* ─── Checkbox / RadioGroup ─── */}
      <Showcase
        eyebrow="4 · Checkbox + Radio"
        title="Checkbox, RadioGroup"
        description="Agrupados por FieldSet + FieldLegend, nunca un div con heading."
      >
        <Panel label="Checkbox group · FieldSet">
          <FieldSet>
            <FieldLegend variant="label">Canales de contacto</FieldLegend>
            <FieldDescription>Selecciona todos los que apliquen.</FieldDescription>
            <FieldGroup className="gap-3">
              <Field orientation="horizontal">
                <Checkbox id="ch-wa" defaultChecked />
                <FieldLabel htmlFor="ch-wa" className="font-normal">
                  WhatsApp
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="ch-email" />
                <FieldLabel htmlFor="ch-email" className="font-normal">
                  Email institucional
                </FieldLabel>
              </Field>
              <Field orientation="horizontal" data-invalid>
                <Checkbox id="ch-tel" aria-invalid />
                <FieldLabel htmlFor="ch-tel" className="font-normal">
                  Teléfono (requiere verificación)
                </FieldLabel>
              </Field>
              <Field orientation="horizontal" data-disabled>
                <Checkbox id="ch-linkedin" disabled />
                <FieldLabel htmlFor="ch-linkedin" className="font-normal">
                  LinkedIn InMail (próximamente)
                </FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
        </Panel>

        <Panel label="RadioGroup · FieldSet">
          <FieldSet>
            <FieldLegend variant="label">Zona horaria preferida</FieldLegend>
            <FieldDescription>Para coordinar entrevistas.</FieldDescription>
            <RadioGroup defaultValue="utc-5">
              <FieldGroup className="gap-2">
                <Field orientation="horizontal">
                  <RadioGroupItem id="tz-5" value="utc-5" />
                  <FieldLabel htmlFor="tz-5" className="font-normal">
                    UTC−5 · Lima, Bogotá
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem id="tz-3" value="utc-3" />
                  <FieldLabel htmlFor="tz-3" className="font-normal">
                    UTC−3 · Buenos Aires, São Paulo
                  </FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem id="tz-6" value="utc-6" />
                  <FieldLabel htmlFor="tz-6" className="font-normal">
                    UTC−6 · CDMX, San Salvador
                  </FieldLabel>
                </Field>
              </FieldGroup>
            </RadioGroup>
          </FieldSet>
        </Panel>
      </Showcase>

      {/* ─── Switch ─── */}
      <Showcase eyebrow="5 · Switch" title="Switch">
        <Panel label="settings pattern · horizontal Field">
          <FieldGroup>
            <Field orientation="horizontal">
              <Switch id="sw-share" defaultChecked />
              <FieldLabel htmlFor="sw-share" className="font-normal">
                Compartir perfil con empresas verificadas
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Switch id="sw-ranking" />
              <FieldLabel htmlFor="sw-ranking" className="font-normal">
                Aparecer en ranking público de la cohort
              </FieldLabel>
            </Field>
          </FieldGroup>
        </Panel>

        <Panel label="privacy · with description">
          <FieldGroup>
            <Field orientation="horizontal">
              <Switch id="sw-privacy" defaultChecked />
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor="sw-privacy" className="font-normal">
                  Autorizo verificar mi oferta laboral
                </FieldLabel>
                <FieldDescription>
                  Cruzar confirmará tu contrato firmado y el primer payroll, únicamente con tu
                  consentimiento explícito.
                </FieldDescription>
              </div>
            </Field>
          </FieldGroup>
        </Panel>
      </Showcase>

      {/* ─── InputGroup ─── */}
      <Showcase
        eyebrow="6 · InputGroup"
        title="InputGroup"
        description="Nunca Input crudo dentro. Usa InputGroupInput / InputGroupTextarea + InputGroupAddon para iconos, unidades y botones inline."
      >
        <Panel label="addon · inline-start (search icon)">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="ig-search">Buscar rol</FieldLabel>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <SearchIcon />
                </InputGroupAddon>
                <InputGroupInput id="ig-search" placeholder="ej. Backend Senior, Remote US" />
              </InputGroup>
            </Field>
          </FieldGroup>
        </Panel>

        <Panel label="addon · inline-end (unit)">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="ig-score">Puntaje TOEFL iBT</FieldLabel>
              <InputGroup>
                <InputGroupInput id="ig-score" type="number" placeholder="118" />
                <InputGroupAddon align="inline-end">
                  <span>/ 120</span>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>Mínimo 95 para cohort 02.</FieldDescription>
            </Field>
          </FieldGroup>
        </Panel>

        <Panel label="salary range · two inputs + USD addons">
          <FieldSet>
            <FieldLegend variant="label">Expectativa salarial</FieldLegend>
            <FieldDescription>Rango mensual bruto, en USD.</FieldDescription>
            <FieldGroup className="gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel htmlFor="salary-min" className="sr-only">
                    Mínimo
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <DollarSignIcon />
                    </InputGroupAddon>
                    <InputGroupInput id="salary-min" type="number" placeholder="2,500" />
                    <InputGroupAddon align="inline-end">USD</InputGroupAddon>
                  </InputGroup>
                </Field>
                <Field>
                  <FieldLabel htmlFor="salary-max" className="sr-only">
                    Máximo
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <DollarSignIcon />
                    </InputGroupAddon>
                    <InputGroupInput id="salary-max" type="number" placeholder="4,000" />
                    <InputGroupAddon align="inline-end">USD</InputGroupAddon>
                  </InputGroup>
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
        </Panel>

        <Panel label="invalid state · aria-invalid on control">
          <FieldGroup>
            <Field data-invalid>
              <FieldLabel htmlFor="ig-invalid">Puntaje TOEFL iBT</FieldLabel>
              <InputGroup>
                <InputGroupInput id="ig-invalid" type="number" defaultValue="82" aria-invalid />
                <InputGroupAddon align="inline-end">/ 120</InputGroupAddon>
              </InputGroup>
              <FieldDescription>Por debajo del mínimo (95) para cohort 02.</FieldDescription>
            </Field>
          </FieldGroup>
        </Panel>
      </Showcase>

      {/* ─── ToggleGroup as option-set input ─── */}
      <Showcase
        eyebrow="7 · ToggleGroup as input"
        title="ToggleGroup como input"
        description="Para 2–7 opciones exclusivas dentro de un Field. El FieldTitle etiqueta al grupo sin labelear un control específico."
      >
        <Panel label="role preference · 4 options">
          <FieldGroup>
            <Field>
              <FieldTitle id="role-pref">Preferencia de rol</FieldTitle>
              <ToggleGroup aria-labelledby="role-pref" defaultValue={["fullstack"]} spacing={2}>
                <ToggleGroupItem value="backend">Backend</ToggleGroupItem>
                <ToggleGroupItem value="frontend">Frontend</ToggleGroupItem>
                <ToggleGroupItem value="fullstack">Fullstack</ToggleGroupItem>
                <ToggleGroupItem value="other">Otro</ToggleGroupItem>
              </ToggleGroup>
              <FieldDescription>
                Usado sólo como filtro inicial — verificamos stack real en diagnóstico.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </Panel>
      </Showcase>
    </div>
  );
}
