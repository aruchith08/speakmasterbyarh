import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Mic, MicOff, RefreshCw, Volume2 } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { StreamBar } from "@/components/StreamBar";
import { toast } from "sonner";

interface Sentence {
  text: string;
  emphasis: string[];
  pattern: string;
}

const Intonation = () => {
  const [sentences] = useState<Sentence[]>([
    { text: "I didn't say she stole my money.", emphasis: ["didn't"], pattern: "falling" },
    { text: "Would you like to come with us?", emphasis: ["like", "us"], pattern: "rising" },
    { text: "That's absolutely incredible!", emphasis: ["absolutely", "incredible"], pattern: "fall-rise" },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<"listen" | "record" | "compare">("listen");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [mirrorScore, setMirrorScore] = useState<number | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        calculateMirrorScore();
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const playModel = () => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(sentences[currentIndex].text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onend = () => {
        setIsPlaying(false);
        setPhase("record");
      };
      synthRef.current = utterance;
      speechSynthesis.speak(utterance);
    } else {
      toast.error("Text-to-speech not supported in this browser");
    }
  };

  const startRecording = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition not supported");
      return;
    }
    setTranscript("");
    setIsRecording(true);
    recognitionRef.current.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const calculateMirrorScore = () => {
    // Simple comparison - in production this would use actual audio analysis
    const original = sentences[currentIndex].text.toLowerCase().replace(/[.,!?]/g, "");
    const spoken = transcript.toLowerCase().replace(/[.,!?]/g, "");
    
    const originalWords = original.split(" ");
    const spokenWords = spoken.split(" ");
    
    let matches = 0;
    originalWords.forEach((word, i) => {
      if (spokenWords[i] === word) matches++;
    });
    
    const score = Math.round((matches / originalWords.length) * 100);
    setMirrorScore(score);
    setPhase("compare");
  };

  const nextSentence = () => {
    setCurrentIndex((prev) => (prev + 1) % sentences.length);
    setPhase("listen");
    setTranscript("");
    setMirrorScore(null);
  };

  const renderSentenceWithEmphasis = () => {
    const words = sentences[currentIndex].text.split(" ");
    return words.map((word, i) => {
      const cleanWord = word.replace(/[.,!?]/g, "");
      const isEmphasis = sentences[currentIndex].emphasis.includes(cleanWord);
      return (
        <span key={i} className={isEmphasis ? "text-foreground font-bold underline underline-offset-4" : "text-muted-foreground"}>
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
        <StatusBadge label={`Pattern: ${sentences[currentIndex].pattern}`} />
        
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-heading font-bold tracking-tighter leading-[0.9] text-foreground mt-8 mb-4">
          INTONATION<br />
          <span className="text-mercury">MIRROR.</span>
        </h1>
        
        <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
          Listen to model sentences and replicate the pitch and rhythm. Receive a Mirror Score based on prosodic accuracy.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <div className="chrome-card-static rounded-2xl p-6 md:p-8">
            {/* Progress */}
            <div className="flex items-center gap-4 mb-8">
              {sentences.map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1 rounded-full ${
                    i === currentIndex ? "bg-foreground" : i < currentIndex ? "bg-green-400" : "bg-white/20"
                  }`}
                />
              ))}
            </div>

            {/* Sentence Display */}
            <div className="p-6 rounded-xl bg-white/5 border border-border mb-6 text-center">
              <p className="text-2xl leading-relaxed">
                {renderSentenceWithEmphasis()}
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-[9px] uppercase text-muted-foreground">
                  Emphasis on underlined words
                </span>
              </div>
            </div>

            {/* Phase-specific controls */}
            {phase === "listen" && (
              <button
                onClick={playModel}
                disabled={isPlaying}
                className="btn-mercury w-full h-14 rounded-xl flex items-center justify-center gap-3"
              >
                <Play className={`w-5 h-5 ${isPlaying ? "animate-pulse" : ""}`} />
                {isPlaying ? "Playing..." : "Listen to Model"}
              </button>
            )}

            {phase === "record" && (
              <div className="space-y-4">
                <p className="text-center text-muted-foreground text-sm mb-4">
                  Now repeat the sentence with the same intonation
                </p>

                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    className="btn-mercury w-full h-14 rounded-xl flex items-center justify-center gap-3"
                  >
                    <Mic className="w-5 h-5" />
                    Start Recording
                  </button>
                ) : (
                  <>
                    <div className="h-20 rounded-xl bg-white/5 border border-border flex items-center justify-center">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-foreground rounded-full animate-pulse"
                            style={{
                              height: `${Math.random() * 35 + 10}px`,
                              animationDelay: `${i * 0.05}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={stopRecording}
                      className="w-full h-14 rounded-xl bg-red-500 text-white font-bold uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2"
                    >
                      <MicOff className="w-5 h-5" />
                      Stop Recording
                    </button>
                  </>
                )}
              </div>
            )}

            {phase === "compare" && (
              <div className="space-y-6">
                <div className="text-center py-6">
                  <div className="text-6xl font-light text-foreground mb-2">
                    {mirrorScore}%
                  </div>
                  <div className="hud-label">Mirror Score</div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-border">
                  <div className="hud-label mb-2">Your Recording</div>
                  <p className="text-sm text-muted-foreground">
                    "{transcript || "No transcript captured"}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPhase("listen")}
                    className="h-12 rounded-xl bg-white/10 border border-border text-foreground font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                  <button
                    onClick={nextSentence}
                    className="h-12 rounded-xl bg-foreground text-background font-mono text-xs uppercase tracking-widest"
                  >
                    Next Sentence
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips Panel */}
        <div className="lg:col-span-5">
          <div className="chrome-card-static rounded-2xl p-6 sticky top-8">
            <h3 className="font-heading font-bold mb-6">Intonation Tips</h3>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-border">
                <span className="block font-heading text-sm font-bold mb-2">Rising Pattern ↗</span>
                <p className="text-xs text-muted-foreground">
                  Used for yes/no questions. Pitch rises at the end.
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-white/5 border border-border">
                <span className="block font-heading text-sm font-bold mb-2">Falling Pattern ↘</span>
                <p className="text-xs text-muted-foreground">
                  Used for statements and WH-questions. Pitch falls at the end.
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-white/5 border border-border">
                <span className="block font-heading text-sm font-bold mb-2">Fall-Rise Pattern ↘↗</span>
                <p className="text-xs text-muted-foreground">
                  Shows surprise, doubt, or encouragement. Complex emotional expression.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-border">
                <p className="text-sm text-center text-muted-foreground">
                  Focus on matching the <span className="text-foreground">emphasized words</span> and the overall pattern
                </p>
              </div>
            </div>

            {mirrorScore !== null && (
              <div className="mt-6 pt-6 border-t border-border">
                <StreamBar 
                  label="Prosodic Accuracy" 
                  value={`${mirrorScore}%`} 
                  percentage={mirrorScore} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Intonation;
