import { Mic, FileText, Headphones, MessageSquare, Sparkles, Settings2, AudioWaveform } from "lucide-react";
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
    {
      number: "07",
      title: "Stammer Shield",
      subtitle: "Fluency Builder",
      description: "Neutralize hesitations and filler words. Build smooth, confident speech patterns.",
      path: "/practice/stammer-neutralizer",
      icon: <AudioWaveform className="w-5 h-5 text-foreground" />,
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
      {/* Header */}
      <div className="mb-12 md:mb-16">
        <StatusBadge label="Training Protocol Selection" />
        
        <h1 className="text-[clamp(2rem,5vw,4rem)] font-heading font-bold tracking-tighter leading-[0.9] text-foreground mt-8 mb-6">
          PRACTICE<br />
          <span className="text-mercury">PROTOCOLS.</span>
        </h1>
        
        <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
          Select a training module to begin your session. Each protocol is designed to target specific IELTS speaking skills with precision neural analysis.
        </p>
      </div>

      {/* Configuration Panel */}
      <div className="chrome-card-static rounded-2xl p-6 mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <div className="hud-label mb-1">Examiner Mode</div>
              <select className="bg-transparent border border-border rounded-lg px-4 py-2 font-mono text-sm text-foreground focus:outline-none focus:border-foreground/50">
                <option value="professional">Professional</option>
                <option value="encourager">Encourager</option>
                <option value="academic">Academic</option>
              </select>
            </div>
            <div className="h-8 w-px bg-border hidden md:block" />
            <div>
              <div className="hud-label mb-1">Acoustic Profile</div>
              <select className="bg-transparent border border-border rounded-lg px-4 py-2 font-mono text-sm text-foreground focus:outline-none focus:border-foreground/50">
                <option value="silent">Silent Room</option>
                <option value="cafe">Urban Cafe</option>
                <option value="exam">Exam Hall</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[9px] text-muted-foreground uppercase">
              Config_Status: <span className="text-foreground">Ready</span>
            </span>
          </div>
        </div>
      </div>

      {/* Practice Modules Grid */}
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

      {/* Quick Actions */}
      <div className="mt-16 chrome-card-static rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-heading text-lg font-bold mb-2">Quick Start</h3>
            <p className="text-muted-foreground text-sm">
              Begin a randomized practice session across all modules
            </p>
          </div>
          <button className="btn-mercury h-14 px-10 rounded-full whitespace-nowrap">
            Random Protocol
          </button>
        </div>
      </div>
    </main>
  );
};

export default Practice;
