"use client";

import type { ServiceWay } from "../_lib/draft";

const OPTIONS: { value: ServiceWay; label: string }[] = [
  { value: "pickup_delivery", label: "Pickup and delivery" },
  { value: "workshop", label: "Self drop (at workshop)" },
];

// Figma ke "Way of service" toggles: ek waqt mein ek hi chuna ja sakta hai
export default function WayOfService({
  value,
  onChange,
}: {
  value: ServiceWay;
  onChange: (value: ServiceWay) => void;
}) {
  return (
    <div className="space-y-3">
      {OPTIONS.map((option) => {
        const on = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="switch"
            aria-checked={on}
            onClick={() => onChange(option.value)}
            className="flex w-full items-center justify-between text-start cursor-pointer"
          >
            <span className="text-sm text-text-main">{option.label}</span>
            <span
              className={`relative h-6 w-11 rounded-full transition-colors ${
                on ? "bg-secondary" : "bg-border-main"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                  on ? "left-[22px]" : "left-0.5"
                }`}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}
