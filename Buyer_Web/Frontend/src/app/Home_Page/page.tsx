"use client";

import { useState } from "react";
import { Button, TextField } from "@/shared_UI";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

const error =
    touched && value.trim().length < 3 ? "Please enter at least 3 characters." : undefined;


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
     <h1 className="text-2xl font-semibold">TextField – Sanity Check</h1>

      <TextField
        label="Search"
        placeholder="Type something…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
        helperText="Enter 3+ characters"
        error={error}
        required
      />

      <div className="flex gap-2">
        <Button onClick={() => alert(`You typed: ${value}`)}>Submit</Button>
        <Button variant="ghost" onClick={() => { setValue(""); setTouched(false); }}>
          Clear
        </Button>
      </div>

    </main>
  );
}
