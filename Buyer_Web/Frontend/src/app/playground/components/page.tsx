"use client";

import { useState } from "react";
import {
  // primitives
  Button, TextField,
  // layout
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  // data-display
  Badge, Price, Skeleton, StockPill,
  // feedback
  EmptyState, ErrorState, Toast,
  // overlays
  Dialog, Sheet, Tooltip,
  // commerce
  QuantityStepper,
} from "@/shared_UI";

export default function ComponentsDemoPage() {
  // Local state for interactive demos
  const [isLoading, setIsLoading] = useState(false);
  const [qty, setQty] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [touched, setTouched] = useState(false);

  const error = touched && search.trim().length < 3
    ? "Please enter at least 3 characters."
    : undefined;

  return (
    <main className="p-6 mx-auto max-w-6xl space-y-8">
      {/* Top intro / coming soon */}
      <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Shared UI Playground</h1>
        <p className="mt-2 text-gray-600">
          This page demonstrates all shared components for quick visual QA and manual testing.
          It also previews the kinds of examples and features we’re about to build next.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="info">Buyer App</Badge>
          <Badge variant="success">Reusable</Badge>
          <Badge variant="warning">WIP</Badge>
        </div>
      </header>

      {/* Coming soon / roadmap */}
      <section className="rounded-2xl border border-dashed border-gray-300 bg-white p-6">
        <h2 className="text-xl font-semibold">What’s Coming Next</h2>
        <ul className="mt-2 list-disc pl-6 text-gray-700 space-y-1">
          <li>Feature components: <strong>StoreCard</strong>, <strong>ProductCard</strong>, <strong>CartLineItem</strong></li>
          <li>Mock data (MSW) + API integration hooks (React Query)</li>
          <li>Inventory/ETA badges & store search</li>
          <li>Checkout & order status flows</li>
        </ul>
      </section>

      {/* Primitives */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Primitives</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Button</CardTitle>
              <CardDescription>Variants, sizes, loading, block</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
              <Button size="lg" block>Large / Block</Button>
              <Button
                isLoading={isLoading}
                onClick={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 1200); }}
              >
                Save Changes
              </Button>
            </CardContent>
            <CardFooter className="text-sm text-gray-500">Accessible: focus ring, disabled, loading</CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>TextField</CardTitle>
              <CardDescription>Label, helper, error state</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <TextField
                label="Search"
                placeholder="Type something…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onBlur={() => setTouched(true)}
                helperText="Enter 3+ characters"
                error={error}
                required
              />
              <TextField label="Email" type="email" placeholder="name@example.com" />
              <TextField label="Disabled" disabled placeholder="You can't type here" />
            </CardContent>
            <CardFooter className="text-sm text-gray-500">ARIA-linked label, helper, error</CardFooter>
          </Card>
        </div>
      </section>

      {/* Data display */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Data Display</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Badge</CardTitle>
              <CardDescription>Status labels</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Price & Stock</CardTitle>
              <CardDescription>INR format, optional MRP & stock status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Price price={129} mrp={149} />
              <div className="flex items-center gap-4">
                <StockPill stockQty={0} />
                <StockPill stockQty={3} />
                <StockPill stockQty={20} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skeleton</CardTitle>
              <CardDescription>Loading placeholders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Commerce + Feedback */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Commerce & Feedback</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>QuantityStepper</CardTitle>
              <CardDescription>+/− control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <QuantityStepper value={qty} onChange={setQty} />
              <div className="text-sm text-gray-600">Qty: {qty}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Empty & Error</CardTitle>
              <CardDescription>Standard blank/error states</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <EmptyState title="Nothing here yet" description="Try adding filters or items." />
              <ErrorState onRetry={() => location.reload()} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Toast</CardTitle>
              <CardDescription>Simple, controlled toast</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setToastOpen(true)}>Show Toast</Button>
                <Button variant="ghost" onClick={() => setToastOpen(false)}>Hide</Button>
              </div>
              <Toast
                open={toastOpen}
                title="Added to cart"
                description="The item was added successfully."
                variant="success"
                onClose={() => setToastOpen(false)}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Overlays */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Overlays</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Dialog (Modal)</CardTitle>
              <CardDescription>Backdrop + content + footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
              <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Confirm Action">
                Are you sure you want to proceed?
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sheet (Drawer) & Tooltip</CardTitle>
              <CardDescription>Bottom/right drawer and hover/focus tooltip</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setSheetOpen(true)}>Open Bottom Sheet</Button>
                <Tooltip content="Shows extra info">
                  <Button variant="ghost">Hover me</Button>
                </Tooltip>
              </div>
              <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} side="bottom">
                <div className="space-y-2">
                  <div className="text-lg font-semibold">Bottom Drawer</div>
                  <p className="text-sm text-gray-600">
                    Great for mini-cart, filters, and quick actions on mobile.
                  </p>
                  <Button variant="ghost" onClick={() => setSheetOpen(false)}>Close</Button>
                </div>
              </Sheet>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer note */}
      <footer className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="text-sm text-gray-500">
          This is a living playground. As we add new shared components or update variants,
          we’ll reflect them here for quick visual QA.
        </div>
      </footer>
    </main>
  );
}
``