# HostelMate

Discover, compare and analyze hostels across India — so students moving to a new
city don't have to visit twenty of them just to learn the rent, food and
vacancy.

## Getting started

```bash
npm install
npm run dev       # starts the dev server
npm run build     # production build to dist/
```

Requires Node 18+.

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (design tokens in `src/index.css`)
- React Router v7
- Framer Motion (animation)
- Recharts (analytics charts)
- Lucide React (icons)

## Project structure

```
src/
  components/    # reusable UI, grouped by domain (common, layout, hostel, discover, landing, ai, onboarding)
  pages/         # route-level screens
  data/          # mock data generator + static city/facility metadata
  hooks/         # React context hooks (preferences, saved/compare state)
  services/      # pure business logic — search/filter, Smart Match, Worth-It
                   analyzer, map projection — designed to be swapped for real
                   API calls without touching UI components
  types/         # shared TypeScript types
  utils/         # formatting helpers
```

## Routes

`/` `/onboarding` `/discover` `/map` `/hostel/:id` `/compare` `/saved`
`/insights` `/city/:city` `/profile` `/ai-assistant` `/login` `/signup`
`/owner` `/owner/hostels` `/owner/analytics` `/owner/add-hostel`

## Data honesty

All prices, availability and food data carry a confidence label —
**Verified**, **Community**, **Estimated**, **Live** or **Sample** — via
`ConfidenceTag`. The mock dataset (`src/data/generator.ts`) assigns these
randomly to demonstrate the pattern; a real backend should set them based on
actual data provenance (owner-submitted vs. crowd-sourced vs. inferred).

## Connecting real services

- **Maps**: `src/services/mapService.ts` documents how to swap the built-in
  projected-plane map (`MapView.tsx`) for Google Maps or Mapbox. Hostel
  records already carry `latitude`/`longitude`/`googlePlaceId`.
- **AI Assistant**: `AIAssistant.tsx` and `AIAssistantPage.tsx` currently use
  a local keyword-matching mock (`mockAnswer`). Replace that function with a
  call to your NLP/LLM backend — the chat UI, suggestions and message list
  are already wired.
- **Hostel data**: `src/services/hostelService.ts` reads from the in-memory
  generated dataset. Replace the body of `searchHostels` / `getHostelById`
  with `fetch()` calls to your API; the function signatures are the contract
  the UI depends on.
- **Auth**: `Login.tsx` / `Signup.tsx` are UI-only and currently just
  navigate on submit — wire the `onSubmit` handlers to your auth provider.

## Notes

- Animations respect `prefers-reduced-motion`.
- The mock dataset is deterministic (seeded RNG) so numbers stay stable
  across reloads within a session.
- Images are placeholder photography from picsum.photos — replace with real
  listing photos in production.
