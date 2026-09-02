const mongoose = require('mongoose');

const FACILITY_ENUM = [
  'wifi', 'ac', 'powerBackup', 'laundry', 'washingMachine', 'parking',
  'cctv', 'security', 'studyRoom', 'gym', 'commonArea', 'housekeeping',
  'attachedBathroom', 'hotWater', 'refrigerator', 'tv', 'roWater',
  'lift', 'biometric',
];

const CONFIDENCE_ENUM = ['verified', 'community', 'estimated', 'live', 'sample'];

const FoodMenuDaySchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    breakfast: String,
    lunch: String,
    dinner: String,
  },
  { _id: false }
);

const FoodInfoSchema = new mongoose.Schema(
  {
    included: { type: Boolean, default: false },
    breakfast: { type: Boolean, default: false },
    lunch: { type: Boolean, default: false },
    dinner: { type: Boolean, default: false },
    veg: { type: Boolean, default: true },
    nonVeg: { type: Boolean, default: false },
    messAvailable: { type: Boolean, default: false },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    weeklyMenu: { type: [FoodMenuDaySchema], default: [] },
    confidence: { type: String, enum: CONFIDENCE_ENUM, default: 'sample' },
  },
  { _id: false }
);

const RoomOptionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['single', 'double', 'triple', 'quad', 'fivePlus'], required: true },
    label: { type: String, required: true },
    price: { type: Number, required: true },
    occupancy: { type: Number, required: true },
    facilities: { type: [String], enum: FACILITY_ENUM, default: [] },
    availability: { type: String, enum: ['available', 'limited', 'full'], default: 'available' },
    bedsAvailable: { type: Number, default: 0 },
  },
  { _id: false }
);

const SafetyBreakdownSchema = new mongoose.Schema(
  {
    security: { type: Number, min: 0, max: 100, default: 0 },
    cctvCoverage: { type: Number, min: 0, max: 100, default: 0 },
    accessControl: { type: Number, min: 0, max: 100, default: 0 },
    userFeedback: { type: Number, min: 0, max: 100, default: 0 },
  },
  { _id: false }
);

const HostelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['boys', 'girls'], required: true },
    city: { type: String, required: true, index: true },
    locality: { type: String, required: true, index: true },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },

    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, default: 0 },

    price: { type: Number, required: true, index: true },
    distanceKm: { type: Number, default: 0 },

    availability: { type: String, enum: ['available', 'limited', 'full'], default: 'available' },
    bedsAvailable: { type: Number, default: 0 },

    images: { type: [String], default: [] },
    facilities: { type: [String], enum: FACILITY_ENUM, default: [] },
    food: { type: FoodInfoSchema, default: () => ({}) },
    roomTypes: { type: [RoomOptionSchema], default: [] },

    safetyScore: { type: Number, min: 0, max: 100, default: 0 },
    safetyBreakdown: { type: SafetyBreakdownSchema, default: () => ({}) },

    description: { type: String, default: '' },
    phone: { type: String, default: '' },
    website: { type: String, default: null },
    verified: { type: Boolean, default: false },

    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' },

    googlePlaceId: { type: String, default: null },
    priceConfidence: { type: String, enum: CONFIDENCE_ENUM, default: 'sample' },
    availabilityConfidence: { type: String, enum: CONFIDENCE_ENUM, default: 'sample' },

    landmark: { type: String, default: '' },
    pros: { type: [String], default: [] },
    cons: { type: [String], default: [] },

    // Owner-facing analytics counters
    stats: {
      profileViews: { type: Number, default: 0 },
      searchImpressions: { type: Number, default: 0 },
      savedCount: { type: Number, default: 0 },
      inquiries: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

HostelSchema.index({ city: 1, locality: 1, gender: 1, price: 1 });
HostelSchema.index({ latitude: 1, longitude: 1 });
HostelSchema.index({ name: 'text', description: 'text', locality: 'text', city: 'text' });

module.exports = mongoose.model('Hostel', HostelSchema);
module.exports.FACILITY_ENUM = FACILITY_ENUM;
module.exports.CONFIDENCE_ENUM = CONFIDENCE_ENUM;
