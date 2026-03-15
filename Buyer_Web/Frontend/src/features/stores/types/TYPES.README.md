
# Stores Feature — Domain Contract (`types.ts`)

## Purpose
The `types.ts` file defines the **domain contract** for the Stores feature. It answers a single, critical question:

> **What is a Store in our system?**

This file is the **single source of truth** for data shape used by:
- UI components
- Feature logic
- API integration
- Backend communication
- Long-term scalability

---

## What `types.ts` Is Responsible For

✅ Defining domain entities (e.g., `Store`)
✅ Defining enums / union types (e.g., `StockStatus`, `StoreCategory`)
✅ Defining value objects (e.g., `DeliveryInfo`, `GeoLocation`)
✅ Defining API response contracts
✅ Defining lightweight UI-friendly derived types

This file must remain **pure and stable**.

---

## What `types.ts` Must NOT Contain

❌ React components
❌ Hooks
❌ API calls or fetch logic
❌ UI styling or class names
❌ Business rules or calculations
❌ Temporary hacks or feature flags

If any of the above appear here, the architecture is broken.

---

## Role as Backend ↔ Frontend Contract

`types.ts` acts as a formal agreement between frontend and backend.

- Backend responses must conform to these types
- Frontend logic relies on these shapes without guessing
- Type mismatches are caught early by TypeScript

This dramatically reduces runtime bugs when the backend evolves.

---

## Why This Matters at Scale

As users, data, and developers grow:
- Codebases become complex
- APIs evolve frequently
- Teams change

A strong domain contract ensures:
- Safe refactoring
- Predictable UI behavior
- Faster onboarding for new developers
- Minimal regressions during releases

This is how production systems survive growth.

---

## Design Principles Used

### Explicit Status Types

Instead of booleans:

```ts
isOpen: boolean; // ❌
```

We use explicit states:

```ts
openStatus: "OPEN" | "CLOSED" | "BUSY"; // ✅
```

Benefits:
- Self-documenting
- Extensible
- Avoids boolean complexity

---

### Normalized Inventory Status

```ts
stockStatus: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
```

Benefits:
- Simplifies UI logic
- Centralizes business meaning
- Easy to extend (e.g., `PREORDER`)

---

### Value Objects Over Primitives

Instead of scattering related fields:

```ts
etaMins: number;
distanceKm: number;
```

We group them:

```ts
delivery: DeliveryInfo;
```

Benefits:
- Clear ownership
- Easier validation
- Cleaner APIs

---

## Safe Extension Guidelines

✅ Add optional fields
✅ Add new enum values
✅ Add new value objects

Example:

```ts
offers?: StoreOffer[];
operatingHours?: StoreHours;
```

❌ Avoid renaming or removing existing fields
❌ Avoid changing field meaning silently

Breaking changes must be versioned and migrated deliberately.

---

## How UI Should Use These Types

✅ Correct:

```ts
function StoreCard({ store }: { store: Store }) {}
```

❌ Incorrect:

```ts
function StoreCard({ name, eta }: any) {}
```

UI must consume domain types, not redefine them.

---
## Listing Contracts (Sorting & Pagination)

- `StoreSortBy`: `"RELEVANCE" | "DISTANCE" | "ETA" | "RATING" | "PRICE"`
- `SortDirection`: `"ASC" | "DESC"`
- `PageParams`: `{ page?: number; pageSize?: number }`
- `StoreSearchParams`: adds `sortBy`, `sortDir`, plus page params
- `PagedStoresResponse`: `{ stores, total, page, pageSize, hasMore }`

**Notes**
- `RATING` defaults to **DESC** (higher first), others default to **ASC**.
- Keep `NearbyStoresResponse` temporarily for backwards compatibility; migrate to `PagedStoresResponse` incrementally.

---
## Relationship With Other Layers

| Layer | Responsibility |
|------|---------------|
| `types.ts` | What data looks like |
| `store.service.ts` | Where data comes from |
| `useStores.ts` | How data is managed |
| `StoreCard.tsx` | How data is displayed |
| `stores/page.tsx` | User interaction |

Dependencies must flow downward only.

---

## Long-Term Vision

This file supports:
- REST or GraphQL APIs
- Microservices
- Caching layers
- Multi-city and multi-country rollout
- Feature flags

Without requiring UI rewrites.

---

## Final Rule

> If you are unsure where a field belongs, it likely belongs in `types.ts`.

And if logic creeps in:

> Stop and move it to the service or hook layer.

---

## Versioning

- v1.0.0 — Initial domain contract for Stores feature
