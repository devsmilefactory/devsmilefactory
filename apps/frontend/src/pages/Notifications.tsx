import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Bot, Zap, Bell, Sparkles, ArrowLeft, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

interface Notification {
  id: string;
  type: "feature" | "update" | "announcement";
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  timestamp: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function Notifications() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [notifications] = useState<Notification[]>([
    {
      id: "fintech-banking",
      type: "feature",
      title: "🎉 New Feature: Fintech & Banking Integration",
      description: "We're excited to introduce AI-powered banking and financial services! Access bank accounts, insurance, market insights, investments, and financial planning - all through our intelligent AI assistant.",
      icon: <DollarSign className="h-5 w-5 text-green-600" />,
      badge: "New Feature",
      badgeColor: "bg-gradient-to-r from-green-500 to-emerald-500",
      timestamp: "Just now",
      actionLabel: "Explore Banking Services",
    },
    {
      id: "ai-assist",
      type: "feature",
      title: "AI Assist Available",
      description: "Get personalized AI guidance and smart recommendations to make the most of the platform. Your AI assistant is ready to help you navigate, connect, and discover opportunities.",
      icon: <Bot className="h-5 w-5 text-primary" />,
      badge: "New",
      badgeColor: "bg-gradient-to-r from-blue-500 to-indigo-500",
      timestamp: "2 days ago",
      actionLabel: "Try AI Assist",
    },
    {
      id: "multiple-profiles",
      type: "update",
      title: "Multiple Profiles Now Available",
      description: "You can now create and manage multiple profiles to showcase different aspects of your professional identity. Switch between profiles seamlessly.",
      icon: <Zap className="h-5 w-5 text-amber-600" />,
      badge: "Update",
      badgeColor: "bg-gradient-to-r from-amber-500 to-orange-500",
      timestamp: "1 week ago",
      actionLabel: "Manage Profiles",
    },
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Distraction-Free Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
        <div className="flex h-16 items-center justify-between px-6 max-w-4xl mx-auto w-full">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto pb-20 md:pb-6 px-6 py-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Notifications</h2>
          <p className="text-muted-foreground">
            Stay updated with the latest features, activities, and announcements.
          </p>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex gap-4 p-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      {notification.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-base leading-tight">
                        {notification.title}
                      </h3>
                      {notification.badge && (
                        <Badge
                          className={`${notification.badgeColor} text-white border-0 text-xs px-2 py-0.5 flex-shrink-0`}
                        >
                          {notification.badge}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {notification.description}
                    </p>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs text-muted-foreground">
                        {notification.timestamp}
                      </span>
                      {notification.actionLabel && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-8"
                          onClick={notification.onAction}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          {notification.actionLabel}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State (hidden when there are notifications) */}
        {notifications.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No new notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}
