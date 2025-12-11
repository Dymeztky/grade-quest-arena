import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SnakeGameProps {
  onBack: () => void;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

type Position = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export const SnakeGame = ({ onBack }: SnakeGameProps) => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("snakeHighScore") || "0");
  });

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  const checkCollision = useCallback((head: Position, snakeBody: Position[]) => {
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    for (let i = 1; i < snakeBody.length; i++) {
      if (head.x === snakeBody[i].x && head.y === snakeBody[i].y) {
        return true;
      }
    }
    return false;
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction, isPlaying]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        
        switch (direction) {
          case "UP": head.y -= 1; break;
          case "DOWN": head.y += 1; break;
          case "LEFT": head.x -= 1; break;
          case "RIGHT": head.x += 1; break;
        }

        if (checkCollision(head, prevSnake)) {
          setGameOver(true);
          setIsPlaying(false);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("snakeHighScore", score.toString());
          }
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];
        
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, INITIAL_SPEED);

    return () => clearInterval(gameLoop);
  }, [isPlaying, direction, food, gameOver, checkCollision, generateFood, score, highScore]);

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
              <p className="text-xs text-muted-foreground">Score</p>
              <p className="font-display text-xl font-bold text-primary">{score}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">High Score</p>
              <p className="font-display text-xl font-bold text-gold">{highScore}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div 
            className="relative bg-secondary/50 rounded-lg border border-border overflow-hidden"
            style={{ 
              width: GRID_SIZE * CELL_SIZE, 
              height: GRID_SIZE * CELL_SIZE 
            }}
          >
            {/* Food */}
            <div
              className="absolute bg-destructive rounded-full"
              style={{
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                left: food.x * CELL_SIZE + 1,
                top: food.y * CELL_SIZE + 1,
              }}
            />
            
            {/* Snake */}
            {snake.map((segment, index) => (
              <div
                key={index}
                className={`absolute rounded-sm ${index === 0 ? "bg-primary" : "bg-primary/70"}`}
                style={{
                  width: CELL_SIZE - 2,
                  height: CELL_SIZE - 2,
                  left: segment.x * CELL_SIZE + 1,
                  top: segment.y * CELL_SIZE + 1,
                }}
              />
            ))}

            {/* Game Over Overlay */}
            {gameOver && (
              <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
                <p className="font-display text-2xl font-bold text-destructive mb-2">Game Over!</p>
                <p className="text-muted-foreground mb-4">Score: {score}</p>
                <Button onClick={resetGame} className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Play Again
                </Button>
              </div>
            )}

            {/* Start Overlay */}
            {!isPlaying && !gameOver && (
              <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center">
                <p className="font-display text-2xl font-bold mb-4">🐍 Snake</p>
                <Button onClick={resetGame} className="gap-2">
                  <Play className="w-4 h-4" />
                  Start Game
                </Button>
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground">Use arrow keys to control the snake</p>
        </div>
      </div>
    </div>
  );
};
