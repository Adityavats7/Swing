"use client";

import { useState } from "react";
import { Button } from "@/shared_UI";

export default function Home() {
  const [loading, setLoading] = useState(false);

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Button – Sanity Check</h1>

      {/* Default */}
      <Button>Primary</Button>

      {/* Variants & Sizes */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="outline">Outline</Button>
        <Button size="lg" block>Large Block</Button>
      </div>

      {/* Loading state */}
      <Button
        isLoading={loading}
        onClick={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 1200);
        }}
      >
        Save Changes
      </Button>

      {/* Disabled */}
      <Button disabled>Disabled</Button>
    </main>
  );
}