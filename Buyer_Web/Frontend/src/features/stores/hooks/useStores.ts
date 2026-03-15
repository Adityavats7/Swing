"use client";

import { useEffect, useRef, useState } from "react";
import type { Store, StoreSearchParams } from "../types/types";
import { getNearbyStores } from "../store.service";

export type UseStoresResult = {
  stores: Store[];
  loading: boolean;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(Math.max(1, params?.pageSize ?? 12));
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  const mountedRef = useRef<boolean>(false);
  const lastParamsRef = useRef<string>("");
  const signature = JSON.stringify({
    query: params?.query ?? null,
    category: params?.category ?? null,
    maxDistanceKm: params?.maxDistanceKm ?? null,
    openOnly: params?.openOnly ?? null,
    tags: params?.tags ?? null,
    sortBy: params?.sortBy ?? null,
    sortDir: params?.sortDir ?? null,
    pageSize,
  });

  useEffect(() => {
    mountedRef.current = true;
    lastParamsRef.current = signature;
    void fetchPage(1);
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mountedRef.current) return;
    if (lastParamsRef.current !== signature) {
      setStores([]);
      setPage(1);
      setHasMore(false);
      setTotal(0);
      lastParamsRef.current = signature;
      void fetchPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  async function fetchPage(nextPage: number) {
    setLoading(true);
    setError(null);
    try {
      const res = await getNearbyStores({ ...(params ?? {}), page: nextPage, pageSize });
      if (!mountedRef.current) return;
      setPage(res.page);
      setHasMore(res.hasMore);
      setTotal(res.total);
      setStores((prev) => (nextPage === 1 ? res.stores : [...prev, ...res.stores]));
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err.message : "Failed to load stores");
    } finally {
      if (!mountedRef.current) return;
      setLoading(false);
    }
  }

  const refresh = () => {
    setStores([]);
    void fetchPage(1);
  };

  const loadMore = () => {
    if (loading || !hasMore) return;
    void fetchPage(page + 1);
  };

  return { stores, loading, error, hasMore, refresh, loadMore, page, pageSize, total };
}