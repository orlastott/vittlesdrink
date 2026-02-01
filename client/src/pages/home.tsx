import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, Wine, Beer, GlassWater, Leaf, Cherry } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trendingDishes } from "@shared/schema";
import cookingVideo from "@/assets/videos/cooking-hero.mp4";
import drinksVideo from "@/assets/videos/drinks-hero.mp4";

const drinkTypeFilters = [
  { id: "beer", label: "Beer & Ale", icon: Beer, color: "text-amber-500" },
  { id: "cider", label: "Cider", icon: Cherry, color: "text-orange-500" },
  { id: "wine", label: "Wine", icon: Wine, color: "text-rose-500" },
  { id: "spirits", label: "Spirits", icon: Leaf, color: "text-emerald-500" },
  { id: "soft", label: "Soft Drinks", icon: GlassWater, color: "text-blue-400" },
];

export default function Home() {
  const [dish, setDish] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [, setLocation] = useLocation();
  const [activeVideo, setActiveVideo] = useState(0);
  const videos = [cookingVideo, drinksVideo];
  
  const toggleType = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(t => t !== typeId)
        : [...prev, typeId]
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideo((prev) => (prev + 1) % videos.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (searchDish: string) => {
    if (searchDish.trim()) {
      const params = new URLSearchParams();
      params.set("dish", searchDish.trim());
      if (selectedTypes.length > 0) {
        params.set("types", selectedTypes.join(","));
      }
      setLocation(`/results?${params.toString()}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(dish);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2" data-testid="link-home">
            <Wine className="h-6 w-6 text-accent" />
            <span className="font-serif text-xl font-bold">Vittles</span>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm font-medium hover:text-accent transition-colors" data-testid="link-nav-home">Home</a>
            <a href="/blog" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors" data-testid="link-nav-blog">Blog</a>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
        {videos.map((video, index) => (
          <video
            key={index}
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              activeVideo === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src={video} type="video/mp4" />
          </video>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        
        <div className="max-w-3xl w-full text-center space-y-8 relative z-10">
          <div className="space-y-4">
            <div className="flex justify-center gap-3">
              <Beer className="h-10 w-10 text-amber-400" />
              <Wine className="h-10 w-10 text-rose-400" />
              <GlassWater className="h-10 w-10 text-amber-300" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
              Find Your Perfect
              <span className="text-amber-400 block mt-2">British Drink Pairing</span>
            </h1>
            <p className="text-gray-200 text-lg md:text-xl max-w-xl mx-auto drop-shadow">
              Match your meal with the finest British & Irish drinks - ales, ciders, gins, whiskies, and more.
            </p>
            <p className="text-green-400 text-sm font-medium flex items-center justify-center gap-2 drop-shadow">
              <Leaf className="h-4 w-4" />
              Non-alcoholic options always included
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-300 uppercase tracking-wider font-medium drop-shadow">
              Filter by drink type <span className="normal-case opacity-70">(optional)</span>
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {drinkTypeFilters.map((filter) => {
                const isSelected = selectedTypes.includes(filter.id);
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => toggleType(filter.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-white text-gray-900 shadow-lg"
                        : "bg-white/20 text-white border border-white/30 backdrop-blur-sm hover:bg-white/30"
                    }`}
                    data-testid={`filter-${filter.id}`}
                  >
                    <Icon className={`h-4 w-4 ${isSelected ? filter.color : ""}`} />
                    {filter.label}
                  </button>
                );
              })}
            </div>
            {selectedTypes.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedTypes([])}
                className="text-sm text-gray-300 hover:text-white underline underline-offset-2"
                data-testid="button-clear-filters"
              >
                Clear filters (show all)
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="max-w-xl mx-auto w-full">
            <div className="flex items-center gap-2 bg-white/95 rounded-md border-2 border-border focus-within:border-accent h-14 px-4">
              <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <Input
                type="text"
                placeholder="What are you eating?"
                value={dish}
                onChange={(e) => setDish(e.target.value)}
                className="flex-1 border-0 h-full text-lg bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                data-testid="input-dish-search"
              />
              <Button
                type="submit"
                disabled={!dish.trim()}
                data-testid="button-search-submit"
              >
                Match
              </Button>
            </div>
          </form>

          <div className="space-y-4">
            <p className="text-sm text-gray-300 uppercase tracking-wider font-medium drop-shadow">
              Trending Dishes
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {trendingDishes.map((trendingDish) => (
                <Badge
                  key={trendingDish}
                  variant="secondary"
                  className="cursor-pointer text-sm py-1.5 px-3 bg-white/20 text-white border-white/30 backdrop-blur-sm"
                  onClick={() => handleSearch(trendingDish)}
                  data-testid={`badge-trending-${trendingDish.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                >
                  {trendingDish}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-card/50">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>Vittles - Discover the perfect drink for every dish.</p>
          <p className="mt-2">Drink responsibly. Must be 18+ to purchase alcohol.</p>
        </div>
      </footer>
    </div>
  );
}
