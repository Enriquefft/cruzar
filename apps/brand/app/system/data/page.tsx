import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRightIcon } from "lucide-react";

type Row = {
  initials: string;
  role: string;
  status: "Placed" | "In review" | "Interview" | "Applied";
  delta: string;
  days: number;
};

const ROWS: Row[] = [
  { initials: "MR", role: "Frontend Engineer · US remote", status: "Placed", delta: "+USD 3,120/mo", days: 41 },
  { initials: "JC", role: "Data Analyst · EU remote", status: "Interview", delta: "+USD 2,840/mo", days: 28 },
  { initials: "AV", role: "Customer Success · LATAM+US", status: "In review", delta: "+USD 2,200/mo", days: 22 },
  { initials: "DF", role: "Backend Engineer · US remote", status: "Placed", delta: "+USD 3,540/mo", days: 53 },
  { initials: "LP", role: "Design Engineer · US remote", status: "Applied", delta: "—", days: 9 },
];

function StatusBadge({ status }: { status: Row["status"] }) {
  const variant =
    status === "Placed"
      ? "default"
      : status === "Interview"
        ? "secondary"
        : status === "In review"
          ? "outline"
          : "ghost";
  return <Badge variant={variant}>{status}</Badge>;
}

function Eyebrow({ no, label }: { no: string; label: string }) {
  return (
    <div className="flex items-baseline gap-3 text-xs uppercase tracking-[0.18em] text-brand-ink-label font-sans">
      <span className="font-semibold text-[color:var(--brand-accent)]">§ {no}</span>
      <span className="h-px w-8 bg-brand-hairline" />
      <span>{label}</span>
    </div>
  );
}

export default function DataPage() {
  return (
    <div className="flex flex-col gap-16 px-6 py-8 lg:px-10">
      <header className="flex flex-col gap-3">
        <Eyebrow no="I" label="Data display" />
        <h1 className="font-serif text-4xl font-normal tracking-tight">
          Data<span className="text-[color:var(--brand-accent)]">.</span>{" "}
          <span className="text-brand-ink-soft">Card, Table, Avatar, Badge</span>
        </h1>
        <p className="max-w-prose text-brand-ink-soft">
          The everyday data-display primitives, dressed as real Cruzar surfaces — placement
          trackers, cohort metrics, operator tables.
        </p>
      </header>

      {/* CARD COMPOSITION */}
      <section className="flex flex-col gap-5">
        <Eyebrow no="II" label="Card — full anatomy" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Cohort 02 · Placement report</CardTitle>
              <CardDescription>
                As of 2026-04-15 · verified by signed offer letter and first-payroll screenshot.
              </CardDescription>
              <CardAction>
                <Badge variant="secondary">Verified</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Placed</span>
                  <span className="font-serif text-3xl tabular-nums">12</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Avg. Δ</span>
                  <span className="font-serif text-3xl tabular-nums">$2,840</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Multiple</span>
                  <span className="font-serif text-3xl tabular-nums">4.1×</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-center justify-between gap-3">
                <Badge variant="outline">25.5% of cohort</Badge>
                <Button size="sm" variant="outline">
                  Open ledger
                  <ArrowUpRightIcon data-icon="inline-end" />
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>Partner universities</CardTitle>
              <CardDescription>Signed MOUs, Peru · 2026-Q2</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">UTEC</span>
                  <Badge variant="secondary">Anchor</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm">UPCH</span>
                  <Badge variant="outline">Negotiating</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm">PUCP</span>
                  <Badge variant="outline">Negotiating</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* AVATAR */}
      <section className="flex flex-col gap-5">
        <Eyebrow no="III" label="Avatar — size scale" />
        <div className="flex flex-col gap-4 rounded-md bg-card p-6 ring-1 ring-border">
          <div className="flex items-end gap-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar size="sm" className="size-8">
                <AvatarFallback className="font-mono">MR</AvatarFallback>
              </Avatar>
              <span className="font-mono text-xs text-muted-foreground">size-8</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar className="size-10">
                <AvatarFallback className="font-mono">JC</AvatarFallback>
              </Avatar>
              <span className="font-mono text-xs text-muted-foreground">size-10</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar size="lg" className="size-12">
                <AvatarFallback className="font-mono">AV</AvatarFallback>
              </Avatar>
              <span className="font-mono text-xs text-muted-foreground">size-12</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            AvatarFallback initials are rendered in <code className="font-mono">font-mono</code> for tabular
            consistency across a cohort roster.
          </p>
        </div>
      </section>

      <Separator />

      {/* TABLE */}
      <section className="flex flex-col gap-5">
        <Eyebrow no="IV" label="Table — placement tracker" />
        <Card size="sm" className="overflow-hidden">
          <CardHeader>
            <CardTitle>Placements · Cohort 02</CardTitle>
            <CardDescription>5 rows shown · 47 total in cohort</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Target role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Salary delta</TableHead>
                  <TableHead className="text-right">Days to offer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ROWS.map((row) => (
                  <TableRow key={row.initials}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar size="sm" className="size-6">
                          <AvatarFallback className="font-mono text-[0.65rem]">{row.initials}</AvatarFallback>
                        </Avatar>
                        <span className="font-mono text-xs">{row.initials}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{row.role}</TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">{row.delta}</TableCell>
                    <TableCell className="text-right font-mono tabular-nums">{row.days}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* SKELETON */}
      <section className="flex flex-col gap-5">
        <Eyebrow no="V" label="Skeleton — loading state" />
        <Card size="sm" className="overflow-hidden">
          <CardHeader>
            <CardTitle>Placements · loading</CardTitle>
            <CardDescription>Same table in its loading register.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Target role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Salary delta</TableHead>
                  <TableHead className="text-right">Days to offer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[0, 1, 2, 3, 4].map((i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="size-6 rounded-full" />
                        <Skeleton className="h-3 w-8" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-3 w-56" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-3 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-3 w-8" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <Separator />

      {/* BADGE + SEPARATOR */}
      <section className="flex flex-col gap-5">
        <Eyebrow no="VI" label="Badge — status register" />
        <div className="flex flex-col gap-4 rounded-md bg-card p-6 ring-1 ring-border">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Placed</Badge>
            <Badge variant="secondary">Interview</Badge>
            <Badge variant="outline">In review</Badge>
            <Badge variant="ghost">Applied</Badge>
            <Badge variant="destructive">Withdrawn</Badge>
          </div>
          <Separator />
          <p className="text-xs text-muted-foreground">
            Status colors live on Badge variants. Never a custom styled span.
          </p>
        </div>
      </section>
    </div>
  );
}
