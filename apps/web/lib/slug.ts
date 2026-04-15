const MAX_SLUG_LEN = 48;
const SLUG_SUFFIX_LEN = 6;

export function slugify(raw: string): string {
  const ascii = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const lowered = ascii.toLowerCase();
  const normalized = lowered.replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-");
  const trimmed = normalized.replace(/^-+|-+$/g, "");
  return trimmed.slice(0, MAX_SLUG_LEN).replace(/-+$/, "");
}

export function generatePublicSlug(name: string): string {
  const base = slugify(name);
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, SLUG_SUFFIX_LEN);
  if (base.length === 0) return `user-${suffix}`;
  return `${base}-${suffix}`;
}
