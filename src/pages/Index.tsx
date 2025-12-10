import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ShopPage } from "@/components/shop/ShopPage";
import { LeaderboardPage } from "@/components/leaderboard/LeaderboardPage";
import { GrimReaperPage } from "@/components/grimreaper/GrimReaperPage";
import { GradesPage } from "@/components/grades/GradesPage";
import { GoalSettingPage } from "@/components/goals/GoalSettingPage";
import { AvatarPage } from "@/components/avatar/AvatarPage";
import { FriendsPage } from "@/components/friends/FriendsPage";
import { BarterPage } from "@/components/barter/BarterPage";
import { SettingsPage } from "@/components/settings/SettingsPage";
import { GuidePage } from "@/components/guide/GuidePage";
import { NotesPage } from "@/components/notes/NotesPage";
import { ProfilePage } from "@/components/profile/ProfilePage";
import { SchedulePage } from "@/components/schedule/SchedulePage";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);
  const { profile, user } = useAuth();

  const handleNavigate = (item: string) => {
    setViewingProfileId(null);
    setActiveItem(item);
  };

  const handleProfileClick = () => {
    setViewingProfileId(user?.id || null);
    setActiveItem("profile");
  };

  const handleViewProfile = (userId: string) => {
    setViewingProfileId(userId);
    setActiveItem("profile");
  };

  const renderContent = () => {
    if (activeItem === "profile" && viewingProfileId) {
      return (
        <ProfilePage 
          userId={viewingProfileId} 
          onBack={() => handleNavigate("dashboard")} 
        />
      );
    }

    switch (activeItem) {
      case "dashboard": return <Dashboard onNavigate={handleNavigate} />;
      case "grades": return <GradesPage />;
      case "goals": return <GoalSettingPage />;
      case "shop": return <ShopPage />;
      case "leaderboard": return <LeaderboardPage onViewProfile={handleViewProfile} />;
      case "grimreaper": return <GrimReaperPage />;
      case "avatar": return <AvatarPage />;
      case "friends": return <FriendsPage onViewProfile={handleViewProfile} />;
      case "barter": return <BarterPage />;
      case "settings": return <SettingsPage />;
      case "guide": return <GuidePage />;
      case "notes": return <NotesPage />;
      case "schedule": return <SchedulePage />;
      default: return (
        <div className="glass-card p-12 text-center animate-fade-in">
          <h2 className="font-display text-2xl font-bold mb-2">{activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}</h2>
          <p className="text-muted-foreground">This page is under development...</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen">
      <Sidebar activeItem={activeItem} onNavigate={handleNavigate} />
      <div className="ml-64">
        <Header 
          playerName={profile?.display_name || "Player"} 
          level={profile?.level || 1} 
          xp={profile?.xp || 0} 
          xpMax={profile?.xp_max || 100} 
          coins={profile?.coins || 0}
          onProfileClick={handleProfileClick}
        />
        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Index;
