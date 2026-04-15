import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cruzar — Brand Directions",
  description: "Three visual directions for the Cruzar identity system",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
