import { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, Play, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MemoryGameProps {
  onBack: () => void;
}

const EMOJIS = ["🎮", "🎯", "🏆", "⭐", "🔥", "💎", "🎨", "🎵"];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGame = ({ onBack }: MemoryGameProps) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem("memoryBestMoves") || "999");
  });

  const shuffleCards = () => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    return shuffled;
  };

  const startGame = () => {
    setCards(shuffleCards());
    setFlippedCards([]);
    setMoves(0);
    setIsWon(false);
    setIsPlaying(true);
  };

  const handleCardClick = (id: number) => {
    if (!isPlaying) return;
    if (flippedCards.length === 2) return;
    if (cards[id].isFlipped || cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);
    setFlippedCards([...flippedCards, id]);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = flippedCards;
      
      if (cards[first].emoji === cards[second].emoji) {
        const newCards = [...cards];
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setCards(newCards);
        setFlippedCards([]);

        // Check win
        if (newCards.every(c => c.isMatched)) {
          setIsWon(true);
          setIsPlaying(false);
          if (moves + 1 < bestScore) {
            setBestScore(moves + 1);
            localStorage.setItem("memoryBestMoves", (moves + 1).toString());
          }
        }
      } else {
        setTimeout(() => {
          const newCards = [...cards];
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards, moves, bestScore]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Moves</p>
              <p className="font-display text-xl font-bold text-primary">{moves}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Best</p>
              <p className="font-display text-xl font-bold text-gold">{bestScore === 999 ? "-" : bestScore}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          {isPlaying || isWon ? (
            <>
              <div className="grid grid-cols-4 gap-3 p-4 bg-secondary/50 rounded-lg border border-border">
                {cards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    disabled={card.isFlipped || card.isMatched}
                    className={`w-16 h-16 rounded-lg text-2xl font-bold transition-all duration-300 transform ${
                      card.isFlipped || card.isMatched
                        ? "bg-primary/20 rotate-0"
                        : "bg-primary hover:scale-105 rotate-0"
                    } ${card.isMatched ? "opacity-50" : ""}`}
                  >
                    {card.isFlipped || card.isMatched ? card.emoji : "?"}
                  </button>
                ))}
              </div>

              {isWon && (
                <div className="text-center animate-fade-in">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy className="w-6 h-6 text-gold" />
                    <p className="font-display text-2xl font-bold text-gold">You Won!</p>
                  </div>
                  <p className="text-muted-foreground mb-4">Completed in {moves} moves</p>
                  <Button onClick={startGame} className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Play Again
                  </Button>
                </div>
              )}

              {isPlaying && (
                <Button variant="outline" onClick={startGame} className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Restart
                </Button>
              )}
            </>
          ) : (
            <div className="w-[280px] h-[280px] bg-secondary/50 rounded-lg border border-border flex flex-col items-center justify-center">
              <p className="font-display text-2xl font-bold mb-4">🧠 Memory Match</p>
              <Button onClick={startGame} className="gap-2">
                <Play className="w-4 h-4" />
                Start Game
              </Button>
            </div>
          )}

          <p className="text-sm text-muted-foreground">Find all matching pairs!</p>
        </div>
      </div>
    </div>
  );
};
