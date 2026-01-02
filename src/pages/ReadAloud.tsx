import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mic, MicOff, Volume2, RefreshCw, CheckCircle2 } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { StreamBar } from "@/components/StreamBar";
import { useSessionManager } from "@/hooks/useSessionManager";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const ReadAloud = () => {
  const { user } = useAuth();
  const { analyzeTranscript, saveSession, generatePersonalizedContent, isAnalyzing } = useSessionManager();
  
  const [phase, setPhase] = useState<"ready" | "recording" | "analyzing" | "results">("ready");
  const [passage, setPassage] = useState({
    text: "The phenomenon of climate change represents one of the most significant challenges facing humanity in the twenty-first century. Scientists have documented rising global temperatures, shifting weather patterns, and increasingly frequent extreme weather events. These changes threaten ecosystems, agricultural systems, and human communities worldwide.",
    difficult_words: ["phenomenon", "significant", "documented", "temperatures", "ecosystems"],
    phonetic_focus: ["th sounds", "word stress", "connected speech"]
  });
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== 'no-speech') {
          toast.error("Speech recognition error. Please try again.");
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleStartRecording = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }
    
    setTranscript("");
    setIsRecording(true);
    setPhase("recording");
    recognitionRef.current.start();
  };

  const handleStopRecording = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setPhase("analyzing");

    // Analyze the transcript
    const result = await analyzeTranscript(transcript, "read_aloud", passage.text);
    
    if (result) {
      setAnalysis(result);
      setPhase("results");
      
      // Save session if logged in
      if (user) {
        await saveSession({
          session_type: "read_aloud",
          topic: "Phonetic Drill",
          transcript,
          pronunciation_score: result.pronunciation_score,
          strengths: result.strengths,
          weaknesses: result.weaknesses,
          ai_feedback: result.ai_feedback,
          duration_seconds: 60
        });
      }
    } else {
      setPhase("ready");
    }
  };

  const handleNewPassage = async () => {
    setIsGenerating(true);
    const content = await generatePersonalizedContent("read_aloud", undefined, 7);
    if (content) {
      setPassage(content);
    }
    setIsGenerating(false);
  };

  const handleReset = () => {
    setPhase("ready");
    setTranscript("");
    setAnalysis(null);
  };

  // Highlight mispronounced words in the passage
  const renderPassageWithHighlights = () => {
    if (!analysis?.mispronounced_words) return passage.text;
    
    const mispronounced = analysis.mispronounced_words.map((w: any) => w.word.toLowerCase());
    const words = passage.text.split(" ");
    
    return words.map((word, i) => {
      const cleanWord = word.replace(/[.,!?]/g, "").toLowerCase();
      const isMispronounced = mispronounced.includes(cleanWord);
      
      return (
        <span key={i} className={isMispronounced ? "text-red-400 underline underline-offset-4" : ""}>
          {word}{" "}
        </span>
      );
    });
  };

  return (
    <main className="max-w-5xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
      <Link
        to="/practice"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-mono text-[10px] uppercase tracking-widest">Back to Protocols</span>
      </Link>

      <div className="mb-12">
        <StatusBadge label={phase === "results" ? "Analysis Complete" : phase === "recording" ? "Recording" : "Ready"} />
        
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-heading font-bold tracking-tighter leading-[0.9] text-foreground mt-8 mb-4">
          PHONETIC<br />
          <span className="text-mercury">DRILL.</span>
        </h1>
        
        <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
          Read the passage aloud. The AI will analyze your pronunciation and identify areas for improvement.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <div className="chrome-card-static rounded-2xl p-6 md:p-8">
            {/* Passage */}
            <div className="p-6 rounded-xl bg-white/5 border border-border mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="hud-label">Reading Passage</div>
                <button
                  onClick={handleNewPassage}
                  disabled={isGenerating || phase === "recording"}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
                  <span className="font-mono text-[9px] uppercase">New Passage</span>
                </button>
              </div>
              <p className="text-lg leading-relaxed">
                {phase === "results" ? renderPassageWithHighlights() : passage.text}
              </p>
            </div>

            {/* Difficult Words */}
            <div className="flex flex-wrap gap-2 mb-6">
              {passage.difficult_words.map((word, i) => (
                <span key={i} className="px-3 py-1 bg-white/5 border border-border rounded-full font-mono text-xs">
                  {word}
                </span>
              ))}
            </div>

            {/* Phonetic Focus */}
            <div className="flex items-center gap-2 mb-8">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-[9px] uppercase text-muted-foreground">
                Focus: {passage.phonetic_focus.join(" • ")}
              </span>
            </div>

            {/* Controls */}
            {phase === "ready" && (
              <button onClick={handleStartRecording} className="btn-mercury w-full h-14 rounded-xl flex items-center justify-center gap-3">
                <Mic className="w-5 h-5" />
                Start Reading
              </button>
            )}

            {phase === "recording" && (
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

                <div className="p-4 rounded-xl bg-white/5 border border-border">
                  <div className="hud-label mb-2">Live Transcription</div>
                  <p className="text-sm text-muted-foreground font-mono min-h-[60px]">
                    {transcript || "Listening..."}
                  </p>
                </div>

                <button
                  onClick={handleStopRecording}
                  className="w-full h-14 rounded-xl bg-red-500 text-white font-bold uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2"
                >
                  <MicOff className="w-5 h-5" />
                  Stop Recording
                </button>
              </div>
            )}

            {phase === "analyzing" && (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Analyzing pronunciation...</p>
              </div>
            )}

            {phase === "results" && (
              <button onClick={handleReset} className="btn-mercury w-full h-14 rounded-xl flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            )}
          </div>
        </div>

        {/* Analysis Panel */}
        <div className="lg:col-span-5">
          <div className="chrome-card-static rounded-2xl p-6 sticky top-8">
            <h3 className="font-heading font-bold mb-6">
              {phase === "results" ? "Pronunciation Analysis" : "Accuracy Metrics"}
            </h3>

            {phase === "results" && analysis ? (
              <div className="space-y-6">
                <div className="text-center py-6">
                  <div className="text-6xl font-light text-foreground mb-2">
                    {analysis.accuracy_percentage || 85}%
                  </div>
                  <div className="hud-label">Accuracy Score</div>
                </div>

                <StreamBar 
                  label="Pronunciation" 
                  value={analysis.pronunciation_score?.toString() || "7.0"} 
                  percentage={(analysis.pronunciation_score || 7) * 11} 
                />

                {analysis.mispronounced_words && analysis.mispronounced_words.length > 0 && (
                  <div className="p-4 rounded-xl bg-white/5 border border-border">
                    <div className="hud-label mb-3">Words to Practice</div>
                    <div className="space-y-2">
                      {analysis.mispronounced_words.slice(0, 5).map((w: any, i: number) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-red-400">{w.word}</span>
                          <span className="text-muted-foreground text-xs">{w.correction}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-white/5 border border-border">
                  <div className="hud-label mb-2">Feedback</div>
                  <p className="text-sm text-muted-foreground">
                    {analysis.ai_feedback || "Good effort! Focus on the highlighted words for improvement."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                    <span className="font-heading text-sm font-bold">Clear Articulation</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Pronounce each word distinctly</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                    <span className="font-heading text-sm font-bold">Natural Pace</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Read at a comfortable, steady speed</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                    <span className="font-heading text-sm font-bold">Intonation</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Use appropriate stress and rhythm</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ReadAloud;
