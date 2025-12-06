import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Settings, User, Bell, Shield, LogOut, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const SettingsPage = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        username: username,
      })
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message.includes("duplicate")
          ? "Username already taken"
          : "Failed to save changes",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Saved!",
        description: "Profile updated successfully",
      });
      refreshProfile();
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged Out",
      description: "See you again!",
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Section */}
      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <User className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-bold">Profile</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email || ""} disabled className="bg-muted/30" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
              placeholder="unique_username"
            />
          </div>

          <Button onClick={handleSaveProfile} disabled={loading} variant="gold">
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-bold">Account Stats</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-muted/30 text-center">
            <p className="text-2xl font-bold text-primary">{profile?.level || 1}</p>
            <p className="text-sm text-muted-foreground">Level</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 text-center">
            <p className="text-2xl font-bold text-gold">{profile?.coins || 0}</p>
            <p className="text-sm text-muted-foreground">Coins</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 text-center">
            <p className="text-2xl font-bold text-primary">{profile?.xp || 0}</p>
            <p className="text-sm text-muted-foreground">XP</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 text-center">
            <p className="text-2xl font-bold text-orange-400">{profile?.streak || 0}</p>
            <p className="text-sm text-muted-foreground">Streak</p>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-bold">Preferences</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications for challenges and friend requests
              </p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Sound Effects</Label>
              <p className="text-sm text-muted-foreground">
                Play sounds for level up and achievements
              </p>
            </div>
            <Switch checked={soundEffects} onCheckedChange={setSoundEffects} />
          </div>
        </div>
      </div>

      {/* Logout Section */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-red-400">Sign Out</h3>
            <p className="text-sm text-muted-foreground">
              You will need to log in again to access your account
            </p>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
