"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import {
  BookingItem,
  Paginated,
  PRIMARY_BTN,
  STATUS_LABELS,
  STATUS_TABS,
  errorMessage,
  formatDate,
  statusBadgeClass,
} from "../_lib/booking";
import { EmptyBlock, ErrorBlock, LoadingBlock, Pager } from "../_components/StateBlocks";

const PAGE_SIZE = 10;

export default function MyBookingsPage() {
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [data, setData] = useState<Paginated<BookingItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    api
      .get<Paginated<BookingItem>>("/bookings", {
        params: { status: status || undefined, page, limit: PAGE_SIZE },
      })
      .then((res) => active && setData(res.data))
      .catch(
        (err) =>
          active && setError(errorMessage(err, "Could not load bookings")),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [status, page, reload]);

  const bookings = data?.items ?? [];

  return (
    <div className="flex w-full flex-col">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-text-heading sm:text-2xl">
          My bookings
        </h1>
        <Link href="/dashboard/workshops" className={PRIMARY_BTN}>
          + New booking
        </Link>
      </div>

      <div className="mb-6 w-full overflow-x-auto border-b border-border-main">
        <div className="flex min-w-max items-center gap-8">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => {
                setStatus(tab.value);
                setPage(1);
              }}
              className={`relative pb-3 text-[15px] transition-colors cursor-pointer ${
                status === tab.value
                  ? "font-medium text-text-heading"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              {tab.label}
              {status === tab.value && (
                <span className="absolute bottom-0 left-0 -mb-[1.5px] h-[3px] w-full rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {loading && !data ? (
        <LoadingBlock text="Loading bookings..." />
      ) : error ? (
        <ErrorBlock message={error} onRetry={() => setReload((n) => n + 1)} />
      ) : bookings.length === 0 ? (
        <EmptyBlock
          title="No bookings yet"
          message="There are no bookings in this list right now."
        >
          <Link href="/dashboard/workshops" className={PRIMARY_BTN}>
            Book a service
          </Link>
        </EmptyBlock>
      ) : (
        <div className={loading ? "opacity-60 transition-opacity" : ""}>
          {/* Desktop: table */}
          <div className="hidden w-full overflow-x-auto md:block">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border-subtle">
                  {["Reference", "Workshop", "Services", "Date", "Status"].map(
                    (head) => (
                      <th
                        key={head}
                        className="pb-4 text-[12px] font-normal text-text-muted"
                      >
                        {head}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b border-border-subtle last:border-none hover:bg-surface-subtle/50"
                  >
                    <td className="py-4 text-[13px] font-medium">
                      <Link
                        href={`/dashboard/my-bookings/${booking._id}`}
                        className="text-text-heading hover:text-primary"
                      >
                        {booking.reference}
                      </Link>
                    </td>
                    <td className="py-4 text-[13px] text-text-main">
                      {booking.workshop?.name ?? "-"}
                    </td>
                    <td className="max-w-[220px] truncate py-4 text-[13px] text-text-main">
                      {booking.services.join(", ")}
                    </td>
                    <td className="py-4 text-[13px] text-text-main">
                      <span className="block">{formatDate(booking.bookingDate)}</span>
                      <span className="text-[11px] text-text-muted">
                        {booking.timeSlot}
                      </span>
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-block rounded-[5px] px-3 py-1 text-[11px] font-medium ${statusBadgeClass(booking.status)}`}
                      >
                        {STATUS_LABELS[booking.status] ?? booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="space-y-3 md:hidden">
            {bookings.map((booking) => (
              <Link
                key={booking._id}
                href={`/dashboard/my-bookings/${booking._id}`}
                className="block rounded-2xl border border-border-main bg-surface p-4"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <span className="text-sm font-semibold text-text-heading">
                    {booking.reference}
                  </span>
                  <span
                    className={`rounded-[5px] px-2.5 py-1 text-[11px] font-medium ${statusBadgeClass(booking.status)}`}
                  >
                    {STATUS_LABELS[booking.status] ?? booking.status}
                  </span>
                </div>
                <p className="text-sm text-text-main">
                  {booking.workshop?.name ?? "-"}
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  {booking.services.join(", ")}
                </p>
                <p className="mt-2 text-xs text-text-secondary">
                  {formatDate(booking.bookingDate)}
                  {booking.timeSlot ? ` · ${booking.timeSlot}` : ""}
                </p>
              </Link>
            ))}
          </div>

          <Pager
            page={data?.page ?? 1}
            totalPages={data?.totalPages ?? 1}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  );
}