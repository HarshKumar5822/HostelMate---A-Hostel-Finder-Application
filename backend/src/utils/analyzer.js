/**
 * A transparent, formula-based estimate of whether a hostel is "worth it" —
 * not a certified inspection. Mirrors src/services/analyzer.ts on the frontend.
 */
function analyzeHostel(hostel) {
  const facilitiesCount = hostel.facilities?.length || 0;
  const pricePerFacility = hostel.price / Math.max(6, facilitiesCount);
  const valueForMoney = Math.max(30, Math.min(100, Math.round(115 - pricePerFacility / 85)));
  const location = Math.max(30, Math.round(100 - (hostel.distanceKm || 0) * 8));
  const facilities = Math.round((facilitiesCount / 19) * 100);
  const food = Math.round((hostel.food?.rating || 0) * 20);
  const safety = hostel.safetyScore || 0;
  const reviews = Math.round(((hostel.rating || 0) / 5) * 100);

  const overall = Math.round(
    valueForMoney * 0.24 + location * 0.2 + facilities * 0.16 + food * 0.14 + safety * 0.16 + reviews * 0.1
  );

  let verdict = 'Worth reconsidering — compare with nearby options';
  if (overall >= 85) verdict = 'Excellent choice for students';
  else if (overall >= 70) verdict = 'Good choice for students';
  else if (overall >= 55) verdict = 'Decent, but worth comparing alternatives';

  return {
    overall,
    valueForMoney,
    location,
    facilities,
    food,
    safety,
    reviews,
    pros: hostel.pros || [],
    cons: hostel.cons || [],
    verdict,
  };
}

module.exports = { analyzeHostel };
