"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { signOut } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const onClick = useCallback(async () => {
    if (pending) return;
    setPending(true);
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } finally {
      setPending(false);
    }
  }, [pending, router]);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-disabled={pending}
      className="text-sm text-[color:var(--brand-ink-soft)] transition-colors hover:text-[color:var(--brand-ink)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Cerrando..." : "Cerrar sesión"}
    </button>
  );
}
