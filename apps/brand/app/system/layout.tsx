import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * /system layout — persistent shell for the Cruzar design-system showcase.
 *
 * Consumes shadcn↔Cruzar semantic tokens (see `app/globals.css`):
 *   - Shell: `bg-background text-foreground`.
 *   - Sidebar: `bg-sidebar text-sidebar-foreground border-r border-sidebar-border`.
 * Typography defaults to Funnel Sans (`font-sans`); headings opt-in to Literata
 * via `font-serif`. The wordmark terminal period is the ONLY brand-accent
 * instance on this surface, matching the editorial register's locked usage.
 */

type NavSection = {
  title: string;
  items: { href: string; label: string; note?: string }[];
};

const NAV: NavSection[] = [
  {
    title: "Foundations",
    items: [
      { href: "/system", label: "Overview" },
      { href: "/system#tokens", label: "Tokens", note: "Soon" },
      { href: "/system#type", label: "Type", note: "Soon" },
      { href: "/system#color", label: "Color", note: "Soon" },
    ],
  },
  {
    title: "Actions",
    items: [{ href: "/system/actions", label: "Button · Badge · Toggle" }],
  },
  {
    title: "Inputs & Forms",
    items: [
      { href: "/system/inputs", label: "Input primitives" },
      { href: "/system/forms", label: "Form composition" },
    ],
  },
  {
    title: "Data Display",
    items: [{ href: "/system#data", label: "Table · Card · Avatar", note: "Soon" }],
  },
  {
    title: "Navigation",
    items: [
      { href: "/system#nav", label: "Tabs · Breadcrumb · Pagination", note: "Soon" },
    ],
  },
  {
    title: "Feedback",
    items: [
      { href: "/system#feedback", label: "Alert · Toast · Spinner", note: "Soon" },
    ],
  },
  {
    title: "Overlays",
    items: [
      { href: "/system#overlays", label: "Dialog · Sheet · Popover", note: "Soon" },
    ],
  },
];

function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-serif text-xl font-medium tracking-[-0.035em] leading-none",
        className,
      )}
    >
      Cruzar
      <span style={{ color: "var(--brand-accent)" }}>.</span>
    </span>
  );
}

export default function SystemLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* ─── Masthead ─── */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-6 border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <Link
          href="/system"
          className="flex items-baseline gap-3 text-foreground"
        >
          <Wordmark />
          <span className="hidden text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground sm:inline">
            Design System
          </span>
        </Link>

        {/* Register switch — non-functional visual placeholder */}
        <div
          aria-label="Register (visual placeholder)"
          className="flex items-center gap-1 rounded-full border border-border bg-muted p-0.5 text-xs font-medium"
        >
          <span className="rounded-full bg-background px-3 py-1 text-foreground shadow-sm ring-1 ring-border">
            Editorial
          </span>
          <span className="px-3 py-1 font-sans-dense text-muted-foreground">
            Field
          </span>
        </div>
      </header>

      {/* ─── Shell ─── */}
      <div className="flex flex-1">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:block">
          <nav className="flex flex-col gap-6 px-4 py-6">
            {NAV.map((section) => (
              <div key={section.title} className="flex flex-col gap-2">
                <p className="px-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {section.title}
                </p>
                <ul className="flex flex-col gap-0.5">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="group flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      >
                        <span className="truncate">{item.label}</span>
                        {item.note ? (
                          <span className="shrink-0 rounded-sm border border-border px-1 text-[0.6rem] font-medium uppercase tracking-wider text-muted-foreground">
                            {item.note}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
