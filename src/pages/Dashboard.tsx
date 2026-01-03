import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, BookOpen, FileText, MessageSquare, Sparkles, Target, Headphones } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { VocalizerCard } from "@/components/VocalizerCard";
import { PracticeCard } from "@/components/PracticeCard";
import { MetricCard } from "@/components/MetricCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const trainingRef = useRef<HTMLDivElement>(null);

  const scrollToTraining = () => {
    trainingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Mock user data
  const userData = {
    streak: 12,
    avgBandScore: 7.5,
    sessionsCompleted: 47,
    score: 9.82,
    fluency: 100,
    lexical: 94,
    resonance: 88,
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
    <main className="max-w-7xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
      <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* Hero Left */}
        <div className="lg:col-span-7 pt-4 md:pt-8">
          <StatusBadge label="Strategic Command Active" />

          <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-heading font-bold tracking-tighter leading-[0.9] text-foreground mt-8 mb-8 md:mb-10">
            COMMAND<br />
            <span className="text-mercury">CENTER.</span>
          </h1>

          <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-lg mb-8 md:mb-12">
            Your neural interface to IELTS mastery. Select a protocol to begin training or review your telemetry data.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            <MetricCard
              label="Practice_Streak"
              value={userData.streak}
              unit="days"
            />
            <MetricCard
              label="Avg_Band"
              value={userData.avgBandScore.toFixed(1)}
            />
            <div className="col-span-2 md:col-span-1">
              <MetricCard
                label="Sessions"
                value={userData.sessionsCompleted}
              />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-6">
            <button 
              onClick={scrollToTraining}
              className="btn-mercury h-14 md:h-16 px-8 md:px-12 rounded-full"
            >
              Begin Training
            </button>
            <button 
              onClick={() => navigate('/tutorial')}
              className="flex items-center gap-4 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-foreground/50 transition-colors">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-foreground"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 3l14 9-14 9V3z" />
                </svg>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">
                Tutorial
              </span>
            </button>
          </div>
        </div>

        {/* Hero Right: Vocalizer Card */}
        <div className="lg:col-span-5 relative">
          <VocalizerCard
            score={userData.score}
            fluency={userData.fluency}
            lexical={userData.lexical}
            resonance={userData.resonance}
          />
        </div>
      </div>

      {/* Practice Modules Grid */}
      <section ref={trainingRef} className="mt-24 md:mt-40">
        <div className="flex items-center gap-4 mb-8 md:mb-12">
          <h2 className="font-heading text-xl md:text-2xl font-bold tracking-tight">
            Training Protocols
          </h2>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
            Select Module
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
      <footer className="mt-24 md:mt-32 pt-8 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-8">
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground">
              © 2024 SPEAKMASTER_SYS
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground hidden md:block">
              STELLAR_MERCURY_EDITION
            </span>
          </div>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <BookOpen className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
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
