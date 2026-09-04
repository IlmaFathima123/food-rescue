# FoodRescue LK — Frontend

Frontend-only build of FoodRescue LK: a platform connecting local businesses
with surplus food to the students, families, and organizations who can use
it. Built with React + Vite, react-router, and Tailwind CSS.

Right now all data is **mocked in memory** — there is no real backend yet.
Everything is wired so you can swap in a real API later without touching
any page or component.

## Running it

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a production
build in `dist/`.

## Pages

| Route          | Page                                             |
|-----------------|---------------------------------------------------|
| `/`             | Home — hero, stats, how it works, featured food   |
| `/find`         | Find Food — search, filter, listing grid          |
| `/donate`       | Donate Food — post-surplus form with validation   |
| `/claim/:id`    | Claim Food — reserve a listing, confirmation ticket |
| `/dashboard`    | Dashboard — impact stats, recent donations table  |

## Project structure

```
src/
  data/mockData.js        Seed data: sample listings, categories, locations
  lib/api.js               The mock "backend" — every function returns a
                              Promise shaped like a real API call would be
  context/FoodContext.jsx  React context that pages/components use to read
                              listings and call actions (addListing, claimListing)
  components/               Reusable UI: Navbar, Footer, FoodCard, Badge,
                              StatStrip, SearchFilterBar
  pages/                    One file per route (see table above)
```

## Wiring up a real backend later

All mock "network" logic lives in `src/lib/api.js`. Each exported
function (`fetchListings`, `fetchListingById`, `createListing`,
`claimListing`, `fetchDashboardStats`, `fetchRecentDonations`,
`fetchClaimById`) currently reads/writes an in-memory array and resolves
after a short delay to simulate latency.

To connect a real backend:

1. Replace the body of each function in `src/lib/api.js` with a real
   `fetch("/api/...")` call (or your framework's client) that returns data
   in the same shape.
2. Keep the function names, parameters, and return shapes the same.
3. Nothing in `src/context/FoodContext.jsx`, `src/pages/*`, or
   `src/components/*` needs to change — they only ever call functions from
   `api.js`.

Server-side validation currently lives in `validateListing()` (for the
donate form) and inline in `claimListing()` (for the claim form) inside
`api.js` — mirror the same rules on your real backend, and the frontend
error messages will keep working as-is.

## Design notes

- Colors, type scale, and the "ticket" card style are defined via Tailwind
  tokens in `tailwind.config.js` and `src/index.css`.
- Fonts: Fraunces (display/headings) and Work Sans (body/UI), loaded from
  Google Fonts in `index.html`.
