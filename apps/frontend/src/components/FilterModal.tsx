import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  ShoppingBag, 
  Briefcase, 
  Megaphone, 
  Calendar, 
  FileText,
  ChevronRight,
  ChevronLeft,
  X,
  Filter
} from "lucide-react";
import PostCard from "./PostCard";
import { usePostsStore } from "@/stores/postsStore";
import { cn } from "@/lib/utils";

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type FilterLevel = "categories" | "subcategories" | "tags";
type CategoryType = "marketplace" | "opportunity" | "update" | "event" | "blog" | null;

const categories = [
  { 
    id: "marketplace", 
    label: "Marketplace", 
    icon: ShoppingBag, 
    color: "text-amber-600",
    subcategories: ["Products", "Services", "Equipment", "Software"]
  },
  { 
    id: "opportunity", 
    label: "Opportunity", 
    icon: Briefcase, 
    color: "text-blue-600",
    subcategories: ["Jobs", "Internships", "Partnerships", "Funding"]
  },
  { 
    id: "update", 
    label: "Update", 
    icon: Megaphone, 
    color: "text-purple-600",
    subcategories: ["Announcements", "News", "Milestones", "Achievements"]
  },
  { 
    id: "event", 
    label: "Event", 
    icon: Calendar, 
    color: "text-orange-600",
    subcategories: ["Conferences", "Workshops", "Webinars", "Networking"]
  },
  { 
    id: "blog", 
    label: "Blog", 
    icon: FileText, 
    color: "text-green-600",
    subcategories: ["Tutorials", "Insights", "Case Studies", "Opinions"]
  },
];

const popularTags = [
  "innovation", "technology", "startup", "ai", "blockchain",
  "sustainability", "healthcare", "fintech", "education", "remote",
  "funding", "mentorship", "networking", "collaboration", "growth"
];

export default function FilterModal({ open, onOpenChange }: FilterModalProps) {
  const posts = usePostsStore((state) => state.posts);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLevel, setCurrentLevel] = useState<FilterLevel>("categories");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Filter posts based on all active filters
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === "" || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || post.type === selectedCategory;
    
    const matchesTags = selectedTags.length === 0 || 
      (post.tags && selectedTags.some(tag => post.tags?.includes(tag)));

    return matchesSearch && matchesCategory && matchesTags;
  });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId as CategoryType);
    setCurrentLevel("subcategories");
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setCurrentLevel("tags");
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleBack = () => {
    if (currentLevel === "tags") {
      setCurrentLevel("subcategories");
      setSelectedSubcategory(null);
    } else if (currentLevel === "subcategories") {
      setCurrentLevel("categories");
      setSelectedCategory(null);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedTags([]);
    setCurrentLevel("categories");
  };

  const activeFiltersCount = 
    (selectedCategory ? 1 : 0) + 
    (selectedSubcategory ? 1 : 0) + 
    selectedTags.length;

  const currentCategory = categories.find(c => c.id === selectedCategory);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[85vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentLevel !== "categories" && (
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Search & Filter
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary">{activeFiltersCount} active</Badge>
                  )}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentLevel === "categories" && "Select a category to filter"}
                  {currentLevel === "subcategories" && `${currentCategory?.label} - Select subcategory`}
                  {currentLevel === "tags" && "Select tags to refine your search"}
                </p>
              </div>
            </div>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Filters */}
          <div className="w-80 border-r flex flex-col">
            {/* Search Input */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts, people, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="p-4 border-b bg-muted/30">
                <p className="text-xs font-medium text-muted-foreground mb-2">Active Filters</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCategory && (
                    <Badge variant="secondary" className="gap-1">
                      {currentCategory?.label}
                      <button onClick={() => {
                        setSelectedCategory(null);
                        setSelectedSubcategory(null);
                        setCurrentLevel("categories");
                      }}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedSubcategory && (
                    <Badge variant="secondary" className="gap-1">
                      {selectedSubcategory}
                      <button onClick={() => setSelectedSubcategory(null)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedTags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      #{tag}
                      <button onClick={() => handleTagToggle(tag)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Options */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {/* Categories Level */}
                {currentLevel === "categories" && (
                  <>
                    <p className="text-xs font-medium text-muted-foreground mb-3">CATEGORIES</p>
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => handleCategorySelect(category.id)}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors",
                            selectedCategory === category.id && "bg-muted"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={cn("h-5 w-5", category.color)} />
                            <span className="font-medium">{category.label}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </button>
                      );
                    })}
                  </>
                )}

                {/* Subcategories Level */}
                {currentLevel === "subcategories" && currentCategory && (
                  <>
                    <p className="text-xs font-medium text-muted-foreground mb-3">SUBCATEGORIES</p>
                    {currentCategory.subcategories.map((subcategory) => (
                      <button
                        key={subcategory}
                        onClick={() => handleSubcategorySelect(subcategory)}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors",
                          selectedSubcategory === subcategory && "bg-muted"
                        )}
                      >
                        <span className="font-medium">{subcategory}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                    ))}
                  </>
                )}

                {/* Tags Level */}
                {currentLevel === "tags" && (
                  <>
                    <p className="text-xs font-medium text-muted-foreground mb-3">POPULAR TAGS</p>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleTagToggle(tag)}
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Results */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b bg-muted/30">
              <p className="text-sm font-medium">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'} found
              </p>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <PostCard key={post.id} {...post} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No posts found matching your filters</p>
                    <Button variant="link" onClick={clearAllFilters} className="mt-2">
                      Clear all filters
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

