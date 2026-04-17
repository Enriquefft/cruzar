import {
  ArrowRightIcon,
  BoldIcon,
  CheckIcon,
  DownloadIcon,
  ItalicIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  UnderlineIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

/**
 * /system/actions — Button, Badge, Toggle, ToggleGroup showcase.
 *
 * Every instance is a real shadcn primitive consuming Cruzar tokens through
 * the semantic bridge in `app/globals.css`. Icons ride `data-icon` so the
 * Button owns its sizing; no `size-*` classes on any icon below.
 */

function Showcase({
  title,
  eyebrow,
  children,
  description,
}: {
  title: string;
  eyebrow: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 border-t border-border pt-8 first:border-t-0 first:pt-0">
      <div className="flex flex-col gap-1">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="font-serif text-2xl font-medium tracking-[-0.012em]">{title}</h2>
        {description ? (
          <p className="max-w-[64ch] text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  );
}

function Row({
  label,
  children,
  note,
}: {
  label: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-card p-4 md:grid-cols-[180px_1fr]">
      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-xs font-medium text-foreground">{label}</span>
        {note ? <span className="text-xs text-muted-foreground">{note}</span> : null}
      </div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export default function ActionsPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 md:px-10">
      {/* ─── Masthead ─── */}
      <header className="flex flex-col gap-3">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          § II · Actions
        </p>
        <h1 className="font-serif text-4xl font-normal leading-[0.95] tracking-[-0.02em] md:text-5xl">
          Button, Badge, Toggle, ToggleGroup
        </h1>
        <p className="max-w-[68ch] text-muted-foreground">
          Los átomos accionables. Mismos primitivos en todo Cruzar: lo único que cambia es el
          contexto tipográfico del registro que los envuelve.
        </p>
      </header>

      {/* ─── Button ─── */}
      <Showcase
        eyebrow="1 · Button"
        title="Button"
        description="Seis variantes, cinco tamaños, estados explícitos. La variante por defecto es ink-on-paper (primary), restringida e institucional — nunca el brand accent."
      >
        <Row label="variant" note="default / outline / secondary / ghost / destructive / link">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </Row>

        <Row label="size" note="xs · sm · default · lg">
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
        </Row>

        <Row label="with icon" note="data-icon owns layout — no size classes on the svg">
          <Button>
            <PlusIcon data-icon="inline-start" />
            Nueva cohort
          </Button>
          <Button variant="outline">
            Continuar
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
          <Button variant="secondary">
            <DownloadIcon data-icon="inline-start" />
            Descargar CV
          </Button>
        </Row>

        <Row label="icon-only" note="size='icon' · size='icon-sm' · size='icon-xs'">
          <Button size="icon" aria-label="Search">
            <SearchIcon />
          </Button>
          <Button size="icon-sm" variant="outline" aria-label="Delete">
            <TrashIcon />
          </Button>
          <Button size="icon-xs" variant="ghost" aria-label="Add">
            <PlusIcon />
          </Button>
        </Row>

        <Row label="state" note="default · disabled · loading (Spinner composition)">
          <Button>Activo</Button>
          <Button disabled>Disabled</Button>
          <Button disabled>
            <Spinner data-icon="inline-start" />
            Guardando…
          </Button>
        </Row>
      </Showcase>

      {/* ─── Per-register composition ─── */}
      <Showcase
        eyebrow="2 · Registers"
        title="Mismo Button, dos registros"
        description="El primitivo no cambia. Cambia la tipografía que lo envuelve, la densidad, y qué acento acompaña: brand accent (editorial) o signal terra (field)."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Editorial register */}
          <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Editorial · Literata + Funnel Sans
            </p>
            <h3 className="font-serif text-2xl font-normal leading-tight tracking-[-0.015em]">
              Firma el MOU
              <span style={{ color: "var(--brand-accent)" }}>.</span>
            </h3>
            <p className="text-sm text-muted-foreground">
              Surfaces rector-facing, where credibility leads and the wordmark period is the only
              accented mark.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button>
                <CheckIcon data-icon="inline-start" />
                Aceptar términos
              </Button>
              <Button variant="outline">Revisar borrador</Button>
            </div>
          </div>

          {/* Field register */}
          <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 font-sans-dense">
            <p className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              FIELD · GEOLOGICA + GEIST MONO
            </p>
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block size-1.5 rounded-full"
                style={{ backgroundColor: "var(--brand-signal)" }}
              />
              <span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-foreground">
                job_id · jd_2026_042
              </span>
            </div>
            <h3 className="font-sans-dense text-lg font-semibold leading-snug">
              Aplicación lista para enviar
            </h3>
            <p className="text-sm text-muted-foreground">
              Dashboard operativo. Prima la densidad y la voz de instrumento.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button>
                <CheckIcon data-icon="inline-start" />
                Confirmar envío
              </Button>
              <Button variant="outline" size="sm">
                Abrir JD
              </Button>
            </div>
          </div>
        </div>
      </Showcase>

      {/* ─── Badge ─── */}
      <Showcase
        eyebrow="3 · Badge"
        title="Badge"
        description="Para estados, conteos y marcas de verificación. Nunca un span con clases crudas — si el color no existe como token semántico, usa variant o pide uno nuevo."
      >
        <Row label="variant">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="ghost">Ghost</Badge>
        </Row>

        <Row label="with icon" note="icons auto-size via Badge internal selectors">
          <Badge>
            <CheckIcon data-icon="inline-start" />
            Verified
          </Badge>
          <Badge variant="outline">
            <CheckIcon data-icon="inline-start" />
            Placed
          </Badge>
          <Badge variant="secondary">+$2,840 / mo</Badge>
        </Row>

        <Row label="student status" note="Cruzar pattern: name + verification">
          <div className="flex items-center gap-2">
            <span className="font-sans-dense text-sm font-medium">Estudiante #042</span>
            <Badge variant="outline">
              <CheckIcon data-icon="inline-start" />
              Verified
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-sans-dense text-sm font-medium">Estudiante #043</span>
            <Badge variant="secondary">Pending</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-sans-dense text-sm font-medium">Estudiante #044</span>
            <Badge variant="destructive">Revoked</Badge>
          </div>
        </Row>
      </Showcase>

      {/* ─── Toggle / ToggleGroup ─── */}
      <Showcase
        eyebrow="4 · Toggle"
        title="Toggle, ToggleGroup"
        description="Para 2–7 opciones exclusivas o un único pressable. Nunca Button en bucle con estado manual — el ToggleGroup del base-ui ya lleva keyboarding y ARIA."
      >
        <Row label="Toggle" note="single pressable (base-ui)">
          <Toggle aria-label="Bold">
            <BoldIcon />
          </Toggle>
          <Toggle aria-label="Italic" variant="outline">
            <ItalicIcon />
          </Toggle>
          <Toggle aria-label="Underline" variant="outline" defaultPressed>
            <UnderlineIcon />
          </Toggle>
          <Toggle aria-label="Disabled" disabled>
            <BoldIcon />
          </Toggle>
        </Row>

        <Row
          label="ToggleGroup · single"
          note="spacing=0 joins items; defaultValue as array (base-ui)"
        >
          <ToggleGroup defaultValue={["backend"]} aria-label="Preferencia de rol">
            <ToggleGroupItem value="backend">Backend</ToggleGroupItem>
            <ToggleGroupItem value="frontend">Frontend</ToggleGroupItem>
            <ToggleGroupItem value="fullstack">Fullstack</ToggleGroupItem>
            <ToggleGroupItem value="other">Other</ToggleGroupItem>
          </ToggleGroup>
        </Row>

        <Row label="ToggleGroup · multiple" note="multiple prop (base-ui)">
          <ToggleGroup multiple defaultValue={["bold", "italic"]} aria-label="Format">
            <ToggleGroupItem value="bold">
              <BoldIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic">
              <ItalicIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline">
              <UnderlineIcon />
            </ToggleGroupItem>
          </ToggleGroup>
        </Row>

        <Row label="ToggleGroup · spacing=2" note="gapped variant for labelled sets">
          <ToggleGroup spacing={2} defaultValue={["editorial"]} aria-label="Register">
            <ToggleGroupItem value="editorial">Editorial</ToggleGroupItem>
            <ToggleGroupItem value="field">Field</ToggleGroupItem>
          </ToggleGroup>
        </Row>
      </Showcase>
    </div>
  );
}
