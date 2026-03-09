import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../primitives/Button";

type Props = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({ title, description, actionLabel, onAction, className }: Props) {
  return (
    <div className={cn("rounded-2xl border border-dashed border-gray-300 p-6 text-center", className)}>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
      {actionLabel && onAction && (
        <div className="mt-3">
          <Button variant="ghost" onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}