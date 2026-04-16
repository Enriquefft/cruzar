import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * /system — editorial-register intro to the Cruzar design-system showcase.
 *
 * Every primitive downstream is a shadcn component wired to Cruzar tokens
 * (see `app/globals.css`). This page consumes the same SSOT — no inline
 * colors, no greyscale defaults, no custom typography overrides.
 */

type CategoryCard = {
  slug: string;
  title: string;
  description: string;
  components: string[];
  status: "ready" | "soon";
};

const CATEGORIES: CategoryCard[] = [
  {
    slug: "actions",
    title: "Actions",
    description:
      "Pulsadores y estados binarios. La gramática de todo botón en Cruzar.",
    components: ["Button", "Badge", "Toggle", "ToggleGroup"],
    status: "ready",
  },
  {
    slug: "inputs",
    title: "Inputs",
    description:
      "Controles primitivos para cohort-intake y dashboards operativos.",
    components: ["Input", "Textarea", "Select", "Checkbox", "RadioGroup", "Switch", "InputGroup"],
    status: "ready",
  },
  {
    slug: "forms",
    title: "Forms",
    description:
      "Composiciones reales: onboarding cohort, validación, loading states.",
    components: ["FieldGroup", "FieldSet", "FieldError", "Spinner + Button"],
    status: "ready",
  },
  {
    slug: "data",
    title: "Data display",
    description:
      "Tablas densas y tarjetas editoriales. El ledger de placements vive aquí.",
    components: ["Table", "Card", "Badge", "Avatar"],
    status: "soon",
  },
  {
    slug: "navigation",
    title: "Navigation",
    description: "Tabs, breadcrumbs, paginación. La estructura de recorrido.",
    components: ["Tabs", "Breadcrumb", "Pagination"],
    status: "soon",
  },
  {
    slug: "feedback",
    title: "Feedback",
    description:
      "Alertas, toasts, estados vacíos. La voz del sistema hacia el usuario.",
    components: ["Alert", "Sonner", "Spinner", "Skeleton", "Empty"],
    status: "soon",
  },
  {
    slug: "overlays",
    title: "Overlays",
    description: "Ventanas modales y paneles laterales para tareas focalizadas.",
    components: ["Dialog", "Sheet", "AlertDialog", "Popover"],
    status: "soon",
  },
];

export default function SystemIndexPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16 md:px-10 md:py-24">
      {/* ─── Editorial lede ─── */}
      <section className="flex flex-col gap-8">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          § I · Foundations
        </p>
        <h1 className="font-serif text-5xl font-normal leading-[0.95] tracking-[-0.025em] md:text-7xl">
          Cruzar
          <span style={{ color: "var(--brand-accent)" }}>.</span> Design System
        </h1>
        <div className="flex max-w-[68ch] flex-col gap-5 text-base leading-relaxed text-foreground">
          <p>
            Un sistema, dos registros. El{" "}
            <span className="font-medium">editorial</span> gobierna las
            superficies que firman rectores — decks, MOUs, landing top-fold — y
            se apoya en Literata como voz. El{" "}
            <span className="font-medium">field</span> gobierna los dashboards
            operativos, CVs y emails al empleador, y cambia a Geologica con
            Geist Mono para dar textura de instrumento.
          </p>
          <p className="text-muted-foreground">
            Los primitivos no cambian entre registros — solo lo hace la densidad,
            el encabezado y qué familia lidera. Todo lo que ves abajo consume la
            misma SSOT de tokens y fuentes; ningún color crudo, ningún{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">
              dark:
            </code>{" "}
            manual, ningún override tipográfico por <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">className</code>.
          </p>
        </div>
      </section>

      {/* ─── Category grid ─── */}
      <section className="flex flex-col gap-6">
        <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
          <h2 className="font-serif text-2xl font-medium tracking-[-0.01em]">
            Catálogo
          </h2>
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            34 primitivos · 7 categorías
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const isReady = cat.status === "ready";
            const card = (
              <Card className="h-full transition-colors hover:bg-muted/40">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="font-serif text-xl font-medium tracking-[-0.01em]">
                      {cat.title}
                    </CardTitle>
                    {!isReady ? (
                      <span className="rounded-sm border border-border px-1.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider text-muted-foreground">
                        Soon
                      </span>
                    ) : null}
                  </div>
                  <CardDescription>{cat.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-wrap gap-1.5">
                    {cat.components.map((c) => (
                      <li
                        key={c}
                        className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[0.72rem] text-foreground"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
            return isReady ? (
              <Link key={cat.slug} href={`/system/${cat.slug}`} className="group">
                {card}
              </Link>
            ) : (
              <div key={cat.slug} aria-disabled className="opacity-70">
                {card}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Colophon ─── */}
      <footer className="border-t border-border pt-6 text-xs text-muted-foreground">
        <p className="font-mono">
          Tokens en <span className="text-foreground">apps/brand/lib/tokens.ts</span>
          {" · "}Fuentes en{" "}
          <span className="text-foreground">apps/brand/lib/fonts.ts</span>
          {" · "}Componentes en{" "}
          <span className="text-foreground">components/ui/</span>.
        </p>
      </footer>
    </div>
  );
}
