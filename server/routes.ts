import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, seedDatabase } from "./storage";
import OpenAI from "openai";
import type { Drink, PairingResult } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

// Flavour keyword mappings for sophisticated pairing
const flavourPairings: Record<string, string[]> = {
  // Dish keywords -> drink flavour keywords that complement
  'beef': ['malt', 'caramel', 'rich', 'roast', 'oak', 'robust'],
  'steak': ['malt', 'oak', 'whisky', 'bold', 'rich'],
  'lamb': ['spice', 'fruit', 'caramel', 'warm', 'herbs'],
  'pork': ['apple', 'crisp', 'dry', 'refreshing', 'cider'],
  'chicken': ['citrus', 'light', 'crisp', 'floral', 'refreshing'],
  'fish': ['citrus', 'crisp', 'mineral', 'light', 'elderflower', 'lemon'],
  'seafood': ['mineral', 'citrus', 'crisp', 'brioche', 'sparkling'],
  'curry': ['ginger', 'spice', 'tropical', 'hoppy', 'cooling'],
  'spicy': ['ginger', 'cooling', 'refreshing', 'citrus', 'tropical'],
  'cheese': ['malt', 'fruit', 'bitter', 'apple', 'complex'],
  'roast': ['malt', 'robust', 'caramel', 'warming', 'rich'],
  'pie': ['malt', 'bitter', 'caramel', 'robust', 'traditional'],
  'salad': ['citrus', 'light', 'floral', 'refreshing', 'crisp'],
  'breakfast': ['malty', 'robust', 'bold', 'comforting', 'rich'],
  'dessert': ['sweet', 'vanilla', 'butterscotch', 'honey', 'fruit'],
  'chocolate': ['vanilla', 'butterscotch', 'molasses', 'rich', 'warming'],
  'cream': ['elderflower', 'delicate', 'honey', 'light', 'floral'],
};

// Fallback function for deterministic pairing when AI fails
function getFallbackPairings(dish: string, allDrinks: Drink[]): PairingResult {
  const dishLower = dish.toLowerCase();
  
  // Separate alcoholic and non-alcoholic drinks
  const alcoholicDrinks = allDrinks.filter(d => d.abv !== '0%');
  const nonAlcoholicDrinks = allDrinks.filter(d => d.abv === '0%');
  
  // Find relevant flavour keywords based on dish
  const relevantFlavours: string[] = [];
  for (const [keyword, flavours] of Object.entries(flavourPairings)) {
    if (dishLower.includes(keyword)) {
      relevantFlavours.push(...flavours);
    }
  }
  
  // Score function for drinks based on flavour matching
  const scoreDrink = (drink: Drink) => {
    let score = 0;
    const recommendedFoods = drink.recommendedFoods.toLowerCase();
    const flavourNotes = drink.flavourNotes.toLowerCase();
    const description = drink.description.toLowerCase();
    
    // Check if dish matches any recommended foods
    const foodKeywords = recommendedFoods.split(',').map(f => f.trim());
    for (const keyword of foodKeywords) {
      if (dishLower.includes(keyword) || keyword.includes(dishLower.split(' ')[0])) {
        score += 25;
      }
    }
    
    // Match flavour notes with relevant flavours
    for (const flavour of relevantFlavours) {
      if (flavourNotes.includes(flavour)) {
        score += 15;
      }
    }
    
    // Boost micro-breweries and local producers
    if (description.includes('micro') || description.includes('craft') || 
        description.includes('independent') || description.includes('family')) {
      score += 10;
    }
    
    // Common food-drink pairings
    if (dishLower.includes('beef') && (drink.type === 'ale' || drink.type === 'whisky')) score += 20;
    if (dishLower.includes('fish') && (drink.type === 'wine' || flavourNotes.includes('citrus'))) score += 20;
    if (dishLower.includes('pork') && drink.type === 'cider') score += 25;
    if (dishLower.includes('curry') && flavourNotes.includes('ginger')) score += 25;
    if (dishLower.includes('spicy') && flavourNotes.includes('ginger')) score += 25;
    if (dishLower.includes('cheese') && (drink.type === 'cider' || drink.type === 'ale')) score += 20;
    if (dishLower.includes('breakfast') && drink.type === 'tea') score += 30;
    if (dishLower.includes('roast') && (drink.type === 'ale' || drink.type === 'tea')) score += 25;
    
    // Add small randomness
    score += Math.random() * 5;
    
    return { drink, score };
  };
  
  // Score and sort alcoholic drinks, take top 2
  const topAlcoholic = alcoholicDrinks
    .map(scoreDrink)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);
  
  // Score and sort non-alcoholic drinks, take top 1
  const topNonAlcoholic = nonAlcoholicDrinks
    .map(scoreDrink)
    .sort((a, b) => b.score - a.score)
    .slice(0, 1);
  
  // Combine: 2 alcoholic + 1 non-alcoholic
  const allPairings = [...topAlcoholic, ...topNonAlcoholic]
    .sort((a, b) => b.score - a.score);
  
  // Generate flavour-based explanations
  const generateExplanation = (drink: Drink, dishName: string) => {
    const flavours = drink.flavourNotes.split(',')[0].trim().toLowerCase();
    return `${drink.name} brings ${flavours} that beautifully ${drink.abv === '0%' ? 'refreshes' : 'complements'} the flavours in ${dishName}. A thoughtful British pairing from ${drink.region}.`;
  };
  
  return {
    dish,
    dishAnalysis: {
      flavourProfile: `A dish with character that pairs wonderfully with carefully selected British drinks - including local craft producers.`,
      keyCharacteristics: ["flavourful", "balanced", "satisfying"],
    },
    pairings: allPairings.map((item, index) => ({
      drink: {
        id: item.drink.id,
        name: item.drink.name,
        type: item.drink.type,
        flavourNotes: item.drink.flavourNotes,
        region: item.drink.region,
        abv: item.drink.abv,
        affiliateLink: item.drink.affiliateLink,
        description: item.drink.description,
        imageUrl: item.drink.imageUrl,
      },
      explanation: generateExplanation(item.drink, dish),
      matchScore: Math.round(92 - index * 4),
    })),
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed database on startup
  await seedDatabase();

  // Get all drinks
  app.get("/api/drinks", async (req, res) => {
    try {
      const drinks = await storage.getAllDrinks();
      res.json(drinks);
    } catch (error) {
      console.error("Error fetching drinks:", error);
      res.status(500).json({ error: "Failed to fetch drinks" });
    }
  });

  // Get single drink by ID
  app.get("/api/drinks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid drink ID" });
      }
      const drink = await storage.getDrink(id);
      if (!drink) {
        return res.status(404).json({ error: "Drink not found" });
      }
      res.json(drink);
    } catch (error) {
      console.error("Error fetching drink:", error);
      res.status(500).json({ error: "Failed to fetch drink" });
    }
  });

  // AI-powered pairing endpoint
  app.get("/api/pairing", async (req, res) => {
    try {
      const dish = req.query.dish as string;
      if (!dish || dish.trim() === "") {
        return res.status(400).json({ error: "Dish parameter is required" });
      }

      // Get all drinks from the database
      const allDrinks = await storage.getAllDrinks();
      if (allDrinks.length === 0) {
        return res.status(500).json({ error: "No drinks available in database" });
      }

      // Use AI to analyze the dish and find pairings
      const systemPrompt = `You are an expert sommelier and food pairing specialist with deep knowledge of British drinks - from craft micro-breweries to traditional producers.
Your task is to analyze a dish's flavour profile and recommend THE BEST British drink pairings from the provided database.

FLAVOUR PAIRING PRINCIPLES:
1. COMPLEMENTARY PAIRINGS: Match similar flavours (caramel malt with caramelised onions, citrus hops with lemon-dressed fish)
2. CONTRASTING PAIRINGS: Balance opposites (bitter hops cutting through fatty meats, crisp acidity refreshing rich dishes)
3. INTENSITY MATCHING: Bold dishes need bold drinks; delicate dishes need subtle drinks
4. REGIONAL AFFINITY: Consider local pairings (Cheshire cheese with Cheshire ales, Welsh lamb with Welsh ale)
5. UNEXPECTED DISCOVERIES: Suggest creative pairings that work on flavour principles but aren't obvious

CHAMPION LOCAL PRODUCERS:
- Prioritise micro-breweries and small independent producers when the flavour match is strong
- Highlight what makes each producer special in your explanation
- Help users discover hidden gems beyond mainstream options

IMPORTANT RULES:
- Analyse the dish's key flavour notes: fat content, acidity, sweetness, umami, spice level, cooking method
- Match specific flavour notes in drinks to specific elements of the dish
- Explain WHY the pairing works using flavour science
- Be fun, engaging and educational - help people learn about pairing
- Use British English spelling
- ALWAYS include at least one non-alcoholic option (tea, soft drink) - 0% ABV drinks
- Reference the drink's flavour notes specifically in your explanations`;

      const userPrompt = `Dish to analyze: "${dish}"

Available British drinks database:
${allDrinks.map((d, i) => `
${i + 1}. ${d.name} (${d.type})
   - Flavour: ${d.flavourNotes}
   - Region: ${d.region}
   - ABV: ${d.abv}
   - Recommended foods: ${d.recommendedFoods}
`).join('')}

Please provide:
1. A detailed flavour profile analysis of the dish (2-3 sentences covering: dominant flavours, fat/acid balance, cooking method effects, texture)
2. 3-5 key flavour characteristics as single words or short phrases
3. Select 2-3 BEST matching drinks from the database. REQUIREMENTS:
   - At least ONE must be non-alcoholic (0% ABV)
   - Prioritise micro-breweries and local producers when the flavour match is strong
   - Include at least one unexpected/creative pairing that works on flavour principles
4. For each drink, explain WHY it pairs well - reference SPECIFIC flavour notes from both the dish AND the drink. Be educational!
5. A match score from 1-100 for each pairing based on flavour harmony

Respond in this exact JSON format:
{
  "dishAnalysis": {
    "flavourProfile": "Description of the dish's flavour profile",
    "keyCharacteristics": ["characteristic1", "characteristic2", "characteristic3"]
  },
  "selectedDrinkIds": [id1, id2, id3],
  "pairingExplanations": {
    "drinkId1": { "explanation": "Why this drink pairs well...", "matchScore": 95 },
    "drinkId2": { "explanation": "Why this drink pairs well...", "matchScore": 88 }
  }
}

Use the exact drink IDs from the database (1-indexed from the list). Return valid JSON only.`;

      const response = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_completion_tokens: 1024,
        response_format: { type: "json_object" },
      });

      const aiResponse = response.choices[0]?.message?.content;
      if (!aiResponse) {
        throw new Error("No response from AI");
      }

      let parsed;
      try {
        parsed = JSON.parse(aiResponse);
      } catch {
        throw new Error("Failed to parse AI response");
      }

      // Map the AI response to our pairing result format
      const pairings = parsed.selectedDrinkIds
        .map((listIndex: number) => {
          const drink = allDrinks[listIndex - 1]; // Convert 1-indexed to 0-indexed
          if (!drink) return null;
          const pairingInfo = parsed.pairingExplanations[listIndex.toString()] ||
                              parsed.pairingExplanations[drink.id.toString()];
          return {
            drink: {
              id: drink.id,
              name: drink.name,
              type: drink.type,
              flavourNotes: drink.flavourNotes,
              region: drink.region,
              abv: drink.abv,
              affiliateLink: drink.affiliateLink,
              description: drink.description,
              imageUrl: drink.imageUrl,
            },
            explanation: pairingInfo?.explanation || "A great British pairing for your dish!",
            matchScore: pairingInfo?.matchScore || 80,
          };
        })
        .filter(Boolean)
        .sort((a: any, b: any) => b.matchScore - a.matchScore)
        .slice(0, 3);

      const result: PairingResult = {
        dish,
        dishAnalysis: parsed.dishAnalysis,
        pairings,
      };

      res.json(result);
    } catch (error) {
      console.error("Error generating AI pairing, using fallback:", error);
      // Use fallback when AI fails
      try {
        const allDrinks = await storage.getAllDrinks();
        const dish = req.query.dish as string;
        const fallbackResult = getFallbackPairings(dish, allDrinks);
        res.json(fallbackResult);
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        res.status(500).json({ error: "Failed to generate drink pairing" });
      }
    }
  });

  return httpServer;
}
