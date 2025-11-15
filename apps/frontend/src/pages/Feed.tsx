import { useState } from "react";
import PostCard from "@/components/PostCard";
import { CreatePostForm } from "@/components/CreatePostForm";
import { usePostsStore } from "@/stores/postsStore";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ShoppingBag, Briefcase, Megaphone, Calendar, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollToTop } from "@/hooks/useScrollToTop";

export default function Feed() {
  useScrollToTop();
  const posts = usePostsStore((state) => state.posts);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const postCategories = [
    { type: "marketplace", icon: ShoppingBag, label: "Marketplace", color: "text-amber-600" },
    { type: "opportunity", icon: Briefcase, label: "Opportunity", color: "text-blue-600" },
    { type: "update", icon: Megaphone, label: "Update", color: "text-purple-600" },
    { type: "event", icon: Calendar, label: "Event", color: "text-orange-600" },
    { type: "blog", icon: FileText, label: "Blog", color: "text-green-600" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-6">
      {/* Compact Post Creation Trigger */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              EH
            </AvatarFallback>
          </Avatar>
          <button
            onClick={() => setShowCreatePost(true)}
            className="flex-1 text-left px-4 py-2 rounded-full bg-muted hover:bg-muted/80 transition-colors text-muted-foreground"
          >
            What's on your mind?
          </button>
        </div>

        {/* Category Icons */}
        <div className="flex items-center justify-around pt-3 border-t">
          {postCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.type}
                onClick={() => setShowCreatePost(true)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors",
                  category.color
                )}
                title={category.label}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium hidden sm:inline">{category.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Create Post Modal */}
      <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
        <DialogContent className="max-w-2xl">
          <CreatePostForm onClose={() => setShowCreatePost(false)} />
        </DialogContent>
      </Dialog>

      {/* All Posts */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Latest Posts</h3>
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
}
