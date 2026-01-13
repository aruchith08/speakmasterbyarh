import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, BookOpen, FileText, MessageSquare, Sparkles, Target, Headphones, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { VocalizerCard } from "@/components/VocalizerCard";
import { PracticeCard } from "@/components/PracticeCard";
import { MetricCard } from "@/components/MetricCard";
import { useSessionManager } from "@/hooks/useSessionManager";
import { useAuth } from "@/hooks/useAuth";

interface UserStats {
  streak: number;
  avgBandScore: number;
  sessionsCompleted: number;
  score: number;
  fluency: number;
  lexical: number;
  resonance: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const trainingRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { getUserProfile, getSessionHistory } = useSessionManager();
  
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserStats>({
    streak: 0,
    avgBandScore: 0,
    sessionsCompleted: 0,
    score: 0,
    fluency: 0,
    lexical: 0,
    resonance: 0,
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch profile and session history in parallel
        const [profile, sessions] = await Promise.all([
          getUserProfile(),
          getSessionHistory(100) // Get up to 100 sessions for accurate average
        ]);

        // Calculate stats from profile
        const streak = profile?.streak_days || 0;

        // Calculate stats from sessions
        const sessionsCompleted = sessions?.length || 0;
        
        let avgBandScore = 0;
        let latestScore = 0;
        let latestFluency = 0;
        let latestLexical = 0;
        let latestPronunciation = 0;

        if (sessions && sessions.length > 0) {
          // Calculate average band score from all sessions
          const sessionsWithBand = sessions.filter((s: any) => s.overall_band != null);
          if (sessionsWithBand.length > 0) {
            const totalBand = sessionsWithBand.reduce((sum: number, s: any) => sum + Number(s.overall_band), 0);
            avgBandScore = totalBand / sessionsWithBand.length;
          }

          // Get latest session for VocalizerCard scores
          const latestSession = sessions[0]; // Sessions are ordered by created_at desc
          if (latestSession) {
            latestScore = latestSession.overall_band ? Number(latestSession.overall_band) : 0;
            latestFluency = latestSession.fluency_score ? Number(latestSession.fluency_score) * 10 : 0;
            latestLexical = latestSession.lexical_score ? Number(latestSession.lexical_score) * 10 : 0;
            latestPronunciation = latestSession.pronunciation_score ? Number(latestSession.pronunciation_score) * 10 : 0;
          }
        }

        setUserData({
          streak,
          avgBandScore,
          sessionsCompleted,
          score: latestScore,
          fluency: latestFluency,
          lexical: latestLexical,
          resonance: latestPronunciation, // Using pronunciation as resonance
        });
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);

  const scrollToTraining = () => {
    trainingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const practiceModules = [
    {
      number: "01",
      title: "Neural Voice",
      subtitle: "Live Mock Exam",
      description: "Full-length IELTS speaking simulation with Gemini Live AI. Real-time bi-directional voice conversation.",
      path: "/practice/mock-exam",
      icon: <Mic className="w-5 h-5 text-foreground animate-pulse-soft" />,
    },
    {
      number: "02",
      title: "Cue Protocol",
      subtitle: "Part 2 Practice",
      description: "Master the 2-minute long turn with timed preparation, live transcription, and diagnostic analysis.",
      path: "/practice/cue-card",
      icon: <FileText className="w-5 h-5 text-foreground" />,
    },
    {
      number: "03",
      title: "Phonetic Drill",
      subtitle: "Read Aloud",
      description: "Precision pronunciation training with phonetic comparison and accuracy scoring.",
      path: "/practice/read-aloud",
      icon: <Headphones className="w-5 h-5 text-foreground" />,
    },
    {
      number: "04",
      title: "Abstract Core",
      subtitle: "Part 3 Discussion",
      description: "High-level reasoning practice with elevated rephrasing and vocabulary boosters.",
      path: "/practice/discussion",
      icon: <MessageSquare className="w-5 h-5 text-foreground" />,
    },
    {
      number: "05",
      title: "Skill Forge",
      subtitle: "Micro Drills",
      description: "Targeted exercises for idiom mastery, intonation mirroring, and prosodic accuracy.",
      path: "/practice/drills",
      icon: <Sparkles className="w-5 h-5 text-foreground" />,
    },
    {
      number: "06",
      title: "Journey Map",
      subtitle: "Learning Roadmap",
      description: "Gamified progression from Band 5 to Band 9 with AI-generated tutorials and practice.",
      path: "/roadmap",
      icon: <Target className="w-5 h-5 text-foreground" />,
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-4 sm:pt-8 md:pt-16 pb-24 md:pb-32">
      <div className="grid lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start">
        {/* Hero Left */}
        <div className="lg:col-span-7 pt-2 sm:pt-4 md:pt-8">
          <StatusBadge label="Strategic Command Active" />

          <h1 className="text-[clamp(2rem,8vw,5rem)] font-heading font-bold tracking-tighter leading-[0.9] text-foreground mt-6 sm:mt-8 mb-6 sm:mb-8 md:mb-10">
            COMMAND<br />
            <span className="text-mercury">CENTER.</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed max-w-lg mb-6 sm:mb-8 md:mb-12">
            Your neural interface to IELTS mastery. Select a protocol to begin training or review your telemetry data.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 sm:mb-12">
            {isLoading ? (
              <>
                <div className="h-16 sm:h-20 rounded-xl bg-card/30 animate-pulse" />
                <div className="h-16 sm:h-20 rounded-xl bg-card/30 animate-pulse" />
                <div className="h-16 sm:h-20 rounded-xl bg-card/30 animate-pulse" />
              </>
            ) : (
              <>
                <MetricCard
                  label="Streak"
                  value={userData.streak}
                  unit="days"
                />
                <MetricCard
                  label="Avg_Band"
                  value={userData.avgBandScore > 0 ? userData.avgBandScore.toFixed(1) : "—"}
                />
                <MetricCard
                  label="Sessions"
                  value={userData.sessionsCompleted}
                />
              </>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button 
              onClick={scrollToTraining}
              className="btn-mercury h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-12 rounded-full text-sm sm:text-base active:scale-95 transition-transform"
            >
              Begin Training
            </button>
            <button 
              onClick={() => navigate('/tutorial')}
              className="flex items-center gap-3 sm:gap-4 group cursor-pointer active:scale-95 transition-transform"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-border flex items-center justify-center group-hover:border-foreground/50 transition-colors">
                <svg
                  viewBox="0 0 24 24"
                  className="w-3 h-3 sm:w-4 sm:h-4 text-foreground"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 3l14 9-14 9V3z" />
                </svg>
              </div>
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">
                Tutorial
              </span>
            </button>
          </div>
        </div>

        {/* Hero Right: Vocalizer Card */}
        <div className="lg:col-span-5 relative order-first lg:order-last">
          {isLoading ? (
            <div className="chrome-card rounded-[24px] sm:rounded-[40px] p-6 sm:p-8 md:p-10 flex items-center justify-center min-h-[280px] sm:min-h-[350px] md:min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-mercury" />
            </div>
          ) : (
            <VocalizerCard
              score={userData.score}
              fluency={userData.fluency}
              lexical={userData.lexical}
              resonance={userData.resonance}
            />
          )}
        </div>
      </div>

      {/* Practice Modules Grid */}
      <section ref={trainingRef} className="mt-16 sm:mt-24 md:mt-40">
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-12">
          <h2 className="font-heading text-lg sm:text-xl md:text-2xl font-bold tracking-tight whitespace-nowrap">
            Training Protocols
          </h2>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-widest hidden sm:block">
            Select Module
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {practiceModules.map((module) => (
            <PracticeCard
              key={module.number}
              number={module.number}
              title={module.title}
              subtitle={module.subtitle}
              description={module.description}
              path={module.path}
              icon={module.icon}
            />
          ))}
        </div>
      </section>

      {/* Footer Info */}
      <footer className="mt-16 sm:mt-24 md:mt-32 pt-6 sm:pt-8 border-t border-border mb-20 md:mb-0">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 sm:gap-8">
            <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-muted-foreground">
              © 2024 SPEAKMASTER_SYS
            </span>
            <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-muted-foreground hidden sm:block">
              STELLAR_MERCURY_EDITION
            </span>
          </div>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors p-2 -m-2"
            >
              <BookOpen className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors p-2 -m-2"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Dashboard;
