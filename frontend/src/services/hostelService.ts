import type { Hostel, UserPreferences, Facility, RoomTypeKey } from '../types';
import { HOSTELS } from '../data';

export interface SearchFilters {
  gender?: 'boys' | 'girls' | null;
  location?: string;
  budgetMin?: number;
  budgetMax?: number;
  roomTypes?: RoomTypeKey[];
  facilities?: Facility[];
  foodOnly?: boolean;
  vegOnly?: boolean;
}

export type SortKey = 'recommended' | 'lowestPrice' | 'highestRated' | 'nearest' | 'mostFacilities' | 'recentlyAdded';

/** Service-layer abstraction. Today reads from generated mock data;
 *  swap the body for a fetch() to a real API without touching UI components. */
export function searchHostels(filters: SearchFilters, sort: SortKey = 'recommended'): Hostel[] {
  let results = [...HOSTELS];

  if (filters.gender) results = results.filter((h) => h.gender === filters.gender);
  if (filters.location) {
    const q = filters.location.toLowerCase();
    results = results.filter(
      (h) => h.city.toLowerCase().includes(q) || h.locality.toLowerCase().includes(q) || h.landmark.toLowerCase().includes(q)
    );
  }
  if (filters.budgetMin != null) results = results.filter((h) => h.price >= filters.budgetMin!);
  if (filters.budgetMax != null) results = results.filter((h) => h.price <= filters.budgetMax!);
  if (filters.roomTypes?.length) {
    results = results.filter((h) => h.roomTypes.some((r) => filters.roomTypes!.includes(r.type)));
  }
  if (filters.facilities?.length) {
    results = results.filter((h) => filters.facilities!.every((f) => h.facilities.includes(f)));
  }
  if (filters.foodOnly) results = results.filter((h) => h.food.included);
  if (filters.vegOnly) results = results.filter((h) => h.food.veg && !h.food.nonVeg);

  switch (sort) {
    case 'lowestPrice': results.sort((a, b) => a.price - b.price); break;
    case 'highestRated': results.sort((a, b) => b.rating - a.rating); break;
    case 'nearest': results.sort((a, b) => a.distanceKm - b.distanceKm); break;
    case 'mostFacilities': results.sort((a, b) => b.facilities.length - a.facilities.length); break;
    case 'recentlyAdded': results.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)); break;
    default:
      results.sort((a, b) => (b.rating * 10 - b.distanceKm) - (a.rating * 10 - a.distanceKm));
  }
  return results;
}

export function filtersFromPreferences(prefs: UserPreferences): SearchFilters {
  return {
    gender: prefs.gender,
    location: prefs.location,
    budgetMin: prefs.budgetMin,
    budgetMax: prefs.budgetMax,
    roomTypes: prefs.roomTypes,
    facilities: prefs.facilities,
    foodOnly: prefs.food.included,
    vegOnly: prefs.food.veg && !prefs.food.nonVeg,
  };
}

export function getHostelById(id: string): Hostel | undefined {
  return HOSTELS.find((h) => h.id === id);
}
