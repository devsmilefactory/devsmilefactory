import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, ChevronDown } from "lucide-react";

interface FilterCategory {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
  }[];
}

interface PageFilterProps {
  categories: FilterCategory[];
  onFilterChange?: (selectedFilters: string[]) => void;
  pageType?: "blog" | "events" | "profiles" | "marketplace";
}

export function PageFilter({
  categories,
  onFilterChange,
  pageType = "marketplace",
}: PageFilterProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleFilter = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter((id) => id !== filterId)
      : [...selectedFilters, filterId];
    setSelectedFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    onFilterChange?.([]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filter</span>
          {selectedFilters.length > 0 && (
            <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-primary rounded-full">
              {selectedFilters.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Filter {pageType}</h3>
            {selectedFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-auto p-1"
                onClick={clearFilters}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-96">
          <div className="p-4 space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="space-y-2">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="flex items-center gap-2 w-full text-sm font-medium hover:text-primary transition-colors"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      expandedCategories.includes(category.id)
                        ? "rotate-0"
                        : "-rotate-90"
                    }`}
                  />
                  {category.name}
                </button>

                {expandedCategories.includes(category.id) && (
                  <div className="ml-6 space-y-2">
                    {category.subcategories.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center gap-2"
                      >
                        <Checkbox
                          id={sub.id}
                          checked={selectedFilters.includes(sub.id)}
                          onCheckedChange={() => toggleFilter(sub.id)}
                        />
                        <Label
                          htmlFor={sub.id}
                          className="text-xs cursor-pointer font-normal"
                        >
                          {sub.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-3 border-t">
          <Button size="sm" className="w-full text-xs">
            Apply Filters
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

