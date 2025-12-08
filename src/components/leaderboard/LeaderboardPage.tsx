import { useState } from "react";
import { Trophy, Medal, Crown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  name: string;
  avgGrade: number;
  totalSubjects: number;
  change: "up" | "down" | "same";
  isCurrentUser?: boolean;
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Sarah Williams", avgGrade: 95, totalSubjects: 8, change: "same" },
  { rank: 2, name: "James Chen", avgGrade: 92, totalSubjects: 8, change: "up" },
  { rank: 3, name: "Maya Johnson", avgGrade: 90, totalSubjects: 8, change: "down" },
  { rank: 4, name: "Ryan Smith", avgGrade: 88, totalSubjects: 8, change: "up" },
  { rank: 5, name: "Diana Lee", avgGrade: 87, totalSubjects: 8, change: "same" },
  { rank: 6, name: "Ahmad Khan", avgGrade: 85, totalSubjects: 8, change: "up" },
  { rank: 7, name: "Lisa Wang", avgGrade: 84, totalSubjects: 8, change: "down" },
  { rank: 8, name: "Kevin Brown", avgGrade: 82, totalSubjects: 8, change: "same" },
  { rank: 9, name: "Nina Davis", avgGrade: 81, totalSubjects: 8, change: "up" },
  { rank: 10, name: "Daniel Kim", avgGrade: 80, totalSubjects: 8, change: "down" },
  { rank: 11, name: "Rina Garcia", avgGrade: 79, totalSubjects: 8, change: "same" },
  { rank: 12, name: "Alex Parker", avgGrade: 78, totalSubjects: 8, change: "up", isCurrentUser: true },
];

const grades = ["Grade 10", "Grade 11", "Grade 12"];

export const LeaderboardPage = () => {
  const [selectedGrade, setSelectedGrade] = useState("Grade 12");

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
        <p className="text-muted-foreground">Ranking by average grade per year level</p>
      </div>

      {/* Grade Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {grades.map((grade) => (
          <Button
            key={grade}
            variant={selectedGrade === grade ? "default" : "glass"}
            onClick={() => setSelectedGrade(grade)}
            className="min-w-[120px]"
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
              <span className="font-display text-2xl font-bold">J</span>
            </div>
            <div className="bg-muted-foreground/20 rounded-t-lg pt-8 pb-4 px-4 w-24">
              <Medal className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
              <p className="font-semibold text-sm truncate">{leaderboardData[1].name.split(" ")[0]}</p>
              <p className="text-xs text-muted-foreground">Avg {leaderboardData[1].avgGrade}</p>
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
              <p className="text-xs text-muted-foreground">Avg {leaderboardData[0].avgGrade}</p>
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
              <p className="text-xs text-muted-foreground">Avg {leaderboardData[2].avgGrade}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-bold">Full Rankings</h3>
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
                    <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">You</span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{entry.totalSubjects} Subjects</p>
              </div>

              {/* Average Grade */}
              <div className="text-right">
                <p className="font-display font-bold text-primary">{entry.avgGrade} Avg</p>
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
