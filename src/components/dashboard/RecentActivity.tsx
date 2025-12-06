import { TrendingUp, TrendingDown, Award, ShoppingBag, Target, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "grade_up" | "grade_down" | "achievement" | "purchase" | "goal" | "friend";
  title: string;
  description: string;
  time: string;
  value?: string;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    type: "grade_up",
    title: "Grade Increased!",
    description: "Mathematics: 78 → 85",
    time: "2 hours ago",
    value: "+50 XP",
  },
  {
    id: "2",
    type: "achievement",
    title: "Achievement Unlocked",
    description: "Perfect Score in Chemistry",
    time: "5 hours ago",
    value: "+100 Coins",
  },
  {
    id: "3",
    type: "purchase",
    title: "Item Purchased",
    description: "Cyber Helmet - Avatar",
    time: "1 day ago",
    value: "-250 Coins",
  },
  {
    id: "4",
    type: "goal",
    title: "Target Achieved",
    description: "Physics reached target of 80",
    time: "2 days ago",
    value: "+75 XP",
  },
  {
    id: "5",
    type: "friend",
    title: "New Friend",
    description: "Sarah joined as a friend",
    time: "3 days ago",
  },
];

const iconMap = {
  grade_up: TrendingUp,
  grade_down: TrendingDown,
  achievement: Award,
  purchase: ShoppingBag,
  goal: Target,
  friend: Users,
};

const colorMap = {
  grade_up: "bg-success/20 text-success",
  grade_down: "bg-destructive/20 text-destructive",
  achievement: "bg-gold/20 text-gold",
  purchase: "bg-primary/20 text-primary",
  goal: "bg-success/20 text-success",
  friend: "bg-primary/20 text-primary",
};

const valueColorMap = {
  grade_up: "text-success",
  grade_down: "text-destructive",
  achievement: "text-gold",
  purchase: "text-destructive",
  goal: "text-success",
  friend: "text-muted-foreground",
};

export const RecentActivity = () => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl font-bold">Recent Activity</h3>
        <button className="text-sm text-primary hover:underline">View All</button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = iconMap[activity.type];
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", colorMap[activity.type])}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">{activity.title}</h4>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
              </div>
              {activity.value && (
                <span className={cn("text-sm font-display font-bold", valueColorMap[activity.type])}>
                  {activity.value}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
