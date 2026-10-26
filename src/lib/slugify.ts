export function slugify(input: string, maxLength = 180): string {
  return input
    .toString()
    .normalize("NFKD")                // split accented chars into base + diacritic
    .replace(/[\u0300-\u036f]/g, "")  // strip the diacritics
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")           // optional: turn & into "and"
    .replace(/[^a-z0-9]+/g, "-")      // anything non-alphanumeric -> hyphen
    .replace(/^-+|-+$/g, "")          // trim leading/trailing hyphens
    .slice(0, maxLength)
    .replace(/-+$/g, "");             // re-trim in case slicing left a trailing hyphen
}