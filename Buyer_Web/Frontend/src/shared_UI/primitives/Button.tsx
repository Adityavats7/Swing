import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Button – Reusable, accessible, Tailwind-styled button
 * Supports: variants, sizes, full-width block, loading spinner, optional icons.
 */

const buttonStyles = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-colors " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:  "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600",
        secondary:"bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-900",
        ghost:    "bg-transparent text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-300",
        danger:   "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
        outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-900"
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-base"
      },
      block: { true: "w-full", false: "" }
    },
    defaultVariants: { variant: "primary", size: "md", block: false }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  /** Show a small spinner and disable interactions */
  isLoading?: boolean;
  /** Optional icon elements */
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={cn(buttonStyles({ variant, size, block }), className)}
        disabled={isDisabled}
        {...props}
      >
        {/* Loading spinner (when isLoading=true) */}
        {isLoading && (
          <span
            className="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            aria-hidden="true"
          />
        )}

        {/* Optional left icon */}
        {leftIcon && !isLoading && <span className="mr-2 inline-flex">{leftIcon}</span>}

        {/* Label */}
        <span>{children}</span>

        {/* Optional right icon */}
        {rightIcon && <span className="ml-2 inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";