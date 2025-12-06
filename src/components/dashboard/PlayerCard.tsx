import { Zap, Star, TrendingUp, Award } from "lucide-react";

interface PlayerCardProps {
  name: string;
  level: number;
  xp: number;
  xpMax: number;
  rank: number;
  streak: number;
  avatarUrl?: string;
}

export const PlayerCard = ({ name, level, xp, xpMax, rank, streak }: PlayerCardProps) => {
  const xpPercentage = (xp / xpMax) * 100;

  return (
    <div className="glass-card p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
      
      <div className="relative flex gap-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center overflow-hidden">
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary to-xp flex items-center justify-center">
              <span className="font-display text-4xl font-bold text-primary-foreground">
                {name.charAt(0)}
              </span>
            </div>
          </div>
          {/* Level badge */}
          <div className="absolute -bottom-2 -right-2 level-badge w-10 h-10 text-base">
            {level}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="font-display text-2xl font-bold mb-1">{name}</h2>
          <p className="text-muted-foreground text-sm mb-4">Grade 12 Science</p>
          
          {/* XP Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Experience</span>
              <span className="text-primary font-semibold">{xp} / {xpMax} XP</span>
            </div>
            <div className="xp-bar h-4">
              <div 
                className="xp-bar-fill flex items-center justify-end pr-2"
                style={{ width: `${xpPercentage}%` }}
              >
                <Zap className="w-3 h-3 text-primary-foreground" />
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-gold" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rank</p>
                <p className="font-display font-bold text-gold">#{rank}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center">
                <Star className="w-4 h-4 text-destructive" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Streak</p>
                <p className="font-display font-bold text-destructive">{streak} Days</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Progress</p>
                <p className="font-display font-bold text-success">+12%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Trophy = ({ className }: { className?: string }) => (
  <Award className={className} />
);
