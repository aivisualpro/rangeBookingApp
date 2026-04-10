import useSWR, { type SWRConfiguration } from "swr";

/**
 * Universal JSON fetcher – throws on non-2xx responses so SWR treats them as errors.
 */
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const json = await res.json();
  return json.data ?? json;
};

/**
 * Thin wrapper around useSWR with sensible defaults for this app:
 *
 *  - `revalidateOnFocus: true` – data refreshes when the user Alt-Tabs back.
 *  - `revalidateOnReconnect: true` – auto-refreshes after network drop.
 *  - `dedupingInterval: 2000` – deduplicates identical requests within 2 s.
 *  - `keepPreviousData: true` – stale data stays on-screen while fresh data loads
 *    → **zero perceived loading on navigation**.
 *
 * The caller still gets `{ data, error, isLoading, isValidating, mutate }`.
 */
export function useAPI<T = any>(
  url: string | null,
  config?: SWRConfiguration
) {
  return useSWR<T>(url, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 2000,
    keepPreviousData: true,
    ...config,
  });
}
