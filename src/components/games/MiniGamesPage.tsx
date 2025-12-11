import { useState } from "react";
import { Gamepad2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SnakeGame } from "./SnakeGame";
import { BlockBlastGame } from "./BlockBlastGame";
import { MemoryGame } from "./MemoryGame";

interface Game {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const games: Game[] = [
  {
    id: "snake",
    name: "Snake",
    description: "Classic snake game. Eat food to grow!",
    icon: "🐍",
    color: "from-green-500 to-emerald-600"
  },
  {
    id: "blockblast",
    name: "Block Blast",
    description: "Match and clear blocks to score points!",
    icon: "🧱",
    color: "from-purple-500 to-violet-600"
  },
  {
    id: "memory",
    name: "Memory Match",
    description: "Find matching pairs to test your memory!",
    icon: "🧠",
    color: "from-blue-500 to-cyan-600"
  }
];

export const MiniGamesPage = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const renderGame = () => {
    switch (selectedGame) {
      case "snake":
        return <SnakeGame onBack={() => setSelectedGame(null)} />;
      case "blockblast":
        return <BlockBlastGame onBack={() => setSelectedGame(null)} />;
      case "memory":
        return <MemoryGame onBack={() => setSelectedGame(null)} />;
      default:
        return null;
    }
  };

  if (selectedGame) {
    return renderGame();
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Mini Games</h1>
            <p className="text-muted-foreground">Take a break and have fun!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              className="glass-card p-6 text-left hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                {game.icon}
              </div>
              <h3 className="font-display text-lg font-bold mb-1">{game.name}</h3>
              <p className="text-sm text-muted-foreground">{game.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
