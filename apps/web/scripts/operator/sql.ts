import { sql } from "drizzle-orm";
import { z } from "zod";

import { parseFlags } from "./_shared/args";
import { db } from "@/db/client";
import { logDone, logError } from "./_shared/logger";

const flagsSchema = z.object({
  query: z.string().min(1),
  write: z.preprocess((v) => v === true || v === "true", z.boolean().default(false)),
  destructive: z.preprocess((v) => v === true || v === "true", z.boolean().default(false)),
});

// Keywords that indicate a write operation
const WRITE_KEYWORDS = [
  "INSERT",
  "UPDATE",
  "DELETE",
  "DROP",
  "TRUNCATE",
  "ALTER",
  "CREATE",
  "UPSERT",
  "MERGE",
] as const;

// Extra-dangerous keywords that need --destructive
const DESTRUCTIVE_KEYWORDS = ["DROP", "TRUNCATE", "ALTER"] as const;

function containsKeyword(query: string, keywords: readonly string[]): string | null {
  const upper = query.toUpperCase();
  for (const kw of keywords) {
    // Match keyword at word boundary (preceded by whitespace or start, followed by whitespace)
    const pattern = new RegExp(`(^|\\s)${kw}(\\s|$)`);
    if (pattern.test(upper)) return kw;
  }
  return null;
}

async function main(): Promise<void> {
  const flags = parseFlags(flagsSchema);

  // --- Read-only gate ---------------------------------------------------------
  const writeKeyword = containsKeyword(flags.query, WRITE_KEYWORDS);
  if (writeKeyword && !flags.write) {
    logError(
      "write_rejected",
      `Query contains "${writeKeyword}" but --write flag not set. ` +
        "Add --write to execute mutations.",
      { keyword: writeKeyword },
    );
  }

  // --- Destructive gate -------------------------------------------------------
  const destructiveKeyword = containsKeyword(flags.query, DESTRUCTIVE_KEYWORDS);
  if (destructiveKeyword && !flags.destructive) {
    logError(
      "destructive_rejected",
      `Query contains "${destructiveKeyword}" which requires both --write and --destructive flags.`,
      { keyword: destructiveKeyword },
    );
  }

  // --- Write confirmation -----------------------------------------------------
  if (flags.write) {
    process.stderr.write(`\n--- WRITE QUERY ---\n${flags.query}\n--- end ---\n\n`);

    // Run EXPLAIN for row count estimate
    try {
      const explainRows = await db.execute(
        sql.raw(`EXPLAIN ${flags.query}`),
      );
      process.stderr.write("EXPLAIN output:\n");
      for (const row of explainRows) {
        const queryPlan = (row as Record<string, unknown>)["QUERY PLAN"];
        if (typeof queryPlan === "string") {
          process.stderr.write(`  ${queryPlan}\n`);
        }
      }
    } catch {
      process.stderr.write("  (EXPLAIN failed -- query may have syntax errors)\n");
    }

    process.stderr.write(
      `\nType CONFIRM to execute the write query: `,
    );

    const confirmation = await readLine();
    if (confirmation.trim() !== "CONFIRM") {
      logError("aborted", "Write query not confirmed by operator", {
        query_preview: flags.query.slice(0, 100),
      });
    }
  }

  // --- Execute ----------------------------------------------------------------
  let rows: Array<unknown>;
  try {
    rows = await db.execute(sql.raw(flags.query));
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    logError("query_failed", `SQL execution failed: ${message}`, {
      query_preview: flags.query.slice(0, 100),
    });
  }

  // --- Output results ---------------------------------------------------------
  const rowCount = rows.length;
  const sample = rows.slice(0, 20);

  // Print results as a table-like format to stderr for readability
  if (rowCount > 0) {
    const first = sample[0];
    if (first && typeof first === "object") {
      const keys = Object.keys(first as Record<string, unknown>);
      process.stderr.write(`\nColumns: ${keys.join(", ")}\n`);
      process.stderr.write(`Rows returned: ${rowCount}\n\n`);

      for (const row of sample) {
        const obj = row as Record<string, unknown>;
        const values = keys.map((k) => `${k}=${String(obj[k] ?? "NULL")}`).join(" | ");
        process.stderr.write(`  ${values}\n`);
      }

      if (rowCount > 20) {
        process.stderr.write(`  ... (${rowCount - 20} more rows)\n`);
      }
    }
  } else {
    process.stderr.write("\nNo rows returned.\n");
  }

  logDone({
    rows_returned: rowCount,
    write_mode: flags.write,
    query_preview: flags.query.slice(0, 100),
  });
}

function readLine(): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    const onData = (chunk: string) => {
      data += chunk;
      if (data.includes("\n")) {
        process.stdin.removeListener("data", onData);
        process.stdin.pause();
        resolve(data.split("\n")[0] ?? "");
      }
    };
    process.stdin.on("data", onData);
    process.stdin.resume();
  });
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  logError("unhandled", message);
});
