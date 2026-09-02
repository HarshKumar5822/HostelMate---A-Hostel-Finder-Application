import type { Hostel, UserPreferences } from '../types';

export interface MatchBreakdown {
  overall: number;
  budget: number;
  location: number;
  facilities: number;
  food: number;
  rating: number;
}

/** Estimates fit between a hostel and stated preferences. This is a heuristic,
 *  not a guarantee — surfaced in the UI as "Smart Match", an analytical estimate. */
export function computeMatch(hostel: Hostel, prefs: UserPreferences): MatchBreakdown {
  // Budget: 100 if within range, decays as price moves outside the band.
  let budget = 100;
  if (hostel.price < prefs.budgetMin) {
    budget = 100;
  } else if (hostel.price > prefs.budgetMax) {
    const overshoot = (hostel.price - prefs.budgetMax) / prefs.budgetMax;
    budget = Math.max(20, Math.round(100 - overshoot * 140));
  }

  // Location: closer distance -> higher score, with locality text match bonus.
  const distanceScore = Math.max(30, Math.round(100 - hostel.distanceKm * 9));
  const localityBonus = prefs.location && hostel.locality.toLowerCase().includes(prefs.location.toLowerCase()) ? 8 : 0;
  const location = Math.min(100, distanceScore + localityBonus);

  // Facilities: overlap between requested and available.
  const facilities = prefs.facilities.length
    ? Math.round((prefs.facilities.filter((f) => hostel.facilities.includes(f)).length / prefs.facilities.length) * 100)
    : 85;

  // Food: match on inclusion + veg/non-veg preference.
  let food = 60;
  if (prefs.food.included) {
    food = hostel.food.included ? 92 : 35;
    if (prefs.food.nonVeg && hostel.food.nonVeg) food = Math.min(100, food + 6);
  } else {
    food = 80;
  }

  const rating = Math.round((hostel.rating / 5) * 100);

  const overall = Math.round(
    budget * 0.28 + location * 0.27 + facilities * 0.2 + food * 0.13 + rating * 0.12
  );

  return { overall, budget, location, facilities, food, rating };
}
