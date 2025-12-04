import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Users, UserPlus, Search, Check, X, MessageCircle, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Friend {
  id: string;
  status: string;
  profile: {
    user_id: string;
    display_name: string;
    username: string;
    level: number;
    avatar_base: string;
  };
}

interface FriendRequest {
  id: string;
  user_id: string;
  profile: {
    display_name: string;
    username: string;
    level: number;
  };
}

export const FriendsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"friends" | "requests" | "search">("friends");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchRequests();
    }
  }, [user]);

  const fetchFriends = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("friendships")
      .select(`
        id,
        status,
        friend_id,
        profiles!friendships_friend_id_fkey(user_id, display_name, username, level, avatar_base)
      `)
      .eq("user_id", user.id)
      .eq("status", "accepted");

    if (!error && data) {
      const formattedFriends = data.map((f: any) => ({
        id: f.id,
        status: f.status,
        profile: f.profiles,
      }));
      setFriends(formattedFriends);
    }
    setLoading(false);
  };

  const fetchRequests = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("friendships")
      .select(`
        id,
        user_id,
        profiles!friendships_user_id_fkey(display_name, username, level)
      `)
      .eq("friend_id", user.id)
      .eq("status", "pending");

    if (!error && data) {
      const formattedRequests = data.map((r: any) => ({
        id: r.id,
        user_id: r.user_id,
        profile: r.profiles,
      }));
      setRequests(formattedRequests);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, display_name, username, level")
      .or(`username.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`)
      .neq("user_id", user.id)
      .limit(10);

    if (!error && data) {
      // Filter out existing friends
      const friendIds = friends.map((f) => f.profile.user_id);
      const filtered = data.filter((p) => !friendIds.includes(p.user_id));
      setSearchResults(filtered);
    }
  };

  const sendFriendRequest = async (friendId: string) => {
    if (!user) return;

    const { error } = await supabase.from("friendships").insert({
      user_id: user.id,
      friend_id: friendId,
      status: "pending",
    });

    if (error) {
      toast({
        title: "Error",
        description: "Gagal mengirim permintaan pertemanan",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Terkirim!",
        description: "Permintaan pertemanan sudah dikirim",
      });
      setSearchResults((prev) => prev.filter((p) => p.user_id !== friendId));
    }
  };

  const acceptRequest = async (requestId: string, senderId: string) => {
    if (!user) return;

    // Update the request status
    await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("id", requestId);

    // Create reverse friendship
    await supabase.from("friendships").insert({
      user_id: user.id,
      friend_id: senderId,
      status: "accepted",
    });

    toast({
      title: "Berhasil!",
      description: "Permintaan pertemanan diterima",
    });

    fetchFriends();
    fetchRequests();
  };

  const declineRequest = async (requestId: string) => {
    await supabase.from("friendships").delete().eq("id", requestId);

    toast({
      title: "Ditolak",
      description: "Permintaan pertemanan ditolak",
    });

    fetchRequests();
  };

  const removeFriend = async (friendshipId: string, friendUserId: string) => {
    if (!user) return;

    // Remove both directions
    await supabase.from("friendships").delete().eq("id", friendshipId);
    await supabase
      .from("friendships")
      .delete()
      .eq("user_id", friendUserId)
      .eq("friend_id", user.id);

    toast({
      title: "Dihapus",
      description: "Teman sudah dihapus dari daftar",
    });

    fetchFriends();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Teman
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola pertemanan dan tantang teman ke Grim Reaper
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "friends" ? "default" : "outline"}
          onClick={() => setActiveTab("friends")}
        >
          <Users className="w-4 h-4 mr-2" />
          Teman ({friends.length})
        </Button>
        <Button
          variant={activeTab === "requests" ? "default" : "outline"}
          onClick={() => setActiveTab("requests")}
          className="relative"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Permintaan
          {requests.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-xs flex items-center justify-center">
              {requests.length}
            </span>
          )}
        </Button>
        <Button
          variant={activeTab === "search" ? "default" : "outline"}
          onClick={() => setActiveTab("search")}
        >
          <Search className="w-4 h-4 mr-2" />
          Cari
        </Button>
      </div>

      {/* Friends Tab */}
      {activeTab === "friends" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <div key={friend.id} className="glass-card p-4 animate-fade-in">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-primary/20 text-primary font-bold text-lg">
                      {friend.profile.display_name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">{friend.profile.display_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      @{friend.profile.username}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Trophy className="w-3 h-3 text-gold" />
                      <span className="text-xs text-gold">Level {friend.profile.level}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Chat
                  </Button>
                  <Button
                    size="sm"
                    variant="grim"
                    className="flex-1"
                  >
                    Challenge
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full glass-card p-12 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Belum ada teman</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setActiveTab("search")}
              >
                Cari Teman
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          {requests.length > 0 ? (
            requests.map((request) => (
              <div key={request.id} className="glass-card p-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/20 text-primary font-bold">
                        {request.profile.display_name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{request.profile.display_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        @{request.profile.username} • Level {request.profile.level}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => acceptRequest(request.id, request.user_id)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => declineRequest(request.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card p-12 text-center">
              <UserPlus className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Tidak ada permintaan pertemanan</p>
            </div>
          )}
        </div>
      )}

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Cari berdasarkan username atau nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Cari
            </Button>
          </div>

          {searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((result) => (
                <div key={result.user_id} className="glass-card p-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-muted">
                          {result.display_name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{result.display_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          @{result.username} • Level {result.level}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => sendFriendRequest(result.user_id)}
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Tambah
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery && (
            <div className="glass-card p-12 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Tidak ditemukan hasil untuk "{searchQuery}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
