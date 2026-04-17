import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="text-sm uppercase tracking-wide opacity-60">404</p>
      <h1 className="text-2xl font-semibold">Página no encontrada.</h1>
      <p className="opacity-80">El enlace podría estar caducado o escrito incorrectamente.</p>
      <Link href="/" className="mt-2 underline">
        Volver al inicio
      </Link>
    </main>
  );
}
