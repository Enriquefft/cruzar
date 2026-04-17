import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cruzar — Brand & Design System",
  description:
    "The locked Cruzar brand identity, two-register system, and shadcn-driven design system.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={cn("font-sans antialiased", fontVariables)}>
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
