import type { Hostel } from '../types';

export interface AnalysisResult {
  overall: number;
  valueForMoney: number;
  location: number;
  facilities: number;
  food: number;
  safety: number;
  reviews: number;
  pros: string[];
  cons: string[];
  verdict: string;
}

/** A transparent, formula-based estimate — not a guarantee of quality.
 *  Combines price-per-facility, distance, review data and safety score. */
export function analyzeHostel(hostel: Hostel): AnalysisResult {
  const pricePerFacility = hostel.price / Math.max(6, hostel.facilities.length);
  const valueForMoney = Math.max(30, Math.min(100, Math.round(115 - pricePerFacility / 85)));
  const location = Math.max(30, Math.round(100 - hostel.distanceKm * 8));
  const facilities = Math.round((hostel.facilities.length / 19) * 100);
  const food = Math.round(hostel.food.rating * 20);
  const safety = hostel.safetyScore;
  const reviews = Math.round((hostel.rating / 5) * 100);

  const overall = Math.round(
    valueForMoney * 0.24 + location * 0.2 + facilities * 0.16 + food * 0.14 + safety * 0.16 + reviews * 0.1
  );

  let verdict = 'Worth reconsidering — compare with nearby options';
  if (overall >= 85) verdict = 'Excellent choice for students';
  else if (overall >= 70) verdict = 'Good choice for students';
  else if (overall >= 55) verdict = 'Decent, but worth comparing alternatives';

  return {
    overall, valueForMoney, location, facilities, food, safety, reviews,
    pros: hostel.pros,
    cons: hostel.cons,
    verdict,
  };
}
