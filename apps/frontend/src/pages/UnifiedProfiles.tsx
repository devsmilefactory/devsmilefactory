import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  FileText,
  Bookmark,
  MessageCircle,
  Calendar,
  Users,
  Plus,
  Settings,
  Mail,
  MapPin,
  Link as LinkIcon,
  Eye,
  TrendingUp,
  Star,
  ArrowLeft,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import ProfileTypeBadge, { ProfileType } from "@/components/ProfileTypeBadge";
import PostCard from "@/components/PostCard";
import { usePostsStore } from "@/stores/postsStore";
import { useEventRegistrationStore } from "@/stores/eventRegistrationStore";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

// Base user identity
const baseIdentity = {
  email: "eff@smilefactory.co.zw",
  name: "EFF HGG",
  joinedDate: "January 2024",
};

// User's profiles
const initialProfiles = [
  {
    id: "current-user",
    name: "EFF HGG",
    type: "Innovator" as ProfileType,
    bio: "Innovation-focused entrepreneur | Building solutions that matter",
    followers: 1250,
    following: 890,
    posts: 45,
    isPrimary: true,
  },
  {
    id: "profile-2",
    name: "Tech Innovations Hub",
    type: "Organization" as ProfileType,
    bio: "Accelerating innovation through collaboration and technology",
    followers: 3400,
    following: 120,
    posts: 78,
    isPrimary: false,
  },
  {
    id: "profile-3",
    name: "EFF HGG - Mentor",
    type: "Mentor" as ProfileType,
    bio: "Helping aspiring entrepreneurs build successful ventures",
    followers: 890,
    following: 340,
    posts: 23,
    isPrimary: false,
  },
];

export default function UnifiedProfiles() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const posts = usePostsStore((state) => state.posts);
  const registeredEvents = useEventRegistrationStore((state) => state.registeredEvents);
  const [activeTab, setActiveTab] = useState("my-profiles");
  const [myProfiles, setMyProfiles] = useState(initialProfiles);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileType, setNewProfileType] = useState<ProfileType>("Innovator");
  const [newProfileBio, setNewProfileBio] = useState("");

  // Filter user's posts
  const userPosts = posts.filter(post => post.author.id === "current-user");
  
  // Mock bookmarked posts
  const bookmarkedPosts = posts.slice(0, 3);

  // Mock comments
  const userComments = [
    { id: "1", postTitle: "AI-Powered Healthcare Platform", comment: "This is amazing! Would love to collaborate.", time: "2 hours ago" },
    { id: "2", postTitle: "Seed Funding Opportunity", comment: "Interested in learning more about the application process.", time: "1 day ago" },
  ];

  // Discover profiles (other users)
  const discoverProfiles = [
    {
      id: "p1",
      name: "Dr. Sarah Johnson",
      role: "Innovation Expert",
      type: "Mentor" as ProfileType,
      location: "San Francisco, CA",
      expertise: ["AI", "Healthcare", "Startups"],
      connections: 1250,
    },
    {
      id: "p2",
      name: "Michael Chen",
      role: "Venture Capitalist",
      type: "Investor" as ProfileType,
      location: "New York, NY",
      expertise: ["FinTech", "SaaS", "Series A"],
      connections: 890,
    },
  ];

  const calculateProfileCompletion = (profile: typeof initialProfiles[0]) => {
    let completionScore = 0;
    const maxScore = 100;

    // Check profile fields (each worth 20%)
    if (profile.name) completionScore += 20;
    if (profile.type) completionScore += 20;
    if (profile.bio && profile.bio.length > 10) completionScore += 20;
    if (profile.followers > 0) completionScore += 20;
    if (profile.posts > 0) completionScore += 20;

    return Math.min(completionScore, maxScore);
  };

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) {
      toast.error("Please enter a profile name");
      return;
    }

    const newProfile = {
      id: `profile-${Date.now()}`,
      name: newProfileName,
      type: newProfileType,
      bio: newProfileBio,
      followers: 0,
      following: 0,
      posts: 0,
      isPrimary: false,
    };

    setMyProfiles([...myProfiles, newProfile]);
    setShowCreateDialog(false);
    setNewProfileName("");
    setNewProfileBio("");
    toast.success("Profile created successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Distraction-Free Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
        <div className="flex h-16 items-center justify-between px-6 max-w-6xl mx-auto w-full">
          <Button
            variant="ghost"
            onClick={() => navigate('/feed')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto pb-20 md:pb-6 px-6 py-6">
      {/* Cover Photo - Reduced by 50% */}
      <div className="relative h-24 md:h-32 bg-gradient-to-r from-primary to-primary-glow rounded-t-lg overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80"
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Header */}
      <Card className="rounded-t-none border-t-0">
        <CardContent className="p-6">
          {/* Avatar and Base Identity */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 sm:-mt-16 mb-4">
            <div className="flex items-end gap-4">
              <Avatar className="h-24 w-24 border-4 border-card ring-4 ring-card shadow-xl">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-white text-3xl">
                  {baseIdentity.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="pb-2">
                <h1 className="text-2xl font-bold">{baseIdentity.name}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Mail className="h-4 w-4" />
                  <span>{baseIdentity.email}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Joined {baseIdentity.joinedDate}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Info Card */}
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 mt-4">
            <CardContent className="p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Base Identity:</strong> This is your foundational account ({baseIdentity.email}). 
                All your profiles are linked to this identity. You can create multiple profiles to represent 
                different aspects of your professional presence.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="my-profiles" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">My Profiles</span>
          </TabsTrigger>
          <TabsTrigger value="posts" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Posts</span>
          </TabsTrigger>
          <TabsTrigger value="bookmarks" className="gap-2">
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Bookmarks</span>
          </TabsTrigger>
          <TabsTrigger value="comments" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Comments</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Events</span>
          </TabsTrigger>
          <TabsTrigger value="discover" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Discover</span>
          </TabsTrigger>
        </TabsList>

        {/* My Profiles Tab */}
        <TabsContent value="my-profiles" className="space-y-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">My Profiles</h3>
              <p className="text-sm text-muted-foreground">
                Manage your different professional personas
              </p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Profile</DialogTitle>
                  <DialogDescription>
                    Create a new profile to represent different aspects of your professional identity
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-name">Profile Name</Label>
                    <Input
                      id="profile-name"
                      placeholder="e.g., Your Company Name, Your Name - Role"
                      value={newProfileName}
                      onChange={(e) => setNewProfileName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-type">Profile Type</Label>
                    <Select value={newProfileType} onValueChange={(value) => setNewProfileType(value as ProfileType)}>
                      <SelectTrigger id="profile-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Innovator">Innovator</SelectItem>
                        <SelectItem value="Mentor">Mentor</SelectItem>
                        <SelectItem value="Investor">Investor</SelectItem>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Organization">Organization</SelectItem>
                        <SelectItem value="Professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-bio">Bio</Label>
                    <Textarea
                      id="profile-bio"
                      placeholder="Tell us about this profile..."
                      value={newProfileBio}
                      onChange={(e) => setNewProfileBio(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleCreateProfile} className="w-full">
                    Create Profile
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {myProfiles.map((profile) => (
              <Card key={profile.id} className={profile.isPrimary ? "border-2 border-primary" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-lg">
                          {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{profile.name}</CardTitle>
                          {profile.isPrimary && (
                            <Badge variant="default" className="text-xs">Primary</Badge>
                          )}
                        </div>
                        <ProfileTypeBadge type={profile.type} size="sm" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">{profile.bio}</p>

                  {/* Profile Completion */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-muted-foreground">Profile Completion</span>
                      <span className="font-semibold text-primary">{calculateProfileCompletion(profile)}%</span>
                    </div>
                    <Progress value={calculateProfileCompletion(profile)} className="h-2" />
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{profile.followers}</span>
                      <span className="text-muted-foreground">followers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{profile.posts}</span>
                      <span className="text-muted-foreground">posts</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/profile/${profile.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/profile/${profile.id}/edit`)}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-4 mt-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Your Posts</h3>
            <p className="text-sm text-muted-foreground">
              All posts across your profiles
            </p>
          </div>
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                You haven't created any posts yet
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Bookmarks Tab */}
        <TabsContent value="bookmarks" className="space-y-4 mt-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Bookmarked Posts</h3>
            <p className="text-sm text-muted-foreground">
              Posts you've saved for later
            </p>
          </div>
          {bookmarkedPosts.length > 0 ? (
            bookmarkedPosts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                No bookmarked posts yet
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments" className="space-y-4 mt-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Your Comments</h3>
            <p className="text-sm text-muted-foreground">
              Comments you've made on posts
            </p>
          </div>
          {userComments.length > 0 ? (
            userComments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium">{comment.postTitle}</p>
                    <span className="text-xs text-muted-foreground">{comment.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{comment.comment}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                No comments yet
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4 mt-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Registered Events</h3>
            <p className="text-sm text-muted-foreground">
              Events you're attending or interested in
            </p>
          </div>
          {registeredEvents.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {registeredEvents.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <Badge variant={event.status === "Going" ? "default" : "secondary"}>
                        {event.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                No registered events yet
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Discover Profiles Tab */}
        <TabsContent value="discover" className="space-y-4 mt-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Discover Profiles</h3>
            <p className="text-sm text-muted-foreground">
              Connect with other innovators, mentors, and organizations
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {discoverProfiles.map((profile) => (
              <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-base">{profile.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{profile.role}</p>
                      <ProfileTypeBadge type={profile.type} size="sm" className="mt-2" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {profile.expertise.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{profile.connections} connections</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/profile/${profile.id}`)}
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}

