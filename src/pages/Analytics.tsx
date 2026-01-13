import { useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { MetricCard } from "@/components/MetricCard";
import { StreamBar } from "@/components/StreamBar";
import { TrendingUp, TrendingDown, AlertCircle, Calendar } from "lucide-react";

// Generate mock activity data for 28 days
const generateActivityData = () => {
  const data: { date: string; sessions: number; intensity: "none" | "low" | "medium" | "high" }[] = [];
  const today = new Date();
  
  for (let i = 27; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const sessions = Math.floor(Math.random() * 5);
    let intensity: "none" | "low" | "medium" | "high" = "none";
    if (sessions > 0) intensity = "low";
    if (sessions > 1) intensity = "medium";
    if (sessions > 3) intensity = "high";
    
    data.push({
      date: date.toISOString().split("T")[0],
      sessions,
      intensity,
    });
  }
  return data;
};

const activityData = generateActivityData();

const weaknesses = [
  { id: 1, issue: "Inconsistent Tenses", frequency: 12, severity: "high" },
  { id: 2, issue: "Over-reliance on Fillers", frequency: 8, severity: "medium" },
  { id: 3, issue: "Limited Vocabulary Range", frequency: 6, severity: "medium" },
  { id: 4, issue: "Pronunciation: 'th' sounds", frequency: 4, severity: "low" },
];

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("28d");

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "high":
        return "bg-white";
      case "medium":
        return "bg-white/60";
      case "low":
        return "bg-white/30";
      default:
        return "bg-white/5";
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
      {/* Header */}
      <div className="mb-12 md:mb-16">
        <StatusBadge label="Telemetry Analysis Active" />
        
        <h1 className="text-[clamp(2rem,5vw,4rem)] font-heading font-bold tracking-tighter leading-[0.9] text-foreground mt-8 mb-6">
          DATA<br />
          <span className="text-mercury">TELEMETRY.</span>
        </h1>
        
        <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
          Long-term performance tracking and pattern recognition. Your speaking data analyzed for continuous improvement.
        </p>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-8">
        {["7d", "14d", "28d", "90d"].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-widest transition-colors ${
              selectedPeriod === period
                ? "bg-foreground text-background"
                : "bg-white/5 text-muted-foreground hover:bg-white/10"
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <MetricCard label="Total_Sessions" value={47} />
        <MetricCard label="Avg_Band" value="7.5" />
        <MetricCard label="Best_Band" value="8.5" />
        <MetricCard label="Practice_Hours" value={23} unit="h" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Activity Heatmap */}
        <div className="lg:col-span-8">
          <div className="chrome-card-static rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-heading font-bold">Activity Log</h3>
              </div>
              <span className="font-mono text-[9px] text-muted-foreground uppercase">
                28-Day HUD
              </span>
            </div>

            {/* Heatmap Grid */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div key={i} className="text-center font-mono text-[9px] text-muted-foreground uppercase">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {activityData.map((day, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-md ${getIntensityColor(day.intensity)} transition-colors hover:ring-1 hover:ring-foreground/50`}
                  title={`${day.date}: ${day.sessions} sessions`}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <span className="font-mono text-[9px] text-muted-foreground">Less</span>
              <div className="w-3 h-3 rounded-sm bg-white/5" />
              <div className="w-3 h-3 rounded-sm bg-white/30" />
              <div className="w-3 h-3 rounded-sm bg-white/60" />
              <div className="w-3 h-3 rounded-sm bg-white" />
              <span className="font-mono text-[9px] text-muted-foreground">More</span>
            </div>
          </div>

          {/* Score Trends */}
          <div className="chrome-card-static rounded-2xl p-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-bold">Score Trends</h3>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="font-mono text-sm text-green-400">+0.5</span>
              </div>
            </div>

            <div className="space-y-6">
              <StreamBar label="Fluency" value="7.5" percentage={83} />
              <StreamBar label="Lexical Resource" value="7.0" percentage={78} delay="-0.3s" />
              <StreamBar label="Grammar" value="7.5" percentage={83} delay="-0.6s" />
              <StreamBar label="Pronunciation" value="8.0" percentage={89} delay="-0.9s" />
            </div>
          </div>
        </div>

        {/* Weakness Detection */}
        <div className="lg:col-span-4">
          <div className="chrome-card-static rounded-2xl p-6 sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-heading font-bold">Weakness Detection</h3>
            </div>

            <div className="space-y-4">
              {weaknesses.map((weakness) => (
                <div
                  key={weakness.id}
                  className="p-4 rounded-xl bg-white/5 border border-border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm text-foreground font-medium">
                      {weakness.issue}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-[9px] uppercase font-mono ${
                        weakness.severity === "high"
                          ? "bg-red-500/20 text-red-400"
                          : weakness.severity === "medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {weakness.severity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-3 h-3 text-muted-foreground" />
                    <span className="font-mono text-[10px] text-muted-foreground">
                      Detected {weakness.frequency}x in last 28 days
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl border border-dashed border-border">
              <p className="text-sm text-muted-foreground text-center">
                Focus on high-severity issues first for maximum score improvement
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Analytics;
