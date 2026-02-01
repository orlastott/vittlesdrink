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
    affiliateLink: "https://www.timothytaylor.co.uk",
    description: "A classic Yorkshire pale ale, winner of multiple CAMRA awards. Known for its perfect balance of hop bitterness and malt sweetness.",
    imageUrl: "/images/drinks/timothy-taylor.jpg",
  },
  {
    name: "Fuller's London Pride",
    type: "ale",
    flavourNotes: "Marmalade citrus, rich malt with a dry, biscuity finish",
    region: "London",
    abv: "4.7%",
    recommendedFoods: "Fish and chips, Bangers and mash, Sunday roast",
    affiliateLink: "https://www.fullers.co.uk",
    description: "London's iconic amber ale with over 175 years of brewing heritage. A perfectly balanced pint with distinctive marmalade notes.",
    imageUrl: "/images/drinks/fullers-london-pride.jpg",
  },
  {
    name: "Aspall Suffolk Cyder",
    type: "cider",
    flavourNotes: "Crisp apple with honeyed sweetness and a dry, refreshing finish",
    region: "East Anglia",
    abv: "5.5%",
    recommendedFoods: "Pork dishes, Cheese, Light salads",
    affiliateLink: "https://www.aspall.co.uk",
    description: "A premium English cider crafted in Suffolk since 1728. Made from a blend of bittersweet and culinary apples.",
    imageUrl: "/images/drinks/aspall-cyder.jpg",
  },
  {
    name: "Sipsmith London Dry Gin",
    type: "gin",
    flavourNotes: "Juniper-forward with bright citrus, floral notes and a peppery warmth",
    region: "London",
    abv: "41.6%",
    recommendedFoods: "Seafood, Light poultry, Cucumber dishes",
    affiliateLink: "https://www.sipsmith.com",
    description: "Handcrafted in London's first copper pot still for nearly 200 years. A perfectly balanced London Dry Gin.",
    imageUrl: "/images/drinks/sipsmith-gin.jpg",
  },
  {
    name: "Glenfiddich 12 Year Old",
    type: "whisky",
    flavourNotes: "Fresh pear, subtle oak, butterscotch with a long smooth finish",
    region: "Speyside",
    abv: "40%",
    recommendedFoods: "Smoked salmon, Dark chocolate, Aged cheese",
    affiliateLink: "https://www.glenfiddich.com",
    description: "The world's most awarded single malt Scotch whisky. Matured in American and European oak casks.",
    imageUrl: "/images/drinks/glenfiddich.jpg",
  },
  {
    name: "Laphroaig 10 Year Old",
    type: "whisky",
    flavourNotes: "Intensely peaty, smoky seaweed with hints of iodine and a long sweet finish",
    region: "Islay",
    abv: "40%",
    recommendedFoods: "Oysters, Blue cheese, Smoked meats",
    affiliateLink: "https://www.laphroaig.com",
    description: "A bold, smoky Islay single malt. The most richly flavoured of all Scotch whiskies.",
    imageUrl: "/images/drinks/laphroaig.jpg",
  },
  {
    name: "Westons Vintage Cider",
    type: "cider",
    flavourNotes: "Rich, oaky with toffee apple notes and a smooth, medium-dry finish",
    region: "Herefordshire",
    abv: "8.2%",
    recommendedFoods: "Cheese board, Pork pie, Apple desserts",
    affiliateLink: "https://www.westons-cider.co.uk",
    description: "A premium oak-aged cider from Herefordshire's finest apples. Aged for two years for exceptional depth.",
    imageUrl: "/images/drinks/westons-vintage.jpg",
  },
  {
    name: "Pusser's British Navy Rum",
    type: "rum",
    flavourNotes: "Rich molasses, butterscotch, vanilla with warming spice notes",
    region: "London",
    abv: "54.5%",
    recommendedFoods: "Jerk chicken, Spicy curries, Chocolate desserts",
    affiliateLink: "https://www.pussersrum.com",
    description: "The original British Royal Navy rum, blended to the Admiralty's specifications since 1655.",
    imageUrl: "/images/drinks/pussers-rum.jpg",
  },
  {
    name: "Nyetimber Classic Cuvée",
    type: "wine",
    flavourNotes: "Toasted brioche, honey, citrus blossom with fine bubbles",
    region: "Sussex",
    abv: "12%",
    recommendedFoods: "Oysters, Canapés, Celebration dishes",
    affiliateLink: "https://www.nyetimber.com",
    description: "England's finest sparkling wine, rivalling the best Champagnes. Grown on the chalk downs of Sussex.",
    imageUrl: "/images/drinks/nyetimber.jpg",
  },
  {
    name: "Adnams Broadside",
    type: "ale",
    flavourNotes: "Rich fruitcake, blackcurrant with a bittersweet malt finish",
    region: "East Anglia",
    abv: "6.3%",
    recommendedFoods: "Game pie, Venison, Christmas pudding",
    affiliateLink: "https://www.adnams.co.uk",
    description: "A dark, rich ruby ale from the Suffolk coast. Named after the 1672 Battle of Sole Bay.",
    imageUrl: "/images/drinks/adnams-broadside.jpg",
  },
  {
    name: "Cotswolds Dry Gin",
    type: "gin",
    flavourNotes: "Fresh lavender, bay leaf, grapefruit with subtle spice",
    region: "Cotswolds",
    abv: "46%",
    recommendedFoods: "Garden salads, Grilled fish, Mediterranean dishes",
    affiliateLink: "https://www.cotswoldsdistillery.com",
    description: "An aromatic gin distilled with nine carefully considered botanicals from the heart of the Cotswolds.",
    imageUrl: "/images/drinks/cotswolds-gin.jpg",
  },
  {
    name: "Chapel Down Bacchus",
    type: "wine",
    flavourNotes: "Elderflower, gooseberry, crisp green apple with mineral notes",
    region: "Kent",
    abv: "12.5%",
    recommendedFoods: "Fresh seafood, Asparagus, Goat's cheese",
    affiliateLink: "https://www.chapeldown.com",
    description: "England's signature white grape, producing wines with distinctive aromatic character.",
    imageUrl: "/images/drinks/chapel-down.jpg",
  },
  {
    name: "Black Sheep Best Bitter",
    type: "ale",
    flavourNotes: "Dry and bitter with fruity esters, crisp hoppy character",
    region: "Yorkshire",
    abv: "3.8%",
    recommendedFoods: "Yorkshire pudding, Shepherd's pie, Cheese",
    affiliateLink: "https://www.blacksheepbrewery.co.uk",
    description: "A traditional Yorkshire bitter brewed in Masham using the Yorkshire Square fermentation system.",
    imageUrl: "/images/drinks/black-sheep.jpg",
  },
  {
    name: "Thatchers Gold",
    type: "cider",
    flavourNotes: "Golden and smooth with a crisp, refreshing apple taste",
    region: "Somerset",
    abv: "4.8%",
    recommendedFoods: "Ploughman's lunch, Pork chops, Light cheese",
    affiliateLink: "https://www.thatcherscider.co.uk",
    description: "A refreshing medium-dry Somerset cider made from a blend of British apples.",
    imageUrl: "/images/drinks/thatchers-gold.jpg",
  },
  {
    name: "Hendrick's Gin",
    type: "gin",
    flavourNotes: "Cucumber, rose petal, citrus with a smooth, rounded finish",
    region: "Scotland",
    abv: "41.4%",
    recommendedFoods: "Cucumber sandwiches, Smoked salmon, Light appetizers",
    affiliateLink: "https://www.hendricksgin.com",
    description: "A distinctively delicious gin made with curious, yet perfectly balanced infusions of cucumber and rose.",
    imageUrl: "/images/drinks/hendricks-gin.jpg",
  },
  // ============================================
  // NON-ALCOHOLIC BRITISH DRINKS
  // ============================================
  {
    name: "Yorkshire Tea",
    type: "tea",
    flavourNotes: "Rich, malty with a robust character and a smooth, comforting finish",
    region: "Yorkshire",
    abv: "0%",
    recommendedFoods: "Scones with cream, Full English breakfast, Biscuits, Sunday roast",
    affiliateLink: "https://www.yorkshiretea.co.uk",
    description: "Britain's favourite tea brand, known for its proper brew strength and comforting character. A cup of Yorkshire is never just a cup of tea.",
    imageUrl: "/images/drinks/yorkshire-tea.jpg",
  },
  {
    name: "Fentimans Ginger Beer",
    type: "soft drink",
    flavourNotes: "Fiery ginger with botanical complexity, warming spice and a refreshing finish",
    region: "Northumberland",
    abv: "0%",
    recommendedFoods: "Spicy curries, Asian cuisine, Grilled meats, Cheese",
    affiliateLink: "https://www.fentimans.com",
    description: "Botanically brewed using a time-honoured recipe since 1905. Made with real ginger root for authentic heat and flavour.",
    imageUrl: "/images/drinks/fentimans-ginger.jpg",
  },
  {
    name: "Belvoir Elderflower Pressé",
    type: "soft drink",
    flavourNotes: "Delicate elderflower, light honey sweetness with subtle citrus notes",
    region: "Leicestershire",
    abv: "0%",
    recommendedFoods: "Light salads, Fish dishes, Afternoon tea, Summer picnics",
    affiliateLink: "https://www.belvoirfarm.co.uk",
    description: "Handcrafted on a Leicestershire farm using freshly picked elderflowers. A quintessentially English refreshment.",
    imageUrl: "/images/drinks/belvoir-elderflower.jpg",
  },
  {
    name: "Fever-Tree Tonic Water",
    type: "soft drink",
    flavourNotes: "Crisp quinine bitterness, subtle citrus with pure spring water freshness",
    region: "London",
    abv: "0%",
    recommendedFoods: "Seafood, Light appetizers, Mediterranean dishes, Cheese platters",
    affiliateLink: "https://www.fever-tree.com",
    description: "Premium tonic water made with the finest quinine from the Congo and natural botanicals. If 3/4 of your drink is the mixer, make it the best.",
    imageUrl: "/images/drinks/fever-tree.jpg",
  },
  {
    name: "Twinings English Breakfast",
    type: "tea",
    flavourNotes: "Bold, full-bodied with bright notes and a satisfying depth",
    region: "London",
    abv: "0%",
    recommendedFoods: "Full English breakfast, Toast with marmalade, Pastries, Eggs",
    affiliateLink: "https://www.twinings.co.uk",
    description: "A classic British blend since 1706 from the world's oldest tea company. The perfect accompaniment to a hearty British breakfast.",
    imageUrl: "/images/drinks/twinings-breakfast.jpg",
  },
  {
    name: "Fentimans Curiosity Cola",
    type: "soft drink",
    flavourNotes: "Warming ginger, cinnamon spice with botanical depth and natural sweetness",
    region: "Northumberland",
    abv: "0%",
    recommendedFoods: "Burgers, Pizza, BBQ dishes, Pub food classics",
    affiliateLink: "https://www.fentimans.com",
    description: "A botanically brewed cola made with natural plant extracts. Complex, grown-up and utterly delicious.",
    imageUrl: "/images/drinks/fentimans-cola.jpg",
  },
  {
    name: "Luscombe Sicilian Lemonade",
    type: "soft drink",
    flavourNotes: "Zesty lemon, light sweetness with a clean, refreshing finish",
    region: "Devon",
    abv: "0%",
    recommendedFoods: "Fish and chips, Grilled chicken, Summer salads, Light lunches",
    affiliateLink: "https://www.luscombe.co.uk",
    description: "Organic lemonade made with Sicilian lemons and pure Dartmoor spring water. Simple, honest refreshment from Devon.",
    imageUrl: "/images/drinks/luscombe-lemonade.jpg",
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
