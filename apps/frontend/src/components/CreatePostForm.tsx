import { useState, useRef } from "react";
import { Image as ImageIcon, Calendar, Briefcase, X, ShoppingBag, FileText, Megaphone, MapPin, DollarSign, Upload, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { usePostsStore, PostType } from "@/stores/postsStore";
import ProfileTypeBadge, { ProfileType } from "./ProfileTypeBadge";

const postTypes = [
  {
    type: "marketplace" as PostType,
    label: "Marketplace",
    icon: ShoppingBag,
    color: "text-amber-600",
    bgColor: "hover:bg-amber-50",
    suggestedTags: ["for-sale", "product", "service", "commerce"],
    ctaLabel: "Contact Seller",
    fields: ["title", "price", "location"],
  },
  {
    type: "opportunity" as PostType,
    label: "Opportunity",
    icon: Briefcase,
    color: "text-blue-600",
    bgColor: "hover:bg-blue-50",
    suggestedTags: ["funding", "investment", "partnership", "collaboration"],
    ctaLabel: "Apply Now",
    fields: ["title", "location"],
  },
  {
    type: "update" as PostType,
    label: "Update",
    icon: Megaphone,
    color: "text-purple-600",
    bgColor: "hover:bg-purple-50",
    suggestedTags: ["announcement", "news", "milestone", "achievement"],
    ctaLabel: "Learn More",
    fields: [],
  },
  {
    type: "event" as PostType,
    label: "Event",
    icon: Calendar,
    color: "text-orange-600",
    bgColor: "hover:bg-orange-50",
    suggestedTags: ["networking", "workshop", "conference", "meetup"],
    ctaLabel: "Register",
    fields: ["title", "date", "location"],
  },
  {
    type: "blog" as PostType,
    label: "Blog",
    icon: FileText,
    color: "text-green-600",
    bgColor: "hover:bg-green-50",
    suggestedTags: ["insights", "tutorial", "guide", "opinion"],
    ctaLabel: "Read More",
    fields: ["title"],
  },
];

interface CreatePostFormProps {
  onClose?: () => void;
}

// User's profiles (this would come from a store in production)
const userProfiles = [
  {
    id: "basic",
    name: "EFF HGG",
    email: "eff@smilefactory.co.zw",
    type: null, // Basic profile
    isPrimary: true,
  },
  {
    id: "current-user",
    name: "EFF HGG",
    type: "Innovator" as ProfileType,
    isPrimary: true,
  },
  {
    id: "profile-2",
    name: "Tech Innovations Hub",
    type: "Organization" as ProfileType,
    isPrimary: false,
  },
  {
    id: "profile-3",
    name: "EFF HGG - Mentor",
    type: "Mentor" as ProfileType,
    isPrimary: false,
  },
];

export function CreatePostForm({ onClose }: CreatePostFormProps) {
  const [selectedType, setSelectedType] = useState<PostType | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<string>("current-user"); // Default to primary profile
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addPost = usePostsStore((state) => state.addPost);

  const selectedPostConfig = postTypes.find(pt => pt.type === selectedType);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!content.trim()) return;

    // Get the selected profile
    const profile = userProfiles.find(p => p.id === selectedProfile);
    if (!profile) return;

    addPost({
      type: selectedType || "general",
      author: {
        id: profile.id,
        name: profile.name,
        userType: profile.type?.toLowerCase() || "user",
      },
      title: title || undefined,
      content,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      date: date || undefined,
      location: location || undefined,
      price: price || undefined,
      image: imagePreview || undefined,
    });

    // Reset form
    setContent("");
    setTitle("");
    setDate("");
    setLocation("");
    setPrice("");
    setSelectedTags([]);
    setSelectedType(null);
    setSelectedProfile("current-user"); // Reset to primary profile
    removeImage();

    if (onClose) onClose();
  };

  return (
    <Card className="shadow-sm flex flex-col max-h-[80vh]">
      {/* Fixed Header */}
      <div className="p-4 border-b flex-shrink-0">
        {onClose && (
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Create Post</h3>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Fixed Category Tabs */}
      <div className="border-b flex-shrink-0 bg-muted/30 p-2 overflow-x-auto">
        <div className="flex gap-2">
          {postTypes.map((postType) => {
            const Icon = postType.icon;
            return (
              <Button
                key={postType.type}
                variant={selectedType === postType.type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(postType.type)}
                className={cn(
                  "transition-all flex-shrink-0",
                  selectedType === postType.type && postType.bgColor
                )}
              >
                <Icon className={cn("h-4 w-4 mr-2", postType.color)} />
                {postType.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Profile Selector */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Post As</Label>
          <Select value={selectedProfile} onValueChange={setSelectedProfile}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {userProfiles.map((profile) => (
                <SelectItem key={profile.id} value={profile.id}>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{profile.name}</span>
                    {profile.type && (
                      <Badge variant="outline" className="text-xs ml-1">
                        {profile.type}
                      </Badge>
                    )}
                    {!profile.type && (
                      <Badge variant="outline" className="text-xs ml-1">
                        Basic Profile
                      </Badge>
                    )}
                    {profile.isPrimary && (
                      <Badge variant="default" className="text-xs">
                        Primary
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Choose which profile to post from
          </p>
        </div>

        {/* Dynamic Fields Based on Post Type */}
        {selectedType && selectedPostConfig && (
          <div className="space-y-3">
          {selectedPostConfig.fields.includes("title") && (
            <div>
              <Label htmlFor="title" className="text-sm">Title</Label>
              <Input
                id="title"
                placeholder="Enter a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1"
              />
            </div>
          )}

          {selectedPostConfig.fields.includes("date") && (
            <div>
              <Label htmlFor="date" className="text-sm">Date</Label>
              <Input
                id="date"
                type="text"
                placeholder="e.g., March 25, 2024"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1"
              />
            </div>
          )}

          {selectedPostConfig.fields.includes("location") && (
            <div>
              <Label htmlFor="location" className="text-sm">Location</Label>
              <Input
                id="location"
                placeholder="Enter location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1"
              />
            </div>
          )}

          {selectedPostConfig.fields.includes("price") && (
            <div>
              <Label htmlFor="price" className="text-sm">Price</Label>
              <Input
                id="price"
                placeholder="e.g., $99 or Free"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1"
              />
            </div>
          )}
          </div>
        )}

        {/* Content */}
        <div>
          <Label htmlFor="content" className="text-sm">Content</Label>
        <Textarea
          id="content"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px] resize-none mt-1"
        />
        </div>

        {/* Image Upload */}
        <div>
        <Label className="text-sm font-medium mb-2 block">Image (Optional)</Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        {imagePreview ? (
          <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-primary/50">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click to upload an image
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        )}
        </div>

        {/* Smart Tags */}
        {selectedType && selectedPostConfig && (
          <div>
            <Label className="text-sm font-medium mb-2 block">Suggested Tags</Label>
          <div className="flex flex-wrap gap-2">
            {selectedPostConfig.suggestedTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Footer with Action Buttons */}
      <div className="p-4 border-t flex-shrink-0 bg-card">
        <div className="flex gap-2 justify-end">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="min-w-[120px]"
        >
          {selectedPostConfig?.ctaLabel || "Post"}
        </Button>
        </div>
      </div>
    </Card>
  );
}
