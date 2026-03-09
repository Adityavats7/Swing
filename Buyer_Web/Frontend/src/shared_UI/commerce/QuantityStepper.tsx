import * as React from "react";
import { Button } from "../primitives/Button";

type Props = {
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
};

export function QuantityStepper({ value, min = 1, max = 99, onChange }: Props) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className="inline-flex items-center gap-2">
      <Button variant="ghost" onClick={dec} disabled={value <= min}>−</Button>
      <span className="min-w-8 text-center">{value}</span>
      <Button variant="ghost" onClick={inc} disabled={value >= max}>+</Button>
    </div>
  );
}