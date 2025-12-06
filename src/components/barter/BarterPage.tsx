import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Repeat, Plus, Check, X, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Accessory {
  id: string;
  name: string;
  image_url: string;
  rarity: string;
}

interface BarterOffer {
  id: string;
  status: string;
  created_at: string;
  offered_accessory: Accessory;
  wanted_accessory: Accessory | null;
  offerer: {
    display_name: string;
    username: string;
  };
  receiver_id: string | null;
}

const rarityColors: Record<string, string> = {
  common: "text-gray-400",
  rare: "text-blue-400",
  epic: "text-purple-400",
  legendary: "text-gold",
};

export const BarterPage = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [offers, setOffers] = useState<BarterOffer[]>([]);
  const [myOffers, setMyOffers] = useState<BarterOffer[]>([]);
  const [myAccessories, setMyAccessories] = useState<Accessory[]>([]);
  const [allAccessories, setAllAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedOffered, setSelectedOffered] = useState<string | null>(null);
  const [selectedWanted, setSelectedWanted] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchOffers();
      fetchMyAccessories();
      fetchAllAccessories();
    }
  }, [user]);

  const fetchOffers = async () => {
    if (!user) return;

    // Fetch open offers from others
    const { data: openOffers } = await supabase
      .from("barter_offers")
      .select(`
        id,
        status,
        created_at,
        receiver_id,
        offered_accessory:avatar_accessories!barter_offers_offered_accessory_id_fkey(id, name, image_url, rarity),
        wanted_accessory:avatar_accessories!barter_offers_wanted_accessory_id_fkey(id, name, image_url, rarity),
        offerer:profiles!barter_offers_offerer_id_fkey(display_name, username)
      `)
      .eq("status", "open")
      .neq("offerer_id", user.id);

    // Fetch my offers
    const { data: userOffers } = await supabase
      .from("barter_offers")
      .select(`
        id,
        status,
        created_at,
        receiver_id,
        offered_accessory:avatar_accessories!barter_offers_offered_accessory_id_fkey(id, name, image_url, rarity),
        wanted_accessory:avatar_accessories!barter_offers_wanted_accessory_id_fkey(id, name, image_url, rarity),
        offerer:profiles!barter_offers_offerer_id_fkey(display_name, username)
      `)
      .eq("offerer_id", user.id);

    if (openOffers) setOffers(openOffers as unknown as BarterOffer[]);
    if (userOffers) setMyOffers(userOffers as unknown as BarterOffer[]);
    setLoading(false);
  };

  const fetchMyAccessories = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("user_accessories")
      .select("accessory:avatar_accessories(id, name, image_url, rarity)")
      .eq("user_id", user.id);

    if (data) {
      setMyAccessories(data.map((d: any) => d.accessory));
    }
  };

  const fetchAllAccessories = async () => {
    const { data } = await supabase
      .from("avatar_accessories")
      .select("id, name, image_url, rarity");

    if (data) setAllAccessories(data);
  };

  const createOffer = async () => {
    if (!user || !selectedOffered) return;

    const { error } = await supabase.from("barter_offers").insert({
      offerer_id: user.id,
      offered_accessory_id: selectedOffered,
      wanted_accessory_id: selectedWanted,
      status: "open",
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create offer",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: "Barter offer has been created",
      });
      setCreateDialogOpen(false);
      setSelectedOffered(null);
      setSelectedWanted(null);
      fetchOffers();
    }
  };

  const acceptOffer = async (offer: BarterOffer) => {
    if (!user) return;

    // Check if user has the wanted item (if specified)
    if (offer.wanted_accessory) {
      const hasItem = myAccessories.some((a) => a.id === offer.wanted_accessory?.id);
      if (!hasItem) {
        toast({
          title: "Missing Item",
          description: `You don't have ${offer.wanted_accessory.name}`,
          variant: "destructive",
        });
        return;
      }
    }

    // Update offer status
    await supabase
      .from("barter_offers")
      .update({ status: "accepted", receiver_id: user.id })
      .eq("id", offer.id);

    toast({
      title: "Barter Successful!",
      description: "Items have been exchanged",
    });

    fetchOffers();
    fetchMyAccessories();
    refreshProfile();
  };

  const cancelOffer = async (offerId: string) => {
    await supabase.from("barter_offers").update({ status: "cancelled" }).eq("id", offerId);

    toast({
      title: "Cancelled",
      description: "Barter offer has been cancelled",
    });

    fetchOffers();
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
            <Repeat className="w-8 h-8 text-primary" />
            Barter
          </h1>
          <p className="text-muted-foreground mt-1">
            Trade items with other players
          </p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gold">
              <Plus className="w-4 h-4 mr-2" />
              Create Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Barter Offer</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-6 mt-4">
              {/* My Item to Offer */}
              <div>
                <h4 className="font-semibold mb-3">Item to Offer</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {myAccessories.map((accessory) => (
                    <button
                      key={accessory.id}
                      onClick={() => setSelectedOffered(accessory.id)}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        selectedOffered === accessory.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{accessory.image_url}</span>
                        <div>
                          <p className="font-medium">{accessory.name}</p>
                          <p className={`text-xs capitalize ${rarityColors[accessory.rarity]}`}>
                            {accessory.rarity}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                  {myAccessories.length === 0 && (
                    <p className="text-muted-foreground text-sm">No items owned</p>
                  )}
                </div>
              </div>

              {/* Wanted Item */}
              <div>
                <h4 className="font-semibold mb-3">Wanted Item (optional)</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => setSelectedWanted(null)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      selectedWanted === null
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-medium">Accept Anything</p>
                    <p className="text-xs text-muted-foreground">Let the offerer choose</p>
                  </button>
                  {allAccessories
                    .filter((a) => !myAccessories.some((m) => m.id === a.id))
                    .map((accessory) => (
                      <button
                        key={accessory.id}
                        onClick={() => setSelectedWanted(accessory.id)}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          selectedWanted === accessory.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{accessory.image_url}</span>
                          <div>
                            <p className="font-medium">{accessory.name}</p>
                            <p className={`text-xs capitalize ${rarityColors[accessory.rarity]}`}>
                              {accessory.rarity}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>

            <Button
              onClick={createOffer}
              disabled={!selectedOffered}
              className="w-full mt-4"
              variant="gold"
            >
              Create Offer
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* My Offers */}
      {myOffers.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-display text-xl font-bold">My Offers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myOffers.map((offer) => (
              <div
                key={offer.id}
                className={`glass-card p-4 ${
                  offer.status === "accepted" ? "border-green-500/50" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      offer.status === "open"
                        ? "bg-blue-500/20 text-blue-400"
                        : offer.status === "accepted"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {offer.status === "open"
                      ? "Pending"
                      : offer.status === "accepted"
                      ? "Accepted"
                      : "Cancelled"}
                  </span>
                  {offer.status === "open" && (
                    <Button size="sm" variant="ghost" onClick={() => cancelOffer(offer.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 p-3 rounded-lg bg-muted/30 text-center">
                    <span className="text-3xl">{offer.offered_accessory.image_url}</span>
                    <p className="text-sm mt-1">{offer.offered_accessory.name}</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-muted-foreground" />
                  <div className="flex-1 p-3 rounded-lg bg-muted/30 text-center">
                    {offer.wanted_accessory ? (
                      <>
                        <span className="text-3xl">{offer.wanted_accessory.image_url}</span>
                        <p className="text-sm mt-1">{offer.wanted_accessory.name}</p>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl">❓</span>
                        <p className="text-sm mt-1">Anything</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Offers */}
      <div className="space-y-4">
        <h3 className="font-display text-xl font-bold">Available Offers</h3>
        {offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map((offer) => (
              <div key={offer.id} className="glass-card p-4 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold">{offer.offerer.display_name}</p>
                    <p className="text-xs text-muted-foreground">@{offer.offerer.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 p-3 rounded-lg bg-muted/30 text-center">
                    <span className="text-3xl">{offer.offered_accessory.image_url}</span>
                    <p className="text-sm mt-1">{offer.offered_accessory.name}</p>
                    <p className={`text-xs capitalize ${rarityColors[offer.offered_accessory.rarity]}`}>
                      {offer.offered_accessory.rarity}
                    </p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-muted-foreground" />
                  <div className="flex-1 p-3 rounded-lg bg-muted/30 text-center">
                    {offer.wanted_accessory ? (
                      <>
                        <span className="text-3xl">{offer.wanted_accessory.image_url}</span>
                        <p className="text-sm mt-1">{offer.wanted_accessory.name}</p>
                        <p className={`text-xs capitalize ${rarityColors[offer.wanted_accessory.rarity]}`}>
                          {offer.wanted_accessory.rarity}
                        </p>
                      </>
                    ) : (
                      <>
                        <span className="text-3xl">❓</span>
                        <p className="text-sm mt-1">Anything</p>
                      </>
                    )}
                  </div>
                </div>

                <Button
                  className="w-full"
                  variant="gold"
                  onClick={() => acceptOffer(offer)}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Accept Barter
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <Repeat className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No barter offers available</p>
          </div>
        )}
      </div>
    </div>
  );
};
