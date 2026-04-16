"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import {
  FileSearchIcon,
  InfoIcon,
  OctagonAlertIcon,
  PlusIcon,
} from "lucide-react";
import { toast } from "sonner";

function Eyebrow({ no, label }: { no: string; label: string }) {
  return (
    <div className="flex items-baseline gap-3 text-xs uppercase tracking-[0.18em] text-brand-ink-label font-sans">
      <span className="font-semibold text-[color:var(--brand-accent)]">§ {no}</span>
      <span className="h-px w-8 bg-brand-hairline" />
      <span>{label}</span>
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <div className="flex flex-col gap-16 px-6 py-8 lg:px-10">
      <Toaster />

      <header className="flex flex-col gap-3">
        <Eyebrow no="I" label="Feedback" />
        <h1 className="font-serif text-4xl font-normal tracking-tight">
          Feedback<span className="text-[color:var(--brand-accent)]">.</span>{" "}
          <span className="text-brand-ink-soft">Alert, Spinner, Skeleton, Toast, Empty</span>
        </h1>
      </header>

      {/* ALERT */}
      <section className="flex flex-col gap-5">
        <Eyebrow no="II" label="Alert — every variant" />
        <div className="flex flex-col gap-4">
          <Alert>
            <InfoIcon />
            <AlertTitle>Verificación pendiente</AlertTitle>
            <AlertDescription>
              Tu certificado de inglés está en revisión. Te avisaremos por WhatsApp apenas quede
              confirmado — suele tomar menos de 24 horas hábiles.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <OctagonAlertIcon />
            <AlertTitle>El certificado no coincide con el archivo subido</AlertTitle>
            <AlertDescription>
              El PDF reporta un score de B1, pero la declaración del formulario indica B2. Sube
              nuevamente el certificado oficial o corrige el valor declarado.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      <Separator />

      {/* SPINNER */}
      <section className="flex flex-col gap-5">
        <Eyebrow no="III" label="Spinner — standalone + inside Button" />
        <div className="flex flex-col gap-4 rounded-md bg-card p-6 ring-1 ring-border">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Spinner />
              <span className="text-sm text-muted-foreground">Inline spinner</span>
            </div>
            <Button disabled>
              <Spinner data-icon="inline-start" />
              Saving…
            </Button>
            <Button variant="outline" disabled>
              <Spinner data-icon="inline-start" />
              Submitting
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Button has no <code className="font-mono">isPending</code>. Compose with{" "}
            <code className="font-mono">Spinner</code> + <code className="font-mono">data-icon</code> +{" "}
            <code className="font-mono">disabled</code>.
          </p>
        </div>
      </section>

      <Separator />

      {/* SKELETON in context */}
      <section className="flex flex-col gap-5">
        <Eyebrow no="IV" label="Skeleton — feedback context" />
        <Card size="sm">
          <CardHeader>
            <CardTitle>Loading cohort 02…</CardTitle>
            <CardDescription>Streaming placement data from the SQL view.</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-16 rounded-md" />
                <Skeleton className="h-16 rounded-md" />
                <Skeleton className="h-16 rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* TOAST */}
      <section className="flex flex-col gap-5">
        <Eyebrow no="V" label="Toast — sonner" />
        <div className="flex flex-col gap-3 rounded-md bg-card p-6 ring-1 ring-border">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() =>
                toast.success("Placement confirmed", {
                  description: "MR — Frontend Engineer · US remote · verified 2026-04-15",
                })
              }
            >
              toast.success()
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.info("Verification pending", {
                  description: "English certificate is under review. ~24h turnaround.",
                })
              }
            >
              toast.info()
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.error("Upload failed", {
                  description: "Offer letter could not be parsed. Please try a PDF copy.",
                })
              }
            >
              toast.error()
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            <code className="font-mono">{`<Toaster />`}</code> is rendered once on this page; sonner
            styling is mapped to Cruzar popover tokens via{" "}
            <code className="font-mono">--normal-bg</code> → <code className="font-mono">--popover</code>.
          </p>
        </div>
      </section>

      <Separator />

      {/* EMPTY */}
      <section className="flex flex-col gap-5">
        <Eyebrow no="VI" label="Empty state" />
        <Card size="sm">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <FileSearchIcon className="size-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-serif text-lg font-medium">No applications yet</div>
              <div className="max-w-prose text-sm text-muted-foreground">
                Once Miura drafts the first batch of applications for this student, they will land
                here with status, company, and the live tracking row from career-ops.
              </div>
            </div>
            <Button size="sm" className="mt-2">
              <PlusIcon data-icon="inline-start" />
              Start a batch
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
