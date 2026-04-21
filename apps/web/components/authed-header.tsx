import Link from "next/link";
import { SignOutButton } from "./sign-out-button";

interface AuthedHeaderProps {
  email: string;
  active?: "profile" | "status" | "onboarding";
}

export function AuthedHeader({ email, active }: AuthedHeaderProps) {
  return (
    <header className="border-b border-[color:var(--brand-hairline)] bg-[color:var(--background)]">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4 md:px-10"
      >
        <Link
          href="/profile"
          className="font-mono text-xs uppercase tracking-[0.22em] text-[color:var(--brand-ink)]"
        >
          Cruzar<span className="text-[color:var(--accent)]">.</span>
        </Link>

        <div className="flex items-center gap-5 md:gap-7">
          <Link
            href="/profile"
            aria-current={active === "profile" ? "page" : undefined}
            className={
              active === "profile"
                ? "text-sm font-medium text-[color:var(--brand-ink)]"
                : "text-sm text-[color:var(--brand-ink-soft)] transition-colors hover:text-[color:var(--brand-ink)]"
            }
          >
            Perfil
          </Link>
          <Link
            href="/status"
            aria-current={active === "status" ? "page" : undefined}
            className={
              active === "status"
                ? "text-sm font-medium text-[color:var(--brand-ink)]"
                : "text-sm text-[color:var(--brand-ink-soft)] transition-colors hover:text-[color:var(--brand-ink)]"
            }
          >
            Estado
          </Link>
          <span
            className="hidden max-w-[180px] truncate text-xs text-[color:var(--brand-ink-label)] md:inline"
            title={email}
          >
            {email}
          </span>
          <SignOutButton />
        </div>
      </nav>
    </header>
  );
}
