import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Star, Lightbulb, Bot, Sparkles, DollarSign } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProminentFeatureAlert } from "./ProminentFeatureAlert";

interface FeatureAlert {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  badge: string;
}

const featureAlerts: FeatureAlert[] = [
  {
    id: "fintech-banking",
    title: "Fintech & Banking Integration",
    description: "Access AI-powered banking, insurance, investments, and financial planning services",
    icon: <DollarSign className="h-4 w-4" />,
    color: "text-green-600",
    badge: "New",
  },
  {
    id: "ai-assist",
    title: "AI Assist Available",
    description: "Get the most out of the platform with personalized AI guidance and smart recommendations",
    icon: <Bot className="h-4 w-4" />,
    color: "text-primary",
    badge: "New",
  },
  {
    id: "1",
    title: "Multiple Profiles",
    description: "You can now create and manage multiple profiles",
    icon: <Zap className="h-4 w-4" />,
    color: "text-amber-600",
    badge: "New",
  },
];

export function CompactFeatureAlerts() {
  const [dismissedProminentAlert, setDismissedProminentAlert] = useState(false);

  // Show only the prominent alert
  const prominentAlert = featureAlerts[0];

  return (
    <div className="space-y-3">
      {/* Prominent Feature Alert */}
      {!dismissedProminentAlert && (
        <ProminentFeatureAlert
          title={prominentAlert.title}
          description={prominentAlert.description}
          badgeText="Feature"
          badgeVariant="default"
          icon={prominentAlert.icon}
          onDismiss={() => setDismissedProminentAlert(true)}
        />
      )}
    </div>
  );
}

// Sidebar Feature Alerts Component - For use in AppSidebar
interface SidebarFeatureAlertsProps {
  onOpenAIChat?: () => void;
  onOpenFintechChat?: () => void;
}

export function SidebarFeatureAlerts({ onOpenAIChat, onOpenFintechChat }: SidebarFeatureAlertsProps) {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const navigate = useNavigate();

  // Show all alerts (scrollable in parent container)
  const displayedAlerts = featureAlerts;

  const handleBadgeClick = (e: React.MouseEvent, alertId: string) => {
    e.stopPropagation(); // Prevent card click event

    if (alertId === "fintech-banking" && onOpenFintechChat) {
      onOpenFintechChat();
    } else if (alertId === "ai-assist" && onOpenAIChat) {
      onOpenAIChat();
    } else {
      navigate('/profile/current-user');
    }
  };

  const handleCardClick = (alertId: string) => {
    setSelectedAlert(alertId);

    if (alertId === "fintech-banking" && onOpenFintechChat) {
      onOpenFintechChat();
    } else if (alertId === "ai-assist" && onOpenAIChat) {
      onOpenAIChat();
    } else {
      navigate('/profile/current-user');
    }
  };

  return (
    <div className="space-y-2">
      {displayedAlerts.map((alert) => (
        <div key={alert.id} className="relative">
          {/* Absolutely positioned badge - flows outside card boundary */}
          <div
            className="absolute -top-1.5 -left-2 z-20 cursor-pointer"
            onClick={(e) => handleBadgeClick(e, alert.id)}
          >
            <Badge
              variant="default"
              className="text-[9px] px-1.5 py-0 font-bold shadow-md bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 whitespace-nowrap hover:from-amber-600 hover:to-orange-600 transition-all leading-tight"
            >
              New Feature
            </Badge>
          </div>

          <Card
            className="border p-2 hover:border-primary/50 transition-all cursor-pointer bg-card/50 relative overflow-visible"
            onClick={() => handleCardClick(alert.id)}
          >
            <div className="flex items-start gap-2">
              <div className={`mt-0.5 flex-shrink-0 ${alert.color}`}>
                {alert.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate mb-0.5">
                  {alert.title}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {alert.description}
                </p>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}

