import { useState, useEffect } from "react";
import { Sword, Star, Check, Clock, Zap, BookOpen, Trophy, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
  icon: React.ReactNode;
  category: "daily" | "weekly";
}

export const DailyQuestsPage = () => {
  const { toast } = useToast();
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: "login",
      title: "Daily Login",
      description: "Log in to the platform today",
      xpReward: 50,
      coinReward: 25,
      progress: 1,
      target: 1,
      completed: true,
      claimed: false,
      icon: <Star className="w-5 h-5" />,
      category: "daily"
    },
    {
      id: "study",
      title: "Study Session",
      description: "Complete a 30-minute study session",
      xpReward: 100,
      coinReward: 50,
      progress: 0,
      target: 1,
      completed: false,
      claimed: false,
      icon: <BookOpen className="w-5 h-5" />,
      category: "daily"
    },
    {
      id: "grades",
      title: "Grade Tracker",
      description: "View your grades dashboard",
      xpReward: 30,
      coinReward: 15,
      progress: 0,
      target: 1,
      completed: false,
      claimed: false,
      icon: <Target className="w-5 h-5" />,
      category: "daily"
    },
    {
      id: "social",
      title: "Social Butterfly",
      description: "Chat with a friend",
      xpReward: 40,
      coinReward: 20,
      progress: 0,
      target: 1,
      completed: false,
      claimed: false,
      icon: <Users className="w-5 h-5" />,
      category: "daily"
    },
    {
      id: "games",
      title: "Break Time",
      description: "Play a mini game",
      xpReward: 25,
      coinReward: 10,
      progress: 0,
      target: 1,
      completed: false,
      claimed: false,
      icon: <Zap className="w-5 h-5" />,
      category: "daily"
    },
    {
      id: "weekly_streak",
      title: "Week Warrior",
      description: "Login for 7 consecutive days",
      xpReward: 500,
      coinReward: 250,
      progress: 3,
      target: 7,
      completed: false,
      claimed: false,
      icon: <Trophy className="w-5 h-5" />,
      category: "weekly"
    }
  ]);

  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClaimReward = (questId: string) => {
    setQuests(quests.map(q => {
      if (q.id === questId && q.completed && !q.claimed) {
        toast({
          title: "Reward Claimed!",
          description: `You earned ${q.xpReward} XP and ${q.coinReward} coins!`,
        });
        return { ...q, claimed: true };
      }
      return q;
    }));
  };

  const dailyQuests = quests.filter(q => q.category === "daily");
  const weeklyQuests = quests.filter(q => q.category === "weekly");
  const completedCount = dailyQuests.filter(q => q.completed).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
              <Sword className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">Daily Quests</h1>
              <p className="text-muted-foreground">Complete quests to earn XP and coins</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Resets in</span>
            </div>
            <p className="font-display text-2xl font-bold text-primary">{timeLeft}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Daily Progress</span>
            <span className="font-medium">{completedCount}/{dailyQuests.length} completed</span>
          </div>
          <Progress value={(completedCount / dailyQuests.length) * 100} className="h-2" />
        </div>
      </div>

      {/* Daily Quests */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold flex items-center gap-2">
          <Star className="w-5 h-5 text-gold" />
          Daily Quests
        </h2>
        <div className="grid gap-3">
          {dailyQuests.map((quest) => (
            <div
              key={quest.id}
              className={`glass-card p-4 flex items-center gap-4 transition-all ${
                quest.claimed ? "opacity-50" : ""
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                quest.completed 
                  ? "bg-success/20 text-success" 
                  : "bg-primary/20 text-primary"
              }`}>
                {quest.completed ? <Check className="w-6 h-6" /> : quest.icon}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">{quest.title}</h3>
                <p className="text-sm text-muted-foreground">{quest.description}</p>
                {!quest.completed && (
                  <Progress 
                    value={(quest.progress / quest.target) * 100} 
                    className="h-1 mt-2"
                  />
                )}
              </div>

              <div className="text-right">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-primary flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {quest.xpReward} XP
                  </span>
                  <span className="text-sm font-medium text-gold">+{quest.coinReward}</span>
                </div>
                {quest.completed && !quest.claimed ? (
                  <Button size="sm" onClick={() => handleClaimReward(quest.id)}>
                    Claim
                  </Button>
                ) : quest.claimed ? (
                  <span className="text-xs text-success">Claimed ✓</span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {quest.progress}/{quest.target}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Quests */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-gold" />
          Weekly Quests
        </h2>
        <div className="grid gap-3">
          {weeklyQuests.map((quest) => (
            <div
              key={quest.id}
              className={`glass-card p-4 flex items-center gap-4 border-2 border-gold/20 ${
                quest.claimed ? "opacity-50" : ""
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                quest.completed 
                  ? "bg-success/20 text-success" 
                  : "bg-gold/20 text-gold"
              }`}>
                {quest.completed ? <Check className="w-6 h-6" /> : quest.icon}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">{quest.title}</h3>
                <p className="text-sm text-muted-foreground">{quest.description}</p>
                <Progress 
                  value={(quest.progress / quest.target) * 100} 
                  className="h-1 mt-2"
                />
              </div>

              <div className="text-right">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-primary flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {quest.xpReward} XP
                  </span>
                  <span className="text-sm font-medium text-gold">+{quest.coinReward}</span>
                </div>
                {quest.completed && !quest.claimed ? (
                  <Button size="sm" onClick={() => handleClaimReward(quest.id)}>
                    Claim
                  </Button>
                ) : quest.claimed ? (
                  <span className="text-xs text-success">Claimed ✓</span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {quest.progress}/{quest.target}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
