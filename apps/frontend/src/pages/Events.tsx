import PostCard from "@/components/PostCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageFilter } from "@/components/PageFilter";
import { Star } from "lucide-react";
import { useEventsStore } from "@/stores/eventsStore";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const eventsFilterCategories = [
  {
    id: "event-type",
    name: "Event Type",
    subcategories: [
      { id: "workshop", name: "Workshop" },
      { id: "conference", name: "Conference" },
      { id: "networking", name: "Networking" },
      { id: "meetup", name: "Meetup" },
    ],
  },
  {
    id: "format",
    name: "Format",
    subcategories: [
      { id: "in-person", name: "In-Person" },
      { id: "virtual", name: "Virtual" },
      { id: "hybrid", name: "Hybrid" },
    ],
  },
  {
    id: "category",
    name: "Category",
    subcategories: [
      { id: "innovation", name: "Innovation" },
      { id: "business", name: "Business" },
      { id: "technology", name: "Technology" },
      { id: "entrepreneurship", name: "Entrepreneurship" },
    ],
  },
];

export default function Events() {
  useScrollToTop();
  const { events, featuredEvents } = useEventsStore();
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-6">
      <Card className="bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Events</h2>
            <PageFilter categories={eventsFilterCategories} pageType="events" />
          </div>
          <p className="text-muted-foreground">
            Discover and join innovation events, workshops, and networking opportunities
          </p>
        </CardContent>
      </Card>

      {/* Featured Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary fill-primary" />
          <h3 className="text-lg font-semibold">Featured Event</h3>
        </div>
        <div className="space-y-4">
          {featuredEvents.map((event) => (
            <div key={event.id} className="relative">
              <div className="absolute -top-2 -left-2 z-10">
                <Badge className="bg-primary text-white shadow-lg">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              </div>
              <div className="border-2 border-primary rounded-lg shadow-lg bg-gradient-to-br from-primary/5 to-transparent">
                <PostCard {...event} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Events */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Upcoming Events</h3>
        <div className="space-y-4">
          {events.map((event) => (
            <PostCard key={event.id} {...event} />
          ))}
        </div>
      </div>
    </div>
  );
}
