import type { Metadata } from "next";

type MetadataContent = Record<string, unknown>;

function cleanText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;

  const text = value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();

  return text || undefined;
}

function firstText(content: MetadataContent, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = cleanText(content[key]);
    if (value) return value;
  }

  return undefined;
}

export function createPageMetadata(
  content: unknown,
  fallbackTitle: string,
  fallbackDescription: string,
): Metadata {
  const values =
    content && typeof content === "object"
      ? (content as MetadataContent)
      : {};
  const title =
    firstText(values, ["meta_title", "seo_title", "page_title", "title", "name"]) ??
    fallbackTitle;
  const description =
    firstText(values, [
      "meta_description",
      "seo_description",
      "description",
      "message",
    ]) ?? fallbackDescription;
  const conciseDescription = description.slice(0, 160);

  return {
    title,
    description: conciseDescription,
    openGraph: {
      title,
      description: conciseDescription,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: conciseDescription,
    },
  };
}
