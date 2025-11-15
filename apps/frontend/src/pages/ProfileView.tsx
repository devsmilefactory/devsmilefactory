import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MapPin, Briefcase, Calendar, Link as LinkIcon, Mail, Users, Heart, MessageCircle, Bookmark, TrendingUp, Settings } from "lucide-react";
import PostCard from "@/components/PostCard";
import { usePostsStore } from "@/stores/postsStore";
import { useNavigate, useParams } from "react-router-dom";

// Current user profile data (this would come from auth context in real app)
const profileData = {
  id: "current-user",
  name: "EFF HGG",
  username: "@effhgg",
  bio: "Innovation-focused entrepreneur | Building solutions that matter | Passionate about technology-driven growth",
  location: "Harare, Zimbabwe",
  website: "smilefactory.co.zw",
  email: "eff@smilefactory.co.zw",
  joinedDate: "January 2024",
  profileTypes: ["Innovator"],
  stats: {
    posts: 0,
    connections: 0,
    following: 0,
  },
  expertise: ["Innovation", "Entrepreneurship", "Technology"],
  coverImage: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80",
};

const mockPosts = [
  {
    id: "1",
    type: "general" as const,
    author: {
      id: "user-1",
      name: "Dr. Sarah Johnson",
      userType: "innovator" as const,
    },
    content: "Just finished mentoring my 50th startup this year! The innovation ecosystem is thriving. Key lesson: Focus on solving real problems, not just building technology.",
    timestamp: "2 hours ago",
    likes: 312,
    comments: 45,
    tags: ["mentorship", "startup", "advice"],
  },
  {
    id: "2",
    type: "opportunity" as const,
    author: {
      id: "user-1",
      name: "Dr. Sarah Johnson",
      userType: "investor" as const,
    },
    title: "Seed Funding Available for Healthcare AI",
    content: "Looking for early-stage healthcare AI startups. Offering $100K-$250K in seed funding plus hands-on mentorship. Strong focus on patient outcomes and scalability.",
    timestamp: "1 day ago",
    likes: 189,
    comments: 34,
    tags: ["funding", "healthcare", "ai"],
  },
];

export default function ProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const allPosts = usePostsStore((state) => state.posts);

  // Filter posts by current user
  const userPosts = allPosts.filter(post => post.author.id === "current-user");

  // Mock bookmarked posts (in real app, this would come from a bookmarks store)
  const bookmarkedPosts = allPosts.slice(0, 2);

  // Mock activity data
  const activityData = [
    { type: "like", post: "AI-Powered Healthcare Platform", time: "2 hours ago" },
    { type: "comment", post: "Global Innovation Summit 2024", time: "5 hours ago" },
    { type: "bookmark", post: "Seed Funding Opportunity", time: "1 day ago" },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-20 md:pb-6">
      {/* Cover Photo */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary to-primary-glow rounded-t-lg overflow-hidden">
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
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/profile/${id}/edit`)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-3">
            <div>
              <h1 className="text-2xl font-bold">{profileData.name}</h1>
              <p className="text-muted-foreground">{profileData.username}</p>
            </div>

            {/* Profile Types */}
            <div className="flex flex-wrap gap-2">
              {profileData.profileTypes.map((type, idx) => (
                <Badge key={idx} className="bg-primary text-white">
                  {type}
                </Badge>
              ))}
            </div>

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
                {profileData.expertise.map((skill, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="posts"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:bg-transparent"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:bg-transparent"
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="bookmarks"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:bg-transparent"
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Bookmarks
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:bg-transparent"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6 space-y-4">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">You haven't posted anything yet</p>
                  <p className="text-sm text-muted-foreground">Share your ideas, opportunities, or updates with the community!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Bio</h3>
                  <p className="text-sm text-muted-foreground">{profileData.bio}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Profile Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.profileTypes.map((type, idx) => (
                      <Badge key={idx} variant="outline">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Areas of Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.expertise.map((skill, idx) => (
                      <Badge key={idx} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookmarks" className="mt-6 space-y-4">
            {bookmarkedPosts.length > 0 ? (
              bookmarkedPosts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">No bookmarks yet</p>
                  <p className="text-sm text-muted-foreground">Save posts to read later by bookmarking them</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {activityData.map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 pb-4 border-b last:border-0">
                      <div className="mt-1">
                        {activity.type === "like" && <Heart className="h-5 w-5 text-red-500 fill-red-500" />}
                        {activity.type === "comment" && <MessageCircle className="h-5 w-5 text-blue-500" />}
                        {activity.type === "bookmark" && <Bookmark className="h-5 w-5 text-amber-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          You {activity.type}d <span className="font-medium">{activity.post}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

