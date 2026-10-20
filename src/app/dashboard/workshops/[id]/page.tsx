"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import {
  CARD_CLASS,
  PRIMARY_BTN,
  SECONDARY_BTN,
  WorkshopItem,
  errorMessage,
  workshopPoint,
} from "../../_lib/booking";
import { useDraft } from "../../_lib/draft";
import WorkshopMap from "../../_components/WorkshopMap";
import { ErrorBlock, LoadingBlock } from "../../_components/StateBlocks";

export default function WorkshopDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { draft, update } = useDraft();

  const [workshop, setWorkshop] = useState<WorkshopItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    api
      .get<WorkshopItem>(`/workshops/${id}`)
      .then((res) => active && setWorkshop(res.data))
      .catch(
        (err) => active && setError(errorMessage(err, "Workshop not found")),
      )
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id, reload]);

  if (loading || !draft) return <LoadingBlock />;
  if (error || !workshop)
    return (
      <ErrorBlock
        message={error ?? "Workshop not found"}
        onRetry={() => setReload((n) => n + 1)}
      />
    );

  // Cart sirf isi workshop ki services ki hoti hai
  const cart = draft.workshopId === workshop._id ? draft.services : [];
  const services = workshop.services ?? [];
  const visibleServices = showAll ? services : services.slice(0, 6);
  const point = workshopPoint(workshop);

  function toggleService(name: string) {
    const next = cart.includes(name)
      ? cart.filter((item) => item !== name)
      : [...cart, name];
    update({ workshopId: workshop!._id, services: next });
  }

  function goToCart() {
    if (cart.length === 0) return;
    router.push(`/dashboard/book/${workshop!._id}`);
  }

  return (
    <div className="w-full pb-24 lg:pb-0">
      <Link
        href="/dashboard/workshops"
        className="mb-4 inline-block text-sm text-text-muted hover:text-primary"
      >
        ← Back to search
      </Link>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-6">
          {/* Hero */}
          <div className="relative overflow-hidden rounded-2xl">
            {workshop.images?.[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={workshop.images[0]}
                alt={workshop.name}
                className="h-56 w-full object-cover sm:h-72"
              />
            ) : (
              <div className="h-56 w-full bg-secondary sm:h-72" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5 text-white">
              <h1 className="text-xl font-bold sm:text-2xl">{workshop.name}</h1>
              <p className="text-sm text-white/80">
                {[workshop.city, workshop.address].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>

          <div className={CARD_CLASS}>
            <h2 className="mb-2 text-base font-semibold text-text-heading">
              Description
            </h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-main">
              {workshop.description || "No description added."}
            </p>
          </div>

          {/* Services grid + Add to cart */}
          <div className={CARD_CLASS}>
            <h2 className="mb-4 text-base font-semibold text-text-heading">
              Services
            </h2>
            {services.length === 0 ? (
              <p className="text-sm text-text-muted">
                Is workshop ne abhi services add nahi ki.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {visibleServices.map((name) => {
                    const added = cart.includes(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => toggleService(name)}
                        aria-pressed={added}
                        className={`flex flex-col items-center rounded-2xl border p-4 text-center transition-colors cursor-pointer ${
                          added
                            ? "border-primary bg-primary-tint"
                            : "border-border-main hover:border-primary"
                        }`}
                      >
                        <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-white">
                          <svg
                            className="h-6 w-6"
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
                        <span className="text-xs font-medium text-text-heading">
                          {name}
                        </span>
                        <span
                          className={`mt-1 text-[11px] font-semibold ${
                            added ? "text-secondary" : "text-primary"
                          }`}
                        >
                          {added ? "✓ Added" : "Add to cart ＋"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {services.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setShowAll((value) => !value)}
                    className={`${SECONDARY_BTN} mx-auto mt-5 !py-2 text-xs`}
                  >
                    {showAll ? "Show fewer services" : "Show all services"}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Location */}
          <div className={CARD_CLASS}>
            <h2 className="mb-3 text-base font-semibold text-text-heading">
              Location
            </h2>
            <p className="mb-3 text-sm text-text-main">
              {[workshop.address, workshop.city].filter(Boolean).join(", ") ||
                "Address not added"}
            </p>
            {point ? (
              <WorkshopMap
                points={[
                  {
                    id: workshop._id,
                    name: workshop.name,
                    lat: point.lat,
                    lng: point.lng,
                  },
                ]}
                selectedId={workshop._id}
                className="h-56 w-full"
              />
            ) : (
              <p className="text-xs text-text-muted">
                Is workshop ki map location abhi add nahi hui.
              </p>
            )}
          </div>
        </div>

        {/* Desktop: side summary */}
        <aside className="hidden w-[320px] shrink-0 lg:block">
          <div className={`${CARD_CLASS} sticky top-24`}>
            <h2 className="mb-3 text-base font-semibold text-text-heading">
              Contact
            </h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-text-muted">Phone</dt>
                <dd className="text-text-main">{workshop.phone || "-"}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Email</dt>
                <dd className="break-all text-text-main">{workshop.email || "-"}</dd>
              </div>
            </dl>
            <div className="my-5 border-t border-border-subtle" />
            <h2 className="mb-2 text-base font-semibold text-text-heading">
              My cart ({cart.length})
            </h2>
            {cart.length === 0 ? (
              <p className="text-sm text-text-muted">
                Kam az kam ek service &quot;Add to cart&quot; karo.
              </p>
            ) : (
              <ul className="mb-3 space-y-1 text-sm text-text-main">
                {cart.map((name) => (
                  <li key={name}>• {name}</li>
                ))}
              </ul>
            )}
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={goToCart}
              className={`${PRIMARY_BTN} mt-2 w-full`}
            >
              Review booking
            </button>
          </div>
        </aside>
      </div>

      {/* Mobile: neeche sticky cart bar (bottom navigation ke upar) */}
      <div className="fixed inset-x-0 bottom-[72px] z-30 px-4 lg:hidden">
        <button
          type="button"
          disabled={cart.length === 0}
          onClick={goToCart}
          className={`${PRIMARY_BTN} w-full shadow-lg`}
        >
          {cart.length === 0
            ? "Add a service to continue"
            : `Review booking (${cart.length})`}
        </button>
      </div>
    </div>
  );
}
