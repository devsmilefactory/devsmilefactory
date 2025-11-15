import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageFilter } from "@/components/PageFilter";
import { Star, Clock, User } from "lucide-react";
import { useBlogStore } from "@/stores/blogStore";
import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const blogFilterCategories = [
  {
    id: "topics",
    name: "Topics",
    subcategories: [
      { id: "innovation", name: "Innovation" },
      { id: "entrepreneurship", name: "Entrepreneurship" },
      { id: "technology", name: "Technology" },
      { id: "business", name: "Business" },
    ],
  },
  {
    id: "content-type",
    name: "Content Type",
    subcategories: [
      { id: "tutorial", name: "Tutorial" },
      { id: "guide", name: "Guide" },
      { id: "opinion", name: "Opinion" },
      { id: "case-study", name: "Case Study" },
    ],
  },
  {
    id: "author",
    name: "Author",
    subcategories: [
      { id: "expert", name: "Expert" },
      { id: "community", name: "Community" },
      { id: "team", name: "Team" },
      { id: "guest", name: "Guest" },
    ],
  },
];

export default function Blog() {
  useScrollToTop();
  const { posts, featuredPosts } = useBlogStore();
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 md:pb-6">
      <Card className="bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Blog</h2>
            <PageFilter categories={blogFilterCategories} pageType="blog" />
          </div>
          <p className="text-muted-foreground">
            Insights, stories, and knowledge from the innovation community
          </p>
        </CardContent>
      </Card>

      {/* Featured Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary fill-primary" />
          <h3 className="text-lg font-semibold">Featured Post</h3>
        </div>
        <div className="space-y-4">
          {featuredPosts.map((post) => (
            <div key={post.id} className="relative">
              <div className="absolute -top-2 -left-2 z-10">
                <Badge className="bg-primary text-white shadow-lg">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              </div>
              <Card
                className="border-2 border-primary shadow-lg bg-gradient-to-br from-primary/5 to-transparent hover:shadow-xl transition-shadow overflow-hidden cursor-pointer"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-auto">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6 flex flex-col justify-center">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{post.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/post/${post.id}`);
                      }}
                    >
                      Read Full Article
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* All Blog Posts - Horizontal List Layout */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Recent Posts</h3>
        <div className="space-y-4">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="hover:shadow-lg transition-shadow overflow-hidden group cursor-pointer"
              onClick={() => navigate(`/post/${post.id}`)}
            >
              <div className="grid md:grid-cols-[300px_1fr] gap-0">
                {/* Image on the left */}
                <div className="relative h-48 md:h-auto overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content on the right */}
                <CardContent className="p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h4 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{post.author}</span>
                      </div>
                      <span>•</span>
                      <span>{post.authorRole}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary text-primary hover:bg-primary/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/post/${post.id}`);
                      }}
                    >
                      Read Article
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

