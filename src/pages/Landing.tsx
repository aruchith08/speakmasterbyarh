import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, BookOpen, FileText, MessageSquare, Sparkles, Target, Headphones, AudioWaveform, Radio, Activity, Cpu } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { VocalizerCard } from "@/components/VocalizerCard";
import { PracticeCard } from "@/components/PracticeCard";
import { MetricCard } from "@/components/MetricCard";

const Landing = () => {
  const navigate = useNavigate();
  const trainingRef = useRef<HTMLDivElement>(null);

  const scrollToTraining = () => {
    trainingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const goAuth = () => navigate("/auth");

  const practiceModules = [
    { number: "01", title: "Neural Voice", subtitle: "Live Mock Exam", description: "Full-length IELTS speaking simulation with live AI examiner. Real-time bi-directional voice conversation.", path: "/auth", icon: <Mic className="w-5 h-5 text-foreground animate-pulse-soft" /> },
    { number: "02", title: "Cue Protocol", subtitle: "Part 2 Practice", description: "Master the 2-minute long turn with timed preparation, live transcription, and diagnostic analysis.", path: "/auth", icon: <FileText className="w-5 h-5 text-foreground" /> },
    { number: "03", title: "Phonetic Drill", subtitle: "Read Aloud", description: "Precision pronunciation training with phonetic comparison and accuracy scoring.", path: "/auth", icon: <Headphones className="w-5 h-5 text-foreground" /> },
    { number: "04", title: "Abstract Core", subtitle: "Part 3 Discussion", description: "High-level reasoning practice with elevated rephrasing and vocabulary boosters.", path: "/auth", icon: <MessageSquare className="w-5 h-5 text-foreground" /> },
    { number: "05", title: "Skill Forge", subtitle: "Micro Drills", description: "Targeted exercises for idiom mastery, intonation mirroring, and prosodic accuracy.", path: "/auth", icon: <Sparkles className="w-5 h-5 text-foreground" /> },
    { number: "06", title: "Journey Map", subtitle: "Learning Roadmap", description: "Gamified progression from Band 5 to Band 9 with AI-generated tutorials and practice.", path: "/auth", icon: <Target className="w-5 h-5 text-foreground" /> },
    { number: "07", title: "Stammer Shield", subtitle: "Fluency Builder", description: "Neutralize hesitations and filler words. Build smooth, confident speech patterns.", path: "/auth", icon: <AudioWaveform className="w-5 h-5 text-foreground" /> },
  ];

  const steps = [
    { number: "01", title: "Engage Protocol", subtitle: "Speak", description: "Pick a module and speak into your mic. Live transcription and waveform feedback as you talk.", icon: <Radio className="w-5 h-5 text-foreground" /> },
    { number: "02", title: "Neural Analysis", subtitle: "Score", description: "AI scores fluency, lexical resource, pronunciation, and coherence using IELTS rubric.", icon: <Cpu className="w-5 h-5 text-foreground" /> },
    { number: "03", title: "Track Telemetry", subtitle: "Improve", description: "Earn XP, unlock achievements, and watch your band score climb session over session.", icon: <Activity className="w-5 h-5 text-foreground" /> },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
      {/* HERO — mirrors Dashboard */}
      <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
        <div className="lg:col-span-7 pt-4 md:pt-8">
          <StatusBadge label="Strategic Command Active" />

          <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-heading font-bold tracking-tighter leading-[0.9] text-foreground mt-8 mb-8 md:mb-10">
            COMMAND<br />
            <span className="text-mercury">CENTER.</span>
          </h1>

          <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-lg mb-8 md:mb-12">
            Your neural interface to IELTS mastery. AI-graded speaking practice, real-time telemetry, and a band-score roadmap — all in one cinematic workspace.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <MetricCard label="Avg_Band_Lift" value="+1.4" />
            <MetricCard label="Protocols" value="7" />
            <div className="col-span-2 md:col-span-1">
              <MetricCard label="AI_Latency" value="<200" unit="ms" />
            </div>
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-12">// Sample_Telemetry</p>

          <div className="flex flex-wrap items-center gap-6">
            <button onClick={goAuth} className="btn-mercury h-14 md:h-16 px-8 md:px-12 rounded-full">
              Start Free
            </button>
            <button onClick={scrollToTraining} className="flex items-center gap-4 group cursor-pointer">
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:border-foreground/50 transition-colors">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 3l14 9-14 9V3z" />
                </svg>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">
                Tour Protocols
              </span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <VocalizerCard score={7.5} fluency={82} lexical={76} resonance={88} />
        </div>
      </div>

      {/* TRAINING PROTOCOLS */}
      <section ref={trainingRef} className="mt-24 md:mt-40">
        <div className="flex items-center gap-4 mb-8 md:mb-12">
          <h2 className="font-heading text-xl md:text-2xl font-bold tracking-tight">Training Protocols</h2>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">Preview Modules</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {practiceModules.map((module) => (
            <PracticeCard key={module.number} {...module} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mt-24 md:mt-40">
        <div className="flex items-center gap-4 mb-8 md:mb-12">
          <h2 className="font-heading text-xl md:text-2xl font-bold tracking-tight">Operating Sequence</h2>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">3 Phases</span>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((s) => (
            <div key={s.number} className="practice-card block">
              <div className="flex justify-between items-start mb-6">
                <div className="practice-card-number">{s.number} //</div>
                <div className="w-10 h-10 border border-border rounded-xl flex items-center justify-center">{s.icon}</div>
              </div>
              <h3 className="practice-card-title">{s.title}</h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">{s.subtitle}</p>
              <p className="practice-card-description">{s.description}</p>
              <div className="feature-line mt-4" />
            </div>
          ))}
        </div>
      </section>

      {/* TELEMETRY PREVIEW */}
      <section className="mt-24 md:mt-40">
        <div className="flex items-center gap-4 mb-8 md:mb-12">
          <h2 className="font-heading text-xl md:text-2xl font-bold tracking-tight">Live Telemetry</h2>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">Sample Feed</span>
        </div>

        <div className="chrome-card rounded-[40px] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-white/5 blur-[80px] rounded-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 relative">
            <MetricCard label="Fluency" value="82" unit="%" />
            <MetricCard label="Lexical" value="76" unit="%" />
            <MetricCard label="Pronunciation" value="88" unit="%" />
            <MetricCard label="Coherence" value="79" unit="%" />
          </div>
          <div className="mt-10 pt-6 border-t border-border flex justify-between font-mono text-[9px] text-muted-foreground uppercase tracking-[0.3em]">
            <span>STREAM_ID 0x7F2A</span>
            <span>STELLAR_MERCURY_PIPELINE</span>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mt-24 md:mt-32">
        <div className="chrome-card rounded-[40px] p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full" />
          <StatusBadge label="Initiation Ready" />
          <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tighter mt-6 mb-6">
            Initiate your <span className="text-mercury">IELTS</span> protocol.
          </h2>
          <p className="text-muted-foreground font-light max-w-xl mx-auto mb-10">
            Free to start. No credit card. Speak your first session in under sixty seconds.
          </p>
          <button onClick={goAuth} className="btn-mercury h-14 md:h-16 px-10 md:px-14 rounded-full">
            Begin Training
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-24 md:mt-32 pt-8 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-8">
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground">© 2024 SPEAKMASTER_SYS</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground hidden md:block">STELLAR_MERCURY_EDITION</span>
          </div>
          <div className="flex gap-6">
            <a href="/tutorial" className="text-muted-foreground hover:text-foreground transition-colors"><BookOpen className="w-4 h-4" /></a>
            <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors"><MessageSquare className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Landing;
