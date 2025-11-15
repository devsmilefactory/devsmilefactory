import { NavLink, Link } from "react-router-dom";
import {
  Home,
  Search,
  Bell,
  MessageSquare,
  Bookmark,
  Users,
  Network,
  Calendar,
  ShoppingBag,
  Plus,
} from "lucide-react";
import logoColored from "@/assets/smile-factory-logo.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SidebarFeatureAlerts } from "./FeatureAlertsSidebar";

const mainNavItems = [
  { title: "Home", url: "/feed", icon: Home },
  { title: "Search", url: "/search", icon: Search },
  { title: "Notifications", url: "/notifications", icon: Bell, badge: 3 },
  { title: "Messages", url: "/messages", icon: MessageSquare, badge: 1 },
  { title: "Bookmarks", url: "/bookmarks", icon: Bookmark },
];

const collaborateItems = [
  { title: "Groups", url: "/groups", icon: Users },
  { title: "Connections", url: "/connections", icon: Network },
  { title: "Events", url: "/events", icon: Calendar },
  { title: "Marketplace", url: "/marketplace", icon: ShoppingBag },
];

interface AppSidebarProps {
  onCreatePost?: () => void;
  onOpenAIChat?: () => void;
  onOpenFintechChat?: () => void;
}

export function AppSidebar({ onCreatePost, onOpenAIChat, onOpenFintechChat }: AppSidebarProps) {
  const { open } = useSidebar();

  return (
    <Sidebar className="border-r">
      <SidebarContent className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="px-4 py-3">
          <Link to="/" className="flex items-center gap-2 mb-3 cursor-pointer hover:opacity-80 transition-opacity">
            <img
              src={logoColored}
              alt="Smile Factory"
              className="h-12 w-auto"
            />
          </Link>

          {/* User Profile Section */}
          {open && (
            <Link
              to="/profile/current-user"
              className="flex items-center gap-3 mb-3 hover:bg-muted/50 p-2 rounded-lg transition-colors"
            >
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  EH
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">EFF HGG</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success"></span>
                  Premium Member
                </p>
              </div>
            </Link>
          )}

          {/* Create Post Button */}
          <Button
            onClick={onCreatePost}
            className="w-full bg-primary hover:bg-primary/90 shadow-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            {open ? "Create Post" : ""}
          </Button>
        </div>

        {/* Horizontal Navigation Icons */}
        <div className="px-4 py-2">
          <div className="flex items-center justify-between gap-2">
            {/* Home */}
            <NavLink
              to="/feed"
              className={({ isActive }) =>
                cn(
                  "flex-1 flex items-center justify-center p-2 rounded-lg transition-all relative",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50"
                )
              }
              title="Home"
            >
              <Home className="h-5 w-5" />
            </NavLink>

            {/* Search */}
            <NavLink
              to="/search"
              className={({ isActive }) =>
                cn(
                  "flex-1 flex items-center justify-center p-2 rounded-lg transition-all",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50"
                )
              }
              title="Search"
            >
              <Search className="h-5 w-5" />
            </NavLink>

            {/* Bookmarks */}
            <NavLink
              to="/bookmarks"
              className={({ isActive }) =>
                cn(
                  "flex-1 flex items-center justify-center p-2 rounded-lg transition-all",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50"
                )
              }
              title="Bookmarks"
            >
              <Bookmark className="h-5 w-5" />
            </NavLink>

            {/* Messages with Badge */}
            <NavLink
              to="/messages"
              className={({ isActive }) =>
                cn(
                  "flex-1 flex items-center justify-center p-2 rounded-lg transition-all relative",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50"
                )
              }
              title="Messages"
            >
              <MessageSquare className="h-5 w-5" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                1
              </Badge>
            </NavLink>
          </div>
        </div>

        {/* Notifications & Feature Alerts Section */}
        <SidebarGroup className="py-2">
          <SidebarGroupLabel className="text-xs font-semibold px-4 mb-2">
            Notifications & Feature Alerts
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            {open && (
              <div className="border rounded-lg bg-card/50 overflow-hidden">
                {/* Notifications Item - Fixed */}
                <NavLink
                  to="/notifications"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 px-3 py-2 transition-all text-sm border-b",
                      isActive
                        ? "bg-muted text-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted/50"
                    )
                  }
                >
                  <Bell className="h-4 w-4" />
                  <span className="flex-1">Notifications</span>
                  <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    3
                  </Badge>
                </NavLink>

                {/* Feature Alerts - Scrollable */}
                <div className="max-h-[100px] overflow-y-auto p-2 space-y-2">
                  <SidebarFeatureAlerts onOpenAIChat={onOpenAIChat} onOpenFintechChat={onOpenFintechChat} />
                </div>
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>



        {/* Footer */}
        {open && (
          <div className="mt-auto px-4 py-2 border-t">
            <p className="text-xs text-muted-foreground">
              © 2025 InnoConnect
            </p>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
