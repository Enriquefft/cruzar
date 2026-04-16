/**
 * PlacementStatusBadge — semantic badge for application states.
 *
 * Maps Cruzar's six canonical application states onto shadcn `Badge`
 * variants + a `lucide-react` icon. The status type is the SSOT — copy
 * keys derive from it, downstream tracker tables filter on it.
 *
 * Variant mapping rationale (B.3 — accent budget, voice rules):
 *   - `applied`     → outline    : noted, not yet weighted
 *   - `viewed`      → secondary  : passive employer signal
 *   - `interview`   → secondary  : active engagement, not yet decisive
 *   - `offer`       → default    : ink-on-paper — institutional weight
 *   - `signed`      → default + check : verified outcome
 *   - `rejected`    → ghost      : recorded but dimmed; we don't shout
 *
 * `destructive` is intentionally NOT used for `rejected` — the brand
 * voice never frames a rejection as user-facing failure (brand-voice
 * §1 "Restrained").
 */

import {
  CheckCircle2Icon,
  CircleDashedIcon,
  EyeIcon,
  HandshakeIcon,
  MessagesSquareIcon,
  XIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type PlacementStatus =
  | "applied"
  | "viewed"
  | "interview"
  | "offer"
  | "signed"
  | "rejected";

type Lang = "es" | "en";

type Props = {
  status: PlacementStatus;
  lang?: Lang;
  className?: string;
};

const COPY: Record<PlacementStatus, Record<Lang, string>> = {
  applied: { es: "Postulado", en: "Applied" },
  viewed: { es: "Visto", en: "Viewed" },
  interview: { es: "Entrevista", en: "Interview" },
  offer: { es: "Oferta", en: "Offer" },
  signed: { es: "Contrato", en: "Signed" },
  rejected: { es: "Cerrado", en: "Closed" },
};

const ICON: Record<PlacementStatus, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  applied: CircleDashedIcon,
  viewed: EyeIcon,
  interview: MessagesSquareIcon,
  offer: HandshakeIcon,
  signed: CheckCircle2Icon,
  rejected: XIcon,
};

const VARIANT: Record<PlacementStatus, "default" | "secondary" | "outline" | "ghost"> = {
  applied: "outline",
  viewed: "secondary",
  interview: "secondary",
  offer: "default",
  signed: "default",
  rejected: "ghost",
};

export function PlacementStatusBadge({
  status,
  lang = "en",
  className,
}: Props) {
  const Icon = ICON[status];
  return (
    <Badge
      variant={VARIANT[status]}
      data-pattern="placement-status-badge"
      data-status={status}
      className={cn("font-mono uppercase tracking-[0.08em]", className)}
    >
      <Icon data-icon="inline-start" />
      {COPY[status][lang]}
    </Badge>
  );
}

export type { Props as PlacementStatusBadgeProps };
