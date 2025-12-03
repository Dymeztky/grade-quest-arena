import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

const subjectData = [
  { subject: "MTK", value: 85, fullMark: 100 },
  { subject: "FIS", value: 78, fullMark: 100 },
  { subject: "KIM", value: 92, fullMark: 100 },
  { subject: "BIO", value: 88, fullMark: 100 },
  { subject: "ING", value: 75, fullMark: 100 },
  { subject: "IND", value: 82, fullMark: 100 },
];

const averages = [
  { label: "Matematika", value: 85, trend: "+3" },
  { label: "Fisika", value: 78, trend: "-2" },
  { label: "Kimia", value: 92, trend: "+5" },
  { label: "Biologi", value: 88, trend: "+1" },
  { label: "B. Inggris", value: 75, trend: "+4" },
  { label: "B. Indonesia", value: 82, trend: "0" },
];

export const GradesRadarChart = () => {
  const totalAverage = Math.round(averages.reduce((sum, item) => sum + item.value, 0) / averages.length);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-xl font-bold">Grafik Nilai</h3>
          <p className="text-sm text-muted-foreground">Semua mata pelajaran</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Rata-rata</p>
          <p className="font-display text-3xl font-bold text-primary glow-text-primary">{totalAverage}</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Radar Chart */}
        <div className="flex-1 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={subjectData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontFamily: "Rajdhani" }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                axisLine={false}
              />
              <Radar
                name="Nilai"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontFamily: "Rajdhani",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Subject List */}
        <div className="w-48 space-y-2">
          {averages.map((item) => (
            <div key={item.label} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
              <span className="text-sm truncate">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold">{item.value}</span>
                <span className={`text-xs ${
                  item.trend.startsWith("+") ? "text-success" : 
                  item.trend.startsWith("-") ? "text-destructive" : "text-muted-foreground"
                }`}>
                  {item.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
