"use client";

import { useEffect, useRef, useState } from "react";
import type { LayerGroup, Map as LeafletMap } from "leaflet";
import type { LatLng } from "../_lib/booking";

type LeafletModule = typeof import("leaflet");

export type MapPoint = { id: string; name: string; lat: number; lng: number };

type Props = {
  points: MapPoint[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  userPosition?: LatLng | null;
  className?: string;
};

const DEFAULT_CENTER: [number, number] = [30.3753, 69.3451];

function ensureLeafletCss() {
  if (typeof document === "undefined") return;
  if (document.getElementById("leaflet-css")) return;
  const link = document.createElement("link");
  link.id = "leaflet-css";
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  document.head.appendChild(link);
}

function pinHtml(selected: boolean) {
  const color = selected ? "#1e1b4b" : "#f5924a";
  const size = selected ? 34 : 28;
  return `<div style="width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)"></div>`;
}

// OpenStreetMap par workshops ke pins (Figma ke orange pins jaisa)
export default function WorkshopMap({
  points,
  selectedId,
  onSelect,
  userPosition,
  className = "h-72 w-full",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const fittedKey = useRef("");
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    ensureLeafletCss();

    import("leaflet").then((mod) => {
      if (cancelled || !containerRef.current || mapRef.current) return;
      const L = ((mod as unknown as { default?: LeafletModule }).default ??
        mod) as LeafletModule;
      leafletRef.current = L;

      const map = L.map(containerRef.current, { scrollWheelZoom: false }).setView(
        DEFAULT_CENTER,
        5,
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setReady(true);
      setTimeout(() => map.invalidateSize(), 0);
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
      setReady(false);
    };
  }, []);

  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!ready || !L || !map || !layer) return;

    layer.clearLayers();

    points.forEach((point) => {
      const selected = point.id === selectedId;
      const marker = L.marker([point.lat, point.lng], {
        icon: L.divIcon({
          className: "",
          html: pinHtml(selected),
          iconSize: [28, 28],
          iconAnchor: [14, 28],
        }),
        zIndexOffset: selected ? 1000 : 0,
      }).addTo(layer);
      marker.bindTooltip(point.name);
      marker.on("click", () => onSelectRef.current?.(point.id));
    });

    if (userPosition) {
      L.circleMarker([userPosition.lat, userPosition.lng], {
        radius: 8,
        color: "#fff",
        weight: 3,
        fillColor: "#2563eb",
        fillOpacity: 1,
      })
        .bindTooltip("You are here")
        .addTo(layer);
    }

    // Zoom sirf tab badlo jab points / user ki jagah badle, selection par nahi
    const key =
      points.map((p) => p.id).join(",") +
      (userPosition ? `|${userPosition.lat},${userPosition.lng}` : "");
    if (key !== fittedKey.current) {
      fittedKey.current = key;
      const coords: [number, number][] = points.map((p) => [p.lat, p.lng]);
      if (userPosition) coords.push([userPosition.lat, userPosition.lng]);
      if (coords.length === 1) {
        map.setView(coords[0], 15);
      } else if (coords.length > 1) {
        map.fitBounds(coords, { padding: [40, 40], maxZoom: 15 });
      }
    }

    const selectedPoint = points.find((p) => p.id === selectedId);
    if (selectedPoint) map.panTo([selectedPoint.lat, selectedPoint.lng]);
  }, [ready, points, selectedId, userPosition]);

  return (
    <div
      ref={containerRef}
      className={`${className} overflow-hidden rounded-2xl border border-border-main`}
      // leaflet ke layers header/menu ke upar na aayen
      style={{ isolation: "isolate" }}
    />
  );
}
