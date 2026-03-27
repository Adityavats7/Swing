"use client";

import { use, useMemo } from "react";
import { Button, Skeleton, Badge } from "@/shared_UI";

/**
 * Stores Playground — Store Details (Dynamic, Non‑Blocking)
 *
 * NOTE:
 * In Next.js App Router (v14+), dynamic route params are async.
 * Therefore, `params` must be unwrapped using React.use().
 */
export default function StoreDetailsPlaygroundPage({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  /* --------------------------------------------------
   * Properly unwrap async route params
   * -------------------------------------------------- */
  const { storeSlug } = use(params);

  /* --------------------------------------------------
   * Playground Mock Store Resolver
   *
   * Generates readable store data from slug.
   * Playground intentionally accepts ANY slug.
   * -------------------------------------------------- */
  const store = useMemo(() => {
    const formattedName = storeSlug
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    return {
      id: "playground-store",
      slug: storeSlug,
      name: formattedName,
      rating: 4.4,
      ratingCount: 120,
      distanceKm: 1.5,
      etaMins: 25,
      openStatus: "OPEN" as const,
      deliveryFee: 20,
      freeDeliveryAbove: 199,
      address: "Playground Address",
      hours: "8:00 AM – 11:00 PM",
    };
  }, [storeSlug]);

  /* --------------------------------------------------
   * Derived UI State
   * -------------------------------------------------- */
  const statusBadge = useMemo(() => {
    return store.openStatus === "OPEN" ? (
      <Badge variant="success">Open</Badge>
    ) : (
      <Badge variant="danger">Closed</Badge>
    );
  }, [store.openStatus]);

  return (
    <main className="mx-auto max-w-7xl p-6 space-y-6">
      {/* ================= STORE HEADER ================= */}
      <section className="rounded-2xl border bg-white p-6 space-y-3">
        <h1 className="text-2xl font-bold">{store.name}</h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <span>⭐ {store.rating} ({store.ratingCount})</span>
          <span>• {store.distanceKm} km</span>
          <span>• ETA {store.etaMins} min</span>
        </div>

        <div className="flex items-center gap-3">
          {statusBadge}
          <span className="text-sm text-gray-600">
            Delivery fee ₹{store.deliveryFee} • Free above ₹{store.freeDeliveryAbove}
          </span>
        </div>
      </section>

      {/* ================= STORE ACTIONS ================= */}
      <section className="flex flex-wrap gap-3">
        <Button variant="ghost">Favorite</Button>
        <Button variant="ghost">Share</Button>
        <Button variant="ghost">Store Info</Button>
      </section>

      {/* ============ PRODUCT DISCOVERY (SKELETON) ============ */}
      <section className="space-y-4">
        <div className="rounded-2xl border bg-white p-4">
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </section>

      {/* ================= STORE INFORMATION ================= */}
      <section className="rounded-2xl border bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold">Store Information</h2>

        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>Address:</strong> {store.address}</p>
          <p><strong>Hours:</strong> {store.hours}</p>
          <p><strong>Status:</strong> {store.openStatus}</p>
        </div>
      </section>
    </main>
  );
}