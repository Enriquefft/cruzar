/**
 * Minimal markdown-to-HTML renderer. Handles the subset used in profile_md
 * and plan_markdown: headings, paragraphs, bold, italic, lists (ordered +
 * unordered), links, inline code, and horizontal rules.
 *
 * No new npm dep required. If the rendering needs grow beyond this subset,
 * replace with `marked` or `react-markdown` (add as dep in that PR).
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderInline(text: string): string {
  let result = escapeHtml(text);

  // inline code (backticks) — must come before bold/italic to avoid conflicts
  result = result.replace(/`([^`]+)`/g, "<code>$1</code>");

  // bold + italic
  result = result.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  // bold
  result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // italic
  result = result.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // links [text](url)
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  return result;
}

function lineAt(lines: ReadonlyArray<string>, idx: number): string {
  return lines[idx] ?? "";
}

function isUl(line: string): boolean {
  return /^[-*+]\s+/.test(line.trim());
}

function isOl(line: string): boolean {
  return /^\d+\.\s+/.test(line.trim());
}

function isSpecialLine(line: string): boolean {
  return (
    /^#{1,6}\s/.test(line) ||
    isUl(line) ||
    isOl(line) ||
    /^---+$/.test(line.trim()) ||
    /^\*\*\*+$/.test(line.trim())
  );
}

export function renderMarkdown(md: string): string {
  const lines = md.split("\n");
  const htmlParts: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lineAt(lines, i);

    // blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // horizontal rule
    if (/^---+$/.test(line.trim()) || /^\*\*\*+$/.test(line.trim())) {
      htmlParts.push("<hr />");
      i++;
      continue;
    }

    // headings
    const headingMatch = /^(#{1,6})\s+(.+)$/.exec(line);
    if (headingMatch) {
      const hashes = headingMatch[1] ?? "#";
      const level = hashes.length;
      const content = headingMatch[2] ?? "";
      htmlParts.push(`<h${level}>${renderInline(content)}</h${level}>`);
      i++;
      continue;
    }

    // unordered list
    if (isUl(line)) {
      const items: string[] = [];
      while (i < lines.length && isUl(lineAt(lines, i))) {
        items.push(
          renderInline(
            lineAt(lines, i)
              .trim()
              .replace(/^[-*+]\s+/, ""),
          ),
        );
        i++;
      }
      htmlParts.push(`<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`);
      continue;
    }

    // ordered list
    if (isOl(line)) {
      const items: string[] = [];
      while (i < lines.length && isOl(lineAt(lines, i))) {
        items.push(
          renderInline(
            lineAt(lines, i)
              .trim()
              .replace(/^\d+\.\s+/, ""),
          ),
        );
        i++;
      }
      htmlParts.push(`<ol>${items.map((item) => `<li>${item}</li>`).join("")}</ol>`);
      continue;
    }

    // paragraph — collect consecutive non-empty, non-special lines
    const paraLines: string[] = [];
    while (i < lines.length) {
      const current = lineAt(lines, i);
      if (current.trim() === "" || isSpecialLine(current)) break;
      paraLines.push(current);
      i++;
    }
    if (paraLines.length > 0) {
      htmlParts.push(`<p>${renderInline(paraLines.join(" "))}</p>`);
    }
  }

  return htmlParts.join("");
}
