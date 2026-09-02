import { generateHostels, generateReviews } from './generator';
import { CITIES } from './cityMeta';
import { FACILITY_META, FACILITY_LIST } from './facilities';
import type { CityStats, Hostel } from '../types';

export const HOSTELS: Hostel[] = generateHostels(50);
export const REVIEWS = generateReviews(HOSTELS);

export function getCityStats(): CityStats[] {
  return CITIES.map((c) => {
    const list = HOSTELS.filter((h) => h.city === c.name);
    const n = list.length || 1;
    const wifiPct = Math.round((list.filter((h) => h.facilities.includes('wifi')).length / n) * 100);
    const acPct = Math.round((list.filter((h) => h.facilities.includes('ac')).length / n) * 100);
    const foodPct = Math.round((list.filter((h) => h.food.included).length / n) * 100);
    return {
      city: c.name,
      hostelCount: list.length,
      avgRent: list.length ? Math.round(list.reduce((s, h) => s + h.price, 0) / n) : 0,
      avgRating: list.length ? Math.round((list.reduce((s, h) => s + h.rating, 0) / n) * 10) / 10 : 0,
      popularAreas: c.localities.slice(0, 4),
      wifiPct, acPct, foodPct,
      avgSafety: list.length ? Math.round(list.reduce((s, h) => s + h.safetyScore, 0) / n) : 0,
    };
  });
}

export { CITIES, FACILITY_META, FACILITY_LIST };
