import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mic, MicOff, Volume2, Settings2, Play, Square } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { StreamBar } from "@/components/StreamBar";

type ExaminerType = "professional" | "encourager" | "academic";
type AcousticProfile = "silent" | "cafe" | "exam";

const MockExam = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [examinerType, setExaminerType] = useState<ExaminerType>("professional");
  const [acousticProfile, setAcousticProfile] = useState<AcousticProfile>("silent");
  const [examPhase, setExamPhase] = useState<"setup" | "intro" | "part1" | "part2" | "part3" | "complete">("setup");

  const examinerDescriptions = {
    professional: "Neutral tone, standard IELTS timing, focused feedback",
    encourager: "Supportive approach, positive reinforcement, gentle corrections",
    academic: "Formal register, challenging follow-ups, academic vocabulary",
  };

  const handleStartExam = () => {
    setExamPhase("intro");
    // In production, this would connect to Gemini Live API
  };

  return (
    <main className="max-w-5xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
      {/* Back Navigation */}
      <Link
        to="/practice"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-mono text-[10px] uppercase tracking-widest">Back to Protocols</span>
      </Link>

      {/* Header */}
      <div className="mb-12">
        <StatusBadge label={examPhase === "setup" ? "Configuration Mode" : "Exam In Progress"} />
        
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-heading font-bold tracking-tighter leading-[0.9] text-foreground mt-8 mb-4">
          NEURAL VOICE<br />
          <span className="text-mercury">PROTOCOL.</span>
        </h1>
        
        <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
          Full-length IELTS speaking simulation with real-time AI examiner. Configure your test environment below.
        </p>
      </div>

      {examPhase === "setup" ? (
        <div className="space-y-8">
          {/* Examiner Selection */}
          <div className="chrome-card-static rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings2 className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-heading font-bold">Examiner Logic</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {(["professional", "encourager", "academic"] as ExaminerType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setExaminerType(type)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    examinerType === type
                      ? "border-foreground bg-white/5"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <span className="block font-heading text-sm font-bold capitalize mb-2">
                    {type}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {examinerDescriptions[type]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Acoustic Profile */}
          <div className="chrome-card-static rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Volume2 className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-heading font-bold">Acoustic Profiling</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { id: "silent" as const, name: "Silent Room", desc: "No background noise" },
                { id: "cafe" as const, name: "Urban Cafe", desc: "Ambient conversation, light music" },
                { id: "exam" as const, name: "Exam Hall", desc: "Distant typing, papers shuffling" },
              ].map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => setAcousticProfile(profile.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    acousticProfile === profile.id
                      ? "border-foreground bg-white/5"
                      : "border-border hover:border-foreground/30"
                  }`}
                >
                  <span className="block font-heading text-sm font-bold mb-2">
                    {profile.name}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {profile.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartExam}
            className="btn-mercury w-full h-16 rounded-2xl flex items-center justify-center gap-3"
          >
            <Play className="w-5 h-5" />
            Initialize Neural Voice Protocol
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Exam Interface */}
          <div className="chrome-card-static rounded-2xl p-8">
            {/* Phase Indicator */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                {["intro", "part1", "part2", "part3"].map((phase, i) => (
                  <div
                    key={phase}
                    className={`flex items-center gap-2 ${
                      examPhase === phase ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                        examPhase === phase
                          ? "border-foreground bg-white/10"
                          : "border-border"
                      }`}
                    >
                      <span className="font-mono text-xs">{i + 1}</span>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider hidden md:block">
                      {phase === "intro" ? "Introduction" : phase.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="font-mono text-xl text-foreground">14:32</div>
            </div>

            {/* Waveform Visualization */}
            <div className="h-32 rounded-xl bg-white/5 border border-border flex items-center justify-center mb-8">
              <div className="flex items-center gap-1">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-foreground rounded-full transition-all ${
                      isRecording ? "animate-pulse" : ""
                    }`}
                    style={{
                      height: isRecording
                        ? `${Math.random() * 60 + 20}px`
                        : "4px",
                      animationDelay: `${i * 0.05}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Transcription Feed */}
            <div className="p-4 rounded-xl bg-white/5 border border-border mb-8 h-40 overflow-y-auto">
              <div className="hud-label mb-2">Live Transcription</div>
              <p className="text-sm text-muted-foreground font-mono">
                {isRecording
                  ? "Listening for speech input..."
                  : "Press the microphone button to begin speaking"}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-foreground hover:bg-foreground/90"
                }`}
              >
                {isRecording ? (
                  <MicOff className="w-6 h-6 text-white" />
                ) : (
                  <Mic className="w-6 h-6 text-background" />
                )}
              </button>
              <button
                onClick={() => setExamPhase("setup")}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:border-foreground/50 transition-colors"
              >
                <Square className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>

          {/* Real-time Metrics */}
          <div className="chrome-card-static rounded-2xl p-6">
            <h3 className="font-heading font-bold mb-6">Real-time Analysis</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <StreamBar label="Fluency" value="Analyzing..." percentage={0} />
              <StreamBar label="Coherence" value="Standby" percentage={0} delay="-0.3s" />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MockExam;
