import * as React from "react";
import { cn } from "@/lib/utils";
// Import Button directly from the primitives group to avoid circular imports:
import { Button } from "../primitives";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Dialog({ open, onClose, title, children, footer }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-5 shadow-xl">
        {title && <div className="mb-2 text-lg font-semibold">{title}</div>}
        <div className="text-sm text-gray-800">{children}</div>
        <div className={cn("mt-4 flex justify-end gap-2")}>
          {footer ?? <Button variant="ghost" onClick={onClose}>Close</Button>}
        </div>
      </div>
    </div>
  );
}