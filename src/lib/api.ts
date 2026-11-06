import { API_URL, REVALIDATE } from "../config/config";

type ApiFetchOptions = Omit<RequestInit, 'cache'> & {
  revalidate?: number;
  cache?: 'no-store' | 'force-cache' | 'default';
};

const DEFAULT_REVALIDATE = Number(REVALIDATE ?? 120);

export async function apiFetch(endpoint: string, options?: ApiFetchOptions) {
  try {
    const { revalidate = DEFAULT_REVALIDATE, cache, headers, ...restOptions } = options ?? {};
    const isServer = typeof window === "undefined";

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(headers as Record<string, string> | undefined),
      },
      ...(cache === 'no-store'
        ? { cache: 'no-store' as const }
        : isServer
          ? { next: { revalidate } }
          : {}),
    });

    // read the body even on failure; Laravel puts validation details there
    let json: any = null;
    try {
      json = await response.json();
    } catch {
      /* empty or non-JSON body */
    }

    if (!response.ok) {
      return {
        data: null,
        error: json?.errors ?? json?.message ?? `Request failed with status ${response.status}`,
      };
    }

    return { data: json, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message ?? 'Unknown error' };
  }
}