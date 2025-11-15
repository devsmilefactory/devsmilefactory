import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ViewOnlyModeBadge from "./components/ViewOnlyModeBadge";
import Landing from "./pages/Landing";
import Feed from "./pages/Feed";
import Marketplace from "./pages/Marketplace";
import Blog from "./pages/Blog";
import Profiles from "./pages/Profiles";
import ProfileView from "./pages/ProfileView";
import SingleProfileView from "./pages/SingleProfileView";
import PostView from "./pages/PostView";
import Article from "./pages/Article";
import Groups from "./pages/Groups";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import Bookmarks from "./pages/Bookmarks";
import Connections from "./pages/Connections";
import Events from "./pages/Events";
import Settings from "./pages/Settings";
import UnifiedProfiles from "./pages/UnifiedProfiles";
import ProfileEdit from "./pages/ProfileEdit";
import PostEdit from "./pages/PostEdit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ViewOnlyModeBadge />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/feed" element={<Layout><Feed /></Layout>} />
          <Route path="/search" element={<Layout><Search /></Layout>} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/bookmarks" element={<Layout><Bookmarks /></Layout>} />
          <Route path="/marketplace" element={<Layout><Marketplace /></Layout>} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/profiles" element={<Layout><Profiles /></Layout>} />
          <Route path="/profile/current-user" element={<UnifiedProfiles />} />
          <Route path="/profile/p1" element={<SingleProfileView />} />
          <Route path="/profile/profile-2" element={<SingleProfileView />} />
          <Route path="/profile/profile-3" element={<SingleProfileView />} />
          <Route path="/profile/:id" element={<Layout><ProfileView /></Layout>} />
          <Route path="/post/:id" element={<PostView />} />
          <Route path="/article/:slug" element={<Article />} />
          <Route path="/groups" element={<Layout><Groups /></Layout>} />
          <Route path="/connections" element={<Layout><Connections /></Layout>} />
          <Route path="/events" element={<Layout><Events /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="/profile/:id/edit" element={<ProfileEdit />} />
          <Route path="/post/:id/edit" element={<PostEdit />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
