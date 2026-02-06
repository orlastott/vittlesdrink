import { Link } from "wouter";
import { Wine, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Blog() {
  return (
    <div className="min-h-screen flex flex-col">
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
              Vittles
            </span>
          </a>
          <nav className="hidden md:flex gap-6 font-medium text-muted-foreground">
            <a href="/" className="hover:text-accent transition-colors">Home</a>
            <a href="/blog" className="hover:text-accent transition-colors">Blog</a>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            The Vittles Blog
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Coming soon: Expert guides, tasting notes, and pairing tips from the world of British drinks.
          </p>

          <div className="grid gap-6 md:grid-cols-2 text-left">
            <Card className="opacity-60">
              <CardHeader>
                <CardTitle>The Art of Beer & Food Pairing</CardTitle>
                <CardDescription>Coming Soon</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Discover how to match British ales with classic pub dishes for the ultimate dining experience.
                </p>
              </CardContent>
            </Card>

            <Card className="opacity-60">
              <CardHeader>
                <CardTitle>A Guide to British Ciders</CardTitle>
                <CardDescription>Coming Soon</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  From Somerset scrumpy to Herefordshire craft, explore the diverse world of British cider.
                </p>
              </CardContent>
            </Card>

            <Card className="opacity-60">
              <CardHeader>
                <CardTitle>Whisky Regions of Scotland</CardTitle>
                <CardDescription>Coming Soon</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Journey through the whisky-producing regions and discover their unique flavour profiles.
                </p>
              </CardContent>
            </Card>

            <Card className="opacity-60">
              <CardHeader>
                <CardTitle>The British Gin Renaissance</CardTitle>
                <CardDescription>Coming Soon</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  How craft distillers are reinventing gin with botanical innovations across the UK.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <Link href="/">
              <Button data-testid="button-back-home">
                Find Your Pairing
              </Button>
            </Link>
          </div>
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
