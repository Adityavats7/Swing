
# Playground Folder — UI & Feature Testing Area

## Purpose
The `playground` folder exists as a **safe, isolated testing environment** for UI components and features during development.

It allows developers to:
- Test components and features visually
- Perform sanity checks
- Experiment freely
- Avoid polluting real application pages
- Keep Git history clean and reviewable

> **Rule:** Nothing inside `playground` is considered production UI.

---

## Why the Playground Exists

Using real pages (e.g. `Home_Page`) for testing causes:
- Noisy Git commits
- Accidental production changes
- Confusing PR reviews
- Forgotten temporary code

The playground solves this by providing **explicit, disposable routes** meant only for development.

---

## Location

```
src/app/playground/
```

Because this folder lives under `app/`, Next.js automatically creates routes from it.

---

## Folder Structure

```
src/app/playground/
├── components/
│   └── page.tsx      # Test shared_UI components
│
├── stores/
│   └── page.tsx      # Test Stores feature (hooks + StoreCard)
│
└── README.md         # This document
```

---

## What Goes Inside Playground

### ✅ Allowed
- Shared UI testing (`Button`, `Card`, `Dialog`, etc.)
- Feature integration testing (`useStores`, `StoreCard`, etc.)
- Temporary mock data
- Visual sanity checks
- UX exploration

### ❌ Not Allowed
- Real navigation flows
- Business-critical logic
- API contracts
- Authentication logic
- Permanent state

---

## Route Examples

| URL | Purpose |
|----|--------|
| `/playground/components` | Test shared UI components |
| `/playground/stores` | Test Stores feature |

These routes are **not linked** from production pages.

---

## Git & Collaboration Rules

- Playground changes should be committed separately:
  - `test(playground): add stores demo`
- Never mix playground code with production changes
- Reviewers can safely ignore playground commits if needed

---

## Dev‑Only Safety (Optional)

Before production deployment, playground routes can be:
- Deleted
- Disabled
- Guarded behind `NODE_ENV !== 'production'`

Example guard:

```ts
if (process.env.NODE_ENV === "production") {
  notFound();
}
```

---

## Relationship With Other Layers

```
shared_UI      → reusable UI building blocks
features       → domain logic + composition
playground     → visual testing & exploration
app (pages)    → real user flows
```

The playground **consumes** shared_UI and features, but never the other way around.

---

## Long‑Term Benefits

- Cleaner architecture
- Faster development
- Safer refactors
- Easier onboarding
- Predictable codebase growth

---

## Final Rule

> If you are "just testing" or "trying something out" — it belongs in the **playground**.

Never modify real pages for experiments.

---

## Versioning

- v1.0.0 — Initial playground guidelines
