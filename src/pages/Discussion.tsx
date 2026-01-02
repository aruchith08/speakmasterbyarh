import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mic, MicOff, MessageSquare, RefreshCw, Sparkles, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { StreamBar } from "@/components/StreamBar";
import { useSessionManager } from "@/hooks/useSessionManager";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Question {
  question: string;
  complexity: string;
  hint: string;
}

const Discussion = () => {
  const { user } = useAuth();
  const { analyzeTranscript, saveSession, generatePersonalizedContent, isAnalyzing } = useSessionManager();
  
  const [phase, setPhase] = useState<"ready" | "discussing" | "analyzing" | "results">("ready");
  const [questions, setQuestions] = useState<Question[]>([
    { question: "How has technology changed the way people communicate in your country?", complexity: "moderate", hint: "Consider both positive and negative aspects" },
    { question: "Do you think traditional forms of communication will disappear in the future?", complexity: "high", hint: "Discuss the balance between old and new methods" },
    { question: "What responsibilities do social media companies have towards their users?", complexity: "very high", hint: "Consider privacy, mental health, and misinformation" }
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [allResponses, setAllResponses] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState("technology and communication");
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
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

  const handleStartDiscussion = () => {
    setPhase("discussing");
    setCurrentQuestionIndex(0);
    setAllResponses([]);
    setTranscript("");
  };

  const handleStartRecording = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }
    
    setTranscript("");
    setIsRecording(true);
    recognitionRef.current.start();
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleNextQuestion = () => {
    const newResponses = [...allResponses, transcript];
    setAllResponses(newResponses);
    setTranscript("");
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // All questions answered, analyze
      handleAnalyze(newResponses);
    }
  };

  const handleAnalyze = async (responses: string[]) => {
    setPhase("analyzing");
    
    const fullTranscript = responses.map((r, i) => 
      `Q${i + 1}: ${questions[i].question}\nA: ${r}`
    ).join("\n\n");

    const result = await analyzeTranscript(fullTranscript, "discussion", topic);
    
    if (result) {
      setAnalysis(result);
      setPhase("results");
      
      if (user) {
        await saveSession({
          session_type: "discussion",
          topic,
          transcript: fullTranscript,
          fluency_score: result.fluency_score,
          lexical_score: result.lexical_score,
          grammar_score: result.grammar_score,
          pronunciation_score: result.pronunciation_score,
          overall_band: result.overall_band,
          strengths: result.strengths,
          weaknesses: result.weaknesses,
          ai_feedback: result.ai_feedback,
          optimized_response: result.optimized_response,
          vocabulary_learned: result.vocabulary_learned,
          duration_seconds: 180
        });
      }
    } else {
      setPhase("ready");
    }
  };

  const handleNewTopic = async () => {
    setIsGenerating(true);
    const content = await generatePersonalizedContent("discussion", topic, 7);
    if (content?.questions) {
      setQuestions(content.questions);
    }
    setIsGenerating(false);
  };

  const handleReset = () => {
    setPhase("ready");
    setTranscript("");
    setAllResponses([]);
    setCurrentQuestionIndex(0);
    setAnalysis(null);
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
        <StatusBadge label={phase === "results" ? "Analysis Complete" : phase === "discussing" ? `Question ${currentQuestionIndex + 1}/${questions.length}` : "Ready"} />
        
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-heading font-bold tracking-tighter leading-[0.9] text-foreground mt-8 mb-4">
          ABSTRACT<br />
          <span className="text-mercury">CORE.</span>
        </h1>
        
        <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
          Part 3 discussion practice. Answer abstract questions to develop sophisticated reasoning and academic vocabulary.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <div className="chrome-card-static rounded-2xl p-6 md:p-8">
            {phase === "ready" && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="hud-label">Topic Selection</div>
                  <button
                    onClick={handleNewTopic}
                    disabled={isGenerating}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
                    <span className="font-mono text-[9px] uppercase">Generate Questions</span>
                  </button>
                </div>

                <div className="mb-6">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic (e.g., education, environment, technology)"
                    className="w-full h-12 px-4 bg-white/5 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50"
                  />
                </div>

                <div className="space-y-4 mb-8">
                  {questions.map((q, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-border">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-mono text-xs">{i + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground mb-2">{q.question}</p>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-mono ${
                              q.complexity === "very high" ? "bg-red-500/20 text-red-400" :
                              q.complexity === "high" ? "bg-yellow-500/20 text-yellow-400" :
                              "bg-green-500/20 text-green-400"
                            }`}>
                              {q.complexity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={handleStartDiscussion} className="btn-mercury w-full h-14 rounded-xl flex items-center justify-center gap-3">
                  <MessageSquare className="w-5 h-5" />
                  Begin Discussion
                </button>
              </>
            )}

            {phase === "discussing" && (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    {questions.map((_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          i < currentQuestionIndex ? "bg-green-400" :
                          i === currentQuestionIndex ? "bg-foreground" :
                          "bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-border mb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <MessageSquare className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-lg text-foreground">{questions[currentQuestionIndex].question}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        <span className="text-foreground">Hint:</span> {questions[currentQuestionIndex].hint}
                      </p>
                    </div>
                  </div>
                </div>

                {!isRecording ? (
                  <button
                    onClick={handleStartRecording}
                    className="btn-mercury w-full h-14 rounded-xl flex items-center justify-center gap-3 mb-4"
                  >
                    <Mic className="w-5 h-5" />
                    Start Speaking
                  </button>
                ) : (
                  <>
                    <div className="h-20 rounded-xl bg-white/5 border border-border flex items-center justify-center mb-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 25 }).map((_, i) => (
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

                    <div className="p-4 rounded-xl bg-white/5 border border-border mb-4">
                      <div className="hud-label mb-2">Your Response</div>
                      <p className="text-sm text-muted-foreground font-mono min-h-[60px]">
                        {transcript || "Listening..."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={handleStopRecording}
                        className="h-12 rounded-xl bg-white/10 border border-border text-foreground font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <MicOff className="w-4 h-4" />
                        Stop
                      </button>
                      <button
                        onClick={() => {
                          handleStopRecording();
                          setTimeout(handleNextQuestion, 100);
                        }}
                        disabled={!transcript}
                        className="h-12 rounded-xl bg-foreground text-background font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            {phase === "analyzing" && (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Evaluating reasoning depth...</p>
              </div>
            )}

            {phase === "results" && (
              <button onClick={handleReset} className="btn-mercury w-full h-14 rounded-xl flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" />
                New Discussion
              </button>
            )}
          </div>
        </div>

        {/* Analysis Panel */}
        <div className="lg:col-span-5">
          <div className="chrome-card-static rounded-2xl p-6 sticky top-8">
            <h3 className="font-heading font-bold mb-6">
              {phase === "results" ? "Reasoning Analysis" : "Discussion Tips"}
            </h3>

            {phase === "results" && analysis ? (
              <div className="space-y-6">
                <StreamBar label="Fluency" value={analysis.fluency_score?.toString() || "7.0"} percentage={(analysis.fluency_score || 7) * 11} />
                <StreamBar label="Lexical Resource" value={analysis.lexical_score?.toString() || "7.0"} percentage={(analysis.lexical_score || 7) * 11} delay="-0.3s" />
                <StreamBar label="Grammar" value={analysis.grammar_score?.toString() || "7.0"} percentage={(analysis.grammar_score || 7) * 11} delay="-0.6s" />
                <StreamBar label="Pronunciation" value={analysis.pronunciation_score?.toString() || "7.0"} percentage={(analysis.pronunciation_score || 7) * 11} delay="-0.9s" />

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center mb-4">
                    <span className="hud-label">Overall Band</span>
                    <span className="text-4xl font-light text-foreground">{analysis.overall_band || 7.0}</span>
                  </div>
                </div>

                {analysis.vocabulary_learned && (
                  <div className="p-4 rounded-xl bg-white/5 border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-muted-foreground" />
                      <span className="hud-label">Vocabulary Boosters</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.vocabulary_learned.slice(0, 5).map((word: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs">{word}</span>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.optimized_response && (
                  <div className="p-4 rounded-xl bg-white/5 border border-border">
                    <div className="hud-label mb-2">Elevated Response</div>
                    <p className="text-sm text-muted-foreground">
                      {analysis.optimized_response.slice(0, 300)}...
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-border">
                  <span className="block font-heading text-sm font-bold mb-2">Develop Your Ideas</span>
                  <p className="text-xs text-muted-foreground">
                    Expand on your points with examples and reasoning
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-border">
                  <span className="block font-heading text-sm font-bold mb-2">Use Academic Language</span>
                  <p className="text-xs text-muted-foreground">
                    Employ sophisticated vocabulary and complex structures
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-border">
                  <span className="block font-heading text-sm font-bold mb-2">Consider Multiple Perspectives</span>
                  <p className="text-xs text-muted-foreground">
                    Show balanced thinking by acknowledging different viewpoints
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Discussion;
