import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, Wine, Beer, GlassWater, Leaf, Cherry } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trendingDishes } from "@shared/schema";

const drinkTypeFilters = [
  { id: "beer", label: "Beer & Ale", icon: Beer, color: "text-amber-400" },
  { id: "cider", label: "Cider", icon: Cherry, color: "text-orange-400" },
  { id: "wine", label: "Wine", icon: Wine, color: "text-rose-400" },
  { id: "spirits", label: "Spirits", icon: Leaf, color: "text-emerald-400" },
  { id: "soft", label: "Soft Drinks", icon: GlassWater, color: "text-blue-400" },
];

export default function Home() {
  const [dish, setDish] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [, setLocation] = useLocation();
  const [activeVideo, setActiveVideo] = useState(0);

  const videos = [
    "/images/ChatGPT_Image_Feb_1,_2026,_08_46_08_PM_1769978801593.png"
  ];

  const toggleType = (typeId: string) => {
    setSelectedTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(t => t !== typeId)
        : [...prev, typeId]
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideo(prev => (prev + 1) % videos.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (searchDish: string) => {
    if (!searchDish.trim()) return;
    const params = new URLSearchParams();
    params.set("dish", searchDish.trim());
    if (selectedTypes.length) params.set("types", selectedTypes.join(","));
    setLocation(`/results?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(dish);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/60 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between py-4 px-6 md:px-10">
          <a href="/" className="flex items-center gap-3">
            <img
              src="/images/ChatGPT_Image_Feb_1,_2026,_08_46_08_PM_1769978801593.png"
              alt="Vittles Logo"
              className="h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
            <span className="text-xl md:text-2xl font-serif font-bold text-primary-foreground hidden md:block drop-shadow-md">
              Vittles & Drink
            </span>
          </a>
          <nav className="hidden md:flex gap-6 font-medium text-muted-foreground">
            <a href="/" className="hover:text-accent transition-colors">Home</a>
            <a href="/blog" className="hover:text-accent transition-colors">Blog</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative flex flex-col items-center justify-center px-4 py-24 overflow-hidden">
        {/* Background Image */}
        {videos.map((video, idx) => (
          <img
            key={idx}
            src={video}
            alt="Background"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              activeVideo === idx ? "opacity-70" : "opacity-0"
            } blur-sm`}
          />
        ))}

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-3xl space-y-8">
          {/* Icons */}
          <div className="flex justify-center gap-4">
            <Beer className="h-10 w-10 text-amber-400" />
            <Wine className="h-10 w-10 text-rose-400" />
            <GlassWater className="h-10 w-10 text-blue-400" />
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
            Find Your Perfect
            <span className="block mt-2 text-amber-400">British Drink Pairing</span>
          </h1>

          <p className="text-gray-200 text-lg md:text-xl drop-shadow-lg">
            Match your meal with the finest British & Irish drinks - ales, ciders, gins, whiskies, and more.
          </p>

          <p className="flex items-center justify-center gap-2 text-green-400 font-medium text-sm drop-shadow-md">
            <Leaf className="h-4 w-4" />
            Non-alcoholic options included
          </p>

          {/* Drink Type Filters */}
          <div className="space-y-3">
            <p className="text-sm text-gray-300 uppercase tracking-wider font-medium drop-shadow">
              Filter by drink type <span className="normal-case opacity-70">(optional)</span>
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {drinkTypeFilters.map(filter => {
                const isSelected = selectedTypes.includes(filter.id);
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => toggleType(filter.id)}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-white text-gray-900 shadow-lg"
                        : "bg-white/20 text-white border border-white/30 backdrop-blur-sm hover:bg-white/30"
                    }`}
                  >
                    <Icon className={`${isSelected ? filter.color : "text-white/70"} h-5 w-5`} />
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
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="mt-6 max-w-xl mx-auto w-full">
            <div className="flex items-center gap-2 bg-white/90 rounded-full border-2 border-border focus-within:border-accent h-14 px-6 shadow-lg">
              <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <Input
                type="text"
                placeholder="What are you eating?"
                value={dish}
                onChange={e => setDish(e.target.value)}
                className="flex-1 border-0 h-full text-lg bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              />
              <Button
                type="submit"
                disabled={!dish.trim()}
              >
                Match
              </Button>
            </div>
          </form>

          {/* Trending Dishes */}
          <div className="mt-8 space-y-4">
            <p className="text-sm text-gray-300 uppercase tracking-wider font-medium drop-shadow">
              Trending Dishes
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {trendingDishes.map(dish => (
                <Badge
                  key={dish}
                  variant="secondary"
                  className="cursor-pointer text-sm py-1.5 px-4 rounded-full bg-white/20 text-white border-white/30 backdrop-blur-sm hover:bg-white/30 transition"
                  onClick={() => handleSearch(dish)}
                >
                  {dish}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>Vittles - Discover the perfect drink for every dish.</p>
          <p className="mt-2">Drink responsibly. Must be 18+ to purchase alcohol.</p>
        </div>
      </footer>
    </div>
  );
}
