import { PlayerCard } from "./PlayerCard";
import { GradesRadarChart } from "./GradesRadarChart";
import { SubjectLineChart } from "./SubjectLineChart";
import { QuickActions } from "./QuickActions";
import { RecentActivity } from "./RecentActivity";
import { UpcomingEvents } from "./UpcomingEvents";

interface DashboardProps {
  onNavigate: (item: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Player Card */}
      <PlayerCard
        name="Alex Pratama"
        level={24}
        xp={2450}
        xpMax={3000}
        rank={12}
        streak={7}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-fade-in-delay-1">
          <GradesRadarChart />
        </div>
        <div className="animate-fade-in-delay-2">
          <SubjectLineChart />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in-delay-3">
        <QuickActions onNavigate={onNavigate} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-fade-in-delay-4">
          <RecentActivity />
        </div>
        <div className="animate-fade-in-delay-4">
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
};
