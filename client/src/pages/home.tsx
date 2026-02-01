import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Wine, Beer, GlassWater } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trendingDishes } from "@shared/schema";

export default function Home() {
  const [dish, setDish] = useState("");
  const [, setLocation] = useLocation();

  const handleSearch = (searchDish: string) => {
    if (searchDish.trim()) {
      setLocation(`/results?dish=${encodeURIComponent(searchDish.trim())}`);
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

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-3xl w-full text-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center gap-3">
              <Beer className="h-10 w-10 text-accent" />
              <Wine className="h-10 w-10 text-primary" />
              <GlassWater className="h-10 w-10 text-accent" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Find Your Perfect
              <span className="text-accent block mt-2">British Drink Pairing</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto">
              Match your meal with the finest British ales, ciders, gins, whiskies, and more.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="What are you eating?"
                value={dish}
                onChange={(e) => setDish(e.target.value)}
                className="pl-12 pr-24 h-14 text-lg rounded-md border-2 focus:border-accent"
                data-testid="input-dish-search"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                disabled={!dish.trim()}
                data-testid="button-search-submit"
              >
                Match
              </Button>
            </div>
          </form>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
              Trending Dishes
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {trendingDishes.map((trendingDish) => (
                <Badge
                  key={trendingDish}
                  variant="secondary"
                  className="cursor-pointer text-sm py-1.5 px-3"
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
          <p>British Pairing - Discover the perfect drink for every dish.</p>
          <p className="mt-2">Drink responsibly. Must be 18+ to purchase alcohol.</p>
        </div>
      </footer>
    </div>
  );
}
