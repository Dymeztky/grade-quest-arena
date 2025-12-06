import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Target, TrendingUp, Calculator, Brain, Sparkles } from "lucide-react";
import { getSubjectAverages, getMonthlyData, getSubjectNames } from "@/data/grades";

interface Goal {
  subject: string;
  targetValue: number;
  currentValue: number;
  predictedValue: number;
  requiredMinimum: number;
}

// Simple linear regression to predict next value
const predictNextValue = (values: number[]): number => {
  const n = values.length;
  if (n < 2) return values[0] || 75;

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  const predicted = Math.round(slope * n + intercept);

  return Math.max(0, Math.min(100, predicted));
};

// Calculate required minimum to reach target
const calculateRequiredMinimum = (
  currentAvg: number,
  targetAvg: number,
  remainingTests: number
): number => {
  // If we have 'remainingTests' tests left, what's the minimum needed?
  const required = Math.round(
    (targetAvg * (7 + remainingTests) - currentAvg * 7) / remainingTests
  );
  return Math.max(0, Math.min(100, required));
};

export const GoalSettingPage = () => {
  const subjects = getSubjectNames();
  const averages = getSubjectAverages();

  const initialGoals: Goal[] = subjects.map((subject) => {
    const current = averages.find((a) => a.label === subject)?.value || 75;
    const monthlyData = getMonthlyData(subject);
    const values = monthlyData.map((d) => d.nilai);
    const predicted = predictNextValue(values);
    const requiredMin = calculateRequiredMinimum(current, 85, 3);

    return {
      subject,
      targetValue: 85,
      currentValue: current,
      predictedValue: predicted,
      requiredMinimum: requiredMin,
    };
  });

  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  const updateGoalTarget = (subject: string, newTarget: number) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.subject === subject) {
          const requiredMin = calculateRequiredMinimum(
            goal.currentValue,
            newTarget,
            3
          );
          return { ...goal, targetValue: newTarget, requiredMinimum: requiredMin };
        }
        return goal;
      })
    );
  };

  const getStatusColor = (current: number, target: number, predicted: number) => {
    if (predicted >= target) return "text-green-400";
    if (predicted >= target - 5) return "text-yellow-400";
    return "text-red-400";
  };

  const getProgressWidth = (current: number, target: number) => {
    return Math.min(100, (current / target) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            Goal Setting
          </h1>
          <p className="text-muted-foreground mt-1">
            Set your grade targets and see predictions to achieve them
          </p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 border-l-4 border-primary">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">AI Prediction</p>
              <p className="font-semibold">Linear Regression</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 border-l-4 border-gold">
          <div className="flex items-center gap-3">
            <Calculator className="w-6 h-6 text-gold" />
            <div>
              <p className="text-sm text-muted-foreground">Remaining Tests</p>
              <p className="font-semibold">3 Tests</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 border-l-4 border-green-500">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">On Track</p>
              <p className="font-semibold">
                {goals.filter((g) => g.predictedValue >= g.targetValue).length} / {goals.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <div key={goal.subject} className="glass-card p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold">{goal.subject}</h3>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  goal.predictedValue >= goal.targetValue
                    ? "bg-green-500/20 text-green-400"
                    : goal.predictedValue >= goal.targetValue - 5
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {goal.predictedValue >= goal.targetValue
                  ? "On Track"
                  : "Needs Effort"}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Progress to Target</span>
                <span className="font-semibold">
                  {goal.currentValue} / {goal.targetValue}
                </span>
              </div>
              <div className="h-3 bg-muted/50 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-primary to-gold rounded-full transition-all duration-500"
                  style={{ width: `${getProgressWidth(goal.currentValue, goal.targetValue)}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Current</p>
                <p className="text-xl font-bold text-primary">{goal.currentValue}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Predicted</p>
                <p className={`text-xl font-bold ${getStatusColor(goal.currentValue, goal.targetValue, goal.predictedValue)}`}>
                  {goal.predictedValue}
                </p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Min. Needed</p>
                <p className={`text-xl font-bold ${
                  goal.requiredMinimum > 95 ? "text-red-400" : 
                  goal.requiredMinimum > 85 ? "text-yellow-400" : "text-green-400"
                }`}>
                  {goal.requiredMinimum > 100 ? "N/A" : goal.requiredMinimum}
                </p>
              </div>
            </div>

            {/* Target Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Set Target</label>
                <span className="text-sm font-bold text-gold">{goal.targetValue}</span>
              </div>
              <Slider
                value={[goal.targetValue]}
                onValueChange={(value) => updateGoalTarget(goal.subject, value[0])}
                min={60}
                max={100}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                {goal.requiredMinimum > 100
                  ? "Target cannot be reached with remaining tests"
                  : `You need at least ${goal.requiredMinimum} on your next test`}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="glass-card p-6 border-l-4 border-primary">
        <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Tips to Achieve Your Targets
        </h3>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Focus on subjects marked as "Needs Effort"</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Review material consistently, at least 30 minutes per day</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Use Grim Reaper to challenge friends and boost motivation</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
