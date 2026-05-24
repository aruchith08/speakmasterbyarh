import { useNavigate } from "react-router-dom";
import { Mic, Cpu, TrendingUp, GraduationCap, Radio, AudioWaveform, BookOpen, MessageSquare } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { VocalizerCard } from "@/components/VocalizerCard";
import { MetricCard } from "@/components/MetricCard";

const Landing = () => {
  const navigate = useNavigate();
  const goAuth = () => navigate("/app");

  const features = [
    {
      icon: <Mic className="w-6 h-6 text-foreground" />,
      title: "Speak naturally",
      copy: "Pick a protocol and talk into your mic. Live transcription, waveform feedback, and a real AI examiner listening in real time.",
    },
    {
      icon: <Cpu className="w-6 h-6 text-foreground" />,
      title: "Neural analysis",
      copy: "Every session is graded on fluency, lexical resource, pronunciation, and coherence — using the official IELTS rubric, powered by Groq.",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-foreground" />,
      title: "Track every band",
      copy: "Watch your score climb session over session. XP, achievements, vocabulary drills, and a roadmap from Band 5 to Band 9.",
    },
  ];

  const useCases = [
    {
      icon: <GraduationCap className="w-7 h-7 text-foreground" />,
      title: "Prepare for IELTS",
      copy: "Run full Part 1, 2, and 3 simulations with timed cue cards, abstract discussion, and instant band-score feedback after every turn.",
      tag: "Score with confidence.",
    },
    {
      icon: <Radio className="w-7 h-7 text-foreground" />,
      title: "Train with a live examiner",
      copy: "Bi-directional voice conversation with an AI examiner that adapts to your level, follows up on your answers, and never gets tired.",
      tag: "Practice anytime.",
    },
    {
      icon: <AudioWaveform className="w-7 h-7 text-foreground" />,
      title: "Rebuild fluency",
      copy: "Neutralize fillers, hesitations, and stammers. Targeted drills for pronunciation, intonation, and prosody until your speech feels effortless.",
      tag: "Speak smoother.",
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 md:px-8">
      {/* HERO */}
      <section className="pt-16 md:pt-28 pb-12 md:pb-20 text-center flex flex-col items-center">
        <StatusBadge label="Stellar Mercury Edition" />

        <h1 className="font-heading font-bold tracking-tighter leading-[0.85] mt-10 mb-8 text-[clamp(3rem,10vw,7.5rem)]">
          Master <span className="text-mercury">Speaking</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mb-10 md:mb-12">
          Your AI IELTS coach, grounded in real-time speech analysis and the latest neural models — built to take you from nervous to fluent.
        </p>

        <button
          onClick={goAuth}
          className="btn-mercury h-14 md:h-16 px-10 md:px-14 rounded-full text-base"
        >
          Try SpeakMaster
        </button>
      </section>

      {/* PRODUCT FRAME */}
      <section className="pb-24 md:pb-40">
        <div className="chrome-card rounded-[40px] p-6 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-white/[0.06] blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-mercury/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative grid lg:grid-cols-5 gap-6 md:gap-8 items-stretch">
            <div className="lg:col-span-3 flex">
              <VocalizerCard score={7.5} fluency={82} lexical={76} resonance={88} />
            </div>
            <div className="lg:col-span-2 flex flex-col justify-between gap-4">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard label="Fluency" value="82" unit="%" />
                <MetricCard label="Lexical" value="76" unit="%" />
                <MetricCard label="Pronunc." value="88" unit="%" />
                <MetricCard label="Coherence" value="79" unit="%" />
              </div>
              <div className="pt-4 border-t border-border flex justify-between font-mono text-[9px] text-muted-foreground uppercase tracking-[0.3em]">
                <span>STREAM 0x7F2A</span>
                <span>LIVE</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground mt-6">
          // Sample_Telemetry_Preview
        </p>
      </section>

      {/* FEATURE TRIO */}
      <section className="pb-24 md:pb-40">
        <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tighter text-center mb-16 md:mb-24">
          Speak. <span className="text-mercury">Analyze.</span> Improve.
        </h2>

        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col">
              <div className="w-12 h-12 border border-border rounded-2xl flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="font-heading text-xl font-bold tracking-tight mb-3">{f.title}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">{f.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* USE CASES */}
      <section className="pb-24 md:pb-40">
        <h2 className="font-heading text-2xl md:text-4xl font-bold tracking-tighter text-center mb-16 md:mb-20">
          How people are using SpeakMaster
        </h2>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {useCases.map((u) => (
            <div key={u.title} className="chrome-card rounded-[32px] p-8 md:p-10 flex flex-col">
              <div className="w-14 h-14 border border-border rounded-2xl flex items-center justify-center mb-6">
                {u.icon}
              </div>
              <h3 className="font-heading text-lg font-bold tracking-tight mb-4">{u.title}</h3>
              <p className="text-muted-foreground font-light leading-relaxed mb-8 flex-1">{u.copy}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/70 italic">{u.tag}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="pb-20 md:pb-28">
        <div className="chrome-card rounded-[40px] p-10 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-mercury/15 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative">
            <StatusBadge label="Initiation Ready" />
            <h2 className="font-heading text-3xl md:text-6xl font-bold tracking-tighter mt-8 mb-6">
              Begin your <span className="text-mercury">IELTS</span> protocol.
            </h2>
            <p className="text-muted-foreground font-light max-w-xl mx-auto mb-10">
              Free to start. No credit card. Speak your first session in under sixty seconds.
            </p>
            <button onClick={goAuth} className="btn-mercury h-14 md:h-16 px-10 md:px-14 rounded-full">
              Try SpeakMaster
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-8 pb-12 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-8">
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground">© 2024 SPEAKMASTER_SYS</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground hidden md:block">BY ARH</span>
          </div>
          <div className="flex gap-6">
            <a href="/tutorial" aria-label="Tutorial" className="text-muted-foreground hover:text-foreground transition-colors"><BookOpen className="w-4 h-4" /></a>
            <a href="/about" aria-label="About" className="text-muted-foreground hover:text-foreground transition-colors"><MessageSquare className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Landing;
