import type {
  Hostel, Facility, RoomOption, RoomTypeKey, FoodInfo, Review, DataConfidence,
} from '../types';
import { CITIES, LANDMARKS } from './cityMeta';
import { FACILITY_LIST } from './facilities';

// Deterministic PRNG (mulberry32) so mock data is stable across renders.
function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20260829);
const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)];
const pickN = <T,>(arr: T[], n: number) => {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(rng() * copy.length), 1)[0]);
  }
  return out;
};
const int = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
const round = (n: number, dp = 1) => Math.round(n * 10 ** dp) / 10 ** dp;

const INDIAN_HOSTEL_NAMES = [
  'Sri Sai', 'Sri Venkateshwara', 'Praneetha', 'Sri Ram', 'Sri Laxmi',
  'Ganesh', 'Saraswati', 'Sri Balaji', 'Siva Sai', 'Lakshmi Narayana',
  'Sri Krishna', 'Srinivasa', 'Mahalaxmi', 'Devi', 'Sri Gayatri',
  'Surya', 'Ananda', 'Sri Rama', 'Radha Krishna', 'Sri Kanya',
  'Royal', 'Sai Tirumala', 'Navya', 'Sneha', 'Pavan', 'Aditya',
  'Karthik', 'Durga', 'Swagath', 'Nandi', 'Chaitanya', 'Abhyudaya',
  'Sri Balaji Deluxe', 'Om Sri', 'Sri Guru', 'Sri Vigneswara', 'Sri Hanuman',
  'Venkata Sai', 'Sri Mallikarjuna', 'Sri Durga Bhavani', 'Annapurna',
];

const MENS_SUFFIXES = [
  "Men's Hostel", "Boys PG", "Gents Hostel", "Men's Luxury PG",
  "Men's Deluxe Hostel", "Gents PG & Hostel", "Executive Men's PG",
  "Boys Student Living", "Gents Deluxe PG", "Men's Residency",
];

const WOMENS_SUFFIXES = [
  "Women's Hostel", "Girls PG", "Ladies Hostel", "Women's Deluxe PG",
  "Girls Luxury Hostel", "Ladies PG & Residency", "Executive Women's PG",
  "Girls Student Living", "Ladies Deluxe PG", "Women's Residency",
];

const BUILDING_EXTERIOR_IMAGES = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1460317476681-8c4328d8b948?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=800&q=80',
];

const INTERIOR_ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
];

const OWNERS = ['Ravi Kumar', 'Lakshmi Rao', 'Anand Textiles Trust', 'Fatima Sheikh', 'Vikram Estates', 'Priya Nair', 'Suresh & Sons', 'Meera Housing'];
const FOOD_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const BREAKFASTS = ['Idli & Sambar', 'Poha', 'Aloo Paratha', 'Upma', 'Bread Omelette / Toast', 'Dosa & Chutney', 'Puri Bhaji'];
const LUNCHES = ['Dal, Rice, Roti, Sabzi', 'Rajma Chawal', 'Sambar Rice + Curd', 'Chole Bhature', 'Veg Thali', 'Curd Rice + Pickle', 'Egg Curry + Rice'];
const DINNERS = ['Roti, Paneer Sabzi, Dal', 'Fried Rice + Manchurian', 'Khichdi + Papad', 'Chicken Curry + Rice', 'Veg Pulao + Raita', 'Roti + Mixed Veg'];

const PROS_POOL = [
  'Excellent location near campus', 'Good security & CCTV coverage', 'Strong Wi-Fi speed',
  'Affordable for the facilities offered', 'Friendly warden and staff', 'Clean and well-maintained rooms',
  'Tasty home-style food', 'Quick response to maintenance requests', 'Great common study area',
];
const CONS_POOL = [
  'Mixed reviews on food variety', 'Limited parking space', 'Water pressure issues at peak hours',
  'Rooms can get noisy near the main road', 'Wi-Fi slows down in the evening', 'Housekeeping is not daily',
];

const REVIEW_NAMES = ['Ananya S.', 'Rahul V.', 'Priya M.', 'Karthik R.', 'Sneha D.', 'Arjun P.', 'Divya K.', 'Mohit J.', 'Neha T.', 'Sathish B.', 'Ritika A.', 'Farhan Q.'];
const REVIEW_TEXTS = [
  'Been staying here for 6 months, food quality has been consistent and the warden is approachable.',
  'Rooms are clean and Wi-Fi works well for online classes. Would recommend to juniors.',
  'Decent place for the price, though the geyser takes time to heat water in winters.',
  'Great location, walking distance to office. Security feels solid with CCTV everywhere.',
  'Food could be better on weekends but overall a comfortable stay.',
  'Moved here after visiting five other hostels — this one had the best value for money.',
  'Laundry service is efficient and the common area is a nice place to unwind.',
  'Safety was my main concern as a girl living alone in a new city, and this hostel handled it well.',
];

function randomFoodInfo(): FoodInfo {
  const included = rng() > 0.15;
  const weeklyMenu = FOOD_DAYS.map((day) => ({
    day, breakfast: pick(BREAKFASTS), lunch: pick(LUNCHES), dinner: pick(DINNERS),
  }));
  return {
    included,
    breakfast: included,
    lunch: included,
    dinner: included && rng() > 0.1,
    veg: true,
    nonVeg: rng() > 0.45,
    messAvailable: included,
    rating: round(3 + rng() * 2, 1),
    weeklyMenu,
    confidence: included ? (rng() > 0.5 ? 'verified' : 'community') : 'sample',
  };
}

function randomRooms(baseRent: number): RoomOption[] {
  const configs: { type: RoomTypeKey; label: string; occupancy: number; mult: number }[] = [
    { type: 'single', label: 'Single Occupancy', occupancy: 1, mult: 1.4 },
    { type: 'double', label: 'Double Sharing', occupancy: 2, mult: 1.15 },
    { type: 'triple', label: 'Triple Sharing', occupancy: 3, mult: 1.0 },
    { type: 'quad', label: '4 Sharing', occupancy: 4, mult: 0.85 },
    { type: 'fivePlus', label: '5+ Sharing', occupancy: 5, mult: 0.7 },
  ];
  const chosen = pickN(configs, int(2, 4)).sort((a, b) => a.occupancy - b.occupancy);
  return chosen.map((c) => {
    const bedsAvailable = int(0, 6);
    return {
      type: c.type,
      label: c.label,
      price: Math.round((baseRent * c.mult) / 100) * 100,
      occupancy: c.occupancy,
      facilities: pickN(FACILITY_LIST, int(4, 7)),
      availability: bedsAvailable === 0 ? 'full' : bedsAvailable <= 2 ? 'limited' : 'available',
      bedsAvailable,
    };
  });
}

function jitter(base: number, span: number) {
  return base + (rng() - 0.5) * span;
}

function confidencePick(): DataConfidence {
  const r = rng();
  if (r < 0.35) return 'verified';
  if (r < 0.6) return 'community';
  if (r < 0.8) return 'estimated';
  if (r < 0.92) return 'live';
  return 'sample';
}

export function generateHostels(perCityCount = 50): Hostel[] {
  const hostels: Hostel[] = [];
  let globalIndex = 0;

  CITIES.forEach((city) => {
    for (let i = 0; i < perCityCount; i++) {
      globalIndex++;
      const locality = pick(city.localities);
      const gender = rng() > 0.5 ? 'girls' : 'boys';
      
      // Weighted base rent calculation: 60% ₹5,000-₹8,000, 25% ₹8,100-₹11,000, 15% ₹11,100-₹15,000
      const roll = rng();
      let baseRent: number;
      if (roll < 0.60) {
        baseRent = int(50, 80) * 100;
      } else if (roll < 0.85) {
        baseRent = int(81, 110) * 100;
      } else {
        baseRent = int(111, 150) * 100;
      }

      const rating = round(3.2 + rng() * 1.7, 1);
      const bedsAvailable = int(0, 8);
      const availability = bedsAvailable === 0 ? 'full' : bedsAvailable <= 2 ? 'limited' : 'available';
      const facilities = pickN(FACILITY_LIST, int(6, 13));
      const safetyBreakdown = {
        security: int(70, 99),
        cctvCoverage: int(65, 99),
        accessControl: int(60, 99),
        userFeedback: int(70, 98),
      };
      const safetyScore = Math.round(
        (safetyBreakdown.security + safetyBreakdown.cctvCoverage + safetyBreakdown.accessControl + safetyBreakdown.userFeedback) / 4
      );
      const id = `hm-${city.name.toLowerCase()}-${i + 1}`;
      const landmarkOptions = LANDMARKS[locality] || [`Near ${locality} main road`];

      const indianPrefix = pick(INDIAN_HOSTEL_NAMES);
      const indianSuffix = gender === 'girls' ? pick(WOMENS_SUFFIXES) : pick(MENS_SUFFIXES);
      const hostelName = `${indianPrefix} ${indianSuffix}`;

      hostels.push({
        id,
        name: hostelName,
        gender,
        city: city.name,
        locality,
        address: `${int(1, 200)}, ${locality}, ${city.name}, ${city.state}`,
        latitude: round(jitter(city.lat, 0.14), 5),
        longitude: round(jitter(city.lng, 0.14), 5),
        rating,
        reviewCount: int(12, 480),
        price: baseRent,
        distanceKm: round(0.3 + rng() * 6.5, 1),
        availability,
        bedsAvailable,
        images: [pick(BUILDING_EXTERIOR_IMAGES), ...pickN(INTERIOR_ROOM_IMAGES, 3)],
        facilities,
        food: randomFoodInfo(),
        roomTypes: randomRooms(baseRent),
        safetyScore,
        safetyBreakdown,
        description: `${gender === 'girls' ? 'A women-only' : 'A'} residence in ${locality}, ${city.name}, built for students and working professionals who want a dependable place to live without compromising on safety, food or connectivity. Close to major colleges, tech parks and transit lines in ${locality}.`,
        phone: `+91 ${int(70000, 99999)}${int(10000, 99999)}`,
        website: rng() > 0.5 ? `https://${id}.hostelmate.example` : undefined,
        verified: rng() > 0.35,
        owner: pick(OWNERS),
        updatedAt: `2026-0${int(6, 8)}-${int(10, 28)}`,
        googlePlaceId: rng() > 0.4 ? `ChIJ${Math.random().toString(36).slice(2, 12)}` : undefined,
        priceConfidence: confidencePick(),
        availabilityConfidence: confidencePick(),
        landmark: pick(landmarkOptions),
        pros: pickN(PROS_POOL, 3),
        cons: pickN(CONS_POOL, 2),
      });
    }
  });

  return hostels;
}

export function generateReviews(hostels: Hostel[]): Review[] {
  const reviews: Review[] = [];
  hostels.forEach((h) => {
    const n = int(3, 6);
    for (let i = 0; i < n; i++) {
      reviews.push({
        id: `${h.id}-rev-${i}`,
        hostelId: h.id,
        name: pick(REVIEW_NAMES),
        role: rng() > 0.5 ? 'Student' : 'Professional',
        rating: int(3, 5),
        text: pick(REVIEW_TEXTS),
        date: `2026-0${int(1, 8)}-${int(1, 28)}`,
        categories: {
          cleanliness: int(3, 5),
          food: int(3, 5),
          location: int(3, 5),
          safety: int(3, 5),
          staff: int(3, 5),
          value: int(3, 5),
        },
      });
    }
  });
  return reviews;
}

export const ALL_FACILITIES: Facility[] = FACILITY_LIST;
