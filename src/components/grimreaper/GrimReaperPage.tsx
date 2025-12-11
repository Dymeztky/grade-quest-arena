import { useState } from "react";
import { Skull, Swords, Clock, Users, Trophy, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Challenge {
  id: string;
  challenger: string;
  opponent: string;
  subject: string;
  stakeItem: string;
  stakeValue: number;
  deadline: string;
  status: "open" | "active" | "completed";
  participants?: number;
}

const challenges: Challenge[] = [
  {
    id: "1",
    challenger: "Alex Johnson",
    opponent: "",
    subject: "Mathematics",
    stakeItem: "Cyber Helmet",
    stakeValue: 250,
    deadline: "10 Dec 2025",
    status: "open",
    participants: 5,
  },
  {
    id: "2",
    challenger: "Sarah Williams",
    opponent: "Maya Chen",
    subject: "Physics",
    stakeItem: "XP Booster x3",
    stakeValue: 450,
    deadline: "12 Dec 2025",
    status: "active",
  },
  {
    id: "3",
    challenger: "Kevin Smith",
    opponent: "",
    subject: "Chemistry",
    stakeItem: "Lucky Charm",
    stakeValue: 350,
    deadline: "15 Dec 2025",
    status: "open",
    participants: 3,
  },
];

export const GrimReaperPage = () => {
  const [selectedTab, setSelectedTab] = useState<"open" | "active" | "history">("open");

  const filteredChallenges = challenges.filter((c) => {
    if (selectedTab === "open") return c.status === "open";
    if (selectedTab === "active") return c.status === "active";
    return c.status === "completed";
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-6 bg-gradient-to-br from-grim/20 to-card border-grim/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-grim/20 flex items-center justify-center">
            <Skull className="w-8 h-8 text-grim" />
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold text-grim">Grim Reaper</h2>
            <p className="text-muted-foreground">Bet your grades, loser forfeits their item!</p>
          </div>
        </div>
        
        <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">
            <strong>Warning:</strong> Items you stake will be lost if you lose. Choose wisely!
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={selectedTab === "open" ? "grim" : "glass"}
          onClick={() => setSelectedTab("open")}
        >
          <Swords className="w-4 h-4 mr-2" />
          Open Challenges
        </Button>
        <Button
          variant={selectedTab === "active" ? "grim" : "glass"}
          onClick={() => setSelectedTab("active")}
        >
          <Clock className="w-4 h-4 mr-2" />
          In Progress
        </Button>
        <Button
          variant={selectedTab === "history" ? "grim" : "glass"}
          onClick={() => setSelectedTab("history")}
        >
          <Trophy className="w-4 h-4 mr-2" />
          History
        </Button>
      </div>

      {/* Create Challenge Button */}
      <Button variant="grim" size="lg" className="w-full">
        <Skull className="w-5 h-5 mr-2" />
        Create New Challenge
      </Button>

      {/* Challenges List */}
      <div className="space-y-4">
        {filteredChallenges.map((challenge) => (
          <div
            key={challenge.id}
            className={cn(
              "glass-card p-5 border-2 transition-all hover:scale-[1.02]",
              challenge.status === "open" && "border-grim/30 hover:border-grim/50",
              challenge.status === "active" && "border-gold/30 hover:border-gold/50"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-grim to-destructive flex items-center justify-center">
                  <span className="font-display font-bold text-foreground">
                    {challenge.challenger.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{challenge.challenger}</p>
                  <p className="text-sm text-muted-foreground">challenges in {challenge.subject}</p>
                </div>
              </div>
              {challenge.status === "active" && challenge.opponent && (
                <div className="flex items-center gap-2">
                  <Swords className="w-5 h-5 text-gold" />
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-xp flex items-center justify-center">
                    <span className="font-display font-bold text-primary-foreground">
                      {challenge.opponent.charAt(0)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Stake Info */}
            <div className="bg-secondary/50 rounded-lg p-4 mb-4">
              <p className="text-sm text-muted-foreground mb-1">Staked Item</p>
              <div className="flex items-center justify-between">
                <p className="font-display font-bold text-lg">{challenge.stakeItem}</p>
                <span className="text-gold font-display font-bold">≈ {challenge.stakeValue} Coins</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {challenge.deadline}
                </span>
                {challenge.participants && (
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {challenge.participants} interested
                  </span>
                )}
              </div>
              {challenge.status === "open" && (
                <Button variant="grim">
                  <Swords className="w-4 h-4 mr-2" />
                  Accept Challenge
                </Button>
              )}
              {challenge.status === "active" && (
                <span className="px-3 py-1 rounded-full bg-gold/20 text-gold font-semibold text-sm">
                  In Progress
                </span>
              )}
            </div>
          </div>
        ))}

        {filteredChallenges.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Skull className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No challenges here yet</p>
          </div>
        )}
      </div>
    </div>
  );
};