import { StatusBadge } from "@/components/StatusBadge";
import { MetricCard } from "@/components/MetricCard";
import { StreamBar } from "@/components/StreamBar";
import { TrendingUp, TrendingDown, AlertCircle, Calendar, Loader2 } from "lucide-react";
import { useRealtimeStats } from "@/hooks/useRealtimeStats";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const Analytics = () => {
  const { user } = useAuth();
  const { stats, activityData, weaknesses, isLoading } = useRealtimeStats();

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

  if (!user) {
    return (
      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
        <div className="text-center py-20">
          <h2 className="text-2xl font-heading font-bold mb-4">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your analytics and progress.
          </p>
          <Link
            to="/auth"
            className="btn-mercury h-12 px-8 rounded-xl inline-flex items-center justify-center"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-mercury" />
        </div>
      </main>
    );
  }

  // Calculate score trends (compare latest to average)
  const fluencyTrend = stats.latestFluency > 0 ? stats.latestFluency / 10 : 0;
  const lexicalTrend = stats.latestLexical > 0 ? stats.latestLexical / 10 : 0;
  const pronunciationTrend = stats.latestPronunciation > 0 ? stats.latestPronunciation / 10 : 0;
  const grammarTrend = stats.avgBandScore > 0 ? stats.avgBandScore : 0;

  const overallTrend = stats.latestScore > stats.avgBandScore ? "up" : stats.latestScore < stats.avgBandScore ? "down" : "same";

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
          Real-time performance tracking and pattern recognition. Your speaking data analyzed for continuous improvement.
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <MetricCard label="Total_Sessions" value={stats.sessionsCompleted} />
        <MetricCard label="Avg_Band" value={stats.avgBandScore > 0 ? stats.avgBandScore.toFixed(1) : "—"} />
        <MetricCard label="Best_Band" value={stats.bestBandScore > 0 ? stats.bestBandScore.toFixed(1) : "—"} />
        <MetricCard label="Practice_Hours" value={stats.practiceHours} unit="h" />
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

            {stats.sessionsCompleted === 0 && (
              <div className="mt-6 p-4 rounded-xl border border-dashed border-border text-center">
                <p className="text-sm text-muted-foreground">
                  Complete practice sessions to see your activity heatmap
                </p>
              </div>
            )}
          </div>

          {/* Score Trends */}
          <div className="chrome-card-static rounded-2xl p-6 mt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-bold">Score Trends</h3>
              {stats.sessionsCompleted > 0 && (
                <div className="flex items-center gap-2">
                  {overallTrend === "up" ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="font-mono text-sm text-green-400">Improving</span>
                    </>
                  ) : overallTrend === "down" ? (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-400" />
                      <span className="font-mono text-sm text-red-400">Needs Focus</span>
                    </>
                  ) : (
                    <span className="font-mono text-sm text-muted-foreground">Stable</span>
                  )}
                </div>
              )}
            </div>

            {stats.sessionsCompleted > 0 ? (
              <div className="space-y-6">
                <StreamBar 
                  label="Fluency" 
                  value={fluencyTrend > 0 ? fluencyTrend.toFixed(1) : "—"} 
                  percentage={fluencyTrend * 11} 
                />
                <StreamBar 
                  label="Lexical Resource" 
                  value={lexicalTrend > 0 ? lexicalTrend.toFixed(1) : "—"} 
                  percentage={lexicalTrend * 11} 
                  delay="-0.3s" 
                />
                <StreamBar 
                  label="Grammar" 
                  value={grammarTrend > 0 ? grammarTrend.toFixed(1) : "—"} 
                  percentage={grammarTrend * 11} 
                  delay="-0.6s" 
                />
                <StreamBar 
                  label="Pronunciation" 
                  value={pronunciationTrend > 0 ? pronunciationTrend.toFixed(1) : "—"} 
                  percentage={pronunciationTrend * 11} 
                  delay="-0.9s" 
                />
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  Complete practice sessions to see your score trends
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Weakness Detection */}
        <div className="lg:col-span-4">
          <div className="chrome-card-static rounded-2xl p-6 sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-heading font-bold">Weakness Detection</h3>
            </div>

            {weaknesses.length > 0 ? (
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
                        Detected {weakness.frequency}x in recent sessions
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  {stats.sessionsCompleted > 0 
                    ? "No weaknesses detected yet. Keep practicing!"
                    : "Complete practice sessions to identify areas for improvement"}
                </p>
              </div>
            )}

            <div className="mt-6 p-4 rounded-xl border border-dashed border-border">
              <p className="text-sm text-muted-foreground text-center">
                {weaknesses.length > 0 
                  ? "Focus on high-severity issues first for maximum score improvement"
                  : "Your weaknesses will be analyzed from AI feedback in your sessions"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Analytics;
