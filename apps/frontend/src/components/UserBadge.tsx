import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  DollarSign, 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  School,
  Building2
} from "lucide-react";

export type UserType = 
  | "innovator" 
  | "investor" 
  | "mentor" 
  | "expert" 
  | "student" 
  | "academic" 
  | "organization";

interface UserBadgeProps {
  type: UserType;
  size?: "sm" | "md";
}

const userTypeConfig: Record<UserType, { label: string; icon: any; variant: string }> = {
  innovator: { 
    label: "Innovator", 
    icon: Lightbulb, 
    variant: "bg-primary/10 text-primary border-primary/20" 
  },
  investor: { 
    label: "Investor", 
    icon: DollarSign, 
    variant: "bg-success/10 text-success border-success/20" 
  },
  mentor: { 
    label: "Mentor", 
    icon: GraduationCap, 
    variant: "bg-secondary/10 text-secondary border-secondary/20" 
  },
  expert: { 
    label: "Industry Expert", 
    icon: Briefcase, 
    variant: "bg-accent/10 text-accent border-accent/20" 
  },
  student: { 
    label: "Student", 
    icon: BookOpen, 
    variant: "bg-warning/10 text-warning border-warning/20" 
  },
  academic: { 
    label: "Academic Institution", 
    icon: School, 
    variant: "bg-muted text-muted-foreground border-border" 
  },
  organization: { 
    label: "Organization", 
    icon: Building2, 
    variant: "bg-muted text-muted-foreground border-border" 
  },
};

export default function UserBadge({ type, size = "sm" }: UserBadgeProps) {
  const config = userTypeConfig[type];
  const Icon = config.icon;
  
  return (
    <Badge 
      variant="outline" 
      className={`${config.variant} ${size === "sm" ? "text-xs" : "text-sm"} font-medium border gap-1`}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
      {config.label}
    </Badge>
  );
}
