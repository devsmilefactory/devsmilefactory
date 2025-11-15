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

const filterCategories: FilterCategory[] = [
  {
    id: "services",
    name: "Services",
    subcategories: [
      { id: "consulting", name: "Consulting" },
      { id: "mentorship", name: "Mentorship" },
      { id: "training", name: "Training" },
      { id: "development", name: "Development" },
    ],
  },
  {
    id: "products",
    name: "Products",
    subcategories: [
      { id: "software", name: "Software" },
      { id: "hardware", name: "Hardware" },
      { id: "tools", name: "Tools" },
      { id: "templates", name: "Templates" },
    ],
  },
  {
    id: "opportunities",
    name: "Opportunities",
    subcategories: [
      { id: "funding", name: "Funding" },
      { id: "partnerships", name: "Partnerships" },
      { id: "collaborations", name: "Collaborations" },
      { id: "investments", name: "Investments" },
    ],
  },
  {
    id: "resources",
    name: "Resources",
    subcategories: [
      { id: "guides", name: "Guides" },
      { id: "courses", name: "Courses" },
      { id: "templates", name: "Templates" },
      { id: "tools", name: "Tools" },
    ],
  },
];

interface MarketplaceFilterProps {
  onFilterChange?: (selectedFilters: string[]) => void;
}

export function MarketplaceFilter({ onFilterChange }: MarketplaceFilterProps) {
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
            <h3 className="font-semibold text-sm">Filter Marketplace</h3>
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
            {filterCategories.map((category) => (
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

