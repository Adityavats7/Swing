"use client";

import { useMemo, useState } from "react";
import { useStores } from "@/features/stores/hooks/useStores";
import { StoreCard } from "@/features/stores/components/StoreCard";
import { TextField, Button, Skeleton, EmptyState, ErrorState } from "@/shared_UI";
import type { StoreSortBy, SortDirection } from "@/features/stores/types/types";

export default function StoresPlaygroundPage() {
  const [search, setSearch] = useState("");
  const [touched, setTouched] = useState(false);
  const [pageSizeInput, setPageSizeInput] = useState<string>("6");
  const pageSize = Math.max(1, Number(pageSizeInput || 6));

  const [sortBy, setSortBy] = useState<StoreSortBy>("DISTANCE");
  const [sortDir, setSortDir] = useState<SortDirection>(sortBy === "RATING" ? "DESC" : "ASC");

  const { stores, loading, error, hasMore, refresh, loadMore, page, total } = useStores({
    query: search || undefined,
    pageSize,
    sortBy,
    sortDir
  });

  const inputError =
    touched && search.length > 0 && search.length < 2 ? "Enter at least 2 characters to search" : undefined;

  const hasResults = stores.length > 0;

  const headerNote = useMemo(() => {
    if (loading && page === 1) return "Loading…";
    if (error) return "Failed to load.";
    if (!hasResults) return "No results.";
    return `${stores.length} / ${total} shown • page ${page} • pageSize ${pageSize} • sort ${sortBy} ${sortDir}`;
  }, [loading, error, hasResults, stores.length, total, page, pageSize, sortBy, sortDir]);

  return (
    <main className="mx-auto max-w-7xl p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Stores Playground</h1>
        <p className="text-gray-600">Sanity testing: search, page size, sort, load more.</p>
        <div className="text-sm text-gray-500">{headerNote}</div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <TextField
          label="Search"
          placeholder="Type store name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={() => setTouched(true)}
          error={inputError}
        />

        <div className="w-full">
          <TextField
            label="Page size"
            type="number"
            min={1}
            value={pageSizeInput}
            onChange={(e) => setPageSizeInput(e.target.value)}
          />
        </div>

        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-gray-800">Sort by</label>
          <select
            className="block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
            value={sortBy}
            onChange={(e) => {
              const v = e.target.value as StoreSortBy;
              setSortBy(v);
              setSortDir(v === "RATING" ? "DESC" : "ASC");
            }}
          >
            <option value="DISTANCE">Distance (ASC)</option>
            <option value="ETA">ETA (ASC)</option>
            <option value="RATING">Rating (DESC)</option>
            <option value="PRICE">Price (ASC)</option>
            <option value="RELEVANCE">Relevance</option>
          </select>
        </div>

        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-gray-800">Direction</label>
          <select
            className="block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none"
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value as SortDirection)}
          >
            <option value="ASC">Asc</option>
            <option value="DESC">Desc</option>
          </select>
        </div>
      </section>

      <section className="flex gap-2">
        <Button
          variant="ghost"
          onClick={() => {
            setSearch("");
            setTouched(false);
          }}
        >
          Clear
        </Button>
        <Button variant="secondary" onClick={refresh}>
          Refresh
        </Button>
      </section>

      {loading && page === 1 && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: pageSize }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-2xl" />
          ))}
        </section>
      )}

      {!loading && error && <ErrorState message={error} onRetry={refresh} />}

      {!loading && !error && !hasResults && (
        <EmptyState
          title="No stores found"
          description="Try a different search or refresh."
          actionLabel="Refresh"
          onAction={refresh}
        />
      )}

      {!loading && !error && hasResults && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onViewStore={(s) => alert(`View: ${s.name}`)}
                onQuickAdd={(s) => alert(`Quick add from: ${s.name}`)}
              />
            ))}
          </section>

          <div className="flex justify-center">
            <Button variant="secondary" onClick={loadMore} disabled={loading || !hasMore}>
              {loading ? "Loading…" : hasMore ? "Load more" : "No more results"}
            </Button>
          </div>
        </>
      )}
    </main>
  );
}