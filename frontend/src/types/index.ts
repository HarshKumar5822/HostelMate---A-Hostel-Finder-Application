export type Gender = 'boys' | 'girls';

export type DataConfidence = 'verified' | 'community' | 'estimated' | 'live' | 'sample';

export type Facility =
  | 'wifi' | 'ac' | 'powerBackup' | 'laundry' | 'washingMachine' | 'parking'
  | 'cctv' | 'security' | 'studyRoom' | 'gym' | 'commonArea' | 'housekeeping'
  | 'attachedBathroom' | 'hotWater' | 'refrigerator' | 'tv' | 'roWater'
  | 'lift' | 'biometric';

export type RoomTypeKey = 'single' | 'double' | 'triple' | 'quad' | 'fivePlus';

export interface RoomOption {
  type: RoomTypeKey;
  label: string;
  price: number;
  occupancy: number;
  facilities: Facility[];
  availability: 'available' | 'limited' | 'full';
  bedsAvailable: number;
}

export interface FoodMenuDay {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface FoodInfo {
  included: boolean;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  veg: boolean;
  nonVeg: boolean;
  messAvailable: boolean;
  rating: number;
  weeklyMenu: FoodMenuDay[];
  confidence: DataConfidence;
}

export interface SafetyBreakdown {
  security: number;
  cctvCoverage: number;
  accessControl: number;
  userFeedback: number;
}

export interface ReviewCategoryRatings {
  cleanliness: number;
  food: number;
  location: number;
  safety: number;
  staff: number;
  value: number;
}

export interface Review {
  id: string;
  hostelId: string;
  name: string;
  role: 'Student' | 'Professional';
  rating: number;
  text: string;
  date: string;
  categories: Partial<ReviewCategoryRatings>;
}

export interface Hostel {
  id: string;
  name: string;
  gender: Gender;
  city: string;
  locality: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  price: number;
  distanceKm: number;
  availability: 'available' | 'limited' | 'full';
  bedsAvailable: number;
  images: string[];
  facilities: Facility[];
  food: FoodInfo;
  roomTypes: RoomOption[];
  safetyScore: number;
  safetyBreakdown: SafetyBreakdown;
  description: string;
  phone: string;
  website?: string;
  verified: boolean;
  owner: string;
  updatedAt: string;
  googlePlaceId?: string;
  priceConfidence: DataConfidence;
  availabilityConfidence: DataConfidence;
  landmark: string;
  pros: string[];
  cons: string[];
}

export interface UserPreferences {
  gender: Gender | null;
  location: string;
  budgetMin: number;
  budgetMax: number;
  roomTypes: RoomTypeKey[];
  facilities: Facility[];
  food: {
    included: boolean;
    veg: boolean;
    nonVeg: boolean;
  };
  moveInDate?: string;
}

export interface CityStats {
  city: string;
  hostelCount: number;
  avgRent: number;
  avgRating: number;
  popularAreas: string[];
  wifiPct: number;
  acPct: number;
  foodPct: number;
  avgSafety: number;
}
