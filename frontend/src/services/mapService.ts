import type { Hostel } from '../types';

/**
 * Map provider abstraction.
 *
 * This project ships with a lightweight projected-plane renderer (see
 * MapView.tsx) so the UI is fully interactive without external API keys.
 * To connect a real provider:
 *   1. Add VITE_GOOGLE_MAPS_KEY or VITE_MAPBOX_TOKEN to .env
 *   2. Implement `loadMapProvider()` below to mount the SDK
 *   3. Replace <PlaceholderMap> usage in MapView.tsx with the real map,
 *      keeping the same `markers`, `onMarkerClick`, `bounds` props.
 * Hostel records already carry `latitude`/`longitude`/`googlePlaceId`
 * fields so no data-shape changes are required.
 */
export interface MapBounds {
  minLat: number; maxLat: number; minLng: number; maxLng: number;
}

export function computeBounds(hostels: Hostel[]): MapBounds {
  if (hostels.length === 0) return { minLat: 8, maxLat: 34, minLng: 68, maxLng: 90 };
  const lats = hostels.map((h) => h.latitude);
  const lngs = hostels.map((h) => h.longitude);
  const pad = 0.02;
  return {
    minLat: Math.min(...lats) - pad,
    maxLat: Math.max(...lats) + pad,
    minLng: Math.min(...lngs) - pad,
    maxLng: Math.max(...lngs) + pad,
  };
}

export function project(h: Hostel, bounds: MapBounds) {
  const x = ((h.longitude - bounds.minLng) / (bounds.maxLng - bounds.minLng || 1)) * 100;
  const y = 100 - ((h.latitude - bounds.minLat) / (bounds.maxLat - bounds.minLat || 1)) * 100;
  return { x: Math.min(97, Math.max(3, x)), y: Math.min(97, Math.max(3, y)) };
}

export function isMapProviderConfigured(): boolean {
  // Swap for: return Boolean(import.meta.env.VITE_GOOGLE_MAPS_KEY || import.meta.env.VITE_MAPBOX_TOKEN)
  return false;
}
