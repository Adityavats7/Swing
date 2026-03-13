import type { NearbyStoresResponse } from "./types/types";

export async function fetchNearbyStores(q?: string): Promise<NearbyStoresResponse> {
  const url = new URL("/api/stores/nearby", window.location.origin);
  if (q) url.searchParams.set("q", q);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`GET /api/stores/nearby -> ${res.status}`);
  return res.json();
}