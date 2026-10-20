import type { AxiosError } from "axios";

// ---------- Types (backend ke jawab ke mutabiq) ----------
export type WorkshopItem = {
  _id: string;
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  services?: string[];
  images?: string[];
  status?: string;
  latitude?: number | null;
  longitude?: number | null;
};

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export type BookingItem = {
  _id: string;
  reference: string;
  workshop?: Pick<
    WorkshopItem,
    "_id" | "name" | "city" | "address" | "phone"
  > | null;
  vehicle?: Record<string, unknown> | null;
  services: string[];
  bookingDate: string;
  timeSlot?: string;
  serviceType: "workshop" | "pickup_delivery";
  pickupAddress?: string;
  deliveryAddress?: string;
  instructions?: string;
  status: BookingStatus;
  cancellationReason?: string;
  statusHistory?: { status: BookingStatus; at: string; note?: string }[];
  createdAt?: string;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type VehicleItem = { _id: string } & Record<string, unknown>;

// ---------- Constants ----------
export const TIME_SLOTS = [
  { label: "09:00 AM - 10:00 AM", startHour: 9 },
  { label: "10:00 AM - 11:00 AM", startHour: 10 },
  { label: "11:00 AM - 12:00 PM", startHour: 11 },
  { label: "12:00 PM - 01:00 PM", startHour: 12 },
  { label: "02:00 PM - 03:00 PM", startHour: 14 },
  { label: "03:00 PM - 04:00 PM", startHour: 15 },
  { label: "04:00 PM - 05:00 PM", startHour: 16 },
  { label: "05:00 PM - 06:00 PM", startHour: 17 },
];

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_TABS: { label: string; value: "" | BookingStatus }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "In progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export function statusBadgeClass(status: BookingStatus): string {
  switch (status) {
    case "completed":
      return "bg-success text-white";
    case "in_progress":
      return "bg-primary text-white";
    case "confirmed":
      return "bg-secondary text-white";
    case "cancelled":
      return "bg-error text-white";
    default:
      return "bg-warning text-white";
  }
}

// ---------- Styles (globals.css ke colors) ----------
export const INPUT_CLASS =
  "w-full rounded-xl border border-border-main bg-surface px-4 py-3 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60";
export const PRIMARY_BTN =
  "inline-flex items-center justify-center rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";
export const SECONDARY_BTN =
  "inline-flex items-center justify-center rounded-xl border border-border-main bg-surface px-6 py-3 text-sm font-semibold text-text-heading transition-colors hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";
export const CARD_CLASS =
  "rounded-2xl border border-border-main bg-surface p-5 sm:p-6";

// ---------- Helpers ----------
export function errorMessage(error: unknown, fallback: string): string {
  const message = (error as AxiosError<{ message?: string | string[] }>)
    ?.response?.data?.message;
  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string" && message) return message;
  return fallback;
}

export function formatDate(value?: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value?: string): string {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Aaj ki tareekh yyyy-mm-dd (local time)
export function todayString(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// Vehicles API ka shape pakka nahi, isliye jo fields milen unse naam banate hain
export function vehicleLabel(vehicle?: Record<string, unknown> | null): string {
  if (!vehicle) return "-";
  const pick = (...keys: string[]) => {
    for (const key of keys) {
      const value = vehicle[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
    return "";
  };
  const plate = pick(
    "licenseNumber",
    "licensePlate",
    "plateNumber",
    "registrationNumber",
    "regNo",
  );
  const name = [pick("make", "brand"), pick("model", "name", "title")]
    .filter(Boolean)
    .join(" ");
  return [name, plate].filter(Boolean).join(" · ") || "My vehicle";
}

// API kabhi array deti hai kabhi {items: []}
export function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const items = (data as { items?: unknown }).items;
    if (Array.isArray(items)) return items as T[];
  }
  return [];
}

export const ACCENT_BTN =
  "inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";

// ---------- Location helpers ----------
export type LatLng = { lat: number; lng: number };

export function workshopPoint(workshop: WorkshopItem): LatLng | null {
  const { latitude, longitude } = workshop;
  if (
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Math.abs(latitude) <= 90 &&
    Math.abs(longitude) <= 180
  ) {
    return { lat: latitude, lng: longitude };
  }
  return null;
}

// Do points ke darmiyan fasla (km) - haversine
export function distanceKm(a: LatLng, b: LatLng): number {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

export function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m away` : `${km.toFixed(1)} km away`;
}
