# Vittles - AI-Powered Food & Drink Matching App

## Overview
A web application that helps users discover the perfect British drink pairing for any dish - both alcoholic and non-alcoholic options. Uses AI (OpenAI) to analyze dish flavour profiles and recommend matching drinks from a curated database of British beverages.

## Current State
MVP complete with:
- Homepage with search bar, trending dishes, and immersive video backgrounds
- AI-powered pairing results page with sophisticated flavour analysis
- Drink detail pages with producer website links
- Blog placeholder page
- 31 seeded British drinks (24 alcoholic + 7 non-alcoholic) in database
- Champions micro-breweries and local craft producers
- At least 1 non-alcoholic option always included in pairings
- Enhanced fallback pairing with flavour keyword matching
- No stock imagery (imageUrl: null) to avoid misrepresentation

## Tech Stack
- **Frontend**: React + TypeScript, Tailwind CSS, Shadcn/UI components, Wouter routing, TanStack Query
- **Backend**: Express.js, Drizzle ORM, PostgreSQL
- **AI**: OpenAI via Replit AI Integrations (no API key required)

## Project Architecture

### Frontend (client/)
- `src/pages/home.tsx` - Homepage with search bar and trending dishes
- `src/pages/results.tsx` - Pairing results with AI analysis and drink cards
- `src/pages/drink-detail.tsx` - Individual drink profiles
- `src/pages/blog.tsx` - Blog placeholder (empty for now)
- `src/App.tsx` - Main router configuration

### Backend (server/)
- `routes.ts` - API endpoints including AI-powered pairing
- `storage.ts` - Database operations and drink seed data
- `db.ts` - PostgreSQL connection

### Shared (shared/)
- `schema.ts` - Drizzle schema and TypeScript types for drinks

## Key Features

### Drink Database
Located in `server/storage.ts` - contains 31 British drinks:

**Alcoholic (24 drinks):**
- Traditional Ales (Timothy Taylor's Landlord, Fuller's London Pride, Black Sheep, Adnams Broadside)
- Micro-brewery Ales (Weetwood Cheshire Cat, Weetwood Eastgate, Thornbridge Jaipur, Hawkshead Windermere Pale, Tiny Rebel Cwtch, Siren Soundwave, Burning Sky Plateau, Beavertown Neck Oil, Wild Beer Bibble)
- Ciders (Aspall Suffolk, Westons Vintage, Thatchers Gold)
- Gins (Sipsmith, Cotswolds, Hendrick's)
- Whiskies (Glenfiddich, Laphroaig)
- Wine (Nyetimber, Chapel Down)
- Rum (Pusser's British Navy)

**Non-Alcoholic (7 drinks):**
- Tea (Yorkshire Tea, Twinings English Breakfast)
- Soft Drinks (Fentimans Ginger Beer, Fentimans Cola, Belvoir Elderflower, Fever-Tree Tonic, Luscombe Lemonade)

**To add more drinks**: Edit the `seedDrinks` array in `server/storage.ts`

### AI Pairing Engine
Located in `server/routes.ts` at `/api/pairing`:
- Analyzes dish flavour profile using OpenAI
- Uses sophisticated flavour matching principles (complementary/contrasting, intensity matching, regional affinity)
- Matches with 2-3 drinks from database, prioritizing micro-breweries when flavour match is strong
- Always includes at least 1 non-alcoholic option (0% ABV)
- Generates educational explanations about flavour science
- Has enhanced fallback mechanism with flavour keyword matching

### Producer Links
Each drink has real producer website links (e.g., timothytaylor.co.uk, yorkshiretea.co.uk). Update the `affiliateLink` field in `server/storage.ts` to add affiliate tracking.

## Design System
British-inspired theme with:
- Navy blue (#1e3a5f) as primary color
- Cream (#f7f5f0) as background
- Muted red (#8b3a3a) as accent
- Fonts: Libre Baskerville (body), Playfair Display (headings)

## API Endpoints
- `GET /api/drinks` - Get all drinks
- `GET /api/drinks/:id` - Get single drink
- `GET /api/pairing?dish={dish}` - Get AI-powered drink pairings

## Running the App
The app runs on port 5000 via `npm run dev`. Database schema is managed with Drizzle (`npm run db:push`).
