import { LayoutDashboard, BarChart3, ShoppingBag, Target, CalendarDays, Users, FileText, Repeat, Skull, User, Trophy, Settings, LogOut, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "./ThemeToggle";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  badge?: string;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, active, badge, onClick }: NavItemProps) => (
  <button onClick={onClick} className={cn("nav-item w-full", active && "active")}>
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
    {badge && <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">{badge}</span>}
  </button>
);

interface SidebarProps {
  activeItem: string;
  onNavigate: (item: string) => void;
}

export const Sidebar = ({ activeItem, onNavigate }: SidebarProps) => {
  const { signOut } = useAuth();

  const mainNavItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "grades", icon: BarChart3, label: "Grades" },
    { id: "shop", icon: ShoppingBag, label: "Shop", badge: "3" },
    { id: "goals", icon: Target, label: "Goal Setting" },
    { id: "schedule", icon: CalendarDays, label: "My Schedule" },
    { id: "friends", icon: Users, label: "Friends" },
    { id: "notes", icon: FileText, label: "Notes" },
    { id: "guide", icon: BookOpen, label: "Guide" },
  ];

  const gameNavItems = [
    { id: "barter", icon: Repeat, label: "Barter" },
    { id: "grimreaper", icon: Skull, label: "Grim Reaper" },
    { id: "avatar", icon: User, label: "Avatar" },
    { id: "leaderboard", icon: Trophy, label: "Leaderboard" },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="font-display text-2xl font-bold text-primary glow-text-primary">ACADEMIX</h1>
        <p className="text-sm text-muted-foreground mt-1">Level Up Your Grades</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="mb-4">
          <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Main Menu</p>
          {mainNavItems.map((item) => (
            <NavItem key={item.id} icon={item.icon} label={item.label} active={activeItem === item.id} badge={item.badge} onClick={() => onNavigate(item.id)} />
          ))}
        </div>

        <div className="pt-4 border-t border-sidebar-border">
          <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Game Mode</p>
          {gameNavItems.map((item) => (
            <NavItem key={item.id} icon={item.icon} label={item.label} active={activeItem === item.id} onClick={() => onNavigate(item.id)} />
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-1">
        <ThemeToggle />
        <NavItem icon={Settings} label="Settings" active={activeItem === "settings"} onClick={() => onNavigate("settings")} />
        <NavItem icon={LogOut} label="Logout" onClick={handleLogout} />
      </div>
    </aside>
  );
};
