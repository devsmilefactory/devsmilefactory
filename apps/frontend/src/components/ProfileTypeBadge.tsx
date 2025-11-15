import { Badge } from "@/components/ui/badge";
import { Lightbulb, GraduationCap, TrendingUp, Users, Building2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProfileType = "Innovator" | "Mentor" | "Investor" | "Student" | "Organization" | "Professional";

interface ProfileTypeBadgeProps {
  type: ProfileType;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

const profileTypeConfig: Record<ProfileType, { 
  icon: any; 
  color: string; 
  bgColor: string;
  textColor: string;
}> = {
  Innovator: {
    icon: Lightbulb,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  Mentor: {
    icon: GraduationCap,
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-50 dark:bg-purple-950",
    textColor: "text-purple-700 dark:text-purple-300",
  },
  Investor: {
    icon: TrendingUp,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950",
    textColor: "text-emerald-700 dark:text-emerald-300",
  },
  Student: {
    icon: Users,
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-50 dark:bg-cyan-950",
    textColor: "text-cyan-700 dark:text-cyan-300",
  },
  Organization: {
    icon: Building2,
    color: "from-orange-500 to-red-600",
    bgColor: "bg-orange-50 dark:bg-orange-950",
    textColor: "text-orange-700 dark:text-orange-300",
  },
  Professional: {
    icon: Sparkles,
    color: "from-amber-500 to-yellow-600",
    bgColor: "bg-amber-50 dark:bg-amber-950",
    textColor: "text-amber-700 dark:text-amber-300",
  },
};

export default function ProfileTypeBadge({ type, showIcon = true, size = "md" }: ProfileTypeBadgeProps) {
  const config = profileTypeConfig[type];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };
  
  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  return (
    <Badge 
      className={cn(
        "font-medium border-0",
        config.bgColor,
        config.textColor,
        sizeClasses[size]
      )}
    >
      {showIcon && <Icon className={cn(iconSizes[size], "mr-1")} />}
      {type}
    </Badge>
  );
}

export { profileTypeConfig };

