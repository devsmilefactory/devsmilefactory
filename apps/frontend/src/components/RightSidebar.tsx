import { TrendingUp, Users, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const trendingTopics = [
  { tag: "#ClimateInnovation", posts: 234 },
  { tag: "#AIStartups", posts: 189 },
  { tag: "#SeedFunding", posts: 156 },
  { tag: "#TechForGood", posts: 142 },
];

const suggestedConnections = [
  { name: "Sarah Johnson", role: "Investor" },
  { name: "Michael Chen", role: "Mentor" },
  { name: "Tech Innovators Hub", role: "Organization" },
];

const upcomingEvents = [
  { title: "Startup Pitch Night", date: "Mar 25" },
  { title: "Innovation Workshop", date: "Mar 28" },
];

export function RightSidebar() {
  return (
    <div className="w-80 space-y-4 py-6">
      {/* Trending Topics */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Trending Topics</h3>
        </div>
        <div className="space-y-3">
          {trendingTopics.map((topic) => (
            <div key={topic.tag} className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary hover:underline cursor-pointer">
                {topic.tag}
              </span>
              <Badge variant="secondary" className="text-xs">
                {topic.posts}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Suggested Connections */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Suggested Connections</h3>
        </div>
        <div className="space-y-3">
          {suggestedConnections.map((connection) => (
            <div key={connection.name} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{connection.name}</p>
                <p className="text-xs text-muted-foreground">{connection.role}</p>
              </div>
              <button className="text-xs text-primary hover:underline font-medium">
                Connect
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Upcoming Events */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Upcoming Events</h3>
        </div>
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <div key={event.title}>
              <p className="text-sm font-medium">{event.title}</p>
              <p className="text-xs text-muted-foreground">{event.date}</p>
            </div>
          ))}
          {upcomingEvents.length > 0 && <Separator />}
          <button className="text-xs text-primary hover:underline font-medium w-full text-center">
            View all events
          </button>
        </div>
      </Card>
    </div>
  );
}
