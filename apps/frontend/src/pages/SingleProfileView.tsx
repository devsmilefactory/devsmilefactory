import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MapPin, Briefcase, Calendar, Link as LinkIcon, Mail, Users, Heart, MessageCircle, Bookmark, TrendingUp, Settings, ArrowLeft, Share2, MoreVertical } from "lucide-react";
import PostCard from "@/components/PostCard";
import { usePostsStore } from "@/stores/postsStore";
import ProfileTypeBadge, { ProfileType } from "@/components/ProfileTypeBadge";
import { useScrollToTop } from "@/hooks/useScrollToTop";

// Mock profile data for different profile IDs
const profilesData: Record<string, any> = {
  "p1": {
    id: "p1",
    name: "Innovation Leader",
    username: "@innovationleader",
    type: "Innovator",
    bio: "Passionate about driving innovation and creating impactful solutions. Building the future one idea at a time.",
    location: "New York, NY",
    website: "innovationleader.com",
    email: "contact@innovationleader.com",
    joinedDate: "February 2024",
    profileTypes: ["Innovator"],
    stats: {
      posts: 45,
      connections: 1250,
      following: 380,
    },
    expertise: ["Innovation", "Product Development", "Strategy", "Leadership"],
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
    followers: 1250,
    following: 380,
  },
  "profile-2": {
    id: "profile-2",
    name: "Tech Innovations Hub",
    username: "@techinnovations",
    type: "Organization",
    bio: "Accelerating innovation through collaboration and technology. We connect innovators, investors, and mentors to build the future.",
    location: "San Francisco, CA",
    website: "techinnovationshub.com",
    email: "hello@techinnovationshub.com",
    joinedDate: "March 2023",
    profileTypes: ["Organization"],
    stats: {
      posts: 78,
      connections: 2340,
      following: 450,
    },
    expertise: ["Technology", "Innovation", "Collaboration", "Startups"],
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
    followers: 3400,
    following: 120,
  },
  "profile-3": {
    id: "profile-3",
    name: "EFF HGG - Mentor",
    username: "@effhgg_mentor",
    type: "Mentor",
    bio: "Helping aspiring entrepreneurs build successful ventures. 15+ years of experience in tech and business.",
    location: "Harare, Zimbabwe",
    website: "smilefactory.co.zw",
    email: "mentor@smilefactory.co.zw",
    joinedDate: "January 2024",
    profileTypes: ["Mentor"],
    stats: {
      posts: 23,
      connections: 890,
      following: 340,
    },
    expertise: ["Entrepreneurship", "Mentoring", "Business Strategy", "Technology"],
    coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80",
    followers: 890,
    following: 340,
  },
};

export default function SingleProfileView() {
  useScrollToTop();
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const allPosts = usePostsStore((state) => state.posts);

  // Get profile data - default to "p1" if no id is provided
  const profileData = profilesData[id || "p1"] || profilesData["p1"];

  // Filter posts by profile
  const userPosts = allPosts.filter(post => post.author.id === id);

  // Mock bookmarked posts
  const bookmarkedPosts = allPosts.slice(0, 2);

  // Mock activity data
  const activityData = [
    { type: "like", post: "AI-Powered Healthcare Platform", time: "2 hours ago" },
    { type: "comment", post: "Global Innovation Summit 2024", time: "5 hours ago" },
    { type: "bookmark", post: "Seed Funding Opportunity", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">{profileData.name}</h1>
              <p className="text-xs text-muted-foreground">{profileData.stats.posts} posts</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-primary/20 to-secondary/20 relative overflow-hidden">
          <img
            src={profileData.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Header */}
        <Card className="rounded-t-none border-t-0">
          <CardContent className="p-6">
            {/* Avatar and Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
              <Avatar className="h-32 w-32 border-4 border-card ring-4 ring-card shadow-xl">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-white text-4xl">
                  {profileData.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex gap-2">
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  onClick={() => setIsFollowing(!isFollowing)}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button variant="outline" size="icon">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{profileData.name}</h2>
                <p className="text-muted-foreground">{profileData.username}</p>
              </div>

              <ProfileTypeBadge type={profileData.type as ProfileType} size="lg" />

              <p className="text-sm leading-relaxed">{profileData.bio}</p>

              {/* Meta Information */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {profileData.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profileData.location}</span>
                  </div>
                )}
                {profileData.website && (
                  <div className="flex items-center gap-1">
                    <LinkIcon className="h-4 w-4" />
                    <a href={`https://${profileData.website}`} className="text-primary hover:underline">
                      {profileData.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {profileData.joinedDate}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 text-sm pt-2">
                <div>
                  <span className="font-bold">{userPosts.length}</span>
                  <span className="text-muted-foreground ml-1">Posts</span>
                </div>
                <div>
                  <span className="font-bold">{profileData.stats.connections}</span>
                  <span className="text-muted-foreground ml-1">Connections</span>
                </div>
                <div>
                  <span className="font-bold">{profileData.stats.following}</span>
                  <span className="text-muted-foreground ml-1">Following</span>
                </div>
              </div>

              {/* Expertise Tags */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.expertise.map((skill: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Card className="rounded-t-none border-t-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
              <TabsTrigger
                value="posts"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:bg-transparent"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:bg-transparent"
              >
                <Users className="h-4 w-4 mr-2" />
                About
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:bg-transparent"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-6 space-y-4 p-6">
              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <PostCard key={post.id} {...post} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground mb-4">No posts yet</p>
                    <p className="text-sm text-muted-foreground">This profile hasn't shared any posts</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="about" className="mt-6 p-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Bio</h3>
                    <p className="text-sm text-muted-foreground">{profileData.bio}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Profile Types</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.profileTypes.map((type: string, idx: number) => (
                        <Badge key={idx} variant="outline">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Areas of Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.expertise.map((skill: string, idx: number) => (
                        <Badge key={idx} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-6 p-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  {activityData.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 pb-4 border-b last:border-b-0">
                      <div className="mt-1">
                        {activity.type === "like" && <Heart className="h-4 w-4 text-red-500" />}
                        {activity.type === "comment" && <MessageCircle className="h-4 w-4 text-blue-500" />}
                        {activity.type === "bookmark" && <Bookmark className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-semibold">{activity.type === "like" ? "Liked" : activity.type === "comment" ? "Commented on" : "Bookmarked"}</span>
                          {" "}<span className="text-muted-foreground">{activity.post}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

