
# Stores Feature — Service Layer (`store.service.ts`)

## Purpose
The `store.service.ts` file is the **data access layer** for the Stores feature. It is responsible for **fetching, transforming, and returning store data** in a consistent, typed format.

This file answers one question:

> **Where does store data come from, and how is it accessed?**

---

## Responsibilities

✅ Fetch store data (mock or real API)
✅ Apply filtering and query logic
✅ Normalize backend responses into domain types
✅ Return strongly typed results
✅ Hide backend/API details from the rest of the app

---

## What `store.service.ts` Must NOT Do

❌ Manage React state
❌ Render UI
❌ Use React hooks
❌ Contain JSX
❌ Know about routes or pages

If any of the above appear here, the architecture is broken.

---

## Position in Architecture

```
types.ts        → defines data shape
store.service.ts→ fetches & prepares data
useStores.ts    → manages state & lifecycle
StoreCard.tsx   → displays data
stores/page.tsx → user interaction
```

The service layer depends **only on types**, never on UI or hooks.

---

## Why a Service Layer Is Critical

Without a service layer:
- Each page fetches data differently
- API changes break multiple files
- Authentication logic spreads everywhere

With a service layer:
- API changes affect one file
- UI remains untouched
- Testing and mocking become easy

This is essential for large applications.

---

## Current Implementation (Mock Mode)

During early development, `store.service.ts` uses mock data:

```ts
const MOCK_STORES: Store[] = [...]
```

This allows UI and feature development **without waiting for backend**.

A simulated network delay ensures realistic loading behavior.

---

## Filtering & Query Logic

Filtering logic lives inside the service:

- Search by name
- Filter by category
- Filter by open status
- Filter by distance
- Filter by tags

This keeps hooks and UI clean and focused.

---
## Sorting & Pagination (Service Contract)

- Input params (from `StoreSearchParams`):
  - `sortBy`: `"RELEVANCE" | "DISTANCE" | "ETA" | "RATING" | "PRICE"`
  - `sortDir`: `"ASC" | "DESC"` (default: `"DESC"` for `RATING`, otherwise `"ASC"`)
  - `page`: 1‑based index (default: `1`)
  - `pageSize`: per‑page count (default: `12`)

- Processing order:
  1) Filter → 2) Sort → 3) Paginate

- Output (`PagedStoresResponse`):
  - `stores`: items for the requested page
  - `total`: total count after filters (before pagination)
  - `page`, `pageSize`
  - `hasMore`: `true` if more items remain

- Notes:
  - `RELEVANCE` currently acts as no-op in mock mode; real scoring can replace it.
  - `PRICE` falls back to `Infinity` if no `featuredPrice` is present.
  - This file is the only place that knows slice/sort details; UI and hooks remain stable.

---
## Transition to Real Backend

When backend APIs are ready, replace the mock implementation with:

```ts
const res = await fetch("/api/stores/nearby");
return await res.json();
```

No UI or hook changes are required.

---

## Error Handling Strategy

The service:
- Throws errors when requests fail
- Returns predictable response shapes

Hooks decide how errors are displayed.

---

## Performance & Scalability

The service layer is the correct place to add:
- Pagination
- Caching
- Debouncing
- Request batching
- Authorization headers

This supports high traffic and large user bases.

---

## Safe Extension Guidelines

✅ Add new filter parameters
✅ Add pagination support
✅ Add authentication headers
✅ Add response normalization

❌ Avoid embedding UI logic
❌ Avoid mutating data in place

---

## Testing Strategy

Because this file has no React dependencies, it is easy to:
- Unit test
- Mock responses
- Simulate edge cases

---

## Final Rule

> All store data must flow through `store.service.ts`.

If UI needs data and this file is bypassed, the architecture is broken.

---

## Versioning

- v1.0.0 — Initial service layer with mock data and filtering
