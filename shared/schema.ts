import { pgTable, text, varchar, integer, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ============================================
// BRITISH DRINKS DATABASE
// To expand this database, add more drinks to the drinks table
// or modify the seed data in server/storage.ts
// ============================================

export const drinks = pgTable("drinks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // beer, ale, cider, gin, whisky, rum, wine
  flavourNotes: text("flavour_notes").notNull(),
  region: text("region").notNull(), // UK region
  abv: text("abv").notNull(), // Alcohol by volume
  recommendedFoods: text("recommended_foods").notNull(), // Comma-separated food types
  affiliateLink: text("affiliate_link").notNull(), // Company website URL
  description: text("description").notNull(),
  imageUrl: text("image_url"), // Path to drink image
});

export const insertDrinkSchema = createInsertSchema(drinks).omit({
  id: true,
});

export type InsertDrink = z.infer<typeof insertDrinkSchema>;
export type Drink = typeof drinks.$inferSelect;

// API Response Types
export const pairingResultSchema = z.object({
  dish: z.string(),
  dishAnalysis: z.object({
    flavourProfile: z.string(),
    keyCharacteristics: z.array(z.string()),
  }),
  pairings: z.array(z.object({
    drink: z.object({
      id: z.number(),
      name: z.string(),
      type: z.string(),
      flavourNotes: z.string(),
      region: z.string(),
      abv: z.string(),
      affiliateLink: z.string(),
      description: z.string(),
      imageUrl: z.string().nullable().optional(),
    }),
    explanation: z.string(),
    matchScore: z.number(),
  })),
});

export type PairingResult = z.infer<typeof pairingResultSchema>;

// Trending dishes for the homepage
export const trendingDishes = [
  "Fish & Chips",
  "Roast Beef",
  "Shepherd's Pie",
  "Chicken Tikka Masala",
  "Full English Breakfast",
  "Bangers & Mash",
  "Steak & Ale Pie",
  "Sunday Roast",
  "Cornish Pasty",
  "Beef Wellington",
  "Cheese Ploughman's",
  "Welsh Rarebit",
];
