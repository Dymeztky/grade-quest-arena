import { useState } from "react";
import { GradesRadarChart } from "@/components/dashboard/GradesRadarChart";
import { SubjectLineChart } from "@/components/dashboard/SubjectLineChart";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Target, BookOpen, Calendar } from "lucide-react";
import { getSubjectAverages, getMonthlyData, getSubjectNames } from "@/data/grades";

export const GradesPage = () => {
  const [viewMode, setViewMode] = useState<"overview" | "detail">("overview");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const subjects = getSubjectNames();
  const averages = getSubjectAverages();

  const totalAverage = Math.round(
    averages.reduce((sum, item) => sum + item.value, 0) / averages.length
  );

  const renderOverview = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rata-rata Total</p>
              <p className="text-2xl font-bold font-display">{totalAverage}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nilai Tertinggi</p>
              <p className="text-2xl font-bold font-display">
                {Math.max(...averages.map(a => a.value))}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20">
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Nilai Terendah</p>
              <p className="text-2xl font-bold font-display">
                {Math.min(...averages.map(a => a.value))}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gold/20">
              <BookOpen className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Mapel</p>
              <p className="text-2xl font-bold font-display">{subjects.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GradesRadarChart />
        <SubjectLineChart />
      </div>

      {/* Subject List */}
      <div className="glass-card p-6">
        <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Rincian Per Mata Pelajaran
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {averages.map((subject) => {
            const trend = parseInt(subject.trend);
            const isPositive = trend > 0;
            const isNegative = trend < 0;

            return (
              <button
                key={subject.label}
                onClick={() => {
                  setSelectedSubject(subject.label);
                  setViewMode("detail");
                }}
                className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all text-left group"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{subject.label}</h4>
                  <span
                    className={`text-sm font-medium ${
                      isPositive
                        ? "text-green-400"
                        : isNegative
                        ? "text-red-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {subject.trend}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold font-display">
                    {subject.value}
                  </span>
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                    Lihat Detail →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderDetail = () => {
    if (!selectedSubject) return null;
    const subjectData = getMonthlyData(selectedSubject);
    const currentAvg = averages.find(a => a.label === selectedSubject);

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => {
              setViewMode("overview");
              setSelectedSubject(null);
            }}
          >
            ← Kembali
          </Button>
          <h2 className="font-display text-2xl font-bold">{selectedSubject}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground">Nilai Saat Ini</p>
            <p className="text-3xl font-bold font-display text-primary">
              {currentAvg?.value}
            </p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground">Target</p>
            <p className="text-3xl font-bold font-display">80</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-sm text-muted-foreground">Trend</p>
            <p className={`text-3xl font-bold font-display ${
              parseInt(currentAvg?.trend || "0") > 0 ? "text-green-400" : 
              parseInt(currentAvg?.trend || "0") < 0 ? "text-red-400" : ""
            }`}>
              {parseInt(currentAvg?.trend || "0") > 0 ? "+" : ""}
              {currentAvg?.trend}
            </p>
          </div>
        </div>

        {/* Detailed Chart */}
        <div className="glass-card p-6">
          <h3 className="font-display text-lg font-bold mb-4">Perkembangan Nilai</h3>
          <div className="space-y-3">
            {subjectData.map((data, index) => (
              <div key={data.month} className="flex items-center gap-4">
                <span className="w-12 text-sm text-muted-foreground">{data.month}</span>
                <div className="flex-1 h-8 bg-muted/30 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all"
                    style={{ width: `${data.nilai}%` }}
                  />
                  <div
                    className="absolute top-0 h-full w-0.5 bg-gold"
                    style={{ left: `${data.target}%` }}
                  />
                </div>
                <span className="w-12 text-right font-semibold">{data.nilai}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary" /> Nilai
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-gold" /> Target (80)
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold">
          {viewMode === "overview" ? "Graph Nilai" : "Detail Nilai"}
        </h1>
        {viewMode === "overview" && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Export CSV
            </Button>
          </div>
        )}
      </div>
      {viewMode === "overview" ? renderOverview() : renderDetail()}
    </div>
  );
};
