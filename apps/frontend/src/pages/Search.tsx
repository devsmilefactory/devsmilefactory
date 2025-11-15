import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import FilterModal from "@/components/FilterModal";

export default function Search() {
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Auto-open filter modal when page loads
  useEffect(() => {
    setShowFilterModal(true);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Search</h2>
        <p className="text-muted-foreground">
          Search and explore content across the innovation ecosystem
        </p>
      </div>

      {/* Open Filter Button */}
      <Card>
        <CardContent className="p-8 text-center">
          <Button
            size="lg"
            onClick={() => setShowFilterModal(true)}
            className="gap-2"
          >
            <Filter className="h-5 w-5" />
            Open Advanced Search & Filter
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            Use our comprehensive filter system to find exactly what you're looking for
          </p>
        </CardContent>
      </Card>

      {/* Filter Modal */}
      <FilterModal
        open={showFilterModal}
        onOpenChange={setShowFilterModal}
      />
    </div>
  );
}
