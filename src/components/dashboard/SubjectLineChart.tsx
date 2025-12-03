import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const subjects = ["Matematika", "Fisika", "Kimia", "Biologi", "B. Inggris", "B. Indonesia"];

const generateData = (subject: string) => {
  const baseValues: Record<string, number[]> = {
    "Matematika": [78, 82, 85, 80, 88, 85, 90],
    "Fisika": [75, 78, 72, 80, 76, 82, 78],
    "Kimia": [85, 88, 90, 92, 89, 94, 92],
    "Biologi": [82, 85, 88, 86, 90, 87, 88],
    "B. Inggris": [70, 72, 75, 78, 73, 76, 75],
    "B. Indonesia": [80, 82, 78, 85, 83, 80, 82],
  };
  
  const values = baseValues[subject] || [80, 82, 84, 83, 85, 84, 86];
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul"];
  
  return months.map((month, i) => ({
    month,
    nilai: values[i],
    target: 80,
  }));
};

export const SubjectLineChart = () => {
  const [selectedSubject, setSelectedSubject] = useState("Matematika");
  const data = generateData(selectedSubject);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-xl font-bold">Progress Nilai</h3>
          <p className="text-sm text-muted-foreground">Per mata pelajaran</p>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {subjects.map((subject) => (
          <Button
            key={subject}
            variant={selectedSubject === subject ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedSubject(subject)}
            className="whitespace-nowrap"
          >
            {subject}
          </Button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorNilai" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontFamily: "Rajdhani" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis 
              domain={[60, 100]} 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontFamily: "Rajdhani" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontFamily: "Rajdhani",
              }}
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="hsl(var(--destructive))" 
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
              name="Target"
            />
            <Area
              type="monotone"
              dataKey="nilai"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fill="url(#colorNilai)"
              name="Nilai"
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Nilai</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-destructive" style={{ borderTop: "2px dashed" }} />
          <span className="text-sm text-muted-foreground">Target</span>
        </div>
      </div>
    </div>
  );
};
