import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Wine, ExternalLink, MapPin, Percent, Utensils, Beer, GlassWater, Leaf, Cherry, Award, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Drink } from "@shared/schema";

async function fetchDrink(id: string): Promise<Drink> {
  const res = await fetch(`/api/drinks/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch drink");
  }
  return res.json();
}

function DrinkIcon({ type, className = "h-16 w-16" }: { type: string; className?: string }) {
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

const ukRegions: Record<string, { lat: number; lng: number }> = {
  "Yorkshire": { lat: 53.9591, lng: -1.0815 },
  "London": { lat: 51.5074, lng: -0.1278 },
  "Scotland": { lat: 56.4907, lng: -4.2026 },
  "Somerset": { lat: 51.1052, lng: -2.9262 },
  "Cornwall": { lat: 50.2660, lng: -5.0527 },
  "Kent": { lat: 51.2787, lng: 0.5217 },
  "Sussex": { lat: 50.9097, lng: -0.2533 },
  "Devon": { lat: 50.7156, lng: -3.5309 },
  "Islay": { lat: 55.6288, lng: -6.2066 },
  "Speyside": { lat: 57.4167, lng: -3.2500 },
  "Wales": { lat: 52.1307, lng: -3.7837 },
  "Cotswolds": { lat: 51.8333, lng: -1.8333 },
  "East Anglia": { lat: 52.2053, lng: 0.1218 },
  "Lake District": { lat: 54.4609, lng: -3.0886 },
};

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-24 mt-2" />
        </div>
      </div>
      <Skeleton className="h-32 w-full" />
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}

export default function DrinkDetail() {
  const params = useParams<{ id: string }>();
  const drinkId = params.id;

  const { data: drink, isLoading, error } = useQuery<Drink>({
    queryKey: ['drink', drinkId],
    queryFn: () => fetchDrink(drinkId!),
    enabled: !!drinkId,
  });

  const regionCoords = drink?.region ? ukRegions[drink.region] : null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center" data-testid="link-home">
            <span className="font-serif text-2xl font-bold tracking-wide">Vittles</span>
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

        <div className="max-w-4xl mx-auto">
          {isLoading && <LoadingSkeleton />}

          {error && (
            <Card className="border-destructive">
              <CardContent className="py-8 text-center">
                <p className="text-destructive">Failed to load drink details.</p>
                <Link href="/">
                  <Button variant="outline" className="mt-4">
                    Back to Home
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {drink && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-start gap-6">
                {drink.imageUrl ? (
                  <div className="w-full md:w-64 h-48 md:h-64 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={drink.imageUrl}
                      alt={drink.name}
                      className="w-full h-full object-cover"
                      data-testid={`img-drink-detail-${drink.id}`}
                    />
                  </div>
                ) : (
                  <DrinkIcon type={drink.type} />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="font-serif text-3xl md:text-4xl font-bold">
                      {drink.name}
                    </h1>
                    <Badge className="capitalize">{drink.type}</Badge>
                    {drink.awards && (
                      <Badge variant="outline" className="text-amber-600 border-amber-600 gap-1" data-testid="badge-award-detail">
                        <Award className="h-3 w-3" />
                        Award Winner
                      </Badge>
                    )}
                    {drink.abv === "0%" && (
                      <Badge variant="outline" className="text-green-600 border-green-600" data-testid="badge-nonalcoholic-detail">
                        Non-alcoholic
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg text-muted-foreground mt-2">
                    {drink.description}
                  </p>
                  
                  {drink.awards && (
                    <div className="flex items-center gap-2 mt-4 text-sm bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 px-4 py-3 rounded-md" data-testid="award-info-detail">
                      <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                      <span className="font-medium">{drink.awards}</span>
                    </div>
                  )}
                  
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={drink.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`link-producer-${drink.id}`}
                    >
                      <Button variant="outline" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Visit Producer Website
                      </Button>
                    </a>
                    {drink.reviewLink && (
                      <a
                        href={drink.reviewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`link-reviews-${drink.id}`}
                      >
                        <Button variant="outline" className="gap-2">
                          <Star className="h-4 w-4" />
                          See Reviews
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Flavour Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="italic text-muted-foreground">{drink.flavourNotes}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-accent" />
                        <span><strong>{drink.abv}</strong> ABV</span>
                      </div>
                      {drink.priceTier && (
                        <span className={`px-3 py-1 rounded-md text-sm font-medium ${
                          drink.priceTier === 'budget' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' :
                          drink.priceTier === 'everyday' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                          drink.priceTier === 'premium' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`} data-testid="price-tier-detail">
                          {drink.priceTier === 'budget' ? 'Budget-Friendly' :
                           drink.priceTier === 'everyday' ? 'Everyday' :
                           drink.priceTier === 'premium' ? 'Premium' :
                           'Luxury'}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Utensils className="h-5 w-5" />
                      Best Paired With
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {drink.recommendedFoods.split(',').map((food, i) => (
                        <Badge key={i} variant="secondary">{food.trim()}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Region: {drink.region}
                  </CardTitle>
                  <CardDescription>
                    This {drink.type} comes from the {drink.region} region of the United Kingdom.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-md h-48 flex items-center justify-center relative overflow-hidden">
                    {regionCoords ? (
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-accent mx-auto mb-2" />
                        <p className="font-medium">{drink.region}</p>
                        <p className="text-sm text-muted-foreground">United Kingdom</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Map placeholder - {drink.region}, UK</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center pt-4">
                <a
                  href={drink.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="button-buy-now"
                >
                  <Button size="lg" className="gap-2 text-lg px-8">
                    Buy Now
                    <ExternalLink className="h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t bg-card/50 mt-auto">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>Vittles - Discover the perfect drink for every dish.</p>
          <p className="mt-2">Drink responsibly. Must be 18+ to purchase alcohol.</p>
        </div>
      </footer>
    </div>
  );
}
