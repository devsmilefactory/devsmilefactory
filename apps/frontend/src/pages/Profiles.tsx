import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageFilter } from "@/components/PageFilter";
import { Star, MapPin, Briefcase, Users } from "lucide-react";
import ProfileTypeBadge, { ProfileType } from "@/components/ProfileTypeBadge";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const profilesFilterCategories = [
  {
    id: "profile-type",
    name: "Profile Type",
    subcategories: [
      { id: "innovator", name: "Innovator" },
      { id: "mentor", name: "Mentor" },
      { id: "investor", name: "Investor" },
      { id: "organization", name: "Organization" },
    ],
  },
  {
    id: "expertise",
    name: "Expertise",
    subcategories: [
      { id: "technology", name: "Technology" },
      { id: "business", name: "Business" },
      { id: "marketing", name: "Marketing" },
      { id: "finance", name: "Finance" },
    ],
  },
  {
    id: "location",
    name: "Location",
    subcategories: [
      { id: "africa", name: "Africa" },
      { id: "americas", name: "Americas" },
      { id: "asia", name: "Asia" },
      { id: "europe", name: "Europe" },
    ],
  },
];

const featuredProfiles = [
  {
    id: "p1",
    name: "Dr. Sarah Johnson",
    role: "Innovation Expert",
    type: "Mentor",
    location: "San Francisco, CA",
    expertise: ["AI", "Healthcare", "Startups"],
    connections: 1250,
    avatar: "",
  },
  {
    id: "p2",
    name: "Michael Chen",
    role: "Venture Capitalist",
    type: "Investor",
    location: "New York, NY",
    expertise: ["FinTech", "SaaS", "Series A"],
    connections: 890,
    avatar: "",
  },
  {
    id: "p3",
    name: "Emma Rodriguez",
    role: "Serial Entrepreneur",
    type: "Innovator",
    location: "Austin, TX",
    expertise: ["E-commerce", "Marketing", "Growth"],
    connections: 2100,
    avatar: "",
  },
];

const allProfiles = [
  {
    id: "p4",
    name: "David Park",
    role: "Product Manager",
    type: "Innovator",
    location: "Seattle, WA",
    expertise: ["Product", "UX", "Agile"],
    connections: 567,
    avatar: "",
  },
  {
    id: "p5",
    name: "Lisa Thompson",
    role: "Sustainability Consultant",
    type: "Mentor",
    location: "Portland, OR",
    expertise: ["Sustainability", "Impact", "ESG"],
    connections: 423,
    avatar: "",
  },
  {
    id: "p6",
    name: "James Williams",
    role: "Academic Researcher",
    type: "Mentor",
    location: "Boston, MA",
    expertise: ["Research", "Innovation", "Academia"],
    connections: 789,
    avatar: "",
  },
];

export default function Profiles() {
  useScrollToTop();
  const navigate = useNavigate();

  const handleViewProfile = (profileId: string) => {
    navigate(`/profile/${profileId}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 md:pb-6">
      <Card className="bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Profiles Directory</h2>
            <PageFilter categories={profilesFilterCategories} pageType="profiles" />
          </div>
          <p className="text-muted-foreground">
            Connect with innovators, investors, mentors, and industry experts
          </p>
        </CardContent>
      </Card>

      {/* Featured Profiles - Spotlight Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary fill-primary" />
          <h3 className="text-lg font-semibold">Featured Profiles</h3>
        </div>

        {/* Hero-style Featured Profile */}
        <div className="grid md:grid-cols-2 gap-6">
          {featuredProfiles.slice(0, 1).map((profile) => (
            <Card key={profile.id} className="md:col-span-2 border-2 border-primary shadow-xl hover:shadow-2xl transition-all group cursor-pointer overflow-hidden">
              <div className="grid md:grid-cols-[300px_1fr] gap-0">
                {/* Left side - Avatar and Stats */}
                <div className="bg-gradient-to-br from-primary/10 to-primary-glow/10 p-8 flex flex-col items-center justify-center">
                  <Avatar className="h-24 w-24 mb-4 ring-4 ring-primary/30 shadow-xl">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-white text-2xl">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Badge className="mb-4 bg-primary text-white shadow-lg">
                    <Star className="h-4 w-4 mr-1" />
                    Featured Profile
                  </Badge>
                  <div className="flex gap-6 text-center">
                    <div>
                      <div className="font-bold text-2xl text-primary">{profile.connections}</div>
                      <div className="text-xs text-muted-foreground">Connections</div>
                    </div>
                  </div>
                </div>

                {/* Right side - Profile Info */}
                <CardContent className="p-8 flex flex-col justify-center">
                  <h4 className="font-bold text-2xl mb-2 group-hover:text-primary transition-colors">{profile.name}</h4>
                  <p className="text-muted-foreground mb-3">{profile.role}</p>
                  <ProfileTypeBadge type={profile.type as ProfileType} size="md" className="w-fit mb-4" />

                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {profile.expertise.map((skill, idx) => (
                      <Badge key={idx} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={() => handleViewProfile(profile.id)}
                    >
                      View Profile
                    </Button>
                    <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/10">
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}

          {/* Other Featured Profiles */}
          {featuredProfiles.slice(1).map((profile) => (
            <Card key={profile.id} className="border-2 border-primary/50 shadow-lg hover:shadow-xl transition-shadow group cursor-pointer">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-16 w-16 mb-4 ring-4 ring-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-white text-xl">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Badge className="mb-2 bg-primary/80 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                  <h4 className="font-bold text-lg mb-1">{profile.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{profile.role}</p>
                  <ProfileTypeBadge type={profile.type as ProfileType} size="sm" className="mb-3" />

                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3" />
                    <span>{profile.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 justify-center mb-4">
                    {profile.expertise.map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-primary text-primary hover:bg-primary/10"
                    onClick={() => handleViewProfile(profile.id)}
                  >
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* All Profiles - Twitter-style List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">All Profiles</h3>
        <Card>
          <CardContent className="p-0 divide-y">
            {allProfiles.map((profile) => (
              <div
                key={profile.id}
                className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleViewProfile(profile.id)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-sm">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate hover:underline">{profile.name}</h4>
                        <p className="text-xs text-muted-foreground truncate">{profile.role}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0 text-xs h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        Connect
                      </Button>
                    </div>

                    <ProfileTypeBadge type={profile.type as ProfileType} size="sm" className="mb-2" />

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{profile.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 flex-shrink-0" />
                        <span>{profile.connections} connections</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {profile.expertise.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
