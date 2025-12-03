import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ShopPage } from "@/components/shop/ShopPage";
import { LeaderboardPage } from "@/components/leaderboard/LeaderboardPage";
import { GrimReaperPage } from "@/components/grimreaper/GrimReaperPage";

const Index = () => {
  const [activeItem, setActiveItem] = useState("dashboard");

  const renderContent = () => {
    switch (activeItem) {
      case "dashboard":
        return <Dashboard onNavigate={setActiveItem} />;
      case "shop":
        return <ShopPage />;
      case "leaderboard":
        return <LeaderboardPage />;
      case "grimreaper":
        return <GrimReaperPage />;
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
          playerName="Alex Pratama"
          level={24}
          xp={2450}
          xpMax={3000}
          coins={1250}
        />
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
