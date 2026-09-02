# HostelMate Backend

Node.js + Express + MongoDB (Mongoose) API for the HostelMate platform.

## Setup

```bash
cd backend
npm install
cp .env.example .env     # then edit MONGO_URI / JWT_SECRET
npm run seed              # populates MongoDB with 96 realistic demo hostels
npm run dev                # starts the API on http://localhost:5000
```

Requires Node 18+ and a running MongoDB instance (local `mongod`, or a
MongoDB Atlas connection string in `MONGO_URI`).

Demo owner account created by the seed script:
`demo-owner@hostelmate.example` / `password123`

## Project structure

```
backend/
  server.js              # entrypoint — loads env, connects DB, starts listener
  src/
    app.js               # Express app: middleware + route mounting
    config/db.js         # Mongoose connection
    models/               # Hostel, Review, User, Owner, Inquiry
    controllers/           # request handlers, grouped by resource
    routes/                 # route definitions
    middleware/             # JWT auth, error handling
    utils/                   # matching.js / analyzer.js — same scoring
                              # formulas as the frontend's Smart Match and
                              # Worth-It analyzer, so both stay consistent
    seed/seedData.js         # generates realistic demo data into MongoDB
```

## API overview

All routes are prefixed with `/api`.

| Method | Route | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/hostels` | Search/filter/sort hostels (query params: `gender`, `location`, `budgetMin`, `budgetMax`, `roomTypes`, `facilities`, `foodOnly`, `vegOnly`, `sort`, `page`, `limit`) |
| GET | `/hostels/nlp-search?q=` | Lightweight natural-language search |
| GET | `/hostels/:id` | Hostel details (increments profile view counter) |
| POST | `/hostels` | Create listing (owner auth) |
| PUT | `/hostels/:id` | Update listing (owner auth, must own it) |
| DELETE | `/hostels/:id` | Delete listing (owner auth) |
| GET | `/hostels/:id/match` | Smart Match score vs. query preferences |
| GET | `/hostels/:id/analysis` | Worth-It analyzer breakdown |
| GET | `/hostels/:hostelId/reviews` | List reviews (`sort=recent|highestRated|lowestRated`) |
| POST | `/hostels/:hostelId/reviews` | Submit a review (user auth) |
| POST | `/hostels/:hostelId/inquiries` | Submit an enquiry |
| PUT | `/reviews/:id/response` | Owner responds to a review (owner auth) |
| POST | `/auth/register` / `/auth/login` | Student account |
| GET | `/auth/me` | Current user (auth) |
| PUT | `/auth/preferences` | Update onboarding preferences (auth) |
| POST | `/auth/owner/register` / `/auth/owner/login` | Owner account |
| GET | `/owner/hostels` | Owner's listings (owner auth) |
| GET | `/owner/analytics` | Views/inquiries/conversion totals (owner auth) |
| GET | `/owner/inquiries` | Inquiries across owner's listings (owner auth) |
| PUT | `/owner/inquiries/:id` | Update inquiry status (owner auth) |
| GET | `/saved` | Current user's saved hostels (auth) |
| POST | `/saved/:hostelId` | Toggle save/unsave (auth) |
| GET | `/compare?ids=id1,id2,id3` | Fetch 2–4 hostels for comparison |
| GET | `/insights/summary` | Platform-wide averages |
| GET | `/insights/rent-by-area` | Average rent per locality |
| GET | `/insights/rating-distribution` | Rating histogram |
| GET | `/insights/facility-availability` | % of hostels offering each facility |
| GET | `/insights/city/:city` | City-level market summary |

Auth routes return a JWT; send it as `Authorization: Bearer <token>` on
protected routes.

## Connecting the frontend

The frontend currently reads from an in-memory generated dataset
(`frontend/src/services/hostelService.ts` and friends). To connect it to
this API:

1. Add `VITE_API_URL=http://localhost:5000/api` to a `.env` file in `frontend/`.
2. Replace the body of each function in `frontend/src/services/*.ts` with a
   `fetch(`${import.meta.env.VITE_API_URL}/...`)` call — the function
   signatures were designed to stay the same so no UI components need to change.

## Data honesty

`priceConfidence` / `availabilityConfidence` / `food.confidence` fields on
the `Hostel` model store one of `verified | community | estimated | live |
sample`, matching the frontend's `ConfidenceTag` component. Set these based
on actual data provenance when hostels are created or updated by owners.
