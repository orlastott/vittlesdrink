import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Wine, ExternalLink, MapPin, Percent, Sparkles, Beer, GlassWater, Leaf, Cherry } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { PairingResult } from "@shared/schema";

async function fetchPairing(dish: string): Promise<PairingResult> {
  const res = await fetch(`/api/pairing?dish=${encodeURIComponent(dish)}`);
  if (!res.ok) {
    throw new Error("Failed to fetch pairing");
  }
  return res.json();
}

function DrinkIcon({ type, className = "h-8 w-8" }: { type: string; className?: string }) {
  switch (type.toLowerCase()) {
    case 'beer':
    case 'ale':
    case 'lager':
      return <Beer className={`${className} text-amber-600`} />;
    case 'cider':
      return <Cherry className={`${className} text-orange-500`} />;
    case 'gin':
      return <Leaf className={`${className} text-emerald-600`} />;
    case 'whisky':
    case 'whiskey':
    case 'rum':
      return <GlassWater className={`${className} text-amber-700`} />;
    case 'wine':
      return <Wine className={`${className} text-rose-600`} />;
    default:
      return <Wine className={`${className} text-accent`} />;
  }
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        </CardContent>
      </Card>
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function Results() {
  const searchParams = new URLSearchParams(window.location.search);
  const dish = searchParams.get('dish') || '';

  const { data, isLoading, error } = useQuery<PairingResult>({
    queryKey: ['pairing', dish],
    queryFn: () => fetchPairing(dish),
    enabled: !!dish,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home">
            <Wine className="h-6 w-6 text-accent" />
            <span className="font-serif text-xl font-bold">British Pairing</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-accent transition-colors" data-testid="link-nav-home">Home</Link>
            <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors" data-testid="link-nav-blog">Blog</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Link href="/" data-testid="link-back">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
        </Link>

        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
            Pairings for <span className="text-accent">{dish}</span>
          </h1>
          <p className="text-muted-foreground mb-8">
            Here are the best British drink matches for your dish.
          </p>

          {isLoading && <LoadingSkeleton />}

          {error && (
            <Card className="border-destructive">
              <CardContent className="py-8 text-center">
                <p className="text-destructive">Failed to find pairings. Please try again.</p>
                <Link href="/">
                  <Button variant="outline" className="mt-4">
                    Try Another Dish
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {data && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent" />
                    Flavour Analysis
                  </CardTitle>
                  <CardDescription>{data.dishAnalysis.flavourProfile}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {data.dishAnalysis.keyCharacteristics.map((char, i) => (
                      <Badge key={i} variant="secondary">{char}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <h2 className="font-serif text-2xl font-bold mt-8 mb-4">Recommended Pairings</h2>

              {data.pairings.map((pairing, index) => (
                <Card key={pairing.drink.id} className="hover-elevate transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-3">
                        <DrinkIcon type={pairing.drink.type} />
                        <div>
                          <CardTitle className="text-xl">
                            <Link
                              href={`/drink/${pairing.drink.id}`}
                              className="hover:text-accent transition-colors"
                              data-testid={`link-drink-${pairing.drink.id}`}
                            >
                              {pairing.drink.name}
                            </Link>
                          </CardTitle>
                          <CardDescription className="capitalize">{pairing.drink.type}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        {index === 0 ? "Best Match" : `Match #${index + 1}`}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground leading-relaxed">{pairing.explanation}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {pairing.drink.region}
                      </span>
                      <span className="flex items-center gap-1">
                        <Percent className="h-4 w-4" />
                        {pairing.drink.abv} ABV
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground italic">
                      Flavour notes: {pairing.drink.flavourNotes}
                    </p>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <a
                        href={pairing.drink.affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`button-buy-${pairing.drink.id}`}
                      >
                        <Button className="gap-2">
                          Buy Now
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                      <Link href={`/drink/${pairing.drink.id}`}>
                        <Button variant="outline" data-testid={`button-details-${pairing.drink.id}`}>
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t bg-card/50 mt-auto">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>British Pairing - Discover the perfect drink for every dish.</p>
          <p className="mt-2">Drink responsibly. Must be 18+ to purchase alcohol.</p>
        </div>
      </footer>
    </div>
  );
}
