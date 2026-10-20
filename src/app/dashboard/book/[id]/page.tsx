"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/services/api";
import {
  ACCENT_BTN,
  BookingItem,
  CARD_CLASS,
  INPUT_CLASS,
  PRIMARY_BTN,
  SECONDARY_BTN,
  TIME_SLOTS,
  VehicleItem,
  WorkshopItem,
  errorMessage,
  todayString,
  unwrapList,
  vehicleLabel,
} from "../../_lib/booking";
import { clearDraft, useDraft } from "../../_lib/draft";
import WayOfService from "../../_components/WayOfService";
import { ErrorBlock, LoadingBlock } from "../../_components/StateBlocks";

type Errors = Partial<Record<"services" | "date" | "slot" | "pickup", string>>;

// Figma ke "My Cart" + "Review Booking" ek page par
export default function ReviewBookingPage() {
  const params = useParams<{ id: string }>();
  const workshopId = params?.id;
  const router = useRouter();
  const { draft, update } = useDraft();

  const [workshop, setWorkshop] = useState<WorkshopItem | null>(null);
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<BookingItem | null>(null);

  useEffect(() => {
    if (!workshopId) return;
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setLoadError(null);
    Promise.all([
      api.get<WorkshopItem>(`/workshops/${workshopId}`),
      api.get("/vehicles").catch(() => ({ data: [] })),
    ])
      .then(([workshopRes, vehicleRes]) => {
        if (!active) return;
        setWorkshop(workshopRes.data);
        setVehicles(unwrapList<VehicleItem>(vehicleRes.data));
      })
      .catch(
        (err) =>
          active && setLoadError(errorMessage(err, "Workshop not found")),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [workshopId, reload]);

  if (loading || !draft) return <LoadingBlock />;
  if (loadError || !workshop)
    return (
      <ErrorBlock
        message={loadError ?? "Workshop not found"}
        onRetry={() => setReload((n) => n + 1)}
      />
    );

  const currentWorkshop = workshop;
  const cart = draft.workshopId === currentWorkshop._id ? draft.services : [];
  const today = todayString();
  const isToday = draft.date === today;
  const nowHour = new Date().getHours();

  function removeService(name: string) {
    update({
      workshopId: currentWorkshop._id,
      services: cart.filter((item) => item !== name),
    });
  }

  function validate(): Errors {
    const found: Errors = {};
    if (cart.length === 0) found.services = "Cart khali hai";
    if (!draft!.date) found.date = "Date chuno";
    else if (draft!.date < today) found.date = "Purani date nahi chun sakte";
    if (!draft!.timeSlot) found.slot = "Time slot chuno";
    if (draft!.serviceType === "pickup_delivery" && !draft!.pickupAddress.trim())
      found.pickup = "Pickup address likho";
    return found;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting || !draft) return;
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      toast.error("Form mein ghalti hai, dobara check karo");
      return;
    }

    setSubmitting(true);
    try {
      const pickup = draft.serviceType === "pickup_delivery";
      const res = await api.post<BookingItem>("/bookings", {
        workshopId: currentWorkshop._id,
        vehicleId: draft.vehicleId || undefined,
        services: cart,
        bookingDate: draft.date,
        timeSlot: draft.timeSlot,
        serviceType: draft.serviceType,
        pickupAddress: pickup ? draft.pickupAddress.trim() : undefined,
        deliveryAddress:
          pickup && draft.deliveryAddress.trim()
            ? draft.deliveryAddress.trim()
            : undefined,
        instructions: draft.instructions.trim() || undefined,
      });
      setCreated(res.data);
      clearDraft();
    } catch (err) {
      toast.error(errorMessage(err, "Booking nahi ho saki, dobara try karo"));
    } finally {
      setSubmitting(false);
    }
  }

  // ---- Booking Successful (Figma ka dark screen) ----
  if (created) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center rounded-3xl bg-secondary px-6 py-14 text-center text-white">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
          <svg
            className="h-12 w-12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 13l5 5L18 6" />
            <path d="M9 17l1 1L22 6" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Booking Successful</h1>
        <p className="mt-3 text-sm text-white/70">
          Workshop jald aapki booking confirm karegi.
        </p>
        <p className="mt-5 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold">
          {created.reference}
        </p>
        <div className="mt-10 flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/my-bookings")}
            className={`${ACCENT_BTN} w-full`}
          >
            Done
          </button>
          <Link
            href={`/dashboard/my-bookings/${created._id}`}
            className="text-sm text-white/70 hover:text-white"
          >
            View booking
          </Link>
        </div>
      </div>
    );
  }

  const pickup = draft.serviceType === "pickup_delivery";

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full pb-24 lg:pb-0">
      <Link
        href={`/dashboard/workshops/${currentWorkshop._id}`}
        className="mb-4 inline-block text-sm text-text-muted hover:text-primary"
      >
        ← Back to workshop
      </Link>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-6">
          {/* My Cart */}
          <section className={CARD_CLASS}>
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-lg font-bold text-text-heading">My cart</h1>
              <Link
                href={`/dashboard/workshops/${currentWorkshop._id}`}
                className="text-xs font-semibold text-primary"
              >
                ＋ Add more service
              </Link>
            </div>
            {cart.length === 0 ? (
              <p className="text-sm text-text-muted">
                Cart khali hai. Workshop ke page se services add karo.
              </p>
            ) : (
              <ul className="divide-y divide-border-subtle">
                {cart.map((name) => (
                  <li
                    key={name}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <span className="flex items-center gap-3 text-sm text-text-heading">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-white">
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" />
                        </svg>
                      </span>
                      {name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeService(name)}
                      className="text-xs font-semibold text-error cursor-pointer"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {errors.services && (
              <p className="mt-2 text-xs text-error">{errors.services}</p>
            )}
          </section>

          {/* Review Booking */}
          <section className={CARD_CLASS}>
            <h2 className="mb-4 text-lg font-bold text-text-heading">
              Review booking
            </h2>

            <div className="mb-6">
              <p className="mb-3 text-sm font-semibold text-text-heading">
                Way of service
              </p>
              <WayOfService
                value={draft.serviceType}
                onChange={(value) => update({ serviceType: value })}
              />
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-text-heading">
                  Date & time
                </label>
                <input
                  type="date"
                  className={`${INPUT_CLASS} sm:max-w-xs`}
                  min={today}
                  value={draft.date}
                  onChange={(e) => {
                    update({ date: e.target.value, timeSlot: "" });
                    setErrors((prev) => ({ ...prev, date: undefined }));
                  }}
                />
                {errors.date && (
                  <p className="mt-1 text-xs text-error">{errors.date}</p>
                )}
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
                  {TIME_SLOTS.map((item) => {
                    const past = isToday && item.startHour <= nowHour;
                    const selected = draft.timeSlot === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        disabled={past}
                        onClick={() => {
                          update({ timeSlot: item.label });
                          setErrors((prev) => ({ ...prev, slot: undefined }));
                        }}
                        aria-pressed={selected}
                        className={`rounded-xl border px-2 py-3 text-xs font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
                          selected
                            ? "border-primary bg-primary text-white"
                            : "border-border-main text-text-main hover:border-primary"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
                {errors.slot && (
                  <p className="mt-2 text-xs text-error">{errors.slot}</p>
                )}
              </div>

              {pickup && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-text-heading">
                      Pickup address
                    </label>
                    <input
                      className={INPUT_CLASS}
                      value={draft.pickupAddress}
                      maxLength={300}
                      onChange={(e) => {
                        update({ pickupAddress: e.target.value });
                        setErrors((prev) => ({ ...prev, pickup: undefined }));
                      }}
                    />
                    {errors.pickup && (
                      <p className="mt-1 text-xs text-error">{errors.pickup}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-text-heading">
                      Delivery address
                    </label>
                    <input
                      className={INPUT_CLASS}
                      placeholder="Khali ho to pickup wala"
                      value={draft.deliveryAddress}
                      maxLength={300}
                      onChange={(e) => update({ deliveryAddress: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-text-heading">
                  Vehicle (optional)
                </label>
                <select
                  className={INPUT_CLASS}
                  value={draft.vehicleId}
                  onChange={(e) => update({ vehicleId: e.target.value })}
                >
                  <option value="">
                    {vehicles.length === 0 ? "Koi gaari save nahi" : "Gaari chuno"}
                  </option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicleLabel(vehicle)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-text-heading">
                  Additional things (optional)
                </label>
                <textarea
                  className={`${INPUT_CLASS} h-28 resize-none`}
                  placeholder="Write additional things"
                  value={draft.instructions}
                  maxLength={1000}
                  onChange={(e) => update({ instructions: e.target.value })}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Summary (desktop) */}
        <aside className="hidden w-[340px] shrink-0 lg:block">
          <div className={`${CARD_CLASS} sticky top-24`}>
            <h2 className="mb-4 text-base font-semibold text-text-heading">
              Booking summary
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-text-muted">Workshop</dt>
                <dd className="font-medium text-text-heading">
                  {currentWorkshop.name}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Services</dt>
                <dd className="font-medium text-text-heading">
                  {cart.length ? cart.join(", ") : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Date & time</dt>
                <dd className="font-medium text-text-heading">
                  {draft.date || "-"}
                  {draft.timeSlot ? ` · ${draft.timeSlot}` : ""}
                </dd>
              </div>
            </dl>
            <button
              type="submit"
              disabled={submitting}
              className={`${PRIMARY_BTN} mt-6 w-full`}
            >
              {submitting ? "Booking..." : "Confirm booking"}
            </button>
            <Link
              href={`/dashboard/workshops/${currentWorkshop._id}`}
              className={`${SECONDARY_BTN} mt-3 w-full`}
            >
              Back
            </Link>
          </div>
        </aside>
      </div>

      {/* Mobile: sticky button */}
      <div className="fixed inset-x-0 bottom-[72px] z-30 px-4 lg:hidden">
        <button
          type="submit"
          disabled={submitting}
          className={`${PRIMARY_BTN} w-full shadow-lg`}
        >
          {submitting ? "Booking..." : "Confirm booking"}
        </button>
      </div>
    </form>
  );
}
