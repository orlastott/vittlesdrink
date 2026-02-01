import { db } from "./db";
import { drinks, type Drink, type InsertDrink } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getDrink(id: number): Promise<Drink | undefined>;
  getAllDrinks(): Promise<Drink[]>;
  createDrink(drink: InsertDrink): Promise<Drink>;
  getDrinksByType(type: string): Promise<Drink[]>;
  searchDrinks(query: string): Promise<Drink[]>;
}

export class DatabaseStorage implements IStorage {
  async getDrink(id: number): Promise<Drink | undefined> {
    const [drink] = await db.select().from(drinks).where(eq(drinks.id, id));
    return drink;
  }

  async getAllDrinks(): Promise<Drink[]> {
    return db.select().from(drinks);
  }

  async createDrink(drink: InsertDrink): Promise<Drink> {
    const [newDrink] = await db.insert(drinks).values(drink).returning();
    return newDrink;
  }

  async getDrinksByType(type: string): Promise<Drink[]> {
    return db.select().from(drinks).where(eq(drinks.type, type));
  }

  async searchDrinks(query: string): Promise<Drink[]> {
    const allDrinks = await db.select().from(drinks);
    const lowerQuery = query.toLowerCase();
    return allDrinks.filter(
      (d) =>
        d.name.toLowerCase().includes(lowerQuery) ||
        d.type.toLowerCase().includes(lowerQuery) ||
        d.flavourNotes.toLowerCase().includes(lowerQuery) ||
        d.recommendedFoods.toLowerCase().includes(lowerQuery)
    );
  }
}

export const storage = new DatabaseStorage();

// ============================================
// SEED DATA - British Drinks Database
// Add more drinks here to expand the database
// Replace affiliateLink values with real affiliate links
// ============================================
export const seedDrinks: InsertDrink[] = [
  {
    name: "Timothy Taylor's Landlord",
    type: "ale",
    flavourNotes: "Full-bodied with a hoppy, slightly floral aroma and a biscuity malt backbone",
    region: "Yorkshire",
    abv: "4.3%",
    recommendedFoods: "Roast beef, Steak pie, Cheese ploughman's",
    affiliateLink: "https://example.com/buy/timothy-taylors-landlord",
    description: "A classic Yorkshire pale ale, winner of multiple CAMRA awards. Known for its perfect balance of hop bitterness and malt sweetness.",
  },
  {
    name: "Fuller's London Pride",
    type: "ale",
    flavourNotes: "Marmalade citrus, rich malt with a dry, biscuity finish",
    region: "London",
    abv: "4.7%",
    recommendedFoods: "Fish and chips, Bangers and mash, Sunday roast",
    affiliateLink: "https://example.com/buy/fullers-london-pride",
    description: "London's iconic amber ale with over 175 years of brewing heritage. A perfectly balanced pint with distinctive marmalade notes.",
  },
  {
    name: "Aspall Suffolk Cyder",
    type: "cider",
    flavourNotes: "Crisp apple with honeyed sweetness and a dry, refreshing finish",
    region: "East Anglia",
    abv: "5.5%",
    recommendedFoods: "Pork dishes, Cheese, Light salads",
    affiliateLink: "https://example.com/buy/aspall-cyder",
    description: "A premium English cider crafted in Suffolk since 1728. Made from a blend of bittersweet and culinary apples.",
  },
  {
    name: "Sipsmith London Dry Gin",
    type: "gin",
    flavourNotes: "Juniper-forward with bright citrus, floral notes and a peppery warmth",
    region: "London",
    abv: "41.6%",
    recommendedFoods: "Seafood, Light poultry, Cucumber dishes",
    affiliateLink: "https://example.com/buy/sipsmith-gin",
    description: "Handcrafted in London's first copper pot still for nearly 200 years. A perfectly balanced London Dry Gin.",
  },
  {
    name: "Glenfiddich 12 Year Old",
    type: "whisky",
    flavourNotes: "Fresh pear, subtle oak, butterscotch with a long smooth finish",
    region: "Speyside",
    abv: "40%",
    recommendedFoods: "Smoked salmon, Dark chocolate, Aged cheese",
    affiliateLink: "https://example.com/buy/glenfiddich-12",
    description: "The world's most awarded single malt Scotch whisky. Matured in American and European oak casks.",
  },
  {
    name: "Laphroaig 10 Year Old",
    type: "whisky",
    flavourNotes: "Intensely peaty, smoky seaweed with hints of iodine and a long sweet finish",
    region: "Islay",
    abv: "40%",
    recommendedFoods: "Oysters, Blue cheese, Smoked meats",
    affiliateLink: "https://example.com/buy/laphroaig-10",
    description: "A bold, smoky Islay single malt. The most richly flavoured of all Scotch whiskies.",
  },
  {
    name: "Westons Vintage Cider",
    type: "cider",
    flavourNotes: "Rich, oaky with toffee apple notes and a smooth, medium-dry finish",
    region: "Herefordshire",
    abv: "8.2%",
    recommendedFoods: "Cheese board, Pork pie, Apple desserts",
    affiliateLink: "https://example.com/buy/westons-vintage",
    description: "A premium oak-aged cider from Herefordshire's finest apples. Aged for two years for exceptional depth.",
  },
  {
    name: "Pusser's British Navy Rum",
    type: "rum",
    flavourNotes: "Rich molasses, butterscotch, vanilla with warming spice notes",
    region: "London",
    abv: "54.5%",
    recommendedFoods: "Jerk chicken, Spicy curries, Chocolate desserts",
    affiliateLink: "https://example.com/buy/pussers-rum",
    description: "The original British Royal Navy rum, blended to the Admiralty's specifications since 1655.",
  },
  {
    name: "Nyetimber Classic Cuvée",
    type: "wine",
    flavourNotes: "Toasted brioche, honey, citrus blossom with fine bubbles",
    region: "Sussex",
    abv: "12%",
    recommendedFoods: "Oysters, Canapés, Celebration dishes",
    affiliateLink: "https://example.com/buy/nyetimber-classic",
    description: "England's finest sparkling wine, rivalling the best Champagnes. Grown on the chalk downs of Sussex.",
  },
  {
    name: "Adnams Broadside",
    type: "ale",
    flavourNotes: "Rich fruitcake, blackcurrant with a bittersweet malt finish",
    region: "East Anglia",
    abv: "6.3%",
    recommendedFoods: "Game pie, Venison, Christmas pudding",
    affiliateLink: "https://example.com/buy/adnams-broadside",
    description: "A dark, rich ruby ale from the Suffolk coast. Named after the 1672 Battle of Sole Bay.",
  },
  {
    name: "Cotswolds Dry Gin",
    type: "gin",
    flavourNotes: "Fresh lavender, bay leaf, grapefruit with subtle spice",
    region: "Cotswolds",
    abv: "46%",
    recommendedFoods: "Garden salads, Grilled fish, Mediterranean dishes",
    affiliateLink: "https://example.com/buy/cotswolds-gin",
    description: "An aromatic gin distilled with nine carefully considered botanicals from the heart of the Cotswolds.",
  },
  {
    name: "Chapel Down Bacchus",
    type: "wine",
    flavourNotes: "Elderflower, gooseberry, crisp green apple with mineral notes",
    region: "Kent",
    abv: "12.5%",
    recommendedFoods: "Fresh seafood, Asparagus, Goat's cheese",
    affiliateLink: "https://example.com/buy/chapel-down-bacchus",
    description: "England's signature white grape, producing wines with distinctive aromatic character.",
  },
  {
    name: "Black Sheep Best Bitter",
    type: "ale",
    flavourNotes: "Dry and bitter with fruity esters, crisp hoppy character",
    region: "Yorkshire",
    abv: "3.8%",
    recommendedFoods: "Yorkshire pudding, Shepherd's pie, Cheese",
    affiliateLink: "https://example.com/buy/black-sheep-bitter",
    description: "A traditional Yorkshire bitter brewed in Masham using the Yorkshire Square fermentation system.",
  },
  {
    name: "Thatchers Gold",
    type: "cider",
    flavourNotes: "Golden and smooth with a crisp, refreshing apple taste",
    region: "Somerset",
    abv: "4.8%",
    recommendedFoods: "Ploughman's lunch, Pork chops, Light cheese",
    affiliateLink: "https://example.com/buy/thatchers-gold",
    description: "A refreshing medium-dry Somerset cider made from a blend of British apples.",
  },
  {
    name: "Hendrick's Gin",
    type: "gin",
    flavourNotes: "Cucumber, rose petal, citrus with a smooth, rounded finish",
    region: "Scotland",
    abv: "41.4%",
    recommendedFoods: "Cucumber sandwiches, Smoked salmon, Light appetizers",
    affiliateLink: "https://example.com/buy/hendricks-gin",
    description: "A distinctively delicious gin made with curious, yet perfectly balanced infusions of cucumber and rose.",
  },
];

export async function seedDatabase(): Promise<void> {
  const existingDrinks = await db.select().from(drinks);
  if (existingDrinks.length === 0) {
    console.log("Seeding drinks database...");
    for (const drink of seedDrinks) {
      await db.insert(drinks).values(drink);
    }
    console.log(`Seeded ${seedDrinks.length} British drinks`);
  } else {
    console.log(`Database already has ${existingDrinks.length} drinks`);
  }
}
