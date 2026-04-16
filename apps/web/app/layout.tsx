import type { Metadata } from "next";
import { fontVariables } from "@cruzar/brand/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cruzar — postulación autónoma a roles remotos en USD",
  description:
    "Diagnóstico, validación en escenarios reales y postulación autónoma a empresas que contratan en USD. Cobramos solo cuando firmas oferta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
