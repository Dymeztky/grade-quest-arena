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
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const { profile } = useAuth();

  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return <Dashboard onNavigate={setActiveItem} />;
      case "grades":
        return <GradesPage />;
      case "goals":
        return <GoalSettingPage />;
      case "shop":
        return <ShopPage />;
      case "leaderboard":
        return <LeaderboardPage />;
      case "grimreaper":
        return <GrimReaperPage />;
      case "avatar":
        return <AvatarPage />;
      case "friends":
        return <FriendsPage />;
      case "barter":
        return <BarterPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return (
          <div className="glass-card p-12 text-center animate-fade-in">
            <h2 className="font-display text-2xl font-bold mb-2">
              {activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}
            </h2>
            <p className="text-muted-foreground">Halaman ini sedang dalam pengembangan...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <Sidebar activeItem={activeItem} onNavigate={setActiveItem} />
      <div className="ml-64">
        <Header
          playerName={profile?.display_name || "Player"}
          level={profile?.level || 1}
          xp={profile?.xp || 0}
          xpMax={profile?.xp_max || 100}
          coins={profile?.coins || 0}
        />
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
