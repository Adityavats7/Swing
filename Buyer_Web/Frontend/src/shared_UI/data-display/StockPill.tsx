import * as React from "react";
import { cn } from "@/lib/utils";

type Props = { stockQty: number; lowThreshold?: number; className?: string };

export function StockPill({ stockQty, lowThreshold = 5, className }: Props) {
  let text = "In Stock";
  let cls = "bg-green-100 text-green-800";
  if (stockQty <= 0) { text = "Out of Stock"; cls = "bg-red-100 text-red-800"; }
  else if (stockQty <= lowThreshold) { text = "Low Stock"; cls = "bg-amber-100 text-amber-800"; }

  return <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", cls, className)}>{text}</span>;
}