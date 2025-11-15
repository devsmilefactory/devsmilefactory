import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import UserBadge, { UserType } from "./UserBadge";
import { Heart, MessageCircle, Share2, Bookmark, TrendingUp, Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { usePostsStore } from "@/stores/postsStore";
import { useEventRegistrationStore } from "@/stores/eventRegistrationStore";
import { toast } from "sonner";

export type PostType = "general" | "opportunity" | "project" | "marketplace" | "event";

interface PostCardProps {
  id?: string;
  type: PostType;
  author: {
    name: string;
    avatar?: string;
    userType: UserType;
  };
  title?: string;
  content: string;
  timestamp: string;
  likes?: number;
  comments?: number;
  image?: string;
  tags?: string[];
  location?: string;
  date?: string;
  price?: string;
}

const postTypeConfig: Record<PostType, {
  borderColor: string;
  badgeColor: string;
  ctaLabel: string;
  ctaVariant: "default" | "secondary" | "outline";
  ctaClassName: string;
  secondaryCtaLabel?: string;
  secondaryCtaClassName?: string;
  icon?: any;
}> = {
  general: {
    borderColor: "border-l-primary",
    badgeColor: "bg-primary/10 text-primary",
    ctaLabel: "Comment",
    ctaVariant: "outline",
    ctaClassName: "border-primary text-primary hover:bg-primary/10",
  },
  opportunity: {
    borderColor: "border-l-success",
    badgeColor: "bg-success/10 text-success",
    ctaLabel: "Apply Now",
    ctaVariant: "outline",
    ctaClassName: "border-blue-600 text-blue-600 hover:bg-blue-50",
    icon: TrendingUp,
  },
  project: {
    borderColor: "border-l-secondary",
    badgeColor: "bg-secondary/10 text-secondary",
    ctaLabel: "Collaborate",
    ctaVariant: "outline",
    ctaClassName: "border-purple-600 text-purple-600 hover:bg-purple-50",
    icon: null,
  },
  marketplace: {
    borderColor: "border-l-accent",
    badgeColor: "bg-accent/10 text-accent",
    ctaLabel: "View Details",
    ctaVariant: "outline",
    ctaClassName: "border-amber-600 text-amber-600 hover:bg-amber-50",
    secondaryCtaLabel: "Contact Seller",
    secondaryCtaClassName: "text-amber-600 hover:text-amber-700",
    icon: null,
  },
  event: {
    borderColor: "border-l-warning",
    badgeColor: "bg-warning/10 text-warning",
    ctaLabel: "Register",
    ctaVariant: "outline",
    ctaClassName: "border-orange-600 text-orange-600 hover:bg-orange-50",
    secondaryCtaLabel: "View Details",
    secondaryCtaClassName: "text-orange-600 hover:text-orange-700",
    icon: Calendar,
  },
};

export default function PostCard({
  id,
  type,
  author,
  title,
  content,
  timestamp,
  likes = 0,
  comments = 0,
  image,
  tags,
  location,
  date,
  price,
}: PostCardProps) {
  const config = postTypeConfig[type];
  const navigate = useNavigate();
  const likePost = usePostsStore((state) => state.likePost);
  const registerForEvent = useEventRegistrationStore((state) => state.registerForEvent);
  const isRegistered = useEventRegistrationStore((state) => state.isRegistered);

  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [localLikes, setLocalLikes] = useState(likes);
  const [eventRegistered, setEventRegistered] = useState(type === "event" && id ? isRegistered(id) : false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      if (!isLiked) {
        likePost(id);
        setLocalLikes(prev => prev + 1);
        setIsLiked(true);
        toast.success("Post liked!");
      } else {
        setLocalLikes(prev => prev - 1);
        setIsLiked(false);
        toast.info("Like removed");
      }
    }
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowComments(!showComments);
    toast.info("Comment feature coming soon!");
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Link copied to clipboard!");
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'A'
    ) {
      return;
    }

    if (id) {
      navigate(`/post/${id}`);
    }
  };
  const Icon = config.icon;

  return (
    <Card
      className={cn(
        "border-l-4 transition-all hover:shadow-md",
        config.borderColor,
        id && "cursor-pointer"
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="h-12 w-12 ring-2 ring-background">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                {author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm">{author.name}</p>
                <UserBadge type={author.userType} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{timestamp}</p>
            </div>
          </div>
          <Bookmark className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-3">
        {title && (
          <div className="flex items-start gap-2">
            {Icon && <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />}
            <h3 className="font-semibold text-lg leading-tight">{title}</h3>
          </div>
        )}
        
        <p className="text-sm text-foreground leading-relaxed">{content}</p>

        {image && (
          <img 
            src={image} 
            alt="Post content" 
            className="w-full rounded-lg object-cover max-h-96"
          />
        )}

        {(date || location || price) && (
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            {date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{date}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
            )}
            {price && (
              <div className="font-semibold text-accent">
                {price}
              </div>
            )}
          </div>
        )}

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground hover:bg-muted/80 cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t flex items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 transition-colors group",
              isLiked ? "text-destructive" : "text-muted-foreground hover:text-destructive"
            )}
          >
            <Heart className={cn("h-5 w-5", isLiked ? "fill-destructive" : "group-hover:fill-destructive")} />
            <span className="text-sm font-medium">{localLikes}</span>
          </button>
          <button
            onClick={handleComment}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{comments}</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Primary CTA - View Details for marketplace/events, or specific action */}
          <Button
            variant={config.ctaVariant}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();

              // For marketplace and events, "View Details" navigates to post
              if ((type === "marketplace" || type === "event") && config.ctaLabel === "View Details") {
                if (id) navigate(`/post/${id}`);
              }
              // Handle event registration
              else if (type === "event" && id && title && date && location) {
                if (!eventRegistered) {
                  registerForEvent({
                    id,
                    title,
                    date,
                    location,
                    status: "Registered",
                  });
                  setEventRegistered(true);
                  toast.success("Successfully registered for event!");
                } else {
                  toast.info("You're already registered for this event");
                }
              } else {
                toast.success(`${config.ctaLabel} clicked!`);
              }
            }}
            className={cn("font-medium", config.ctaClassName)}
          >
            {type === "event" && eventRegistered ? "Registered ✓" : config.ctaLabel}
          </Button>

          {/* Secondary CTA - Contact Seller or View Details */}
          {config.secondaryCtaLabel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // For marketplace "Contact Seller", navigate to messages
                if (type === "marketplace" && config.secondaryCtaLabel === "Contact Seller") {
                  navigate("/messages");
                  toast.success("Message sent to seller! Check your inbox.");
                }
                // For events "View Details", navigate to post
                else if (type === "event" && config.secondaryCtaLabel === "View Details") {
                  if (id) navigate(`/post/${id}`);
                } else {
                  toast.info(`${config.secondaryCtaLabel} - Feature coming soon!`);
                }
              }}
              className={cn("font-medium", config.secondaryCtaClassName)}
            >
              {config.secondaryCtaLabel}
            </Button>
          )}

          {/* View Button for non-marketplace/event posts */}
          {type !== "marketplace" && type !== "event" && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (id) navigate(`/post/${id}`);
              }}
              className="font-medium"
            >
              View
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
