import * as React from "react";
import { Button } from "../primitives/Button";
import { cn } from "@/lib/utils";

type Props = {
  message?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({ message = "Something went wrong.", onRetry, className }: Props) {
  return (
    <div className={cn("rounded-2xl border border-red-200 bg-red-50 p-4", className)}>
      <div className="text-sm font-medium text-red-700">{message}</div>
      {onRetry && <Button variant="ghost" className="mt-2" onClick={onRetry}>Retry</Button>}
    </div>
  );
}