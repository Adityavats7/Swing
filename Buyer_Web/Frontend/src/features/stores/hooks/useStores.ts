"use client";


import { useEffect, useRef, useState } from "react";
import type {
  Store,
  StoreSearchParams,
} from "../types/types";
import { getNearbyStores } from "../store.service";

/* ---------------------------------
 * PUBLIC HOOK API
 * --------------------------------- */

export type UseStoresResult = {
  stores: Store[];
  loading: boolean;
  error: string | null;

  // Controls
  refresh: () => void;
};

export function useStores(params?: StoreSearchParams): UseStoresResult {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Used to prevent state updates on unmounted component
  const mountedRef = useRef<boolean>(false);

  // Used to re-trigger fetch manually
  const refreshIndexRef = useRef<number>(0);

  /* ---------------------------------
   * DATA FETCH LOGIC
   * --------------------------------- */

  const fetchStores = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getNearbyStores(params);

      if (!mountedRef.current) return;

      setStores(response.stores);
    } catch (err) {
      if (!mountedRef.current) return;

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load stores"
      );
    } finally {
      if (!mountedRef.current) return;

      setLoading(false);
    }
  };

  /* ---------------------------------
   * EFFECTS
   * --------------------------------- */

  // Initial mount & param change
  useEffect(() => {
    mountedRef.current = true;
    fetchStores();

    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params), refreshIndexRef.current]);

  /* ---------------------------------
   * PUBLIC ACTIONS
   * --------------------------------- */

  const refresh = () => {
    refreshIndexRef.current += 1;
    fetchStores();
  };

  return {
    stores,
    loading,
    error,
    refresh,
  };
}