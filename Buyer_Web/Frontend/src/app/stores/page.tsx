"use client";


import { useMemo, useState } from "react";
import { useStores } from "@/features/stores/hooks/useStores";
import { StoreCard } from "@/features/stores/components/StoreCard";

// shared UI
import {
  TextField,
  Button,
  Skeleton,
  EmptyState,
  ErrorState,
  Badge,
} from "@/shared_UI";

// Optional: UX sugar — a very small toggle control using Button
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <Button
      variant={checked ? "secondary" : "ghost"}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
    >
      {label} {checked && <Badge variant="success" className="ml-2">On</Badge>}
    </Button>
  );
}

export default function StoresPage() {
  // Basic search + "open only" toggle
  const [query, setQuery] = useState("");
  const [touched, setTouched] = useState(false);
  const [openOnly, setOpenOnly] = useState(false);

  // validate query (you can replace with Zod later)
  const queryError =
    touched && query.trim().length > 0 && query.trim().length < 2
      ? "Enter at least 2 characters to search"
      : undefined;

  // Hook: typed, production-ready data pipeline
  const { stores, loading, error, refresh } = useStores({
    query: query || undefined,
    openOnly,
  });

  const hasResults = stores.length > 0;

  // derived label
  const headerNote = useMemo(() => {
    if (loading) return "Finding nearby stores…";
    if (error) return "We couldn't load stores right now.";
    if (!hasResults) return "No stores match the current filters.";
    return `${stores.length} store${stores.length > 1 ? "s" : ""} found`;
  }, [loading, error, hasResults, stores.length]);

  return (
    <main className="mx-auto max-w-7xl p-6 space-y-6">
      {/* Page heading */}
      <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Stores</h1>
        <p className="mt-1 text-gray-600">
          Browse nearby stores with live availability and quick ETAs.
        </p>
        <div className="mt-3 text-sm text-gray-500">{headerNote}</div>
      </header>

      {/* Controls */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <TextField
            label="Search stores"
            placeholder="Type store name…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => setTouched(true)}
            error={queryError}
          />
        </div>

        <div className="flex gap-2">
          <Toggle checked={openOnly} onChange={setOpenOnly} label="Open only" />

          <Button variant="ghost" onClick={() => { setQuery(""); setTouched(false); setOpenOnly(false); }}>
            Clear
          </Button>

          <Button variant="secondary" onClick={refresh}>
            Refresh
          </Button>
        </div>
      </section>

      {/* Data states */}
      {loading && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-2xl" />
          ))}
        </section>
      )}

      {!loading && error && <ErrorState message={error} onRetry={refresh} />}

      {!loading && !error && !hasResults && (
        <EmptyState
          title="No stores found"
          description="Try a different search term, disable filters, or refresh."
          actionLabel="Refresh"
          onAction={refresh}
        />
      )}

      {/* Store grid */}
      {!loading && !error && hasResults && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onViewStore={(s) => alert(`View store: ${s.name}`)}
              onQuickAdd={(s) => alert(`Quick add from: ${s.name}`)}
            />
          ))}
        </section>
      )}
    </main>
  );
}