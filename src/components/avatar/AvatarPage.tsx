import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Sparkles, ShoppingBag, Check, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Accessory {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  rarity: string;
  image_url: string;
}

interface OwnedAccessory extends Accessory {
  equipped: boolean;
}

const rarityColors: Record<string, string> = {
  common: "border-gray-500 bg-gray-500/10",
  rare: "border-blue-500 bg-blue-500/10",
  epic: "border-purple-500 bg-purple-500/10",
  legendary: "border-gold bg-gold/10",
};

const categoryIcons: Record<string, string> = {
  hat: "🎩",
  glasses: "👓",
  outfit: "👕",
  background: "🖼️",
};

export const AvatarPage = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [ownedAccessories, setOwnedAccessories] = useState<OwnedAccessory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [equippedItems, setEquippedItems] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccessories();
  }, [user]);

  const fetchAccessories = async () => {
    if (!user) return;

    // Fetch all accessories
    const { data: allAccessories } = await supabase
      .from("avatar_accessories")
      .select("*");

    // Fetch owned accessories
    const { data: owned } = await supabase
      .from("user_accessories")
      .select("*, accessory:avatar_accessories(*)")
      .eq("user_id", user.id);

    if (allAccessories) setAccessories(allAccessories);

    if (owned) {
      const ownedWithEquipped = owned.map((o) => ({
        ...o.accessory,
        equipped: o.equipped,
      }));
      setOwnedAccessories(ownedWithEquipped);

      // Set equipped items
      const equipped: Record<string, string> = {};
      ownedWithEquipped.forEach((item) => {
        if (item.equipped) {
          equipped[item.category] = item.id;
        }
      });
      setEquippedItems(equipped);
    }

    setLoading(false);
  };

  const isOwned = (accessoryId: string) => {
    return ownedAccessories.some((a) => a.id === accessoryId);
  };

  const isEquipped = (accessoryId: string) => {
    return Object.values(equippedItems).includes(accessoryId);
  };

  const handlePurchase = async (accessory: Accessory) => {
    if (!user || !profile) return;

    if (profile.coins < accessory.price) {
      toast({
        title: "Koin Tidak Cukup",
        description: `Kamu butuh ${accessory.price - profile.coins} koin lagi`,
        variant: "destructive",
      });
      return;
    }

    // Deduct coins
    const { error: coinError } = await supabase
      .from("profiles")
      .update({ coins: profile.coins - accessory.price })
      .eq("user_id", user.id);

    if (coinError) {
      toast({
        title: "Error",
        description: "Gagal melakukan pembelian",
        variant: "destructive",
      });
      return;
    }

    // Add to owned accessories
    const { error: accessoryError } = await supabase
      .from("user_accessories")
      .insert({
        user_id: user.id,
        accessory_id: accessory.id,
        equipped: false,
      });

    if (accessoryError) {
      toast({
        title: "Error",
        description: "Gagal menambahkan item",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Berhasil!",
      description: `${accessory.name} sudah menjadi milikmu!`,
    });

    refreshProfile();
    fetchAccessories();
  };

  const handleEquip = async (accessory: Accessory) => {
    if (!user) return;

    // Unequip current item in this category
    if (equippedItems[accessory.category]) {
      await supabase
        .from("user_accessories")
        .update({ equipped: false })
        .eq("user_id", user.id)
        .eq("accessory_id", equippedItems[accessory.category]);
    }

    // Equip new item
    await supabase
      .from("user_accessories")
      .update({ equipped: true })
      .eq("user_id", user.id)
      .eq("accessory_id", accessory.id);

    setEquippedItems((prev) => ({
      ...prev,
      [accessory.category]: accessory.id,
    }));

    toast({
      title: "Equipped!",
      description: `${accessory.name} sudah dipakai`,
    });

    fetchAccessories();
  };

  const handleUnequip = async (accessory: Accessory) => {
    if (!user) return;

    await supabase
      .from("user_accessories")
      .update({ equipped: false })
      .eq("user_id", user.id)
      .eq("accessory_id", accessory.id);

    setEquippedItems((prev) => {
      const newEquipped = { ...prev };
      delete newEquipped[accessory.category];
      return newEquipped;
    });

    toast({
      title: "Unequipped",
      description: `${accessory.name} sudah dilepas`,
    });

    fetchAccessories();
  };

  const categories = ["all", "hat", "glasses", "outfit", "background"];
  const filteredAccessories =
    selectedCategory === "all"
      ? accessories
      : accessories.filter((a) => a.category === selectedCategory);

  const equippedAccessories = accessories.filter((a) =>
    Object.values(equippedItems).includes(a.id)
  );

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
            <User className="w-8 h-8 text-primary" />
            Avatar Customization
          </h1>
          <p className="text-muted-foreground mt-1">
            Kustomisasi avatar kamu dengan aksesoris keren
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 border border-gold/30">
          <span className="text-gold">🪙</span>
          <span className="font-bold text-gold">{profile?.coins || 0}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Preview */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-6">
            <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              Preview Avatar
            </h3>

            {/* Avatar Display */}
            <div className="relative aspect-square bg-gradient-to-br from-primary/20 to-gold/20 rounded-2xl overflow-hidden mb-4">
              {/* Background Effect */}
              {equippedAccessories.find((a) => a.category === "background") && (
                <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-30">
                  {equippedAccessories.find((a) => a.category === "background")?.image_url}
                </div>
              )}

              {/* Base Avatar */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Avatar Face */}
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center text-6xl">
                    😊
                  </div>

                  {/* Hat */}
                  {equippedAccessories.find((a) => a.category === "hat") && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-5xl">
                      {equippedAccessories.find((a) => a.category === "hat")?.image_url}
                    </div>
                  )}

                  {/* Glasses */}
                  {equippedAccessories.find((a) => a.category === "glasses") && (
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 text-3xl">
                      {equippedAccessories.find((a) => a.category === "glasses")?.image_url}
                    </div>
                  )}
                </div>
              </div>

              {/* Outfit */}
              {equippedAccessories.find((a) => a.category === "outfit") && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-4xl">
                  {equippedAccessories.find((a) => a.category === "outfit")?.image_url}
                </div>
              )}
            </div>

            {/* Equipped List */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Equipped Items:</p>
              {equippedAccessories.length > 0 ? (
                equippedAccessories.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.image_url}</span>
                      <span className="text-sm">{item.name}</span>
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUnequip(item)}
                    >
                      Lepas
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Belum ada item yang dipakai
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Accessories Shop */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="capitalize"
              >
                {cat === "all" ? "Semua" : categoryIcons[cat]} {cat !== "all" && cat}
              </Button>
            ))}
          </div>

          {/* Accessories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredAccessories.map((accessory) => {
              const owned = isOwned(accessory.id);
              const equipped = isEquipped(accessory.id);

              return (
                <div
                  key={accessory.id}
                  className={`glass-card p-4 border-2 transition-all hover:scale-[1.02] ${
                    rarityColors[accessory.rarity]
                  } ${equipped ? "ring-2 ring-primary" : ""}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{accessory.image_url}</span>
                      <div>
                        <h4 className="font-semibold">{accessory.name}</h4>
                        <p className="text-xs text-muted-foreground capitalize">
                          {accessory.category}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                        accessory.rarity === "legendary"
                          ? "bg-gold/20 text-gold"
                          : accessory.rarity === "epic"
                          ? "bg-purple-500/20 text-purple-400"
                          : accessory.rarity === "rare"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {accessory.rarity}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {accessory.description}
                  </p>

                  <div className="flex items-center justify-between">
                    {owned ? (
                      <span className="flex items-center gap-1 text-green-400 text-sm">
                        <Check className="w-4 h-4" /> Owned
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gold font-semibold">
                        🪙 {accessory.price}
                      </span>
                    )}

                    {owned ? (
                      equipped ? (
                        <Button size="sm" variant="outline" onClick={() => handleUnequip(accessory)}>
                          Unequip
                        </Button>
                      ) : (
                        <Button size="sm" variant="gold" onClick={() => handleEquip(accessory)}>
                          Equip
                        </Button>
                      )
                    ) : (
                      <Button
                        size="sm"
                        variant="gold"
                        onClick={() => handlePurchase(accessory)}
                        disabled={!profile || profile.coins < accessory.price}
                      >
                        {!profile || profile.coins < accessory.price ? (
                          <Lock className="w-4 h-4 mr-1" />
                        ) : (
                          <ShoppingBag className="w-4 h-4 mr-1" />
                        )}
                        Beli
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
