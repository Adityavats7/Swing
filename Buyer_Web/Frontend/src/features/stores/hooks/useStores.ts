"use client";

import { useEffect, useRef, useState } from "react";
import type { Store, StoreSearchParams } from "../types/types";
import { getNearbyStores } from "../store.service";

export type UseStoresResult = {
  stores: Store[];
  loading: boolean;
  isFetchingMore: boolean;
  error: string | null;
  hasMore: boolean;
  refresh: () => void;
  loadMore: () => void;
  page: number;
  pageSize: number;
  total: number;
};

export function useStores(
  params?: Omit<StoreSearchParams, "page" | "pageSize"> & { pageSize?: number }
): UseStoresResult {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = Math.max(1, params?.pageSize ?? 12);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const mountedRef = useRef(false);
  const paramsKey = JSON.stringify(params ?? {});

  useEffect(() => {
    mountedRef.current = true;
    fetchPage(1, true);
    return () => {
      mountedRef.current = false;
    };
  }, [paramsKey]);

  async function fetchPage(nextPage: number, reset: boolean) {
    if (reset) setLoading(true);
    else setIsFetchingMore(true);

    setError(null);

    try {
      const res = await getNearbyStores({
        ...(params ?? {}),
        page: nextPage,
        pageSize,
      });

      if (!mountedRef.current) return;

      setPage(res.page);
      setTotal(res.total);
      setHasMore(res.hasMore);
      setStores((prev) => (reset ? res.stores : [...prev, ...res.stores]));
    } catch {
      if (!mountedRef.current) return;
      setError("Failed to load stores");
    } finally {
      if (!mountedRef.current) return;
      setLoading(false);
      setIsFetchingMore(false);
    }
  }

  return {
    stores,
    loading,
    isFetchingMore,
    error,
    hasMore,
    page,
    pageSize,
    total,
    refresh: () => fetchPage(1, true),
    loadMore: () => hasMore && fetchPage(page + 1, false),
  };
}