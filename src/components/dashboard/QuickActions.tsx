import { ShoppingBag, Trophy, Users, Skull, FileText, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionProps {
  icon: React.ElementType;
  label: string;
  description: string;
  color: "primary" | "gold" | "grim" | "success";
  badge?: string;
  onClick?: () => void;
}

const colorStyles = {
  primary: "from-primary/20 to-primary/5 border-primary/30 hover:border-primary/50",
  gold: "from-gold/20 to-gold/5 border-gold/30 hover:border-gold/50",
  grim: "from-grim/20 to-grim/5 border-grim/30 hover:border-grim/50",
  success: "from-success/20 to-success/5 border-success/30 hover:border-success/50",
};

const iconColorStyles = {
  primary: "bg-primary/20 text-primary",
  gold: "bg-gold/20 text-gold",
  grim: "bg-grim/20 text-grim",
  success: "bg-success/20 text-success",
};

const QuickAction = ({ icon: Icon, label, description, color, badge, onClick }: QuickActionProps) => (
  <button
    onClick={onClick}
    className={cn(
      "glass-card-hover p-4 text-left bg-gradient-to-br border transition-all duration-300 group",
      colorStyles[color]
    )}
  >
    <div className="flex items-start justify-between mb-3">
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", iconColorStyles[color])}>
        <Icon className="w-5 h-5" />
      </div>
      {badge && (
        <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary font-semibold">
          {badge}
        </span>
      )}
    </div>
    <h4 className="font-display font-bold mb-1 group-hover:text-primary transition-colors">{label}</h4>
    <p className="text-sm text-muted-foreground">{description}</p>
  </button>
);

interface QuickActionsProps {
  onNavigate: (item: string) => void;
}

export const QuickActions = ({ onNavigate }: QuickActionsProps) => {
  const actions: QuickActionProps[] = [
    {
      icon: ShoppingBag,
      label: "Shop",
      description: "Buy items & new costumes",
      color: "gold",
      badge: "3 New",
      onClick: () => onNavigate("shop"),
    },
    {
      icon: Trophy,
      label: "Leaderboard",
      description: "View your class rankings",
      color: "primary",
      onClick: () => onNavigate("leaderboard"),
    },
    {
      icon: Skull,
      label: "Grim Reaper",
      description: "Bet on grades, win items!",
      color: "grim",
      badge: "2 Live",
      onClick: () => onNavigate("grimreaper"),
    },
    {
      icon: Users,
      label: "Friends",
      description: "See your friends' progress",
      color: "success",
      onClick: () => onNavigate("friends"),
    },
    {
      icon: FileText,
      label: "Notes",
      description: "Upload & access your notes",
      color: "primary",
      onClick: () => onNavigate("notes"),
    },
    {
      icon: Target,
      label: "Goals",
      description: "Set your grade targets",
      color: "gold",
      onClick: () => onNavigate("goals"),
    },
  ];

  return (
    <div className="glass-card p-6">
      <h3 className="font-display text-xl font-bold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => (
          <QuickAction key={action.label} {...action} />
        ))}
      </div>
    </div>
  );
};
