import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely (prevents duplicate/conflicting classes) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}