import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, Eye, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileTypeBadge, { ProfileType } from "@/components/ProfileTypeBadge";
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

export default function MyProfiles() {
  const navigate = useNavigate();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileType, setNewProfileType] = useState<ProfileType>("Innovator");
  const [newProfileBio, setNewProfileBio] = useState("");

  // Mock data - in real app this would come from a store/API
  const [myProfiles, setMyProfiles] = useState([
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
  ]);

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
    <div className="max-w-5xl mx-auto space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">My Profiles</h2>
          <p className="text-muted-foreground">
            Manage your profiles and switch between different personas
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

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            💡 <strong>Tip:</strong> Create multiple profiles to represent different aspects of your professional identity - 
            like your personal brand, your company, or your role as a mentor.
          </p>
        </CardContent>
      </Card>

      {/* Profiles Grid */}
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
              
              {/* Stats */}
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

              {/* Actions */}
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

      {/* Empty State */}
      {myProfiles.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="h-16 w-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No profiles yet</h3>
              <p className="text-muted-foreground">
                Create your first profile to get started on the platform
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

