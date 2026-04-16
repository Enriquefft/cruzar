"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArchiveIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";

function Eyebrow({ no, label }: { no: string; label: string }) {
  return (
    <div className="flex items-baseline gap-3 text-xs uppercase tracking-[0.18em] text-brand-ink-label font-sans">
      <span className="font-semibold text-[color:var(--brand-accent)]">§ {no}</span>
      <span className="h-px w-8 bg-brand-hairline" />
      <span>{label}</span>
    </div>
  );
}

export default function NavigationPage() {
  return (
    <div className="flex flex-col gap-16 px-6 py-8 lg:px-10">
      <header className="flex flex-col gap-3">
        <Eyebrow no="I" label="Navigation" />
        <h1 className="font-serif text-4xl font-normal tracking-tight">
          Navigation<span className="text-[color:var(--brand-accent)]">.</span>{" "}
          <span className="text-brand-ink-soft">Tabs, Breadcrumb, Pagination, Accordion, DropdownMenu</span>
        </h1>
      </header>

      {/* TABS */}
      <section className="flex flex-col gap-5">
        <Eyebrow no="II" label="Tabs — view switcher" />
        <Tabs defaultValue="editorial">
          <TabsList>
            <TabsTrigger value="editorial">Editorial</TabsTrigger>
            <TabsTrigger value="field">Field</TabsTrigger>
            <TabsTrigger value="source">Source</TabsTrigger>
          </TabsList>
          <TabsContent value="editorial">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Editorial view</CardTitle>
                <CardDescription>Long-form, display type, generous measure.</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="max-w-prose font-serif text-lg leading-snug">
                  Cohort 02 placed 12 students into international remote roles, with an average
                  salary delta of USD 2,840 per month.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="field">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Field view</CardTitle>
                <CardDescription>Operator register — dense, tabular, mono accents.</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-3 gap-4 font-sans-dense">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Placed</span>
                    <span className="font-mono text-2xl tabular-nums">12</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Δ USD/mo</span>
                    <span className="font-mono text-2xl tabular-nums">2,840</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">×</span>
                    <span className="font-mono text-2xl tabular-nums">4.1</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="source">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Source view</CardTitle>
                <CardDescription>Raw JSON — the ground-truth record.</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <pre className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs text-muted-foreground">
{`{
  "cohort": "02",
  "placed": 12,
  "avg_salary_delta_usd": 2840,
  "avg_salary_multiple": 4.1,
  "as_of": "2026-04-15"
}`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Separator />

      {/* BREADCRUMB */}
      <section className="flex flex-col gap-5">
        <Eyebrow no="III" label="Breadcrumb" />
        <div className="rounded-md bg-card p-4 ring-1 ring-border">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<a href="#">Cruzar</a>} />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<a href="#">Cohort 02</a>} />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<a href="#">U0</a>} />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      <Separator />

      {/* PAGINATION */}
      <section className="flex flex-col gap-5">
        <Eyebrow no="IV" label="Pagination — 47-student cohort" />
        <div className="flex flex-col gap-3 rounded-md bg-card p-6 ring-1 ring-border">
          <div className="text-xs text-muted-foreground">
            Showing 11–20 of 47 students
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">4</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">5</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>

      <Separator />

      {/* ACCORDION */}
      <section className="flex flex-col gap-5">
        <Eyebrow no="V" label="Accordion — Preguntas frecuentes" />
        <div className="rounded-md bg-card p-4 ring-1 ring-border">
          <Accordion>
            <AccordionItem value="when">
              <AccordionTrigger>¿Cuándo se cobra el fee?</AccordionTrigger>
              <AccordionContent>
                <p>
                  El fee se cobra una sola vez, solo cuando se firma el contrato internacional.
                  No hay depósito, no hay suscripción, no hay matrícula.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="no-placement">
              <AccordionTrigger>¿Qué pasa si no me colocan?</AccordionTrigger>
              <AccordionContent>
                <p>
                  No pagas. El precio es 100% contingente a la firma de un contrato internacional
                  verificado. Nunca antes.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="english">
              <AccordionTrigger>¿Cómo verifican mi inglés?</AccordionTrigger>
              <AccordionContent>
                <p>
                  Aceptamos certificaciones estándar (TOEFL, IELTS, EF SET, Duolingo) mapeadas a
                  CEFR. Para B2+ no verificable, hacemos una entrevista oral grabada como respaldo.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Separator />

      {/* DROPDOWN MENU */}
      <section className="flex flex-col gap-5">
        <Eyebrow no="VI" label="DropdownMenu — Actions" />
        <div className="flex items-center gap-4 rounded-md bg-card p-6 ring-1 ring-border">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-sm">MR — Frontend Engineer · US remote</span>
            <span className="text-xs text-muted-foreground">Placed · 2026-03-14</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="icon-sm">
                  <MoreHorizontalIcon />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                  <UserIcon />
                  View profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PencilIcon />
                  Edit
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <ArchiveIcon />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  <Trash2Icon />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>
    </div>
  );
}
