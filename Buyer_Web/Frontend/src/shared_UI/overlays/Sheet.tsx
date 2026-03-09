import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right" | "bottom";
  children: React.ReactNode;
};

export function Sheet({ open, onClose, side = "bottom", children }: Props) {
  if (!open) return null;
  const base = "fixed inset-0 z-50";
  const panel = side === "bottom"
    ? "fixed left-0 right-0 bottom-0 rounded-t-2xl bg-white shadow-2xl"
    : side === "right"
      ? "fixed top-0 right-0 h-full w-96 bg-white shadow-2xl"
      : "fixed top-0 left-0 h-full w-96 bg-white shadow-2xl";

  return (
    <div className={base}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={cn(panel, "p-4")}>{children}</div>
    </div>
  );
}