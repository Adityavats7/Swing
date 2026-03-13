"use client";

/**
 * Stores Playground Page
 * --------------------------------
 * Purpose:
 * - Sanity test Stores feature
 * - Verify hook + service + UI integration
 * - Experiment safely without touching real pages
 *
 * Rules:
 * - No business routing
 * - No auth
 * - No production logic
 */

import { useMemo, useState } from "react";

// Feature hook + component
import { useStores } from "@/features/stores/hooks/useStores";
import { StoreCard } from "@/features/stores/components/StoreCard";

// Shared UI
import {
  TextField,
  Button,
  Skeleton,
  EmptyState,
  ErrorState,
} from "@/shared_UI";

export default function StoresPlaygroundPage() {
  /* ---------------------------------
   * LOCAL STATE (PLAYGROUND ONLY)
   * --------------------------------- */

  const [search, setSearch] = useState("");
  const [touched, setTouched] = useState(false);

  /* ---------------------------------
   * FEATURE HOOK
   * --------------------------------- */

  const { stores, loading, error, refresh } = useStores({
    query: search || undefined,
    openOnly: false,
  });

  /* ---------------------------------
   * DERIVED STATE
   * --------------------------------- */

  const inputError =
    touched && search.length > 0 && search.length < 2
      ? "Enter at least 2 characters to search"
      : undefined;

  const hasResults = stores.length > 0;

  /* ---------------------------------
   * RENDER
   * --------------------------------- */

  return (
    <main className="mx-auto max-w-7xl p-6 space-y-6">
      {/* HEADER */}
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">
          Stores Playground
        </h1>
        <p className="text-gray-600">
          This page is a sandbox to test the Stores feature
          without touching real application routes.
        </p>
      </header>

      {/* CONTROLS */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <TextField
          label="Search stores"
          placeholder="Type store name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={() => setTouched(true)}
          error={inputError}
        />

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
            onClick={refresh}
          >
            Refresh
          </Button>
        </div>
      </section>

      {/* STATES */}
      {loading && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-56 rounded-2xl"
            />
          ))}
        </section>
      )}

      {!loading && error && (
        <ErrorState
          message={error}
          onRetry={refresh}
        />
      )}

      {!loading && !error && !hasResults && (
        <EmptyState
          title="No stores found"
          description="Try a different search term or refresh."
          actionLabel="Refresh"
          onAction={refresh}
        />
      )}

      {/* STORE GRID */}
      {!loading && !error && hasResults && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onViewStore={(s) =>
                alert(`View store: ${s.name}`)
              }
              onQuickAdd={(s) =>
                alert(`Quick add from: ${s.name}`)
              }
            />
          ))}
        </section>
      )}
    </main>
  );
}