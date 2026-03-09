// src/shared_UI/overlays/Tooltip.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Tooltip – minimal CSS-only tooltip.
 * - No portals; the tooltip is positioned relative to its trigger.
 * - Shown on hover and focus (keyboard users).
 * - Use short content; for longer content prefer Dialog/Sheet.
 */
type TooltipProps = {
  content: string;
  position?: "top" | "bottom";
  children: React.ReactNode;
  className?: string;
};

export function Tooltip({ content, position = "top", children, className }: TooltipProps) {
  const pos =
    position === "top"
      ? "bottom-full mb-1 left-1/2 -translate-x-1/2"
      : "top-full mt-1 left-1/2 -translate-x-1/2";

  return (
    <span className={cn("relative inline-block group focus-within:outline-none", className)}>
      {/* Trigger */}
      <span tabIndex={0} className="inline-flex">
        {children}
      </span>

      {/* Bubble */}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-30 hidden whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white",
          "group-hover:block group-focus-within:block",
          pos
        )}
      >
        {content}
      </span>
    </span>
  );
}