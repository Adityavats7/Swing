import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  onClose?: () => void;
  variant?: "default" | "success" | "error";
  durationMs?: number; // auto-close
};

const variants = {
  default: "bg-gray-900 text-white",
  success: "bg-green-600 text-white",
  error:   "bg-red-600 text-white",
};

export function Toast({ open, title, description, onClose, variant = "default", durationMs = 2000 }: Props) {
  const [visible, setVisible] = React.useState(open);

  React.useEffect(() => {
    setVisible(open);
    if (open && durationMs > 0) {
      const t = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, durationMs);
      return () => clearTimeout(t);
    }
  }, [open, durationMs, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className={cn("pointer-events-auto min-w-[260px] rounded-xl px-4 py-3 shadow-lg", variants[variant])}>
          {title && <div className="text-sm font-semibold">{title}</div>}
          {description && <div className="text-xs opacity-90">{description}</div>}
        </div>
      </div>
    </div>
  );
}