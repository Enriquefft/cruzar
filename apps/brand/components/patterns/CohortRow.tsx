/**
 * CohortRow — a single application row in the operator placement tracker.
 *
 * Composes `TableRow` + `TableCell` from the shadcn primitive. Caller
 * provides the parent `<Table><TableHeader>...</TableHeader><TableBody>`
 * — this pattern is a row, never a standalone table.
 *
 * Columns (left → right):
 *   1. Initials       — Avatar fallback (two-letter)
 *   2. Role           — sentence case + locale tag, single-line truncate
 *   3. Status         — PlacementStatusBadge
 *   4. Salary delta   — tabular, prefixed with sign; "—" when null
 *   5. Days to offer  — tabular, "—" when null
 *
 * All numeric cells are tabular-nums (C.3).
 */

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { type PlacementStatus, PlacementStatusBadge } from "./PlacementStatusBadge";

type Props = {
  initials: string;
  jobTitle: string;
  status: PlacementStatus;
  /** Salary delta in USD/month. `undefined` renders as em-dash. */
  salaryDelta?: number;
  /** Days from application to signed offer. `undefined` renders as em-dash. */
  daysToOffer?: number;
  /** Optional language for badge copy. Defaults to `en`. */
  lang?: "es" | "en";
  className?: string;
};

const formatDelta = (delta?: number) => {
  if (delta === undefined) return "—";
  const sign = delta > 0 ? "+" : delta < 0 ? "−" : "";
  return `${sign}USD ${Math.abs(delta).toLocaleString("en-US")}/mo`;
};

export function CohortRow({
  initials,
  jobTitle,
  status,
  salaryDelta,
  daysToOffer,
  lang = "en",
  className,
}: Props) {
  return (
    <TableRow
      data-pattern="cohort-row"
      data-status={status}
      className={cn("font-sans-dense tabular-nums", className)}
    >
      <TableCell className="w-12">
        <Avatar className="size-8">
          <AvatarFallback className="font-mono text-[0.72rem] font-medium uppercase">
            {initials.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="max-w-[34ch] truncate text-sm font-medium text-foreground">
        {jobTitle}
      </TableCell>
      <TableCell>
        <PlacementStatusBadge status={status} lang={lang} />
      </TableCell>
      <TableCell className="text-right font-mono text-sm text-foreground">
        {formatDelta(salaryDelta)}
      </TableCell>
      <TableCell className="text-right font-mono text-sm text-brand-ink-soft">
        {daysToOffer === undefined ? "—" : `${daysToOffer}d`}
      </TableCell>
    </TableRow>
  );
}

export type { Props as CohortRowProps };
