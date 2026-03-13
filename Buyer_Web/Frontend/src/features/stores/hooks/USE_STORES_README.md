
# Stores Feature — State & Lifecycle Hook (`useStores.ts`)

## Purpose
The `useStores.ts` file defines the **state and lifecycle management layer** for the Stores feature.

It answers one critical question:

> **How does the UI safely consume store data over time?**

This hook sits between the **service layer** and the **UI layer**.

---

## Responsibilities

✅ Call the service layer (`store.service.ts`)
✅ Manage loading, error, and success states
✅ Handle component lifecycle (mount, update, unmount)
✅ Expose a clean, reusable API to pages and components
✅ Prevent memory leaks and race conditions

---

## What `useStores.ts` Must NOT Do

❌ Render JSX
❌ Contain UI logic or styling
❌ Fetch data directly from APIs
❌ Know about routing or navigation
❌ Contain business presentation rules

If any of the above appear here, responsibilities are mixed incorrectly.

---

## Position in Architecture

```
types.ts            → what data looks like
store.service.ts    → where data comes from
useStores.ts        → how data is managed over time
StoreCard.tsx       → how data is displayed
stores/page.tsx     → how users interact
```

The hook depends only on:
- `types.ts`
- `store.service.ts`

It must never depend on UI components.

---

## Why a Hook Layer Is Essential

Without a hook layer:
- Pages duplicate loading and error handling
- Fetch logic spreads across the app
- Refactoring becomes risky

With a hook layer:
- UI stays clean and declarative
- Logic is reusable across pages
- Data handling is centralized

This pattern is required for scalable frontend systems.

---

## Hook API Design

The hook returns a **state bundle**:

```ts
{
  stores: Store[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}
```

### Why this shape?

- `stores` → actual data
- `loading` → UI skeletons/spinners
- `error` → error boundaries and retries
- `refresh` → manual refetch (retry, pull‑to‑refresh)

This design scales naturally to pagination and infinite scrolling.

---

## Lifecycle Safety (Critical)

The hook protects against a common production bug:

> Updating state after a component has unmounted

It uses an internal `mountedRef` guard to:
- Prevent memory leaks
- Avoid React warnings
- Ensure predictable behavior

This is mandatory in real applications.

---

## Parameterized Fetching

`useStores` accepts typed search parameters:

```ts
useStores(params?: StoreSearchParams)
```

This enables:
- Search queries
- Category filters
- Distance filters
- Open‑only filtering
- Tag‑based filtering

All parameters are validated by TypeScript at compile time.

---

## Manual Refresh Strategy

The hook exposes a `refresh()` method that:
- Triggers a re‑fetch
- Does not require changing parameters
- Supports retry buttons and future pull‑to‑refresh UX

This keeps UI logic simple and declarative.

---

## Error Handling Strategy

- The hook catches errors from the service layer
- Errors are normalized into user‑safe messages
- UI decides how to display them

This separation allows:
- Centralized logging later
- Graceful degradation

---

## Transition to Advanced Data Libraries

When the app grows, `useStores.ts` can be replaced or internally refactored to use:
- React Query
- SWR
- Apollo Client

The UI and feature components **do not need to change**.

---

## Safe Extension Guidelines

✅ Add pagination state (`page`, `pageSize`)
✅ Add sorting options
✅ Add optimistic updates
✅ Add caching logic

❌ Do not add JSX
❌ Do not add UI formatting
❌ Do not call fetch directly

---

## Testing Strategy

Because the hook is isolated:
- The service can be mocked
- Loading and error states can be tested
- Edge cases can be simulated

This improves confidence during refactors.

---

## Final Rule

> All UI components must consume store data through `useStores.ts`.

If a page bypasses this hook, the architecture is violated.

---

## Versioning

- v1.0.0 — Initial state & lifecycle hook for Stores feature
