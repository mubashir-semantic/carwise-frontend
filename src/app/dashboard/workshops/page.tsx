"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/services/api";
import {
  CARD_CLASS,
  INPUT_CLASS,
  LatLng,
  Paginated,
  PRIMARY_BTN,
  SECONDARY_BTN,
  VehicleItem,
  WorkshopItem,
  distanceKm,
  errorMessage,
  formatDistance,
  todayString,
  unwrapList,
  vehicleLabel,
  workshopPoint,
} from "../_lib/booking";
import { useDraft } from "../_lib/draft";
import WayOfService from "../_components/WayOfService";
import WorkshopMap from "../_components/WorkshopMap";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "../_components/StateBlocks";

type Errors = Partial<Record<"pickup" | "date", string>>;

export default function ServiceBookingPage() {
  const router = useRouter();
  const { draft, update } = useDraft();

  const [workshops, setWorkshops] = useState<WorkshopItem[]>([]);
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  const [searched, setSearched] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [term, setTerm] = useState("");
  const [userPos, setUserPos] = useState<LatLng | null>(null);
  const [locating, setLocating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    Promise.all([
      api.get<Paginated<WorkshopItem>>("/workshops", { params: { limit: 100 } }),
      api.get("/vehicles").catch(() => ({ data: [] })),
    ])
      .then(([workshopRes, vehicleRes]) => {
        if (!active) return;
        setWorkshops(workshopRes.data.items ?? []);
        setVehicles(unwrapList<VehicleItem>(vehicleRes.data));
      })
      .catch(
        (err) =>
          active && setError(errorMessage(err, "Could not load workshops")),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [reload]);

  // Search: name / city / address; sort by closest distance if available
  const results = useMemo(() => {
    const query = term.trim().toLowerCase();
    const rows = workshops
      .filter((workshop) =>
        query
          ? [workshop.name, workshop.city, workshop.address]
              .filter(Boolean)
              .some((text) => String(text).toLowerCase().includes(query))
          : true,
      )
      .map((workshop) => {
        const point = workshopPoint(workshop);
        return {
          workshop,
          point,
          km: point && userPos ? distanceKm(userPos, point) : null,
        };
      });
    if (userPos) {
      rows.sort((a, b) => (a.km ?? Infinity) - (b.km ?? Infinity));
    }
    return rows;
  }, [workshops, term, userPos]);

  const mapPoints = results
    .filter((row) => row.point)
    .map((row) => ({
      id: row.workshop._id,
      name: row.workshop.name,
      lat: row.point!.lat,
      lng: row.point!.lng,
    }));

  function validate(): Errors {
    if (!draft) return {};
    const found: Errors = {};
    if (!draft.date) found.date = "Please select a date";
    else if (draft.date < todayString())
      found.date = "Cannot select a past date";
    if (draft.serviceType === "pickup_delivery" && !draft.pickupAddress.trim())
      found.pickup = "Please enter a pickup address";
    return found;
  }

  function handleSearch() {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setSearched(true);
    setTimeout(
      () => resultsRef.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  }

  function locateMe() {
    if (!navigator.geolocation) {
      toast.error("Location is not supported in this browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPos({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocating(false);
      },
      () => {
        setLocating(false);
        toast.error("Could not get location. Please allow location access in your browser.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  function openWorkshop(id: string) {
    if (!draft) return;
    // If a different workshop is selected, clear the previous cart services
    update({
      workshopId: id,
      services: draft.workshopId === id ? draft.services : [],
    });
    router.push(`/dashboard/workshops/${id}`);
  }

  if (!draft) return <LoadingBlock />;

  return (
    <div className="w-full">
      <h1 className="mb-1 text-xl font-bold text-text-heading sm:text-2xl">
        Service booking
      </h1>
      <p className="mb-6 text-sm text-text-muted">
        Specify your requirements, then choose a nearby workshop.
      </p>

      {/* ---------- Criteria (Figma: Way of service) ---------- */}
      <section className={`${CARD_CLASS} mb-8 lg:max-w-2xl`}>
        <h2 className="mb-4 text-base font-semibold text-text-heading">
          Way of service
        </h2>
        <WayOfService
          value={draft.serviceType}
          onChange={(value) => update({ serviceType: value })}
        />

        <div className="mt-5 space-y-3">
          {draft.serviceType === "pickup_delivery" && (
            <>
              <div>
                <input
                  className={INPUT_CLASS}
                  placeholder="Write your pickup address"
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
              <input
                className={INPUT_CLASS}
                placeholder="Write your delivery address (leave blank to use pickup address)"
                value={draft.deliveryAddress}
                maxLength={300}
                onChange={(e) => update({ deliveryAddress: e.target.value })}
              />
            </>
          )}

          <select
            className={INPUT_CLASS}
            value={draft.vehicleId}
            onChange={(e) => update({ vehicleId: e.target.value })}
          >
            <option value="">
              {vehicles.length === 0
                ? "No saved vehicles (optional)"
                : "Choose your vehicle (optional)"}
            </option>
            {vehicles.map((vehicle) => (
              <option key={vehicle._id} value={vehicle._id}>
                {vehicleLabel(vehicle)}
              </option>
            ))}
          </select>

          <div>
            <input
              type="date"
              className={INPUT_CLASS}
              min={todayString()}
              value={draft.date}
              onChange={(e) => {
                update({ date: e.target.value, timeSlot: "" });
                setErrors((prev) => ({ ...prev, date: undefined }));
              }}
            />
            {errors.date && (
              <p className="mt-1 text-xs text-error">{errors.date}</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSearch}
          className={`${PRIMARY_BTN} mt-6 w-full`}
        >
          Search
        </button>
      </section>

      {/* ---------- Results: map + list ---------- */}
      <div ref={resultsRef}>
        {searched &&
          (loading ? (
            <LoadingBlock text="Loading workshops..." />
          ) : error ? (
            <ErrorBlock message={error} onRetry={() => setReload((n) => n + 1)} />
          ) : (
            <section>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-text-heading">
                  Search results{" "}
                  <span className="text-sm font-normal text-text-muted">
                    ({results.length})
                  </span>
                </h2>
                <div className="flex gap-2">
                  <input
                    className={`${INPUT_CLASS} sm:w-64`}
                    placeholder="Search workshop or city"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={locateMe}
                    disabled={locating}
                    className={`${SECONDARY_BTN} shrink-0 !px-4`}
                  >
                    {locating ? "Locating..." : "Near me"}
                  </button>
                </div>
              </div>

              {results.length === 0 ? (
                <EmptyBlock
                  title="No workshops found"
                  message="Try a different name or city."
                />
              ) : (
                <div className="flex flex-col gap-6 lg:flex-row">
                  <div className="lg:flex-1">
                    {mapPoints.length > 0 ? (
                      <WorkshopMap
                        points={mapPoints}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        userPosition={userPos}
                        className="h-80 w-full lg:sticky lg:top-24 lg:h-[480px]"
                      />
                    ) : (
                      <div className="flex h-40 items-center justify-center rounded-2xl border border-border-main bg-surface-subtle px-6 text-center text-sm text-text-muted">
                        Map locations have not been added for these workshops yet.
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3 lg:w-[380px] lg:shrink-0">
                    {results.map(({ workshop, point, km }) => {
                      const selected = workshop._id === selectedId;
                      return (
                        <li
                          key={workshop._id}
                          onMouseEnter={() => point && setSelectedId(workshop._id)}
                          className={`flex items-center gap-4 rounded-2xl border bg-surface p-3 transition-colors ${
                            selected
                              ? "border-primary"
                              : "border-border-main"
                          }`}
                        >
                          {workshop.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={workshop.images[0]}
                              alt={workshop.name}
                              className="h-20 w-20 shrink-0 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl font-bold text-white">
                              {workshop.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-text-heading">
                              {workshop.name}
                            </p>
                            <p className="truncate text-xs text-text-muted">
                              {[workshop.city, workshop.address]
                                .filter(Boolean)
                                .join(" · ") || "Address not added"}
                            </p>
                            {km != null && (
                              <p className="mt-1 text-xs text-primary">
                                {formatDistance(km)}
                              </p>
                            )}
                            <button
                              type="button"
                              onClick={() => openWorkshop(workshop._id)}
                              className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-text-heading cursor-pointer"
                            >
                              BOOK NOW
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                                <svg
                                  className="h-3 w-3"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M5 12h14M13 6l6 6-6 6" />
                                </svg>
                              </span>
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </section>
          ))}
      </div>
    </div>
  );
}