export interface InfoItem {
  key: string;
  value: string | null;
  image: string | null;
  url?: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function getInfoValue(value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (!Array.isArray(value)) {
    return null;
  }

  const valueEntry =
    value.find((entry) => isRecord(entry) && entry.key === "value") ?? value[0];

  if (!isRecord(valueEntry)) {
    return null;
  }

  const values = valueEntry.values;
  if (Array.isArray(values)) {
    return values.map(getString).find((entry) => entry !== null) ?? null;
  }

  return getString(values) ?? getString(valueEntry.value);
}

export function normalizeInfoResponse(response: unknown): InfoItem[] {
  const items = Array.isArray(response)
    ? response
    : isRecord(response) && Array.isArray(response.data)
      ? response.data
      : [];

  return items.flatMap((item): InfoItem[] => {
    if (!isRecord(item) || typeof item.key !== "string") {
      return [];
    }

    const nestedValue = Array.isArray(item.value)
      ? item.value.find((entry) => isRecord(entry) && entry.key === "value") ??
        item.value[0]
      : null;

    return [
      {
        key: item.key,
        value: getInfoValue(item.value),
        image:
          getString(item.image) ??
          (isRecord(nestedValue) ? getString(nestedValue.image) : null),
        url: getString(item.url),
      },
    ];
  });
}
