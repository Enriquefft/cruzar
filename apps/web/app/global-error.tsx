"use client";

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
        <h2>Algo falló.</h2>
        <p>Intenta de nuevo. Si persiste, escríbenos a enrique@cruzarapp.com.</p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            border: "1px solid currentColor",
            borderRadius: "0.375rem",
            cursor: "pointer",
          }}
        >
          Reintentar
        </button>
      </body>
    </html>
  );
}
