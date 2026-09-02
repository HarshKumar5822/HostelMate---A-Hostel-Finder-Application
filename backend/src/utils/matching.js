/**
 * Estimates fit between a hostel document and a user's stated preferences.
 * This is a heuristic surfaced in the UI as "Smart Match" — an analytical
 * estimate, not a guarantee. Mirrors src/services/matching.ts on the frontend.
 */
function computeMatch(hostel, prefs = {}) {
  const budgetMin = prefs.budgetMin ?? 5000;
  const budgetMax = prefs.budgetMax ?? 15000;

  let budget = 100;
  if (hostel.price > budgetMax) {
    const overshoot = (hostel.price - budgetMax) / budgetMax;
    budget = Math.max(20, Math.round(100 - overshoot * 140));
  }

  const distanceScore = Math.max(30, Math.round(100 - (hostel.distanceKm || 0) * 9));
  const localityBonus =
    prefs.location && hostel.locality?.toLowerCase().includes(String(prefs.location).toLowerCase()) ? 8 : 0;
  const location = Math.min(100, distanceScore + localityBonus);

  const requestedFacilities = prefs.facilities || [];
  const facilities = requestedFacilities.length
    ? Math.round(
        (requestedFacilities.filter((f) => hostel.facilities.includes(f)).length / requestedFacilities.length) * 100
      )
    : 85;

  let food = 80;
  if (prefs.food?.included) {
    food = hostel.food?.included ? 92 : 35;
    if (prefs.food.nonVeg && hostel.food?.nonVeg) food = Math.min(100, food + 6);
  }

  const rating = Math.round(((hostel.rating || 0) / 5) * 100);

  const overall = Math.round(budget * 0.28 + location * 0.27 + facilities * 0.2 + food * 0.13 + rating * 0.12);

  return { overall, budget, location, facilities, food, rating };
}

module.exports = { computeMatch };
