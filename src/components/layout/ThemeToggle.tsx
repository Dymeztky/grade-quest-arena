import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start gap-3 hover:bg-secondary relative overflow-hidden"
      onClick={toggleTheme}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <Sun
          className={`
            w-5 h-5 absolute inset-0 transition-all duration-500 ease-in-out
            ${theme === "dark" 
              ? "rotate-0 scale-100 opacity-100" 
              : "rotate-90 scale-0 opacity-0"
            }
          `}
        />
        {/* Moon Icon */}
        <Moon
          className={`
            w-5 h-5 absolute inset-0 transition-all duration-500 ease-in-out
            ${theme === "dark" 
              ? "-rotate-90 scale-0 opacity-0" 
              : "rotate-0 scale-100 opacity-100"
            }
          `}
        />
      </div>
      <span className="transition-all duration-300">
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </span>
    </Button>
  );
};
