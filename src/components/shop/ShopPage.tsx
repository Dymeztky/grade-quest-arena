import { useState } from "react";
import { Coins, Star, Sparkles, Palette, User, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "avatar" | "theme" | "item" | "special";
  rarity: "common" | "rare" | "epic" | "legendary";
  image?: string;
  owned?: boolean;
}

const shopItems: ShopItem[] = [
  { id: "1", name: "Cyber Helmet", description: "Futuristic helmet untuk avatar", price: 250, category: "avatar", rarity: "rare" },
  { id: "2", name: "Golden Crown", description: "Crown untuk yang terbaik", price: 500, category: "avatar", rarity: "epic" },
  { id: "3", name: "Neon Theme", description: "Theme cyberpunk neon", price: 300, category: "theme", rarity: "rare" },
  { id: "4", name: "Dark Forest", description: "Theme gelap misterius", price: 200, category: "theme", rarity: "common" },
  { id: "5", name: "XP Booster", description: "+50% XP selama 24 jam", price: 150, category: "item", rarity: "common" },
  { id: "6", name: "Lucky Charm", description: "Bonus koin dari achievement", price: 350, category: "item", rarity: "rare" },
  { id: "7", name: "Dragon Wings", description: "Wings legendary untuk avatar", price: 1000, category: "avatar", rarity: "legendary" },
  { id: "8", name: "Galaxy Theme", description: "Theme luar angkasa", price: 750, category: "theme", rarity: "epic" },
];

const categories = [
  { id: "all", label: "Semua", icon: Sparkles },
  { id: "avatar", label: "Avatar", icon: User },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "item", label: "Item", icon: Star },
  { id: "special", label: "Special", icon: Crown },
];

const rarityStyles = {
  common: "border-muted-foreground/30 bg-muted/20",
  rare: "border-primary/50 bg-primary/10",
  epic: "border-level/50 bg-level/10",
  legendary: "border-gold/50 bg-gold/10 animate-pulse-glow",
};

const rarityBadgeStyles = {
  common: "bg-muted text-muted-foreground",
  rare: "bg-primary/20 text-primary",
  epic: "bg-level/20 text-level",
  legendary: "bg-gold/20 text-gold",
};

export const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [coins] = useState(1250);

  const filteredItems = selectedCategory === "all" 
    ? shopItems 
    : shopItems.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold mb-1">Shop</h2>
          <p className="text-muted-foreground">Beli item, avatar, dan theme keren!</p>
        </div>
        <div className="coin-display text-lg">
          <Coins className="w-6 h-6 text-gold" />
          <span className="font-display font-bold text-gold">{coins.toLocaleString()}</span>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "glass"}
            onClick={() => setSelectedCategory(cat.id)}
            className="flex items-center gap-2"
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "glass-card p-4 border-2 transition-all duration-300 hover:scale-105",
              rarityStyles[item.rarity]
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Image placeholder */}
            <div className="aspect-square rounded-lg bg-secondary/50 mb-4 flex items-center justify-center overflow-hidden">
              <div className={cn(
                "w-20 h-20 rounded-xl flex items-center justify-center",
                item.category === "avatar" ? "bg-gradient-to-br from-primary to-xp" :
                item.category === "theme" ? "bg-gradient-to-br from-level to-primary" :
                "bg-gradient-to-br from-gold to-accent"
              )}>
                {item.category === "avatar" && <User className="w-10 h-10 text-primary-foreground" />}
                {item.category === "theme" && <Palette className="w-10 h-10 text-primary-foreground" />}
                {item.category === "item" && <Sparkles className="w-10 h-10 text-primary-foreground" />}
                {item.category === "special" && <Crown className="w-10 h-10 text-primary-foreground" />}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-bold">{item.name}</h4>
                <span className={cn("px-2 py-0.5 text-xs rounded-full capitalize", rarityBadgeStyles[item.rarity])}>
                  {item.rarity}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              
              {/* Price & Buy */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-gold" />
                  <span className="font-display font-bold text-gold">{item.price}</span>
                </div>
                <Button 
                  variant={item.owned ? "ghost" : "gold"} 
                  size="sm"
                  disabled={item.owned || coins < item.price}
                >
                  {item.owned ? "Dimiliki" : "Beli"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
