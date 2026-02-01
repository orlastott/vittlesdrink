# British Pairing - AI-Powered Food & Drink Matching App

## Overview
A web application that helps users discover the perfect British alcoholic drink pairing for any dish. Uses AI (OpenAI) to analyze dish flavour profiles and recommend matching drinks from a curated database of British beverages.

## Current State
MVP complete with:
- Homepage with search bar and trending dishes
- AI-powered pairing results page
- Drink detail pages
- Blog placeholder page
- 15 seeded British drinks in database
- Fallback pairing mechanism when AI is unavailable

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
Located in `server/storage.ts` - contains 15 British drinks including:
- Ales (Timothy Taylor's Landlord, Fuller's London Pride, etc.)
- Ciders (Aspall Suffolk, Westons Vintage, Thatchers Gold)
- Gins (Sipsmith, Cotswolds, Hendrick's)
- Whiskies (Glenfiddich, Laphroaig)
- Wine (Nyetimber, Chapel Down)
- Rum (Pusser's British Navy)

**To add more drinks**: Edit the `seedDrinks` array in `server/storage.ts`

### AI Pairing Engine
Located in `server/routes.ts` at `/api/pairing`:
- Analyzes dish flavour profile using OpenAI
- Matches with 1-3 drinks from database
- Generates friendly pairing explanations
- Has fallback mechanism for when AI is unavailable

### Affiliate Links
Each drink has a placeholder `affiliateLink` field. **To add real affiliate links**: Update the values in `server/storage.ts` seedDrinks array.

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
