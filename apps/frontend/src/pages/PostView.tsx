import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  User,
  ArrowLeft,
  Moon,
  Sun
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePostsStore } from "@/stores/postsStore";
import { useEventsStore } from "@/stores/eventsStore";
import { useMarketplaceStore } from "@/stores/marketplaceStore";
import { useBlogStore } from "@/stores/blogStore";
import { useTheme } from "@/hooks/useTheme";

export default function PostView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Get post from all stores with proper selectors
  const feedPosts = usePostsStore((state) => state.posts);
  const events = useEventsStore((state) => state.events);
  const featuredEvents = useEventsStore((state) => state.featuredEvents);
  const items = useMarketplaceStore((state) => state.items);
  const featuredItems = useMarketplaceStore((state) => state.featuredItems);
  const posts = useBlogStore((state) => state.posts);
  const featuredPosts = useBlogStore((state) => state.featuredPosts);

  // Find the post
  const eventPosts = [...events, ...featuredEvents];
  const marketplacePosts = [...items, ...featuredItems];
  const blogPosts = [...posts, ...featuredPosts];
  const allPosts = [...feedPosts, ...eventPosts, ...marketplacePosts];
  const post = allPosts.find(p => p.id === id);
  const blogPost = blogPosts.find(p => p.id === id);

  if (!post && !blogPost) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  // Render blog post
  if (blogPost) {
    return (
      <div className="min-h-screen bg-background">
        {/* Distraction-Free Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
          <div className="flex h-16 items-center justify-between px-6 max-w-4xl mx-auto w-full">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
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

        <div className="max-w-4xl mx-auto pb-20 md:pb-6 px-6 py-12">

        <article>
          {/* Hero Image */}
          <div className="relative h-96 rounded-lg overflow-hidden mb-6">
            <img
              src={blogPost.image}
              alt={blogPost.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Header */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {blogPost.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{blogPost.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-white">
                    {blogPost.author.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{blogPost.author}</p>
                  <p className="text-xs">{blogPost.authorRole}</p>
                </div>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{blogPost.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{blogPost.readTime}</span>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <Card>
            <CardContent className="p-8 prose prose-lg max-w-none">
              <p className="lead text-xl text-muted-foreground mb-6">
                {blogPost.excerpt}
              </p>
              
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              
              <h2>Key Insights</h2>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              
              <h2>Practical Applications</h2>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
            </CardContent>
          </Card>

          {/* Engagement Actions */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors">
                    <Heart className="h-5 w-5" />
                    <span className="text-sm font-medium">234</span>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">45</span>
                  </button>
                  <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
                <Button variant="ghost" size="sm">
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </article>
        </div>
      </div>
    );
  }

  // Render regular post
  if (!post) return null;

  const postTypeConfig: Record<string, { color: string; icon: any }> = {
    marketplace: { color: "text-amber-600", icon: DollarSign },
    event: { color: "text-orange-600", icon: Calendar },
    opportunity: { color: "text-blue-600", icon: null },
    project: { color: "text-purple-600", icon: null },
    general: { color: "text-primary", icon: null },
  };

  const config = postTypeConfig[post.type] || postTypeConfig.general;

  return (
    <div className="min-h-screen bg-background">
      {/* Distraction-Free Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
        <div className="flex h-16 items-center justify-between px-6 max-w-4xl mx-auto w-full">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/post/${id}/edit`)}
              size="sm"
            >
              Edit Post
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
        </div>
      </header>

      <div className="max-w-4xl mx-auto pb-20 md:pb-6 px-6 py-12">

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-white">
                {post.author.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold">{post.author.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {post.author.userType}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{post.timestamp}</p>
            </div>
            <Badge className={config.color}>
              {post.type}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Title */}
          {post.title && (
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          )}

          {/* Meta Information */}
          {(post.date || post.location || post.price) && (
            <div className="flex flex-wrap gap-4 mb-6 text-sm">
              {post.date && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
              )}
              {post.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{post.location}</span>
                </div>
              )}
              {post.price && (
                <div className="flex items-center gap-2 font-semibold text-lg text-amber-600">
                  <DollarSign className="h-5 w-5" />
                  <span>{post.price}</span>
                </div>
              )}
            </div>
          )}

          {/* Image */}
          {post.image && (
            <div className="relative h-96 rounded-lg overflow-hidden mb-6">
              <img
                src={post.image}
                alt={post.title || "Post image"}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-6">
            <p className="text-lg leading-relaxed">{post.content}</p>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          <Separator className="my-6" />

          {/* Engagement Stats */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors group">
                <Heart className="h-6 w-6 group-hover:fill-destructive" />
                <span className="text-lg font-medium">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-6 w-6" />
                <span className="text-lg font-medium">{post.comments}</span>
              </button>
              <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Share2 className="h-6 w-6" />
              </button>
            </div>
            <Button variant="ghost" size="sm">
              <Bookmark className="h-5 w-5" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {post.type === "marketplace" && (
              <>
                <Button className="flex-1 bg-amber-600 hover:bg-amber-700">
                  View Details
                </Button>
                <Button variant="outline" className="flex-1 border-amber-600 text-amber-600 hover:bg-amber-50">
                  Contact Seller
                </Button>
              </>
            )}
            {post.type === "event" && (
              <>
                <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
                  Register
                </Button>
                <Button variant="outline" className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50">
                  View Details
                </Button>
              </>
            )}
            {post.type === "opportunity" && (
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                Apply Now
              </Button>
            )}
            {post.type === "project" && (
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                Collaborate
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

