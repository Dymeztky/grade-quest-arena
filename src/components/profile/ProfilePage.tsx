import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trophy, Flame, Coins, Target, BarChart3, Users, ArrowLeft } from "lucide-react";

interface ProfileData {
  user_id: string;
  display_name: string | null;
  username: string | null;
  level: number;
  xp: number;
  xp_max: number;
  coins: number;
  streak: number;
  rank: number;
  avatar_base: string | null;
}

interface ProfilePageProps {
  userId?: string;
  onBack?: () => void;
}

export const ProfilePage = ({ userId, onBack }: ProfilePageProps) => {
  const { user, profile: ownProfile } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [friendsCount, setFriendsCount] = useState(0);
  const [averageGrade, setAverageGrade] = useState<number | null>(null);

  const isOwnProfile = !userId || userId === user?.id;

  useEffect(() => {
    if (isOwnProfile && ownProfile) {
      setProfile(ownProfile as ProfileData);
      setLoading(false);
      fetchStats(user?.id || "");
    } else if (userId) {
      fetchProfile(userId);
      fetchStats(userId);
    }
  }, [userId, user, ownProfile, isOwnProfile]);

  const fetchProfile = async (id: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", id)
      .single();

    if (!error && data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const fetchStats = async (id: string) => {
    // Fetch friends count
    const { count } = await supabase
      .from("friendships")
      .select("*", { count: "exact", head: true })
      .eq("user_id", id)
      .eq("status", "accepted");

    setFriendsCount(count || 0);

    // Fetch average grade
    const { data: grades } = await supabase
      .from("grades")
      .select("value")
      .eq("user_id", id);

    if (grades && grades.length > 0) {
      const avg = grades.reduce((sum, g) => sum + g.value, 0) / grades.length;
      setAverageGrade(Math.round(avg * 10) / 10);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  const xpPercentage = (profile.xp / profile.xp_max) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      )}

      {/* Profile Header */}
      <div className="glass-card p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-primary/30">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/50 text-4xl font-display font-bold text-primary-foreground">
                {profile.display_name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 level-badge text-sm">
              {profile.level}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h1 className="font-display text-3xl font-bold">{profile.display_name || "Player"}</h1>
              <div className="level-badge text-sm hidden md:flex">
                Level {profile.level}
              </div>
            </div>
            {profile.username && (
              <p className="text-muted-foreground mt-1">@{profile.username}</p>
            )}
            
            {/* XP Bar */}
            <div className="mt-4 max-w-md">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Experience</span>
                <span className="font-medium">{profile.xp} / {profile.xp_max} XP</span>
              </div>
              <div className="xp-bar">
                <div className="xp-bar-fill" style={{ width: `${xpPercentage}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Rank</span>
          </div>
          <p className="font-display text-2xl font-bold">#{profile.rank || "-"}</p>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-muted-foreground">Streak</span>
          </div>
          <p className="font-display text-2xl font-bold">{profile.streak} days</p>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coins className="w-5 h-5 text-gold" />
            <span className="text-sm text-muted-foreground">Coins</span>
          </div>
          <p className="font-display text-2xl font-bold text-gold">{profile.coins?.toLocaleString()}</p>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-muted-foreground">Friends</span>
          </div>
          <p className="font-display text-2xl font-bold">{friendsCount}</p>
        </div>
      </div>

      {/* Academic Stats */}
      <div className="glass-card p-6">
        <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Academic Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-secondary/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Average Grade</p>
            <p className="font-display text-3xl font-bold text-primary">
              {averageGrade !== null ? averageGrade : "-"}
            </p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Current Level</p>
            <p className="font-display text-3xl font-bold">{profile.level}</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Total XP Earned</p>
            <p className="font-display text-3xl font-bold text-primary">{profile.xp}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {!isOwnProfile && (
        <div className="flex gap-4">
          <Button className="flex-1">
            <Users className="w-4 h-4 mr-2" />
            Add Friend
          </Button>
          <Button variant="grim" className="flex-1">
            <Target className="w-4 h-4 mr-2" />
            Challenge
          </Button>
        </div>
      )}
    </div>
  );
};
