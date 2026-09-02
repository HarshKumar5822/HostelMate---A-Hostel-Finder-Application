/**
 * Seeds MongoDB with realistic demo hostel data across Indian cities.
 * Mirrors the logic used by the frontend's src/data/generator.ts so the
 * two stay conceptually in sync once the frontend is switched to call
 * the real API instead of its local mock data.
 *
 * Usage:
 *   npm run seed            # wipes hostels/reviews and reseeds
 *   npm run seed:destroy    # wipes hostels/reviews/inquiries only
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Hostel = require('../models/Hostel');
const Review = require('../models/Review');
const Owner = require('../models/Owner');
const Inquiry = require('../models/Inquiry');
const User = require('../models/User');

const CITIES = [
  { name: 'Hyderabad', state: 'Telangana', lat: 17.385, lng: 78.4867, localities: ['Gachibowli', 'Madhapur', 'Kukatpally', 'Ameerpet', 'Hitech City', 'Kondapur', 'SR Nagar', 'Manikonda', 'Hafeezpet', 'Miyapur'] },
  { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946, localities: ['Koramangala', 'HSR Layout', 'Whitefield', 'Electronic City', 'BTM Layout', 'Marathahalli', 'Indiranagar', 'Jayanagar', 'Bellandur', 'Hebbal'] },
  { name: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.209, localities: ['Kamla Nagar', 'Mukherjee Nagar', 'Laxmi Nagar', 'Karol Bagh', 'Vasant Kunj', 'GTB Nagar', 'Satya Niketan', 'Hauz Khas', 'Rohini', 'Dwarka'] },
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.8777, localities: ['Andheri', 'Powai', 'Dadar', 'Borivali', 'Kharghar', 'Vile Parle', 'Malad', 'Thane', 'Bandra', 'Nerul'] },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, localities: ['Hinjewadi', 'Kothrud', 'Viman Nagar', 'Baner', 'Hadapsar', 'Wakad', 'Aundh', 'Pimple Saudagar', 'Kharadi', 'Shivajinagar'] },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, localities: ['Velachery', 'Adyar', 'OMR', 'T Nagar', 'Guindy', 'Thoraipakkam', 'Sholinganallur', 'Porur', 'Nungambakkam', 'Chromepet'] },
  { name: 'Noida', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.391, localities: ['Sector 62', 'Sector 18', 'Sector 137', 'Sector 15', 'Greater Noida Knowledge Park', 'Sector 126', 'Sector 76', 'Sector 50'] },
  { name: 'Gurgaon', state: 'Haryana', lat: 28.4595, lng: 77.0266, localities: ['Sector 29', 'DLF Phase 3', 'Udyog Vihar', 'Sohna Road', 'DLF Phase 2', 'Golf Course Road', 'Sector 45', 'Sector 14'] },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, localities: ['Malviya Nagar', 'Vaishali Nagar', 'C-Scheme', 'Raja Park', 'Mansarovar', 'Jagatpura', 'Tonga Road', 'Gopalpura Bypass'] },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, localities: ['Salt Lake', 'Jadavpur', 'Park Street', 'New Town', 'Bidhannagar', 'Gariahat', 'Kasba', 'Dum Dum'] },
];

const FACILITY_LIST = [
  'wifi', 'ac', 'powerBackup', 'laundry', 'washingMachine', 'parking',
  'cctv', 'security', 'studyRoom', 'gym', 'commonArea', 'housekeeping',
  'attachedBathroom', 'hotWater', 'refrigerator', 'tv', 'roWater',
  'lift', 'biometric',
];

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

const FOOD_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const BREAKFASTS = ['Idli & Sambar', 'Poha', 'Aloo Paratha', 'Upma', 'Bread Omelette / Toast', 'Dosa & Chutney'];
const LUNCHES = ['Dal, Rice, Roti, Sabzi', 'Rajma Chawal', 'Sambar Rice + Curd', 'Chole Bhature', 'Veg Thali'];
const DINNERS = ['Roti, Paneer Sabzi, Dal', 'Fried Rice + Manchurian', 'Khichdi + Papad', 'Veg Pulao + Raita'];
const PROS_POOL = ['Excellent location near campus', 'Good security & CCTV coverage', 'Strong Wi-Fi speed', 'Affordable for the facilities offered', 'Friendly warden and staff', 'Clean and well-maintained rooms'];
const CONS_POOL = ['Mixed reviews on food variety', 'Limited parking space', 'Water pressure issues at peak hours', 'Wi-Fi slows down in the evening'];
const CONFIDENCE = ['verified', 'community', 'estimated', 'live', 'sample'];
const REVIEW_NAMES = ['Ananya S.', 'Rahul V.', 'Priya M.', 'Karthik R.', 'Sneha D.', 'Arjun P.', 'Divya K.', 'Mohit J.'];
const REVIEW_TEXTS = [
  'Been staying here for 6 months, food quality has been consistent and the warden is approachable.',
  'Rooms are clean and Wi-Fi works well for online classes.',
  'Decent place for the price, though the geyser takes time to heat water in winters.',
  'Great location, walking distance to office. Security feels solid with CCTV everywhere.',
  'Moved here after visiting five other hostels — this one had the best value for money.',
];

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickN = (arr, n) => [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
const jitter = (base, span) => base + (Math.random() - 0.5) * span;

function buildFood() {
  const included = Math.random() > 0.15;
  return {
    included,
    breakfast: included,
    lunch: included,
    dinner: included && Math.random() > 0.1,
    veg: true,
    nonVeg: Math.random() > 0.45,
    messAvailable: included,
    rating: Math.round((3 + Math.random() * 2) * 10) / 10,
    weeklyMenu: FOOD_DAYS.map((day) => ({ day, breakfast: pick(BREAKFASTS), lunch: pick(LUNCHES), dinner: pick(DINNERS) })),
    confidence: included ? (Math.random() > 0.5 ? 'verified' : 'community') : 'sample',
  };
}

function buildRooms(baseRent) {
  const configs = [
    { type: 'single', label: 'Single Occupancy', occupancy: 1, mult: 1.4 },
    { type: 'double', label: 'Double Sharing', occupancy: 2, mult: 1.15 },
    { type: 'triple', label: 'Triple Sharing', occupancy: 3, mult: 1.0 },
    { type: 'quad', label: '4 Sharing', occupancy: 4, mult: 0.85 },
    { type: 'fivePlus', label: '5+ Sharing', occupancy: 5, mult: 0.7 },
  ];
  return pickN(configs, rand(2, 4)).map((c) => {
    const bedsAvailable = rand(0, 6);
    return {
      type: c.type,
      label: c.label,
      price: Math.round((baseRent * c.mult) / 100) * 100,
      occupancy: c.occupancy,
      facilities: pickN(FACILITY_LIST, rand(4, 7)),
      availability: bedsAvailable === 0 ? 'full' : bedsAvailable <= 2 ? 'limited' : 'available',
      bedsAvailable,
    };
  });
}

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

async function buildHostel(ownerId, targetCity, i) {
  const city = targetCity;
  const locality = pick(city.localities);
  const gender = Math.random() > 0.5 ? 'girls' : 'boys';
  
  // Weighted base rent: 60% ₹5,000-₹8,000, 25% ₹8,100-₹11,000, 15% ₹11,100-₹15,000
  const roll = Math.random();
  let baseRent;
  if (roll < 0.60) {
    baseRent = rand(50, 80) * 100;
  } else if (roll < 0.85) {
    baseRent = rand(81, 110) * 100;
  } else {
    baseRent = rand(111, 150) * 100;
  }

  const bedsAvailable = rand(0, 8);
  const availability = bedsAvailable === 0 ? 'full' : bedsAvailable <= 2 ? 'limited' : 'available';
  const facilities = pickN(FACILITY_LIST, rand(6, 13));
  const safetyBreakdown = {
    security: rand(70, 99), cctvCoverage: rand(65, 99), accessControl: rand(60, 99), userFeedback: rand(70, 98),
  };
  const safetyScore = Math.round(Object.values(safetyBreakdown).reduce((a, b) => a + b, 0) / 4);

  const indianPrefix = pick(INDIAN_HOSTEL_NAMES);
  const indianSuffix = gender === 'girls' ? pick(WOMENS_SUFFIXES) : pick(MENS_SUFFIXES);
  const hostelName = `${indianPrefix} ${indianSuffix}`;

  return {
    name: hostelName,
    gender,
    city: city.name,
    locality,
    address: `${rand(1, 200)}, ${locality}, ${city.name}, ${city.state}`,
    latitude: Math.round(jitter(city.lat, 0.14) * 1e5) / 1e5,
    longitude: Math.round(jitter(city.lng, 0.14) * 1e5) / 1e5,
    rating: Math.round((3.2 + Math.random() * 1.7) * 10) / 10,
    reviewCount: 0,
    price: baseRent,
    distanceKm: Math.round((0.3 + Math.random() * 6.5) * 10) / 10,
    availability,
    bedsAvailable,
    images: [pick(BUILDING_EXTERIOR_IMAGES), ...pickN(INTERIOR_ROOM_IMAGES, 3)],
    facilities,
    food: buildFood(),
    roomTypes: buildRooms(baseRent),
    safetyScore,
    safetyBreakdown,
    description: `${gender === 'girls' ? 'A women-only' : 'A'} residence in ${locality}, ${city.name}, built for students and working professionals who want a dependable place to live without compromising on safety, food or connectivity.`,
    phone: `+91 ${rand(70000, 99999)}${rand(10000, 99999)}`,
    verified: Math.random() > 0.35,
    owner: ownerId,
    googlePlaceId: Math.random() > 0.4 ? `ChIJ${Math.random().toString(36).slice(2, 12)}` : null,
    priceConfidence: pick(CONFIDENCE),
    availabilityConfidence: pick(CONFIDENCE),
    landmark: `Near ${locality} main road`,
    pros: pickN(PROS_POOL, 3),
    cons: pickN(CONS_POOL, 2),
  };
}

async function run() {
  await connectDB();

  if (process.argv.includes('--destroy')) {
    await Promise.all([Hostel.deleteMany(), Review.deleteMany(), Inquiry.deleteMany()]);
    console.log('[seed] Cleared hostels, reviews and inquiries.');
    await mongoose.disconnect();
    return;
  }

  console.log('[seed] Clearing existing data...');
  await Promise.all([Hostel.deleteMany(), Review.deleteMany(), Inquiry.deleteMany()]);

  let demoOwner = await Owner.findOne({ email: 'demo-owner@hostelmate.example' });
  if (!demoOwner) {
    demoOwner = await Owner.create({
      name: 'Demo Owner',
      businessName: 'HostelMate Demo Properties',
      email: 'demo-owner@hostelmate.example',
      password: 'password123',
      phone: '+91 9876543210',
    });
    console.log('[seed] Created demo owner -> demo-owner@hostelmate.example / password123');
  }

  let demoUser = await User.findOne({ email: 'user@hostelmate.com' });
  if (!demoUser) {
    demoUser = await User.create({
      name: 'Harsh Kumar',
      email: 'user@hostelmate.com',
      password: 'password123',
    });
    console.log('[seed] Created demo user -> user@hostelmate.com / password123');
  }

  console.log('[seed] Generating 50 hostels for EACH city (500 hostels total)...');
  const hostelDocs = [];
  for (const city of CITIES) {
    for (let i = 0; i < 50; i++) {
      hostelDocs.push(await buildHostel(demoOwner._id, city, i));
    }
  }
  const hostels = await Hostel.insertMany(hostelDocs);
  demoOwner.hostels = hostels.map((h) => h._id);
  await demoOwner.save();
  console.log(`[seed] Inserted ${hostels.length} hostels.`);

  console.log('[seed] Generating reviews...');
  const reviewDocs = [];
  hostels.forEach((h) => {
    const n = rand(3, 6);
    for (let i = 0; i < n; i++) {
      reviewDocs.push({
        hostel: h._id,
        name: pick(REVIEW_NAMES),
        role: Math.random() > 0.5 ? 'Student' : 'Professional',
        rating: rand(3, 5),
        text: pick(REVIEW_TEXTS),
        categories: {
          cleanliness: rand(3, 5), food: rand(3, 5), location: rand(3, 5),
          safety: rand(3, 5), staff: rand(3, 5), value: rand(3, 5),
        },
      });
    }
  });
  await Review.insertMany(reviewDocs);
  console.log(`[seed] Inserted ${reviewDocs.length} reviews.`);

  // Recompute aggregate rating/reviewCount per hostel from the seeded reviews.
  for (const h of hostels) {
    const hostelReviews = reviewDocs.filter((r) => String(r.hostel) === String(h._id));
    if (hostelReviews.length) {
      const avg = hostelReviews.reduce((s, r) => s + r.rating, 0) / hostelReviews.length;
      await Hostel.findByIdAndUpdate(h._id, { rating: Math.round(avg * 10) / 10, reviewCount: hostelReviews.length });
    }
  }

  console.log('[seed] Done.');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
