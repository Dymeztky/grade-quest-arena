import { BookOpen, Target, Trophy, Skull, ShoppingBag, Users, Repeat, Sparkles, TrendingUp, Star } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const GuidePage = () => {
  const guideItems = [
    {
      id: "getting-started",
      icon: BookOpen,
      title: "Getting Started",
      content: `Welcome to Academix! This platform gamifies your academic journey by turning grades into XP (experience points) and levels.

**How it works:**
• Your grades directly affect your XP and level
• Meeting or exceeding targets earns you XP and coins
• Falling below targets may decrease your XP
• Level up to unlock rewards and climb the leaderboard!`
    },
    {
      id: "xp-system",
      icon: TrendingUp,
      title: "XP & Level System",
      content: `Your progress is tracked through XP and levels:

**Earning XP:**
• Each grade that meets the target: +50 XP
• Each grade that exceeds the target: +100 XP
• Maintaining a study streak: +10 XP per day

**Levelling Up:**
• Reach your XP cap to level up
• Each level requires more XP than the last
• Levelling up rewards you with coins!

**Warning:** Grades below target may cause XP loss.`
    },
    {
      id: "coins-shop",
      icon: ShoppingBag,
      title: "Coins & Shop",
      content: `Coins are the in-game currency:

**Earning Coins:**
• Level up: +100-500 coins depending on level
• Complete challenges: varies by difficulty
• Win Grim Reaper bets: claim opponent's stake

**Spending Coins:**
• Purchase avatar accessories in the Shop
• Buy backgrounds and themes
• Unlock special items`
    },
    {
      id: "goal-setting",
      icon: Target,
      title: "Goal Setting",
      content: `Set academic targets and track your progress:

**Features:**
• Set target grades for each subject
• View predictions based on your current performance
• See minimum scores needed on upcoming tests
• Track which subjects need more attention

**Tips:**
• Set realistic but challenging targets
• Focus on subjects marked as "Needs Effort"
• Review your progress regularly`
    },
    {
      id: "grim-reaper",
      icon: Skull,
      title: "Grim Reaper",
      content: `The competitive betting system:

**How it works:**
1. Challenge a friend on a specific subject
2. Both players stake coins or accessories
3. Set a deadline (usually before a test)
4. The player with the higher grade wins everything!

**Rules:**
• Both players must accept the challenge
• Stakes are locked until the deadline
• Ties result in stakes being returned
• You can only have one active challenge per subject`
    },
    {
      id: "leaderboard",
      icon: Trophy,
      title: "Leaderboard",
      content: `Compete with your classmates:

**Ranking System:**
• Rankings are based on average grades
• Separated by year level (Grade 10, 11, 12)
• Updated after each grade entry

**Rewards:**
• Top 3 get special badges displayed on profile
• Earn bonus XP for ranking improvements
• Seasonal rewards for top performers`
    },
    {
      id: "friends-barter",
      icon: Users,
      title: "Friends & Barter",
      content: `Social features:

**Friends:**
• Add friends to see their progress
• Challenge friends in Grim Reaper
• Compare stats and achievements

**Barter System:**
• Trade accessories with friends
• Create trade offers for items you want
• Accept or decline incoming offers`
    },
    {
      id: "avatar",
      icon: Star,
      title: "Avatar Customisation",
      content: `Personalise your character:

**Customisation Options:**
• Rotate and view your 3D avatar
• Equip hats, glasses, outfits, and backgrounds
• Purchase new items from the Shop

**Rarity Tiers:**
• Common (Grey) - Basic items
• Rare (Blue) - Special items
• Epic (Purple) - Premium items
• Legendary (Gold) - Exclusive items`
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-primary" />
          <h2 className="font-display text-3xl font-bold">Guide</h2>
        </div>
        <p className="text-muted-foreground">Learn how to use Academix and level up your grades!</p>
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="font-semibold">Earn XP</h3>
          <p className="text-xs text-muted-foreground">Get good grades</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Sparkles className="w-8 h-8 text-gold mx-auto mb-2" />
          <h3 className="font-semibold">Level Up</h3>
          <p className="text-xs text-muted-foreground">Reach XP cap</p>
        </div>
        <div className="glass-card p-4 text-center">
          <ShoppingBag className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <h3 className="font-semibold">Spend Coins</h3>
          <p className="text-xs text-muted-foreground">Buy cool items</p>
        </div>
        <div className="glass-card p-4 text-center">
          <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <h3 className="font-semibold">Compete</h3>
          <p className="text-xs text-muted-foreground">Climb rankings</p>
        </div>
      </div>

      {/* Detailed Guide */}
      <div className="glass-card p-6">
        <h3 className="font-display text-xl font-bold mb-4">Detailed Guide</h3>
        <Accordion type="single" collapsible className="w-full">
          {guideItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{item.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-8 whitespace-pre-line text-muted-foreground">
                  {item.content}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Tips */}
      <div className="glass-card p-6 border-l-4 border-primary">
        <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Pro Tips
        </h3>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Check your goals daily to stay on track</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Use Grim Reaper challenges to motivate yourself</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Save coins for legendary items - they're worth it!</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Maintain your streak for bonus XP every day</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
