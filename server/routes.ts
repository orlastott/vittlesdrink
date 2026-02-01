import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, seedDatabase } from "./storage";
import OpenAI from "openai";
import type { Drink, PairingResult } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

// Fallback function for deterministic pairing when AI fails
function getFallbackPairings(dish: string, allDrinks: Drink[]): PairingResult {
  const dishLower = dish.toLowerCase();
  
  // Separate alcoholic and non-alcoholic drinks
  const alcoholicDrinks = allDrinks.filter(d => d.abv !== '0%');
  const nonAlcoholicDrinks = allDrinks.filter(d => d.abv === '0%');
  
  // Score function for drinks
  const scoreDrink = (drink: Drink) => {
    let score = 0;
    const recommendedFoods = drink.recommendedFoods.toLowerCase();
    
    // Check if dish matches any recommended foods
    const foodKeywords = recommendedFoods.split(',').map(f => f.trim());
    for (const keyword of foodKeywords) {
      if (dishLower.includes(keyword) || keyword.includes(dishLower.split(' ')[0])) {
        score += 30;
      }
    }
    
    // Common food-drink pairings for alcoholic drinks
    if (dishLower.includes('fish') && (drink.type === 'ale' || drink.type === 'wine')) score += 20;
    if (dishLower.includes('beef') && (drink.type === 'ale' || drink.type === 'whisky')) score += 20;
    if (dishLower.includes('chicken') && (drink.type === 'cider' || drink.type === 'wine')) score += 20;
    if (dishLower.includes('pork') && drink.type === 'cider') score += 25;
    if (dishLower.includes('curry') && (drink.type === 'ale' || drink.type === 'rum' || drink.type === 'soft drink')) score += 20;
    if (dishLower.includes('cheese') && (drink.type === 'cider' || drink.type === 'ale')) score += 20;
    if (dishLower.includes('pie') && drink.type === 'ale') score += 25;
    if (dishLower.includes('roast') && (drink.type === 'ale' || drink.type === 'tea')) score += 25;
    if (dishLower.includes('breakfast') && drink.type === 'tea') score += 30;
    if (dishLower.includes('spicy') && drink.type === 'soft drink') score += 25;
    
    // Add some randomness with base score
    score += Math.random() * 10;
    
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
  
  // Combine: 2 alcoholic + 1 non-alcoholic (or adjust if not enough of either)
  const allPairings = [...topAlcoholic, ...topNonAlcoholic]
    .sort((a, b) => b.score - a.score);
  
  return {
    dish,
    dishAnalysis: {
      flavourProfile: `A delicious dish that pairs wonderfully with British drinks - both alcoholic and non-alcoholic options available.`,
      keyCharacteristics: ["savoury", "hearty", "traditional"],
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
      explanation: `${item.drink.name} is a fantastic choice with its ${item.drink.flavourNotes.toLowerCase()}. A classic British pairing!`,
      matchScore: Math.round(95 - index * 5),
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
      const systemPrompt = `You are an expert sommelier and food pairing specialist focusing on British drinks - both alcoholic and non-alcoholic.
Your task is to analyze a dish and recommend the best British drink pairings from a provided database.

IMPORTANT GUIDELINES:
- Base your pairing on flavour contrast/complement rules
- Consider the dish's key flavours, textures, and cooking methods
- Match intensity of flavours between food and drink
- Be fun, friendly, and engaging in your explanations
- Keep explanations concise but informative (2-3 sentences)
- Use British English spelling
- ALWAYS include at least one non-alcoholic option (tea, soft drink) in your recommendations
- Drinks with 0% ABV are non-alcoholic`;

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
1. A flavour profile analysis of the dish (2-3 sentences describing key flavours and characteristics)
2. 3-5 key characteristics as single words or short phrases
3. Select 2-3 BEST matching drinks from the database above. IMPORTANT: At least ONE must be non-alcoholic (0% ABV) such as tea or soft drink.
4. For each selected drink, provide a fun, engaging explanation (2-3 sentences) of why it pairs well
5. A match score from 1-100 for each pairing

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
