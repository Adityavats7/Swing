import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  price: number;
  mrp?: number;
  className?: string;
};

export function Price({ price, mrp, className }: Props) {
  const isDiscount = mrp && mrp > price;
  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className="text-base font-semibold text-gray-900">{fmt(price)}</span>
      {isDiscount && <span className="text-sm text-gray-500 line-through">{fmt(mrp!)}</span>}
    </div>
  );
}