import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StickyFilterHeaderProps {
  title: string;
  description: string;
  filterComponent: React.ReactNode;
  pageType?: string;
}

export function StickyFilterHeader({
  title,
  description,
  filterComponent,
  pageType,
}: StickyFilterHeaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [spacerHeight, setSpacerHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Get the header height (toolbar is 64px = h-16)
    const headerHeight = 64;
    const tabsHeight = window.innerWidth < 1024 ? 48 : 0; // Mobile tabs height

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the element is no longer visible at the top, make it sticky
        const isNotVisible = entry.boundingClientRect.top <= headerHeight + tabsHeight;
        setIsSticky(isNotVisible);
      },
      {
        threshold: 0,
        rootMargin: `-${headerHeight + tabsHeight}px 0px 0px 0px`,
      }
    );

    observer.observe(container);

    // Store the height for the spacer
    setSpacerHeight(container.offsetHeight);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={containerRef} className="relative z-20">
        <Card
          className={cn(
            "bg-card transition-all duration-200",
            isSticky && "fixed left-0 right-0 top-16 lg:top-16 rounded-none border-b border-t-0 shadow-md z-30"
          )}
          style={
            isSticky
              ? {
                  width: "100%",
                  left: 0,
                  right: 0,
                  top: "64px", // Header height
                }
              : {}
          }
        >
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-2 gap-4">
              <h2 className={cn(
                "font-bold transition-all duration-200",
                isSticky ? "text-sm md:text-base" : "text-2xl"
              )}>
                {title}
              </h2>
              <div className="flex-shrink-0">
                {filterComponent}
              </div>
            </div>
            {!isSticky && (
              <p className="text-muted-foreground text-sm">
                {description}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Spacer to prevent content jump when sticky */}
      {isSticky && (
        <div
          style={{
            height: `${spacerHeight}px`,
          }}
          className="pointer-events-none"
        />
      )}
    </>
  );
}

