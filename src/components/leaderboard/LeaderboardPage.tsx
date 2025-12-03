import { useState } from "react";
import { Trophy, Medal, Crown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  name: string;
  level: number;
  xp: number;
  change: "up" | "down" | "same";
  isCurrentUser?: boolean;
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Sarah Wijaya", level: 32, xp: 8500, change: "same" },
  { rank: 2, name: "Budi Santoso", level: 30, xp: 7800, change: "up" },
  { rank: 3, name: "Maya Putri", level: 29, xp: 7200, change: "down" },
  { rank: 4, name: "Rizki Rahman", level: 28, xp: 6900, change: "up" },
  { rank: 5, name: "Diana Chen", level: 27, xp: 6500, change: "same" },
  { rank: 6, name: "Ahmad Fauzi", level: 26, xp: 6200, change: "up" },
  { rank: 7, name: "Lisa Anggraini", level: 26, xp: 6000, change: "down" },
  { rank: 8, name: "Kevin Pratama", level: 25, xp: 5800, change: "same" },
  { rank: 9, name: "Nina Sari", level: 25, xp: 5600, change: "up" },
  { rank: 10, name: "Dimas Nugroho", level: 24, xp: 5400, change: "down" },
  { rank: 11, name: "Rina Maharani", level: 24, xp: 5200, change: "same" },
  { rank: 12, name: "Alex Pratama", level: 24, xp: 2450, change: "up", isCurrentUser: true },
];

const grades = ["XII IPA", "XII IPS", "XI IPA", "XI IPS", "X IPA", "X IPS"];

export const LeaderboardPage = () => {
  const [selectedGrade, setSelectedGrade] = useState("XII IPA");

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-gold" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-muted-foreground" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-700" />;
    return <span className="font-display font-bold text-lg text-muted-foreground">#{rank}</span>;
  };

  const getChangeIcon = (change: string) => {
    if (change === "up") return <TrendingUp className="w-4 h-4 text-success" />;
    if (change === "down") return <TrendingDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-8 h-8 text-gold" />
          <h2 className="font-display text-3xl font-bold">Leaderboard</h2>
        </div>
        <p className="text-muted-foreground">Ranking berdasarkan level dan XP per angkatan</p>
      </div>

      {/* Grade Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {grades.map((grade) => (
          <Button
            key={grade}
            variant={selectedGrade === grade ? "default" : "glass"}
            onClick={() => setSelectedGrade(grade)}
          >
            {grade}
          </Button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="glass-card p-6">
        <div className="flex items-end justify-center gap-4 mb-6">
          {/* 2nd Place */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-muted to-muted-foreground/20 mx-auto mb-2 flex items-center justify-center border-4 border-muted-foreground/30">
              <span className="font-display text-2xl font-bold">B</span>
            </div>
            <div className="bg-muted-foreground/20 rounded-t-lg pt-8 pb-4 px-4 w-24">
              <Medal className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
              <p className="font-semibold text-sm truncate">{leaderboardData[1].name.split(" ")[0]}</p>
              <p className="text-xs text-muted-foreground">Lvl {leaderboardData[1].level}</p>
            </div>
          </div>

          {/* 1st Place */}
          <div className="text-center -mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold to-amber-600 mx-auto mb-2 flex items-center justify-center border-4 border-gold/50 animate-pulse-glow">
              <span className="font-display text-3xl font-bold text-primary-foreground">S</span>
            </div>
            <div className="bg-gold/20 rounded-t-lg pt-10 pb-4 px-4 w-28 border-t-4 border-gold">
              <Crown className="w-8 h-8 text-gold mx-auto mb-1" />
              <p className="font-semibold truncate">{leaderboardData[0].name.split(" ")[0]}</p>
              <p className="text-xs text-muted-foreground">Lvl {leaderboardData[0].level}</p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 mx-auto mb-2 flex items-center justify-center border-4 border-amber-700/30">
              <span className="font-display text-2xl font-bold text-primary-foreground">M</span>
            </div>
            <div className="bg-amber-700/20 rounded-t-lg pt-6 pb-4 px-4 w-24">
              <Medal className="w-6 h-6 text-amber-700 mx-auto mb-1" />
              <p className="font-semibold text-sm truncate">{leaderboardData[2].name.split(" ")[0]}</p>
              <p className="text-xs text-muted-foreground">Lvl {leaderboardData[2].level}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-bold">Ranking Lengkap</h3>
        </div>
        <div className="divide-y divide-border">
          {leaderboardData.map((entry) => (
            <div
              key={entry.rank}
              className={cn(
                "flex items-center gap-4 p-4 transition-colors hover:bg-secondary/50",
                entry.isCurrentUser && "bg-primary/10 border-l-4 border-primary"
              )}
            >
              {/* Rank */}
              <div className="w-12 flex justify-center">
                {getRankIcon(entry.rank)}
              </div>

              {/* Avatar */}
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center font-display font-bold",
                entry.rank <= 3 
                  ? "bg-gradient-to-br from-gold to-amber-600 text-primary-foreground" 
                  : "bg-secondary text-foreground"
              )}>
                {entry.name.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="font-semibold flex items-center gap-2">
                  {entry.name}
                  {entry.isCurrentUser && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">Kamu</span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Level {entry.level}</p>
              </div>

              {/* XP */}
              <div className="text-right">
                <p className="font-display font-bold text-primary">{entry.xp.toLocaleString()} XP</p>
                <div className="flex items-center gap-1 justify-end">
                  {getChangeIcon(entry.change)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
