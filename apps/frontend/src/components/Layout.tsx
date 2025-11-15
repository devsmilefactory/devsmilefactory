import { ReactNode, useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { RightSidebar } from "./RightSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CreatePostForm } from "./CreatePostForm";
import { FloatingActionButton } from "./FloatingActionButton";
import FilterModal from "./FilterModal";
import AIChatbot from "./AIChatbot";
import MultipleProfilesNotification from "./MultipleProfilesNotification";
import { ProfileWizard } from "./ProfileWizard";
import { useAuthStore } from "@/stores/authStore";
import { Search, Bell, Settings, ChevronDown, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/hooks/useTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiChatMode, setAIChatMode] = useState<"general" | "fintech">("general");
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { firstLogin, isAuthenticated } = useAuthStore();

  const tabs = [
    { value: "/feed", label: "Feed" },
    { value: "/marketplace", label: "Marketplace" },
    { value: "/blog", label: "Blog" },
    { value: "/events", label: "Events" },
    { value: "/profiles", label: "Profiles" },
  ];

  return (
    <SidebarProvider>
      {/* Profile Wizard - Blocks access until profile type is selected */}
      {isAuthenticated && firstLogin && <ProfileWizard open={true} />}

      {/* Multiple Profiles Notification */}
      <MultipleProfilesNotification />

      <div className="min-h-screen flex w-full bg-background">
        {/* Left Sidebar */}
        <AppSidebar
          onCreatePost={() => setShowCreatePost(true)}
          onOpenAIChat={() => {
            setAIChatMode("general");
            setShowAIChat(true);
          }}
          onOpenFintechChat={() => {
            setAIChatMode("fintech");
            setShowAIChat(true);
          }}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
            <div className="flex h-16 items-center justify-between px-4 gap-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />

                {/* Navigation Tabs - Desktop Only */}
                <Tabs value={location.pathname} className="h-full hidden lg:block">
                  <TabsList className="h-10 bg-transparent">
                    {tabs.map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        onClick={() => navigate(tab.value)}
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setShowFilterModal(true)}>
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigate('/notifications')}>
                  <Bell className="h-5 w-5" />
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
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          EH
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate('/profile/current-user')}>
                      My Profiles
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/')}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Mobile Tab Navigation - Sticky Below Header */}
          <div className="lg:hidden sticky top-16 z-30 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
            <div className="relative">
              {/* Fade indicators */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-card/95 to-transparent pointer-events-none z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card/95 to-transparent pointer-events-none z-10" />

              <Tabs value={location.pathname} className="w-full">
                <TabsList className="w-full h-12 bg-transparent rounded-none flex justify-start overflow-x-auto scrollbar-hide">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      onClick={() => navigate(tab.value)}
                      className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none text-sm whitespace-nowrap flex-shrink-0 px-4"
                    >
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Main Content with Right Sidebar */}
          <div className="flex flex-1 overflow-hidden">
            <main className="flex-1 overflow-y-auto px-4 py-6">
              {children}
            </main>

            {/* Right Sidebar - Hidden on mobile */}
            <aside className="hidden xl:block border-l overflow-y-auto">
              <RightSidebar />
            </aside>
          </div>
        </div>

        {/* FAB */}
        <FloatingActionButton onClick={() => setShowCreatePost(true)} />

        {/* Create Post Dialog */}
        <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
          <DialogContent className="max-w-2xl">
            <CreatePostForm onClose={() => setShowCreatePost(false)} />
          </DialogContent>
        </Dialog>

        {/* Filter Modal */}
        <FilterModal
          open={showFilterModal}
          onOpenChange={setShowFilterModal}
        />

        {/* AI Chatbot */}
        <AIChatbot initialOpen={showAIChat} mode={aiChatMode} />
      </div>
    </SidebarProvider>
  );
}
