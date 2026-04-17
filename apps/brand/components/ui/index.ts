// Barrel export for every shadcn primitive in @cruzar/brand/ui.
// Consumers: `import { Button, Card } from "@cruzar/brand/ui"`.
// Tree-shaking-aware consumers can also import a single primitive via
// `import { Button } from "@cruzar/brand/ui/button"` (see package.json exports).
//
// When adding a new primitive under components/ui/, append its `export *` line
// below and add a matching showcase block under app/system/.
//
// Ordered alphabetically to match `ls components/ui/*.tsx`.

// `cn` is also exposed as its own subpath (`@cruzar/brand/cn`) so callers
// that only need the helper don't pull the entire primitive barrel.
export { cn } from "../../lib/utils";
export * from "./accordion";
export * from "./alert";
export * from "./alert-dialog";
export * from "./avatar";
export * from "./badge";
export * from "./breadcrumb";
export * from "./button";
export * from "./card";
export * from "./checkbox";
export * from "./command";
export * from "./dialog";
export * from "./dropdown-menu";
export * from "./field";
export * from "./hover-card";
export * from "./input";
export * from "./input-group";
export * from "./label";
export * from "./pagination";
export * from "./popover";
export * from "./radio-group";
export * from "./scroll-area";
export * from "./select";
export * from "./separator";
export * from "./sheet";
export * from "./skeleton";
export * from "./sonner";
export * from "./spinner";
export * from "./switch";
export * from "./table";
export * from "./tabs";
export * from "./textarea";
export * from "./toggle";
export * from "./toggle-group";
export * from "./tooltip";
