import { Bell, Search, Coins, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  playerName: string;
  level: number;
  xp: number;
  xpMax: number;
  coins: number;
}

export const Header = ({ playerName, level, xp, xpMax, coins }: HeaderProps) => {
  const xpPercentage = (xp / xpMax) * 100;

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari..."
            className="w-64 h-10 pl-10 pr-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Player Stats */}
      <div className="flex items-center gap-6">
        {/* Coins */}
        <div className="coin-display">
          <Coins className="w-5 h-5 text-gold" />
          <span className="font-display font-bold text-gold">{coins.toLocaleString()}</span>
        </div>

        {/* Level & XP */}
        <div className="flex items-center gap-3">
          <div className="level-badge">
            <span>{level}</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{xp} / {xpMax} XP</span>
            </div>
            <div className="xp-bar w-32">
              <div className="xp-bar-fill" style={{ width: `${xpPercentage}%` }} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] font-bold flex items-center justify-center">
            3
          </span>
        </Button>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center border-2 border-primary/30">
            <span className="font-display font-bold text-sm">{playerName.charAt(0)}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
