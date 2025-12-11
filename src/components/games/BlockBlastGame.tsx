import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, RotateCcw, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlockBlastGameProps {
  onBack: () => void;
}

const GRID_SIZE = 8;
const COLORS = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"];

type Cell = { color: string; id: number } | null;

export const BlockBlastGame = ({ onBack }: BlockBlastGameProps) => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("blockBlastHighScore") || "0");
  });

  const createGrid = useCallback(() => {
    let id = 0;
    return Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() => ({
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        id: id++
      }))
    );
  }, []);

  const startGame = () => {
    setGrid(createGrid());
    setScore(0);
    setIsPlaying(true);
  };

  const findConnected = (row: number, col: number, color: string, visited: Set<string>): string[] => {
    const key = `${row},${col}`;
    if (
      row < 0 || row >= GRID_SIZE ||
      col < 0 || col >= GRID_SIZE ||
      visited.has(key) ||
      !grid[row][col] ||
      grid[row][col]!.color !== color
    ) {
      return [];
    }

    visited.add(key);
    const connected = [key];
    
    connected.push(...findConnected(row - 1, col, color, visited));
    connected.push(...findConnected(row + 1, col, color, visited));
    connected.push(...findConnected(row, col - 1, color, visited));
    connected.push(...findConnected(row, col + 1, color, visited));

    return connected;
  };

  const handleCellClick = (row: number, col: number) => {
    if (!isPlaying || !grid[row][col]) return;

    const color = grid[row][col]!.color;
    const connected = findConnected(row, col, color, new Set());

    if (connected.length < 2) return;

    const newGrid = grid.map(r => [...r]);
    connected.forEach(key => {
      const [r, c] = key.split(",").map(Number);
      newGrid[r][c] = null;
    });

    // Drop blocks down
    for (let c = 0; c < GRID_SIZE; c++) {
      let writePos = GRID_SIZE - 1;
      for (let r = GRID_SIZE - 1; r >= 0; r--) {
        if (newGrid[r][c]) {
          if (r !== writePos) {
            newGrid[writePos][c] = newGrid[r][c];
            newGrid[r][c] = null;
          }
          writePos--;
        }
      }
    }

    const points = connected.length * connected.length * 10;
    const newScore = score + points;
    setScore(newScore);
    setGrid(newGrid);

    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem("blockBlastHighScore", newScore.toString());
    }
  };

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
          <div className="relative bg-secondary/50 rounded-lg border border-border p-2">
            {isPlaying ? (
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      disabled={!cell}
                      className={`w-10 h-10 rounded-md transition-all duration-200 ${
                        cell ? `${cell.color} hover:scale-110 hover:brightness-110` : "bg-transparent"
                      }`}
                    />
                  ))
                )}
              </div>
            ) : (
              <div className="w-[344px] h-[344px] flex flex-col items-center justify-center">
                <p className="font-display text-2xl font-bold mb-4">🧱 Block Blast</p>
                <Button onClick={startGame} className="gap-2">
                  <Play className="w-4 h-4" />
                  Start Game
                </Button>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {isPlaying && (
              <Button variant="outline" onClick={startGame} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Restart
              </Button>
            )}
          </div>

          <p className="text-sm text-muted-foreground">Click on groups of 2+ same-colored blocks to clear them</p>
        </div>
      </div>
    </div>
  );
};
