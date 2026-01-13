import { Mic, FileText, Headphones, MessageSquare, Sparkles, Settings2 } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { PracticeCard } from "@/components/PracticeCard";

const Practice = () => {
  const practiceModules = [
    {
      number: "01",
      title: "Neural Voice",
      subtitle: "Live Mock Exam",
      description: "Full-length IELTS speaking simulation powered by Gemini Live API. Configure examiner personality and acoustic environment.",
      path: "/practice/mock-exam",
      icon: <Mic className="w-5 h-5 text-foreground animate-pulse-soft" />,
    },
    {
      number: "02",
      title: "Cue Protocol",
      subtitle: "Part 2 Practice",
      description: "60-second prep phase followed by 2-minute delivery. Real-time transcription with diagnostic breakdown.",
      path: "/practice/cue-card",
      icon: <FileText className="w-5 h-5 text-foreground" />,
    },
    {
      number: "03",
      title: "Phonetic Drill",
      subtitle: "Read Aloud",
      description: "Phonetic comparison engine highlights mispronunciations. Calculates percentage-based accuracy value.",
      path: "/practice/read-aloud",
      icon: <Headphones className="w-5 h-5 text-foreground" />,
    },
    {
      number: "04",
      title: "Abstract Core",
      subtitle: "Part 3 Discussion",
      description: "Evaluates reasoning depth with elevated rephrasing. Extracts topical synonyms to boost vocabulary.",
      path: "/practice/discussion",
      icon: <MessageSquare className="w-5 h-5 text-foreground" />,
    },
    {
      number: "05",
      title: "Idiom Master",
      subtitle: "Daily Rotation",
      description: "Academic idioms with meanings, context examples, and usage scenarios. Updated every 24 hours.",
      path: "/practice/drills/idioms",
      icon: <Sparkles className="w-5 h-5 text-foreground" />,
    },
    {
      number: "06",
      title: "Intonation Mirror",
      subtitle: "Shadowing Protocol",
      description: "Listen to model sentences and replicate pitch and rhythm. Receive a Mirror Score based on prosodic accuracy.",
      path: "/practice/drills/intonation",
      icon: <Settings2 className="w-5 h-5 text-foreground" />,
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-4 sm:pt-8 md:pt-16 pb-24 md:pb-32">
      {/* Header */}
      <div className="mb-8 sm:mb-12 md:mb-16">
        <StatusBadge label="Training Protocol Selection" />
        
        <h1 className="text-[clamp(1.75rem,5vw,4rem)] font-heading font-bold tracking-tighter leading-[0.9] text-foreground mt-6 sm:mt-8 mb-4 sm:mb-6">
          PRACTICE<br />
          <span className="text-mercury">PROTOCOLS.</span>
        </h1>
        
        <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
          Select a training module to begin your session. Each protocol is designed to target specific IELTS speaking skills with precision neural analysis.
        </p>
      </div>

      {/* Configuration Panel */}
      <div className="chrome-card-static rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="flex-1 sm:flex-none">
              <div className="hud-label mb-1 text-[8px] sm:text-[9px]">Examiner Mode</div>
              <select className="w-full sm:w-auto bg-transparent border border-border rounded-lg px-3 sm:px-4 py-2 font-mono text-xs sm:text-sm text-foreground focus:outline-none focus:border-foreground/50">
                <option value="professional">Professional</option>
                <option value="encourager">Encourager</option>
                <option value="academic">Academic</option>
              </select>
            </div>
            <div className="h-8 w-px bg-border hidden md:block" />
            <div className="flex-1 sm:flex-none">
              <div className="hud-label mb-1 text-[8px] sm:text-[9px]">Acoustic Profile</div>
              <select className="w-full sm:w-auto bg-transparent border border-border rounded-lg px-3 sm:px-4 py-2 font-mono text-xs sm:text-sm text-foreground focus:outline-none focus:border-foreground/50">
                <option value="silent">Silent Room</option>
                <option value="cafe">Urban Cafe</option>
                <option value="exam">Exam Hall</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[8px] sm:text-[9px] text-muted-foreground uppercase">
              Config_Status: <span className="text-foreground">Ready</span>
            </span>
          </div>
        </div>
      </div>

      {/* Practice Modules Grid */}
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

      {/* Quick Actions */}
      <div className="mt-12 sm:mt-16 chrome-card-static rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-20 md:mb-0">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="text-center sm:text-left">
            <h3 className="font-heading text-base sm:text-lg font-bold mb-1 sm:mb-2">Quick Start</h3>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Begin a randomized practice session across all modules
            </p>
          </div>
          <button className="btn-mercury h-12 sm:h-14 px-8 sm:px-10 rounded-full whitespace-nowrap w-full sm:w-auto active:scale-95 transition-transform">
            Random Protocol
          </button>
        </div>
      </div>
    </main>
  );
};

export default Practice;
