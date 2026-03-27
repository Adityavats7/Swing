"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStores } from "@/features/stores/hooks/useStores";
import { StoreCard } from "@/features/stores/components/StoreCard";
import { TextField, Button, Skeleton, EmptyState, ErrorState } from "@/shared_UI";
import type { StoreSortBy, SortDirection } from "@/features/stores/types/types";

/**
 * StoresPlaygroundPage
 *
 * Purpose:
 * - UX sandbox for Stores feature
 * - Validate pagination, sorting, refresh and scroll behavior
 *
 * Key UX Behaviors Implemented:
 * 1. Browser-like LOCAL refresh (without full page reload)
 * 2. Pagination with bottom-only loading skeletons
 * 3. Smooth scroll reveal when new items are appended
 *
 * Architecture Notes:
 * - Data lifecycle handled by useStores()
 * - Scroll & UX forcing handled ONLY here
 * - This file is allowed to be UX-heavy (playground only)
 */
export default function StoresPlaygroundPage() {
  /* --------------------------------------------------
   * Input & control state
   * -------------------------------------------------- */
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [touched, setTouched] = useState(false);
  const [pageSizeInput, setPageSizeInput] = useState("6");

  const [sortBy, setSortBy] = useState<StoreSortBy>("DISTANCE");
  const [sortDir, setSortDir] = useState<SortDirection>(
    sortBy === "RATING" ? "DESC" : "ASC"
  );

  /**
   * forceReload
   * Forces the UI into an "initial load" state
   * to mimic browser refresh behavior for stores only.
   */
  const [forceReload, setForceReload] = useState(false);

  const pageSize = Math.max(1, Number(pageSizeInput || 6));

  /* --------------------------------------------------
   * Anchor used to smoothly reveal newly appended items
   * -------------------------------------------------- */
  const appendAnchorRef = useRef<HTMLDivElement | null>(null);
  const prevCountRef = useRef(0);

  /* --------------------------------------------------
   * Feature hook
   * -------------------------------------------------- */
  const {
    stores,
    loading,          // initial load
    isFetchingMore,   // pagination append
    error,
    hasMore,
    loadMore,
    refresh,
    page,
    total,
  } = useStores({
    query: search || undefined,
    pageSize,
    sortBy,
    sortDir,
  });

  const hasResults = stores.length > 0;

  /* --------------------------------------------------
   * End forced reload once fresh data is available
   * -------------------------------------------------- */
  useEffect(() => {
    if (forceReload && !loading) {
      setForceReload(false);
    }
  }, [forceReload, loading]);

  /* --------------------------------------------------
   * Smooth scroll reveal after pagination append
   *
   * When new items are appended:
   * - Detect increase in item count
   * - Scroll smoothly to anchor below existing items
   * -------------------------------------------------- */
  useEffect(() => {
    if (
      !isFetchingMore &&
      stores.length > prevCountRef.current
    ) {
      appendAnchorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    prevCountRef.current = stores.length;
  }, [stores.length, isFetchingMore]);

  const inputError =
    touched && search.length > 0 && search.length < 2
      ? "Enter at least 2 characters"
      : undefined;

  /* --------------------------------------------------
   * Header status message
   * -------------------------------------------------- */
  const headerNote = useMemo(() => {
    if ((loading && !hasResults) || forceReload)
      return "Refreshing stores…";

    if (error) return "Failed to load stores";
    if (!hasResults) return "No stores found";

    return `${stores.length} / ${total} shown | page ${page}`;
  }, [loading, error, hasResults, stores.length, total, page, forceReload]);

  return (
    <main className="mx-auto max-w-7xl p-6 space-y-6">
      {/* --------------------------------------------------
       * Header
       * -------------------------------------------------- */}
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Stores Playground</h1>
        <p className="text-gray-600">
          Pagination, sorting, refresh and scroll UX validation.
        </p>
        <div className="text-sm text-gray-500">{headerNote}</div>
      </header>

      {/* --------------------------------------------------
       * Playground controls
       * -------------------------------------------------- */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <TextField
          label="Search"
          placeholder="Store name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={() => setTouched(true)}
          error={inputError}
        />

        <TextField
          label="Page size"
          type="number"
          min={1}
          value={pageSizeInput}
          onChange={(e) => setPageSizeInput(e.target.value)}
        />

        <select
          className="w-full rounded-xl border px-3 py-2 text-sm"
          value={sortBy}
          onChange={(e) => {
            const v = e.target.value as StoreSortBy;
            setSortBy(v);
            setSortDir(v === "RATING" ? "DESC" : "ASC");
          }}
        >
          <option value="DISTANCE">Distance</option>
          <option value="ETA">ETA</option>
          <option value="RATING">Rating</option>
          <option value="PRICE">Price</option>
          <option value="RELEVANCE">Relevance</option>
        </select>

        <select
          className="w-full rounded-xl border px-3 py-2 text-sm"
          value={sortDir}
          onChange={(e) =>
            setSortDir(e.target.value as SortDirection)
          }
        >
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
      </section>

      {/* --------------------------------------------------
       * Action buttons
       * -------------------------------------------------- */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          onClick={() => {
            setSearch("");
            setTouched(false);
          }}
        >
          Clear
        </Button>

        <Button
          variant="secondary"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setForceReload(true);
            refresh();
          }}
        >
          Refresh
        </Button>
      </div>

      {/* --------------------------------------------------
       * Initial / refresh skeleton loaders
       * -------------------------------------------------- */}
      {(forceReload || (loading && !hasResults)) && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: pageSize }).map((_, i) => (
            <Skeleton key={`reload-${i}`} className="h-56 rounded-2xl" />
          ))}
        </section>
      )}

      {/* --------------------------------------------------
       * Error state
       * -------------------------------------------------- */}
      {!loading && error && (
        <ErrorState message={error} onRetry={refresh} />
      )}

      {/* --------------------------------------------------
       * Empty state
       * -------------------------------------------------- */}
      {!loading && !error && !hasResults && !forceReload && (
        <EmptyState
          title="No stores found"
          description="Try changing the search or refresh."
          actionLabel="Refresh"
          onAction={refresh}
        />
      )}

      {/* --------------------------------------------------
       * Store grid & pagination
       * -------------------------------------------------- */}
      {hasResults && !forceReload && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onViewStore={(s) => {
                  router.push(`/playground/stores/${s.slug}`);
                }}
                onQuickAdd={(s) => alert(`Quick add: ${s.name}`)}
              />
            ))}
          </section>

          {/* Pagination-only loading animation */}
          {isFetchingMore && (
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 opacity-60">
              {Array.from({ length: pageSize }).map((_, i) => (
                <Skeleton key={`append-${i}`} className="h-56 rounded-2xl" />
              ))}
            </section>
          )}

          {/* Anchor used for smooth scroll reveal */}
          <div ref={appendAnchorRef} />

          <div className="flex justify-center">
            <Button
              variant="secondary"
              disabled={!hasMore || isFetchingMore}
              onClick={loadMore}
            >
              {isFetchingMore
                ? "Loading more…"
                : hasMore
                  ? "Load more"
                  : "No more stores"}
            </Button>
          </div>
        </>
      )}
    </main>
  );
}