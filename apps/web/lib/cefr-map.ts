import { z } from "zod";
import type { EnglishCertKind } from "@/schemas/_shared";

export const cefrLevels = ["A2", "B1", "B2", "C1", "C2"] as const;
export type CefrLevel = (typeof cefrLevels)[number];
export const cefrLevelSchema = z.enum(cefrLevels);

// Maps an external cert (kind + numeric/string score) to a CEFR level.
// Returns null when the mapping is ambiguous and requires Miura verification.
export function mapCertToCefr(kind: EnglishCertKind, score: string): CefrLevel | null {
  const s = score.trim().toLowerCase();
  switch (kind) {
    case "ielts": {
      const n = Number.parseFloat(s);
      if (Number.isNaN(n)) return null;
      if (n >= 8.0) return "C2";
      if (n >= 6.5) return "C1";
      if (n >= 5.5) return "B2";
      if (n >= 4.0) return "B1";
      return "A2";
    }
    case "toefl": {
      const n = Number.parseInt(s, 10);
      if (Number.isNaN(n)) return null;
      if (n >= 110) return "C2";
      if (n >= 95) return "C1";
      if (n >= 72) return "B2";
      if (n >= 42) return "B1";
      return "A2";
    }
    case "cambridge": {
      if (s.includes("cpe") || s.includes("c2 proficiency")) return "C2";
      if (s.includes("cae") || s.includes("c1 advanced")) return "C1";
      if (s.includes("fce") || s.includes("b2 first")) return "B2";
      if (s.includes("pet") || s.includes("b1 preliminary")) return "B1";
      return null;
    }
    case "aprendly":
    case "other":
      return null;
  }
}

export function meetsB2(level: CefrLevel): boolean {
  return level === "B2" || level === "C1" || level === "C2";
}
