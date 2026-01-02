import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Mic, MicOff, RotateCcw, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { StreamBar } from "@/components/StreamBar";

type Phase = "intro" | "prep" | "delivery" | "analysis";

const sampleCueCard = {
  topic: "Describe a skill you would like to learn",
  points: [
    "What the skill is",
    "Why you want to learn it",
    "How you would learn it",
    "And explain why this skill would be useful to you",
  ],
  tips: [
    "Structure your answer with clear transitions",
    "Use specific examples from your life",
    "Vary your vocabulary and sentence structures",
    "Aim to speak for the full 2 minutes",
  ],
};

const CueCard = () => {
  const [phase, setPhase] = useState<Phase>("intro");
  const [prepTime, setPrepTime] = useState(60);
  const [deliveryTime, setDeliveryTime] = useState(120);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (phase === "prep" && prepTime > 0) {
      interval = setInterval(() => {
        setPrepTime((t) => t - 1);
      }, 1000);
    } else if (phase === "prep" && prepTime === 0) {
      setPhase("delivery");
      setIsRecording(true);
    }

    if (phase === "delivery" && deliveryTime > 0 && isRecording) {
      interval = setInterval(() => {
        setDeliveryTime((t) => t - 1);
      }, 1000);
    } else if (phase === "delivery" && deliveryTime === 0) {
      setIsRecording(false);
      setPhase("analysis");
    }

    return () => clearInterval(interval);
  }, [phase, prepTime, deliveryTime, isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setPhase("prep");
  };

  const handleStop = () => {
    setIsRecording(false);
    setPhase("analysis");
  };

  const handleReset = () => {
    setPhase("intro");
    setPrepTime(60);
    setDeliveryTime(120);
    setIsRecording(false);
    setTranscript("");
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
        <StatusBadge
          label={
            phase === "intro"
              ? "Ready"
              : phase === "prep"
              ? "Preparation Phase"
              : phase === "delivery"
              ? "Recording"
              : "Analysis Complete"
          }
        />
        
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-heading font-bold tracking-tighter leading-[0.9] text-foreground mt-8 mb-4">
          CUE CARD<br />
          <span className="text-mercury">PROTOCOL.</span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Cue Card */}
        <div className="lg:col-span-7">
          <div className="chrome-card-static rounded-2xl p-6 md:p-8">
            {/* Timer */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="hud-label">
                  {phase === "prep" ? "Prep Time" : phase === "delivery" ? "Speak Time" : "Status"}
                </span>
              </div>
              <div className="font-mono text-4xl text-foreground">
                {phase === "prep"
                  ? formatTime(prepTime)
                  : phase === "delivery"
                  ? formatTime(deliveryTime)
                  : "--:--"}
              </div>
            </div>

            {/* Cue Card Content */}
            <div className="p-6 rounded-xl bg-white/5 border border-border mb-8">
              <h3 className="font-heading text-lg font-bold mb-4">{sampleCueCard.topic}</h3>
              <p className="text-sm text-muted-foreground mb-4">You should say:</p>
              <ul className="space-y-2">
                {sampleCueCard.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                    <ChevronRight className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Phase-specific content */}
            {phase === "intro" && (
              <button onClick={handleStart} className="btn-mercury w-full h-14 rounded-xl">
                Begin Preparation (60s)
              </button>
            )}

            {phase === "prep" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-border">
                  <div className="hud-label mb-3">Strategic Tips</div>
                  <ul className="space-y-2">
                    {sampleCueCard.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-foreground">{i + 1}.</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Recording will begin automatically when prep time ends
                </div>
              </div>
            )}

            {phase === "delivery" && (
              <div className="space-y-6">
                {/* Waveform */}
                <div className="h-24 rounded-xl bg-white/5 border border-border flex items-center justify-center">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-foreground rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 40 + 10}px`,
                          animationDelay: `${i * 0.05}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Transcription */}
                <div className="p-4 rounded-xl bg-white/5 border border-border h-32 overflow-y-auto">
                  <div className="hud-label mb-2">Live Transcription</div>
                  <p className="text-sm text-muted-foreground font-mono">
                    {transcript || "Listening..."}
                  </p>
                </div>

                <button
                  onClick={handleStop}
                  className="w-full h-14 rounded-xl bg-red-500 text-white font-bold uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2"
                >
                  <MicOff className="w-5 h-5" />
                  End Recording
                </button>
              </div>
            )}

            {phase === "analysis" && (
              <button onClick={handleReset} className="btn-mercury w-full h-14 rounded-xl flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Try Another Topic
              </button>
            )}
          </div>
        </div>

        {/* Analysis Panel */}
        <div className="lg:col-span-5">
          <div className="chrome-card-static rounded-2xl p-6 sticky top-8">
            <h3 className="font-heading font-bold mb-6">
              {phase === "analysis" ? "Diagnostic Analysis" : "IELTS Criteria"}
            </h3>

            {phase === "analysis" ? (
              <div className="space-y-6">
                <StreamBar label="Fluency & Coherence" value="7.0" percentage={78} />
                <StreamBar label="Lexical Resource" value="7.5" percentage={83} delay="-0.3s" />
                <StreamBar label="Grammar Range" value="7.0" percentage={78} delay="-0.6s" />
                <StreamBar label="Pronunciation" value="7.5" percentage={83} delay="-0.9s" />

                <div className="pt-6 border-t border-border">
                  <div className="flex justify-between items-center mb-4">
                    <span className="hud-label">Overall Band</span>
                    <span className="text-4xl font-light text-foreground">7.5</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-border">
                  <div className="hud-label mb-2">Optimized Response</div>
                  <p className="text-sm text-muted-foreground">
                    AI-generated high-band version of your response will appear here after analysis.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-border">
                  <span className="block font-heading text-sm font-bold mb-2">Fluency & Coherence</span>
                  <span className="text-xs text-muted-foreground">
                    Speak at length without noticeable effort. Use cohesive devices naturally.
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-border">
                  <span className="block font-heading text-sm font-bold mb-2">Lexical Resource</span>
                  <span className="text-xs text-muted-foreground">
                    Use a wide vocabulary range with flexibility. Use less common words naturally.
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-border">
                  <span className="block font-heading text-sm font-bold mb-2">Grammar Range</span>
                  <span className="text-xs text-muted-foreground">
                    Use a variety of complex structures. Maintain consistent accuracy.
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-border">
                  <span className="block font-heading text-sm font-bold mb-2">Pronunciation</span>
                  <span className="text-xs text-muted-foreground">
                    Use connected speech features. Maintain clear, accurate pronunciation.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CueCard;
