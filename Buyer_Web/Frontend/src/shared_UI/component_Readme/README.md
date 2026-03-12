
# Component Readme (Shared UI)

This document centralizes quick, copy‑paste usage and maintenance notes for all **shared UI** components currently in the project. Store it alongside the components so it stays in sync.

> **Scope**: Reusable, presentation‑only components that live under `src/shared_UI/`. Feature‑specific components should live under `src/features/<feature>/` and compose these shared parts.

---

## Prerequisites

- **TailwindCSS** enabled and `globals.css` imported in `src/app/layout.tsx`.
- **Path alias** `@/*` set in `tsconfig.json` (so `@/shared_UI` works).
- **Utilities** helper at `src/lib/utils.ts`:

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- **Packages** (install once):

```bash
npm install class-variance-authority clsx tailwind-merge
```

- **Import pattern** (barrel export):

```ts
import { Button, TextField, Card, Badge, Skeleton, EmptyState, ErrorState, QuantityStepper, Price, StockPill, Sheet, Toast, Tooltip, Dialog } from "@/shared_UI";
```

> If you reorganize internals into subfolders, keep the root barrel `src/shared_UI/index.ts` re‑exporting everything to avoid breaking imports.

---

## 1) Button

**File**: `src/shared_UI/Button.tsx`

**What**: Reusable, accessible button with variants, sizes, full‑width support, loading state and optional icons.

**Key props**
- `variant`: `"primary" | "secondary" | "ghost" | "danger"` (default: `"primary"`)
- `size`: `"sm" | "md" | "lg"` (default: `"md"`)
- `block`: `boolean` (full width)
- `isLoading`: `boolean` (shows spinner & disables)
- `leftIcon` / `rightIcon`: `ReactNode`
- plus all native `<button>` props

**Usage**
```tsx
<Button>Primary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Delete</Button>
<Button size="lg" block>Continue</Button>
<Button isLoading>Saving…</Button>
```

**Extend**
- Add a new visual style inside the CVA `variant` map; use `className` to tweak per‑call.

---

## 2) TextField

**File**: `src/shared_UI/TextField.tsx`

**What**: Accessible text input with label, helper text, error state, and ARIA wiring.

**Key props**
- `label?: string`
- `helperText?: string`
- `error?: string` (sets `aria-invalid` and red styles)
- `fullWidth?: boolean` (default `true`)
- `required?`, `disabled?`
- plus all native `<input>` props

**Usage**
```tsx
<TextField label="Search" placeholder="Type…" helperText="Enter 3+ chars" />
<TextField label="Email" type="email" error="Invalid email" />
```

**Extend**
- Pass `className` for size variants; wrap with form libraries (React Hook Form / Formik) using the forwarded ref.

---

## 3) Card (with sections)

**File**: `src/shared_UI/Card.tsx`

**What**: Surface container with composable sections.

**Exports**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`

**Usage**
```tsx
<Card className="max-w-md">
  <CardHeader>
    <CardTitle>Store Info</CardTitle>
  </CardHeader>
  <CardContent>Details go here…</CardContent>
  <CardFooter>Actions</CardFooter>
</Card>
```

**Extend**
- Add density props (`compact`) or elevation variants using `className` or a light CVA.

---

## 4) Skeleton

**File**: `src/shared_UI/Skeleton.tsx`

**What**: Loading placeholder block.

**Usage**
```tsx
<Skeleton className="h-6 w-2/3" />
<Skeleton className="h-4 w-full" />
```

**Extend**
- Create composite skeletons for cards/lists with a small wrapper component.

---

## 5) Badge

**File**: `src/shared_UI/Badge.tsx`

**What**: Small status label with color variants.

**Variants**: `default | success | warning | danger | info`

**Usage**
```tsx
<Badge variant="success">Open</Badge>
<Badge variant="warning">Low Stock</Badge>
```

**Extend**
- Add outline variants or icons via `children`.

---

## 6) EmptyState

**File**: `src/shared_UI/EmptyState.tsx`

**What**: Neutral, dashed box for “nothing to show”.

**Key props**
- `title: string`
- `description?: string`
- `actionLabel?: string`
- `onAction?: () => void`

**Usage**
```tsx
<EmptyState title="No products found" description="Try adjusting your filters." />
```

**Extend**
- Add an `icon` prop for visual hints; provide `children` for custom content.

---

## 7) ErrorState

**File**: `src/shared_UI/ErrorState.tsx`

**What**: Prominent error banner with optional retry button.

**Key props**
- `message?: string` (default: "Something went wrong.")
- `onRetry?: () => void`

**Usage**
```tsx
<ErrorState onRetry={() => location.reload()} />
```

**Extend**
- Add `variant` for warning vs error; support error codes.

---

## 8) QuantityStepper

**File**: `src/shared_UI/QuantityStepper.tsx`

**What**: +/− control for quantities; uses `Button` ghost variant.

**Key props**
- `value: number`
- `min?: number` (default 1)
- `max?: number` (default 99)
- `onChange: (next: number) => void`

**Usage**
```tsx
const [qty, setQty] = useState(1);
<QuantityStepper value={qty} onChange={setQty} />
```

**Extend**
- Add long‑press to accelerate; disable based on stock.

---

## 9) Price

**File**: `src/shared_UI/Price.tsx`

**What**: INR currency display with optional MRP strike‑through.

**Key props**
- `price: number`
- `mrp?: number`

**Usage**
```tsx
<Price price={129} mrp={149} />
```

**Extend**
- Add `locale`/`currency` props if multi‑currency is required.

---

## 10) StockPill

**File**: `src/shared_UI/StockPill.tsx`

**What**: Stock state badge with thresholds.

**Key props**
- `stockQty: number`
- `lowThreshold?: number` (default 5)

**Usage**
```tsx
<StockPill stockQty={3} />
```

**Extend**
- Make thresholds dynamic by category; add tooltip on hover.

---

## 11) Sheet (Drawer)

**File**: `src/shared_UI/Sheet.tsx`

**What**: Lightweight drawer for mobile or side panels.

**Key props**
- `open: boolean`
- `onClose: () => void`
- `side?: "left" | "right" | "bottom"` (default `"bottom"`)

**Usage**
```tsx
const [open, setOpen] = useState(false);
<>
  <Button onClick={() => setOpen(true)}>Open Drawer</Button>
  <Sheet open={open} onClose={() => setOpen(false)} side="bottom">
    <div className="space-y-2">
      <div className="text-lg font-semibold">Mini Cart</div>
      <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
    </div>
  </Sheet>
</>
```

**Extend**
- Add focus‑trap and ESC close for stronger a11y (or swap to a library when needed).

---

## 12) Toast (Simple, controlled)

**File**: `src/shared_UI/Toast.tsx`

**What**: Minimal toast that appears for a short duration.

**Key props**
- `open: boolean`
- `title?: string`
- `description?: string`
- `onClose?: () => void`
- `variant?: "default" | "success" | "error"`
- `durationMs?: number` (auto‑close, default 2000)

**Usage**
```tsx
const [open, setOpen] = useState(false);
<>
  <Button onClick={() => setOpen(true)}>Show Toast</Button>
  <Toast open={open} title="Added to cart" variant="success" onClose={() => setOpen(false)} />
</>
```

**Extend**
- Add a queue system or replace with a library for stacking.

---

## 13) Tooltip (CSS‑only)

**File**: `src/shared_UI/Tooltip.tsx`

**What**: Hover/focus tooltip without portals (short messages).

**Key props**
- `content: string`
- `position?: "top" | "bottom"` (default `"top"`)

**Usage**
```tsx
<Tooltip content="Add to cart">
  <Button variant="ghost">+</Button>
</Tooltip>
```

**Extend**
- For complex content/positioning, swap with Radix/HeadlessUI keeping same API.

---

## 14) Dialog (Modal)

**File**: `src/shared_UI/Dialog.tsx` *(or under `overlays/Dialog.tsx` if grouped)*

**What**: Simple modal with backdrop and optional footer.

**Key props**
- `open: boolean`
- `onClose: () => void`
- `title?: string`
- `children: React.ReactNode`
- `footer?: React.ReactNode` (defaults to a Close button)

**Usage**
```tsx
const [open, setOpen] = useState(false);
<>
  <Button onClick={() => setOpen(true)}>Open Dialog</Button>
  <Dialog open={open} onClose={() => setOpen(false)} title="Confirm">
    Are you sure you want to proceed?
  </Dialog>
</>
```

**Extend**
- Add focus‑trap, ESC close, and portal to `document.body` as needed.

---

## Maintenance Tips

- **No circular imports**: Component source files should not import from the **root** barrel (`@/shared_UI`) for things inside the same folder group. Prefer relative paths or group barrels to avoid cycles.
- **Barrel exports**: Keep `src/shared_UI/index.ts` re‑exporting all components so pages/feature code imports from a single place.
- **a11y first**: Ensure focus is visible; add `role`, `aria-*` where relevant.
- **Theming/extending**: Use `className` or CVA to add variants instead of duplicating components.
- **Feature vs shared**: Keep domain rules out of `shared_UI`. Compose them in `src/features/<feature>/components`.

---

## Changelog
- v1.0.0 — Initial consolidation of shared UI docs

