import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Mic, MicOff, RotateCcw, ChevronRight, AlertCircle } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { StreamBar } from "@/components/StreamBar";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSessionManager } from "@/hooks/useSessionManager";
import { useAuth } from "@/hooks/useAuth";
import { useApiKey } from "@/hooks/useApiKey";
import { toast } from "sonner";

type Phase = "intro" | "prep" | "delivery" | "analysis";

interface AnalysisResult {
  fluencyScore: number;
  lexicalScore: number;
  grammarScore: number;
  pronunciationScore: number;
  overallBand: number;
  feedback: string;
  optimizedResponse: string;
  strengths: string[];
  weaknesses: string[];
}

const sampleCueCards = [
  {
    topic: "Describe a skill you would like to learn",
    points: [
      "What the skill is",
      "Why you want to learn it",
      "How you would learn it",
      "And explain why this skill would be useful to you",
    ],
  },
  {
    topic: "Describe a memorable journey you have taken",
    points: [
      "Where you went",
      "How you traveled",
      "Who you were with",
      "And explain what made the journey memorable",
    ],
  },
  {
    topic: "Describe a person who has influenced you",
    points: [
      "Who this person is",
      "How you know them",
      "What they did that influenced you",
      "And explain how this influence has affected your life",
    ],
  },
  {
    topic: "Describe a book that has had a significant impact on you",
    points: [
      "What the book is about",
      "When you read it",
      "Why you chose to read it",
      "And explain how it impacted you",
    ],
  },
];

const tips = [
  "Structure your answer with clear transitions",
  "Use specific examples from your life",
  "Vary your vocabulary and sentence structures",
  "Aim to speak for the full 2 minutes",
];

const CueCard = () => {
  const { user } = useAuth();
  const { hasApiKey } = useApiKey();
  const { analyzeTranscript, saveSession, isAnalyzing } = useSessionManager();
  
  const [phase, setPhase] = useState<Phase>("intro");
  const [prepTime, setPrepTime] = useState(60);
  const [deliveryTime, setDeliveryTime] = useState(120);
  const [currentCueCard, setCurrentCueCard] = useState(sampleCueCards[0]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error: speechError,
  } = useSpeechRecognition();

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (phase === "prep" && prepTime > 0) {
      interval = setInterval(() => {
        setPrepTime((t) => t - 1);
      }, 1000);
    } else if (phase === "prep" && prepTime === 0) {
      setPhase("delivery");
      startListening();
    }

    if (phase === "delivery" && deliveryTime > 0 && isListening) {
      interval = setInterval(() => {
        setDeliveryTime((t) => t - 1);
      }, 1000);
    } else if (phase === "delivery" && deliveryTime === 0) {
      handleStopRecording();
    }

    return () => clearInterval(interval);
  }, [phase, prepTime, deliveryTime, isListening]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setPhase("prep");
  };

  const handleStopRecording = async () => {
    stopListening();
    setPhase("analysis");

    if (!transcript.trim()) {
      toast.error("No speech detected. Please try again.");
      return;
    }

    if (!user) {
      toast.info("Sign in to get AI analysis of your response");
      return;
    }

    if (!hasApiKey) {
      toast.info("Add your API key in settings to get AI analysis");
      return;
    }

    try {
      const result = await analyzeTranscript(transcript, "cue-card", currentCueCard.topic);
      
      if (result) {
        setAnalysisResult({
          fluencyScore: result.fluency_score,
          lexicalScore: result.lexical_score,
          grammarScore: result.grammar_score,
          pronunciationScore: result.pronunciation_score,
          overallBand: result.overall_band,
          feedback: result.ai_feedback || '',
          optimizedResponse: result.optimized_response || '',
          strengths: result.strengths || [],
          weaknesses: result.weaknesses || [],
        });

        // Save session
        await saveSession({
          session_type: "cue-card",
          topic: currentCueCard.topic,
          transcript,
          duration_seconds: 120 - deliveryTime,
          overall_band: result.overall_band,
          fluency_score: result.fluency_score,
          lexical_score: result.lexical_score,
          grammar_score: result.grammar_score,
          pronunciation_score: result.pronunciation_score,
          ai_feedback: result.ai_feedback,
          optimized_response: result.optimized_response,
          strengths: result.strengths,
          weaknesses: result.weaknesses,
          vocabulary_learned: result.vocabulary_learned || [],
        });

        toast.success("Session saved successfully!");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze response");
    }
  };

  const handleReset = () => {
    // Get a random cue card
    const randomIndex = Math.floor(Math.random() * sampleCueCards.length);
    setCurrentCueCard(sampleCueCards[randomIndex]);
    
    setPhase("intro");
    setPrepTime(60);
    setDeliveryTime(120);
    resetTranscript();
    setAnalysisResult(null);
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
              : isAnalyzing
              ? "Analyzing..."
              : "Analysis Complete"
          }
        />
        
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-heading font-bold tracking-tighter leading-[0.9] text-foreground mt-8 mb-4">
          CUE CARD<br />
          <span className="text-mercury">PROTOCOL.</span>
        </h1>
      </div>

      {/* Browser Support Warning */}
      {!isSupported && (
        <div className="chrome-card-static rounded-xl p-4 mb-8 flex items-center gap-3 border-destructive">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-sm text-muted-foreground">
            Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.
          </p>
        </div>
      )}

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
              <h3 className="font-heading text-lg font-bold mb-4">{currentCueCard.topic}</h3>
              <p className="text-sm text-muted-foreground mb-4">You should say:</p>
              <ul className="space-y-2">
                {currentCueCard.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                    <ChevronRight className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Phase-specific content */}
            {phase === "intro" && (
              <button 
                onClick={handleStart} 
                disabled={!isSupported}
                className="btn-mercury w-full h-14 rounded-xl disabled:opacity-50"
              >
                Begin Preparation (60s)
              </button>
            )}

            {phase === "prep" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-border">
                  <div className="hud-label mb-3">Strategic Tips</div>
                  <ul className="space-y-2">
                    {tips.map((tip, i) => (
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
                          height: `${isListening ? Math.random() * 40 + 10 : 10}px`,
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

                {speechError && (
                  <div className="text-sm text-destructive text-center">
                    Error: {speechError}
                  </div>
                )}

                <button
                  onClick={handleStopRecording}
                  className="w-full h-14 rounded-xl bg-destructive text-destructive-foreground font-bold uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2"
                >
                  <MicOff className="w-5 h-5" />
                  End Recording
                </button>
              </div>
            )}

            {phase === "analysis" && (
              <div className="space-y-4">
                {isAnalyzing && (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Analyzing your response...</p>
                  </div>
                )}
                
                {transcript && (
                  <div className="p-4 rounded-xl bg-white/5 border border-border max-h-40 overflow-y-auto">
                    <div className="hud-label mb-2">Your Response</div>
                    <p className="text-sm text-muted-foreground">{transcript}</p>
                  </div>
                )}

                <button onClick={handleReset} className="btn-mercury w-full h-14 rounded-xl flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Try Another Topic
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Panel */}
        <div className="lg:col-span-5">
          <div className="chrome-card-static rounded-2xl p-6 sticky top-8">
            <h3 className="font-heading font-bold mb-6">
              {phase === "analysis" ? "Diagnostic Analysis" : "IELTS Criteria"}
            </h3>

            {phase === "analysis" && analysisResult ? (
              <div className="space-y-6">
                <StreamBar label="Fluency & Coherence" value={analysisResult.fluencyScore.toFixed(1)} percentage={(analysisResult.fluencyScore / 9) * 100} />
                <StreamBar label="Lexical Resource" value={analysisResult.lexicalScore.toFixed(1)} percentage={(analysisResult.lexicalScore / 9) * 100} delay="-0.3s" />
                <StreamBar label="Grammar Range" value={analysisResult.grammarScore.toFixed(1)} percentage={(analysisResult.grammarScore / 9) * 100} delay="-0.6s" />
                <StreamBar label="Pronunciation" value={analysisResult.pronunciationScore.toFixed(1)} percentage={(analysisResult.pronunciationScore / 9) * 100} delay="-0.9s" />

                <div className="pt-6 border-t border-border">
                  <div className="flex justify-between items-center mb-4">
                    <span className="hud-label">Overall Band</span>
                    <span className="text-4xl font-light text-foreground">{analysisResult.overallBand.toFixed(1)}</span>
                  </div>
                </div>

                {analysisResult.feedback && (
                  <div className="p-4 rounded-xl bg-white/5 border border-border">
                    <div className="hud-label mb-2">AI Feedback</div>
                    <p className="text-sm text-muted-foreground">
                      {analysisResult.feedback}
                    </p>
                  </div>
                )}

                {analysisResult.optimizedResponse && (
                  <div className="p-4 rounded-xl bg-white/5 border border-border">
                    <div className="hud-label mb-2">Optimized Response</div>
                    <p className="text-sm text-muted-foreground">
                      {analysisResult.optimizedResponse}
                    </p>
                  </div>
                )}
              </div>
            ) : phase === "analysis" && !analysisResult && !isAnalyzing ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-border text-center">
                  <p className="text-sm text-muted-foreground">
                    {!user ? "Sign in to get AI analysis" : !hasApiKey ? "Add API key for AI analysis" : "No analysis available"}
                  </p>
                </div>
                <StreamBar label="Fluency & Coherence" value="--" percentage={0} />
                <StreamBar label="Lexical Resource" value="--" percentage={0} delay="-0.3s" />
                <StreamBar label="Grammar Range" value="--" percentage={0} delay="-0.6s" />
                <StreamBar label="Pronunciation" value="--" percentage={0} delay="-0.9s" />
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
