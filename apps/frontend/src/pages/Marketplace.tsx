import PostCard from "@/components/PostCard";
import { MarketplaceFilter } from "@/components/MarketplaceFilter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useMarketplaceStore } from "@/stores/marketplaceStore";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useScrollToTop } from "@/hooks/useScrollToTop";

export default function Marketplace() {
  useScrollToTop();
  const { items, featuredItems } = useMarketplaceStore();
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (featuredItems.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === featuredItems.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredItems.length]);

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? featuredItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === featuredItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-6">
      <Card className="bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Marketplace</h2>
            <MarketplaceFilter />
          </div>
          <p className="text-muted-foreground">
            Connect with vetted services and solutions that empower your innovation journey
          </p>
        </CardContent>
      </Card>

      {/* Featured Section - Carousel with Thumbnails */}
      {featuredItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary fill-primary" />
            <h3 className="text-lg font-semibold">Featured Listings</h3>
          </div>

          <Card className="border-2 border-primary shadow-xl overflow-hidden">
            <CardContent className="p-0">
              {/* Main Carousel */}
              <div className="relative">
                <div className="absolute -top-2 -left-2 z-10">
                  <Badge className="bg-primary text-white shadow-lg">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>

                {/* Active Item */}
                <div className="bg-gradient-to-br from-primary/5 to-transparent">
                  <PostCard {...featuredItems[activeIndex]} />
                </div>

                {/* Navigation Arrows */}
                {featuredItems.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                      onClick={handlePrevious}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                      onClick={handleNext}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {featuredItems.length > 1 && (
                <div className="p-4 bg-muted/30 border-t">
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide justify-center">
                    {featuredItems.map((item, index) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveIndex(index)}
                        className={cn(
                          "flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all",
                          activeIndex === index
                            ? "border-primary shadow-lg scale-105"
                            : "border-transparent opacity-60 hover:opacity-100"
                        )}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title || "Thumbnail"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              {item.title?.substring(0, 2) || "?"}
                            </span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Divider */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">All Listings</h3>
        <div className="space-y-4">
          {items.map((item) => (
            <PostCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
