"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/services/api";
import {
  BookingItem,
  CARD_CLASS,
  INPUT_CLASS,
  PRIMARY_BTN,
  SECONDARY_BTN,
  STATUS_LABELS,
  errorMessage,
  formatDate,
  formatDateTime,
  statusBadgeClass,
  vehicleLabel,
} from "../../_lib/booking";
import { ErrorBlock, LoadingBlock } from "../../_components/StateBlocks";

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border-subtle py-3 last:border-none sm:flex-row sm:gap-6">
      <dt className="text-sm text-text-muted sm:w-40 sm:shrink-0">{label}</dt>
      <dd className="text-sm font-medium text-text-heading">{value || "-"}</dd>
    </div>
  );
}

export default function BookingDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [booking, setBooking] = useState<BookingItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    api
      .get<BookingItem>(`/bookings/${id}`)
      .then((res) => active && setBooking(res.data))
      .catch(
        (err) => active && setError(errorMessage(err, "Booking not found")),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id, reload]);

  async function handleCancel() {
    if (cancelling || !booking) return;
    setCancelling(true);
    try {
      await api.patch(`/bookings/${booking._id}/status`, {
        status: "cancelled",
        note: reason.trim() || undefined,
      });
      toast.success("Booking cancelled");
      setCancelOpen(false);
      setReason("");
      setReload((n) => n + 1);
    } catch (err) {
      toast.error(errorMessage(err, "Booking cancel nahi ho saki"));
    } finally {
      setCancelling(false);
    }
  }

  if (loading && !booking) return <LoadingBlock />;
  if (error || !booking)
    return (
      <ErrorBlock
        message={error ?? "Booking not found"}
        onRetry={() => setReload((n) => n + 1)}
      />
    );

  const canCancel = booking.status === "pending" || booking.status === "confirmed";
  const history = booking.statusHistory ?? [];

  return (
    <div className="w-full">
      <Link
        href="/dashboard/my-bookings"
        className="mb-4 inline-block text-sm text-text-muted hover:text-primary"
      >
        ← Back to bookings
      </Link>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold text-text-heading sm:text-2xl">
          {booking.reference}
        </h1>
        <span
          className={`rounded-[5px] px-3 py-1 text-xs font-medium ${statusBadgeClass(booking.status)}`}
        >
          {STATUS_LABELS[booking.status] ?? booking.status}
        </span>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-6">
          <section className={CARD_CLASS}>
            <h2 className="mb-2 text-base font-semibold text-text-heading">
              Booking
            </h2>
            <dl>
              <Row label="Date" value={formatDate(booking.bookingDate)} />
              <Row label="Time slot" value={booking.timeSlot} />
              <Row
                label="Way of service"
                value={
                  booking.serviceType === "pickup_delivery"
                    ? "Pickup & delivery"
                    : "At workshop"
                }
              />
              <Row label="Services" value={booking.services.join(", ")} />
              <Row
                label="Vehicle"
                value={booking.vehicle ? vehicleLabel(booking.vehicle) : "-"}
              />
              {booking.serviceType === "pickup_delivery" && (
                <>
                  <Row label="Pickup address" value={booking.pickupAddress} />
                  <Row label="Delivery address" value={booking.deliveryAddress} />
                </>
              )}
              <Row label="Instructions" value={booking.instructions} />
              {booking.status === "cancelled" && (
                <Row label="Cancel reason" value={booking.cancellationReason} />
              )}
              <Row label="Created" value={formatDateTime(booking.createdAt)} />
            </dl>
          </section>

          <section className={CARD_CLASS}>
            <h2 className="mb-4 text-base font-semibold text-text-heading">
              Status history
            </h2>
            {history.length === 0 ? (
              <p className="text-sm text-text-muted">No history yet.</p>
            ) : (
              <ol className="space-y-4">
                {history.map((entry, index) => (
                  <li key={`${entry.status}-${index}`} className="flex gap-3">
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium text-text-heading">
                        {STATUS_LABELS[entry.status] ?? entry.status}
                      </p>
                      <p className="text-xs text-text-muted">
                        {formatDateTime(entry.at)}
                      </p>
                      {entry.note && (
                        <p className="mt-1 text-xs text-text-secondary">
                          {entry.note}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <aside className="w-full shrink-0 space-y-6 lg:w-[320px]">
          <section className={CARD_CLASS}>
            <h2 className="mb-3 text-base font-semibold text-text-heading">
              Workshop
            </h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-text-muted">Name</dt>
                <dd className="font-medium text-text-heading">
                  {booking.workshop?.name ?? "-"}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Address</dt>
                <dd className="text-text-main">
                  {[booking.workshop?.address, booking.workshop?.city]
                    .filter(Boolean)
                    .join(", ") || "-"}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Phone</dt>
                <dd className="text-text-main">{booking.workshop?.phone ?? "-"}</dd>
              </div>
            </dl>
          </section>

          {canCancel && (
            <button
              type="button"
              onClick={() => setCancelOpen(true)}
              className="w-full rounded-xl border border-error px-6 py-3 text-sm font-semibold text-error transition-colors hover:bg-error hover:text-white cursor-pointer"
            >
              Cancel booking
            </button>
          )}
        </aside>
      </div>

      {cancelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-surface p-6">
            <h3 className="mb-1 text-lg font-semibold text-text-heading">
              Cancel this booking?
            </h3>
            <p className="mb-4 text-sm text-text-muted">
              Ye wapas nahi ho sakega. Wajah likhna zaroori nahi.
            </p>
            <textarea
              className={`${INPUT_CLASS} h-24 resize-none`}
              placeholder="Reason (optional)"
              value={reason}
              maxLength={500}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                className={`${SECONDARY_BTN} flex-1`}
                onClick={() => setCancelOpen(false)}
                disabled={cancelling}
              >
                Keep booking
              </button>
              <button
                type="button"
                className={`${PRIMARY_BTN} flex-1 !bg-error`}
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? "Cancelling..." : "Yes, cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
