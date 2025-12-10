import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Sparkles, ShoppingBag, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { BlooketAvatar } from "./BlooketAvatar";

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

const skinColors = [
  { id: "default", name: "Light", color: "#FFD5C2" },
  { id: "fair", name: "Fair", color: "#FFF0E6" },
  { id: "tan", name: "Tan", color: "#D4A574" },
  { id: "dark", name: "Dark", color: "#8B6F47" },
];

const outfitColors = [
  { id: "blue", name: "Blue", color: "#4F9DDE" },
  { id: "red", name: "Red", color: "#E85D75" },
  { id: "green", name: "Green", color: "#5DC264" },
  { id: "gold", name: "Gold", color: "#F5C842" },
  { id: "grey", name: "Grey", color: "#7C8594" },
];

const hatOptions = [
  { id: "none", name: "None" },
  { id: "cap", name: "Cap" },
  { id: "wizard", name: "Wizard Hat" },
  { id: "crown", name: "Crown" },
];

const glassesOptions = [
  { id: "none", name: "None" },
  { id: "round", name: "Round" },
  { id: "shades", name: "Shades" },
];

export const AvatarPage = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [ownedAccessories, setOwnedAccessories] = useState<OwnedAccessory[]>([]);
  const [loading, setLoading] = useState(true);

  const [skinColor, setSkinColor] = useState("default");
  const [outfit, setOutfit] = useState("blue");
  const [hat, setHat] = useState("none");
  const [glasses, setGlasses] = useState("none");

  useEffect(() => {
    fetchAccessories();
  }, [user]);

  const fetchAccessories = async () => {
    if (!user) return;

    const { data: allAccessories } = await supabase
      .from("avatar_accessories")
      .select("*");

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
    }

    setLoading(false);
  };

  const handleReset = () => {
    setSkinColor("default");
    setOutfit("blue");
    setHat("none");
    setGlasses("none");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <User className="w-8 h-8 text-primary" />
            Avatar Customisation
          </h1>
          <p className="text-muted-foreground mt-1">
            Customise your avatar with cool accessories
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30">
          <span className="text-accent">🪙</span>
          <span className="font-bold text-accent-foreground">{profile?.coins || 0}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Avatar Preview */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Preview
            </h3>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl overflow-hidden flex items-center justify-center p-8">
            <BlooketAvatar
              skinColor={skinColor}
              outfit={outfit}
              hat={hat}
              glasses={glasses}
              className="w-full max-w-[280px]"
            />
          </div>

          <p className="text-sm text-muted-foreground text-center mt-4">
            Click and drag to rotate your avatar
          </p>
        </div>

        {/* Customisation Options */}
        <div className="space-y-6">
          {/* Skin Colour */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Skin Colour</h3>
            <div className="flex gap-3">
              {skinColors.map((skin) => (
                <button
                  key={skin.id}
                  onClick={() => setSkinColor(skin.id)}
                  className={`w-12 h-12 rounded-full border-4 transition-all shadow-md hover:scale-105 ${skinColor === skin.id
                    ? "border-primary scale-110 ring-2 ring-primary/30"
                    : "border-border"
                    }`}
                  style={{ backgroundColor: skin.color }}
                  title={skin.name}
                />
              ))}
            </div>
          </div>

          {/* Outfit Colour */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Outfit Colour</h3>
            <div className="flex gap-3 flex-wrap">
              {outfitColors.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setOutfit(o.id)}
                  className={`w-12 h-12 rounded-lg border-4 transition-all shadow-md hover:scale-105 ${outfit === o.id
                    ? "border-primary scale-110 ring-2 ring-primary/30"
                    : "border-border"
                    }`}
                  style={{ backgroundColor: o.color }}
                  title={o.name}
                />
              ))}
            </div>
          </div>

          {/* Hat */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Hat</h3>
            <div className="flex gap-2 flex-wrap">
              {hatOptions.map((h) => (
                <Button
                  key={h.id}
                  variant={hat === h.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setHat(h.id)}
                >
                  {h.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Glasses */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Glasses</h3>
            <div className="flex gap-2 flex-wrap">
              {glassesOptions.map((g) => (
                <Button
                  key={g.id}
                  variant={glasses === g.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGlasses(g.id)}
                >
                  {g.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Unlock More */}
          <div className="glass-card p-6 border-l-4 border-accent">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-accent" />
              <div>
                <h3 className="font-semibold">Want more options?</h3>
                <p className="text-sm text-muted-foreground">
                  Visit the Shop to unlock more skins and accessories!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};