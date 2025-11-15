import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, X } from "lucide-react";
import { useState } from "react";

interface ProminentFeatureAlertProps {
  title: string;
  description: string;
  badgeText?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  icon?: React.ReactNode;
  onDismiss?: () => void;
}

export function ProminentFeatureAlert({
  title,
  description,
  badgeText = "New",
  badgeVariant = "default",
  icon = <Zap className="h-6 w-6" />,
  onDismiss,
}: ProminentFeatureAlertProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (isDismissed) return null;

  return (
    <Card className="relative overflow-visible border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 mb-4 shadow-md hover:shadow-lg transition-shadow">
      {/* Floating Badge - Positioned absolutely at top-left */}
      <div className="absolute -top-3 -left-3 z-10">
        <Badge
          variant="default"
          className="text-xs px-3 py-1.5 font-semibold shadow-md bg-primary text-primary-foreground"
        >
          Feature
        </Badge>
      </div>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 hover:bg-primary/10 rounded-full transition-colors z-5"
        aria-label="Dismiss alert"
      >
        <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
      </button>

      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className="flex-shrink-0 text-primary mt-0.5">
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title Section with Light Grey Background */}
          <div className="bg-muted/50 rounded-md px-3 py-2 mb-3">
            <h3 className="text-base font-bold text-foreground">
              {title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed px-1">
            {description}
          </p>
        </div>
      </div>

      {/* Decorative accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
    </Card>
  );
}

