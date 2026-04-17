"use client";

import { BriefcaseIcon, FileTextIcon, HelpCircleIcon, SettingsIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function Eyebrow({ no, label }: { no: string; label: string }) {
  return (
    <div className="flex items-baseline gap-3 text-xs uppercase tracking-[0.18em] text-brand-ink-label font-sans">
      <span className="font-semibold text-[color:var(--brand-accent)]">§ {no}</span>
      <span className="h-px w-8 bg-brand-hairline" />
      <span>{label}</span>
    </div>
  );
}

export default function OverlaysPage() {
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-16 px-6 py-8 lg:px-10">
        <header className="flex flex-col gap-3">
          <Eyebrow no="I" label="Overlays" />
          <h1 className="font-serif text-4xl font-normal tracking-tight">
            Overlays<span className="text-[color:var(--brand-accent)]">.</span>{" "}
            <span className="text-brand-ink-soft">
              Dialog, Sheet, AlertDialog, Tooltip, Popover, HoverCard, Command
            </span>
          </h1>
        </header>

        {/* DIALOG */}
        <section className="flex flex-col gap-5">
          <Eyebrow no="II" label="Dialog — Edit profile" />
          <div className="rounded-md bg-card p-6 ring-1 ring-border">
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>Edit profile</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Update the student-facing profile fields. Changes propagate to the CV builder on
                    save.
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="profile-name">Name</FieldLabel>
                    <Input id="profile-name" defaultValue="M. Rodríguez" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="profile-role">Target role</FieldLabel>
                    <Input id="profile-role" defaultValue="Frontend Engineer" />
                    <FieldDescription>Used to tune CV tailoring and role matches.</FieldDescription>
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                  <Button>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        <Separator />

        {/* SHEET */}
        <section className="flex flex-col gap-5">
          <Eyebrow no="III" label="Sheet — Filters" />
          <div className="rounded-md bg-card p-6 ring-1 ring-border">
            <Sheet>
              <SheetTrigger render={<Button variant="outline" />}>Open filters</SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter applications</SheetTitle>
                  <SheetDescription>
                    Narrow the cohort-02 application tracker by status.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-1 flex-col gap-4 px-4">
                  <FieldGroup>
                    <Field orientation="horizontal">
                      <Checkbox id="f-applied" defaultChecked />
                      <FieldContent>
                        <FieldLabel htmlFor="f-applied">Applied</FieldLabel>
                        <FieldDescription>Submitted, awaiting recruiter view.</FieldDescription>
                      </FieldContent>
                    </Field>
                    <Field orientation="horizontal">
                      <Checkbox id="f-review" defaultChecked />
                      <FieldContent>
                        <FieldLabel htmlFor="f-review">In review</FieldLabel>
                        <FieldDescription>Recruiter viewed or screened.</FieldDescription>
                      </FieldContent>
                    </Field>
                    <Field orientation="horizontal">
                      <Checkbox id="f-interview" />
                      <FieldContent>
                        <FieldLabel htmlFor="f-interview">Interview</FieldLabel>
                        <FieldDescription>
                          Live interview scheduled or in progress.
                        </FieldDescription>
                      </FieldContent>
                    </Field>
                    <Field orientation="horizontal">
                      <Checkbox id="f-placed" />
                      <FieldContent>
                        <FieldLabel htmlFor="f-placed">Placed</FieldLabel>
                        <FieldDescription>Contract signed and payroll verified.</FieldDescription>
                      </FieldContent>
                    </Field>
                  </FieldGroup>
                </div>
                <SheetFooter>
                  <Button>Apply filters</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </section>

        <Separator />

        {/* ALERT DIALOG */}
        <section className="flex flex-col gap-5">
          <Eyebrow no="IV" label="AlertDialog — destructive confirm" />
          <div className="rounded-md bg-card p-6 ring-1 ring-border">
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="destructive" />}>
                Delete cohort
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete cohort 02?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove 47 student records, 312 applications, and the full placement
                    ledger. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive">Delete cohort</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>

        <Separator />

        {/* TOOLTIP */}
        <section className="flex flex-col gap-5">
          <Eyebrow no="V" label="Tooltip" />
          <div className="flex items-center gap-3 rounded-md bg-card p-6 ring-1 ring-border">
            <span className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
              CEFR · B2
            </span>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="ghost" size="icon-sm" aria-label="What is CEFR?">
                    <HelpCircleIcon />
                  </Button>
                }
              />
              <TooltipContent>
                CEFR B2 — upper-intermediate. Threshold for international remote roles.
              </TooltipContent>
            </Tooltip>
          </div>
        </section>

        <Separator />

        {/* POPOVER */}
        <section className="flex flex-col gap-5">
          <Eyebrow no="VI" label="Popover — quick stats" />
          <div className="rounded-md bg-card p-6 ring-1 ring-border">
            <Popover>
              <PopoverTrigger render={<Button variant="outline" />}>Quick stats</PopoverTrigger>
              <PopoverContent>
                <PopoverHeader>
                  <PopoverTitle>Cohort 02 · snapshot</PopoverTitle>
                </PopoverHeader>
                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                      Placed
                    </span>
                    <span className="font-serif text-xl tabular-nums">12</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                      Δ / mo
                    </span>
                    <span className="font-serif text-xl tabular-nums">$2,840</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                      Multi
                    </span>
                    <span className="font-serif text-xl tabular-nums">4.1×</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </section>

        <Separator />

        {/* HOVERCARD */}
        <section className="flex flex-col gap-5">
          <Eyebrow no="VII" label="HoverCard — student mini-profile" />
          <div className="rounded-md bg-card p-6 ring-1 ring-border">
            <p className="text-sm">
              Cohort 02 placement:{" "}
              <HoverCard>
                <HoverCardTrigger
                  render={
                    <a
                      // biome-ignore lint/a11y/useValidAnchor: hover-card trigger specimen in design-system showcase.
                      href="#"
                      className="font-medium underline underline-offset-4 hover:text-foreground"
                    >
                      M. Rodríguez
                    </a>
                  }
                />
                <HoverCardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-serif text-base font-medium">M. Rodríguez</div>
                      <Badge variant="secondary">Placed</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Frontend Engineer · US remote · 2026-03-14
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                          Δ / mo
                        </span>
                        <span className="font-mono text-sm tabular-nums">+$3,120</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                          Days
                        </span>
                        <span className="font-mono text-sm tabular-nums">41</span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>{" "}
              signed a remote contract on 2026-03-14.
            </p>
          </div>
        </section>

        <Separator />

        {/* COMMAND */}
        <section className="flex flex-col gap-5">
          <Eyebrow no="VIII" label="Command — palette inside Dialog" />
          <Card size="sm">
            <CardHeader>
              <CardTitle>Command palette</CardTitle>
              <CardDescription>
                The standard shadcn pattern — Command inside a Dialog.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <Button variant="outline" onClick={() => setCommandOpen(true)}>
                Open command palette
              </Button>
            </CardContent>
          </Card>
          <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
            <CommandInput placeholder="Search commands, students, companies…" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Navigation">
                <CommandItem>
                  <UserIcon />
                  Go to student profile
                </CommandItem>
                <CommandItem>
                  <BriefcaseIcon />
                  Go to applications
                </CommandItem>
                <CommandItem>
                  <FileTextIcon />
                  Go to placements ledger
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Actions">
                <CommandItem>
                  <SettingsIcon />
                  Open cohort settings
                </CommandItem>
                <CommandItem>
                  <FileTextIcon />
                  Export placement ledger (CSV)
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </section>
      </div>
    </TooltipProvider>
  );
}
