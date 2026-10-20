"use client";

import { useCallback, useEffect, useState } from "react";

export type ServiceWay = "workshop" | "pickup_delivery";

// Booking ke steps ke darmiyan data (sirf is tab mein, sessionStorage)
export type BookingDraft = {
  serviceType: ServiceWay;
  pickupAddress: string;
  deliveryAddress: string;
  date: string;
  vehicleId: string;
  workshopId: string;
  services: string[];
  timeSlot: string;
  instructions: string;
};

const KEY = "carwise_booking_draft";

export const EMPTY_DRAFT: BookingDraft = {
  serviceType: "workshop",
  pickupAddress: "",
  deliveryAddress: "",
  date: "",
  vehicleId: "",
  workshopId: "",
  services: [],
  timeSlot: "",
  instructions: "",
};

function read(): BookingDraft {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return EMPTY_DRAFT;
    return { ...EMPTY_DRAFT, ...(JSON.parse(raw) as Partial<BookingDraft>) };
  } catch {
    return EMPTY_DRAFT;
  }
}

function write(draft: BookingDraft) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    // storage band ho to bhi app chalti rahe
  }
}

export function clearDraft() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

// draft null = abhi browser se load nahi hua
export function useDraft() {
  const [draft, setDraft] = useState<BookingDraft | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(read());
  }, []);

  const update = useCallback((patch: Partial<BookingDraft>) => {
    setDraft((prev) => {
      const next = { ...(prev ?? read()), ...patch };
      write(next);
      return next;
    });
  }, []);

  return { draft, update };
}
