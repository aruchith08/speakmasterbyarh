import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mic, MicOff, RefreshCw, Loader2, Volume2, VolumeX, CheckCircle2, Award } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { toast } from "sonner";
import { useSessionManager } from "@/hooks/useSessionManager";
import { useApiKey } from "@/hooks/useApiKey";

interface PhonemeCategory {
  id: string;
  name: string;
  description: string;
  phonemes: { symbol: string; example: string; sound: string }[];
}

const phonemeCategories: PhonemeCategory[] = [
  {
    id: "consonants_voiced",
    name: "Voiced Consonants",
    description: "Sounds made with vocal cord vibration",
    phonemes: [
      { symbol: "/b/", example: "boy", sound: "b" },
      { symbol: "/d/", example: "dog", sound: "d" },
      { symbol: "/g/", example: "go", sound: "g" },
      { symbol: "/v/", example: "very", sound: "v" },
      { symbol: "/z/", example: "zoo", sound: "z" },
      { symbol: "/ʒ/", example: "vision", sound: "zh" },
    ]
  },
  {
    id: "consonants_voiceless",
    name: "Voiceless Consonants",
    description: "Sounds made without vocal cord vibration",
    phonemes: [
      { symbol: "/p/", example: "pen", sound: "p" },
      { symbol: "/t/", example: "top", sound: "t" },
      { symbol: "/k/", example: "cat", sound: "k" },
      { symbol: "/f/", example: "fun", sound: "f" },
      { symbol: "/s/", example: "sun", sound: "s" },
      { symbol: "/ʃ/", example: "ship", sound: "sh" },
    ]
  },
  {
    id: "th_sounds",
    name: "TH Sounds",
    description: "Challenging dental fricatives",
    phonemes: [
      { symbol: "/θ/", example: "think", sound: "th (voiceless)" },
      { symbol: "/ð/", example: "this", sound: "th (voiced)" },
    ]
  },
  {
    id: "r_l_sounds",
    name: "R & L Sounds",
    description: "Liquid consonants - often challenging",
    phonemes: [
      { symbol: "/r/", example: "red", sound: "r" },
      { symbol: "/l/", example: "love", sound: "l" },
    ]
  },
  {
    id: "vowels_short",
    name: "Short Vowels",
    description: "Quick, sharp vowel sounds",
    phonemes: [
      { symbol: "/ɪ/", example: "sit", sound: "short i" },
      { symbol: "/e/", example: "bed", sound: "short e" },
      { symbol: "/æ/", example: "cat", sound: "short a" },
      { symbol: "/ʌ/", example: "cup", sound: "short u" },
      { symbol: "/ɒ/", example: "hot", sound: "short o" },
      { symbol: "/ʊ/", example: "put", sound: "short oo" },
    ]
  },
  {
    id: "vowels_long",
    name: "Long Vowels",
    description: "Extended vowel sounds",
    phonemes: [
      { symbol: "/iː/", example: "see", sound: "long ee" },
      { symbol: "/ɑː/", example: "car", sound: "long ah" },
      { symbol: "/ɔː/", example: "saw", sound: "long aw" },
      { symbol: "/uː/", example: "too", sound: "long oo" },
      { symbol: "/ɜː/", example: "bird", sound: "long er" },
    ]
  },
  {
    id: "diphthongs",
    name: "Diphthongs",
    description: "Gliding vowel sounds",
    phonemes: [
      { symbol: "/eɪ/", example: "say", sound: "ay" },
      { symbol: "/aɪ/", example: "my", sound: "eye" },
      { symbol: "/ɔɪ/", example: "boy", sound: "oy" },
      { symbol: "/aʊ/", example: "how", sound: "ow" },
      { symbol: "/əʊ/", example: "go", sound: "oh" },
    ]
  },
];

interface PracticeContent {
  phoneme: string;
  ipa_symbol: string;
  description: string;
  minimal_pairs: Array<{ word1: string; word2: string }>;
  practice_words: string[];
  practice_sentences: string[];
  common_mistakes: string[];
  tips: string[];
}

interface SessionScore {
  sentenceIndex: number;
  accuracy: number;
  feedback: string;
}

const Phonetics = () => {
  const [selectedCategory, setSelectedCategory] = useState<PhonemeCategory | null>(null);
  const [selectedPhoneme, setSelectedPhoneme] = useState<{ symbol: string; example: string; sound: string } | null>(null);
  const [practiceContent, setPracticeContent] = useState<PracticeContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const [sessionScores, setSessionScores] = useState<SessionScore[]>([]);
  const [showSessionComplete, setShowSessionComplete] = useState(false);
  const [isSavingSession, setIsSavingSession] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const { generatePersonalizedContent, analyzeTranscript, saveSession, isAnalyzing, hasApiKey } = useSessionManager();
  const { hasApiKey: apiKeyExists } = useApiKey();

  // Check for speech synthesis support
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  // Setup speech recognition
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
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          toast.error("Microphone access denied. Please allow microphone access in your browser settings.");
        } else if (event.error === 'no-speech') {
          toast.error("No speech detected. Please try again.");
        } else {
          toast.error("Speech recognition error. Please try again.");
        }
      };
    } else {
      setRecognitionSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping
        }
      }
    };
  }, []);

  const loadPracticeContent = async (phoneme: { symbol: string; example: string; sound: string }) => {
    setSelectedPhoneme(phoneme);
    setIsLoading(true);
    setPracticeContent(null);
    setAnalysis(null);
    setTranscript("");
    setCurrentSentenceIndex(0);
    setSessionScores([]);
    setShowSessionComplete(false);

    try {
      const content = await generatePersonalizedContent("phonetics", phoneme.sound);
      if (content) {
        setPracticeContent(content as PracticeContent);
        toast.success("Practice content loaded!");
      } else {
        toast.error("Failed to generate content. Please check your API key.");
      }
    } catch (error) {
      console.error("Error loading practice content:", error);
      toast.error("Failed to load practice content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string) => {
    if (!speechSupported) {
      toast.error("Text-to-speech not supported in your browser");
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7; // Slower for clearer pronunciation
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast.error("Error playing audio");
      };
      
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Speech synthesis error:", error);
      toast.error("Failed to play audio");
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const startRecording = () => {
    if (!recognitionSupported) {
      toast.error("Speech recognition not supported in your browser. Please use Chrome or Edge.");
      return;
    }
    
    if (!recognitionRef.current) {
      toast.error("Speech recognition not available");
      return;
    }

    setTranscript("");
    setAnalysis(null);
    setIsRecording(true);
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
      setIsRecording(false);
      toast.error("Failed to start recording. Please try again.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore errors
      }
    }
    setIsRecording(false);
  };

  const analyzeRecording = async () => {
    if (!transcript || !selectedPhoneme) return;

    const result = await analyzeTranscript(
      transcript,
      "phonetics",
      `Target phoneme: ${selectedPhoneme.symbol} (${selectedPhoneme.sound}). Target sentence: "${practiceContent?.practice_sentences[currentSentenceIndex]}"`
    );

    if (result) {
      setAnalysis(result);
      
      // Save score for this sentence
      const accuracy = result.accuracy_percentage || (result.pronunciation_score ? result.pronunciation_score * 10 : 0);
      setSessionScores(prev => [...prev, {
        sentenceIndex: currentSentenceIndex,
        accuracy,
        feedback: result.ai_feedback || ""
      }]);
    }
  };

  const nextSentence = () => {
    if (practiceContent && currentSentenceIndex < practiceContent.practice_sentences.length - 1) {
      setCurrentSentenceIndex(prev => prev + 1);
      setTranscript("");
      setAnalysis(null);
    } else {
      // All sentences completed - show session summary
      setShowSessionComplete(true);
    }
  };

  const completeSession = async () => {
    if (!selectedPhoneme || sessionScores.length === 0) return;

    setIsSavingSession(true);
    
    try {
      // Calculate average score
      const avgAccuracy = sessionScores.reduce((sum, s) => sum + s.accuracy, 0) / sessionScores.length;
      const pronunciationScore = avgAccuracy / 10; // Convert to 0-10 scale

      await saveSession({
        session_type: "phonetics",
        topic: `Phoneme: ${selectedPhoneme.symbol} (${selectedPhoneme.sound})`,
        transcript: sessionScores.map((s, i) => `Sentence ${i + 1}: ${s.accuracy}% - ${s.feedback}`).join("\n"),
        pronunciation_score: pronunciationScore,
        overall_band: pronunciationScore * 0.9, // Rough estimate
        fluency_score: pronunciationScore * 0.9,
        ai_feedback: `Practiced ${selectedPhoneme.symbol} sound with ${sessionScores.length} sentences. Average accuracy: ${avgAccuracy.toFixed(1)}%`,
        strengths: avgAccuracy >= 80 ? [`Good pronunciation of ${selectedPhoneme.sound} sound`] : [],
        weaknesses: avgAccuracy < 80 ? [`Continue practicing ${selectedPhoneme.sound} sound`] : [],
      });

      toast.success("Session saved successfully!");
    } catch (error) {
      console.error("Error saving session:", error);
      toast.error("Failed to save session");
    } finally {
      setIsSavingSession(false);
    }
  };

  const resetPractice = () => {
    setSelectedPhoneme(null);
    setPracticeContent(null);
    setAnalysis(null);
    setTranscript("");
    setCurrentSentenceIndex(0);
    setSessionScores([]);
    setShowSessionComplete(false);
    stopSpeaking();
  };

  const getOverallScore = () => {
    if (sessionScores.length === 0) return 0;
    return sessionScores.reduce((sum, s) => sum + s.accuracy, 0) / sessionScores.length;
  };

  if (!apiKeyExists) {
    return (
      <main className="max-w-5xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
        <Link
          to="/practice/drills"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono text-[10px] uppercase tracking-widest">Back to Drills</span>
        </Link>

        <div className="text-center py-20">
          <h2 className="text-2xl font-heading font-bold mb-4">API Key Required</h2>
          <p className="text-muted-foreground mb-6">
            Please add your Groq API key to use phonetics practice. Open settings using the gear icon in the top navigation.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
      <Link
        to="/practice/drills"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-mono text-[10px] uppercase tracking-widest">Back to Drills</span>
      </Link>

      <div className="mb-12">
        <StatusBadge label="Phonetics Drill" />
        
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-heading font-bold tracking-tighter leading-[0.9] text-foreground mt-8 mb-4">
          PHONETICS<br />
          <span className="text-mercury">PRACTICE.</span>
        </h1>
        
        <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
          Master individual sounds with targeted phoneme drills. Select a sound category and practice with AI-generated exercises.
        </p>

        {/* Browser compatibility warnings */}
        {(!speechSupported || !recognitionSupported) && (
          <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-400">
              {!recognitionSupported && "⚠️ Speech recognition not supported. Please use Chrome or Edge. "}
              {!speechSupported && "⚠️ Text-to-speech not supported in your browser."}
            </p>
          </div>
        )}
      </div>

      {/* Category Selection */}
      {!selectedCategory && !selectedPhoneme && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {phonemeCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className="group p-6 rounded-2xl border border-border bg-card/30 backdrop-blur-sm text-left transition-all duration-300 hover:border-mercury/50 hover:bg-card/50"
            >
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {category.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {category.phonemes.slice(0, 4).map((p) => (
                  <span key={p.symbol} className="px-2 py-1 text-xs font-mono bg-mercury/10 text-mercury rounded">
                    {p.symbol}
                  </span>
                ))}
                {category.phonemes.length > 4 && (
                  <span className="px-2 py-1 text-xs font-mono text-muted-foreground">
                    +{category.phonemes.length - 4} more
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Phoneme Selection */}
      {selectedCategory && !selectedPhoneme && (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-xs uppercase tracking-widest">Back to Categories</span>
          </button>

          <h2 className="text-2xl font-heading font-bold">{selectedCategory.name}</h2>
          <p className="text-muted-foreground">{selectedCategory.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedCategory.phonemes.map((phoneme) => (
              <button
                key={phoneme.symbol}
                onClick={() => loadPracticeContent(phoneme)}
                className="p-6 rounded-xl border border-border bg-card/30 backdrop-blur-sm text-center transition-all duration-300 hover:border-mercury/50 hover:bg-card/50"
              >
                <div className="text-3xl font-mono text-mercury mb-2">{phoneme.symbol}</div>
                <div className="text-sm text-muted-foreground">{phoneme.example}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Practice Interface */}
      {selectedPhoneme && !showSessionComplete && (
        <div className="space-y-6">
          <button
            onClick={resetPractice}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-xs uppercase tracking-widest">Back to Phonemes</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-mercury/10 border border-mercury/20 flex items-center justify-center">
              <span className="text-3xl font-mono text-mercury">{selectedPhoneme.symbol}</span>
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold">Practicing: {selectedPhoneme.sound}</h2>
              <p className="text-muted-foreground">Example: "{selectedPhoneme.example}"</p>
            </div>
          </div>

          {/* Progress indicator */}
          {practiceContent && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">Progress:</span>
              <div className="flex gap-1">
                {practiceContent.practice_sentences.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      sessionScores.some(s => s.sentenceIndex === i)
                        ? sessionScores.find(s => s.sentenceIndex === i)!.accuracy >= 80
                          ? "bg-emerald-500"
                          : sessionScores.find(s => s.sentenceIndex === i)!.accuracy >= 60
                          ? "bg-amber-500"
                          : "bg-red-500"
                        : i === currentSentenceIndex
                        ? "bg-mercury"
                        : "bg-border"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {sessionScores.length} / {practiceContent.practice_sentences.length}
              </span>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-mercury" />
              <span className="ml-3 text-muted-foreground">Generating practice content...</span>
            </div>
          )}

          {practiceContent && (
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-6">
                {/* IPA and Description */}
                <div className="chrome-card-static rounded-2xl p-6">
                  <h3 className="font-heading font-bold mb-3">How to Pronounce</h3>
                  <p className="text-muted-foreground">{practiceContent.description}</p>
                </div>

                {/* Practice Sentence */}
                <div className="chrome-card-static rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-bold">Practice Sentence</h3>
                    <span className="text-xs text-muted-foreground">
                      {currentSentenceIndex + 1} / {practiceContent.practice_sentences.length}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-border mb-4">
                    <p className="text-lg text-center">
                      "{practiceContent.practice_sentences[currentSentenceIndex]}"
                    </p>
                  </div>

                  <div className="flex gap-3 mb-4">
                    {!isSpeaking ? (
                      <button
                        onClick={() => speakText(practiceContent.practice_sentences[currentSentenceIndex])}
                        disabled={!speechSupported}
                        className="flex-1 h-12 rounded-xl bg-white/10 border border-border text-foreground font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Volume2 className="w-4 h-4" />
                        Listen
                      </button>
                    ) : (
                      <button
                        onClick={stopSpeaking}
                        className="flex-1 h-12 rounded-xl bg-mercury/20 border border-mercury/30 text-mercury font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <VolumeX className="w-4 h-4" />
                        Stop
                      </button>
                    )}

                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        disabled={!recognitionSupported}
                        className="flex-1 h-12 rounded-xl btn-mercury flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Mic className="w-4 h-4" />
                        Record
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="flex-1 h-12 rounded-xl bg-red-500 text-white font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 animate-pulse"
                      >
                        <MicOff className="w-4 h-4" />
                        Stop
                      </button>
                    )}
                  </div>

                  {transcript && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-white/5 border border-border">
                        <div className="hud-label mb-2">Your Recording</div>
                        <p className="text-sm text-muted-foreground">"{transcript}"</p>
                      </div>

                      {!analysis && !isAnalyzing && (
                        <button
                          onClick={analyzeRecording}
                          className="w-full h-12 rounded-xl btn-mercury"
                        >
                          Analyze Pronunciation
                        </button>
                      )}

                      {isAnalyzing && (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="w-5 h-5 animate-spin text-mercury" />
                          <span className="ml-2 text-muted-foreground">Analyzing...</span>
                        </div>
                      )}

                      {analysis && (
                        <div className="space-y-4">
                          <div className="text-center py-4">
                            <div className={`text-4xl font-light mb-1 ${
                              (analysis.accuracy_percentage || analysis.pronunciation_score * 10) >= 80
                                ? "text-emerald-400"
                                : (analysis.accuracy_percentage || analysis.pronunciation_score * 10) >= 60
                                ? "text-amber-400"
                                : "text-red-400"
                            }`}>
                              {analysis.accuracy_percentage || analysis.pronunciation_score * 10}%
                            </div>
                            <div className="hud-label">Accuracy Score</div>
                          </div>

                          <div className="p-4 rounded-xl bg-white/5 border border-border">
                            <h4 className="font-heading text-sm font-bold mb-2">Feedback</h4>
                            <p className="text-sm text-muted-foreground">{analysis.ai_feedback}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => {
                                setTranscript("");
                                setAnalysis(null);
                              }}
                              className="h-12 rounded-xl bg-white/10 border border-border text-foreground font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                              <RefreshCw className="w-4 h-4" />
                              Try Again
                            </button>
                            <button
                              onClick={nextSentence}
                              className="h-12 rounded-xl bg-foreground text-background font-mono text-xs uppercase tracking-widest"
                            >
                              {currentSentenceIndex < practiceContent.practice_sentences.length - 1 ? "Next Sentence" : "Complete Session"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Side Panel */}
              <div className="lg:col-span-5 space-y-6">
                {/* Practice Words */}
                <div className="chrome-card-static rounded-2xl p-6">
                  <h3 className="font-heading font-bold mb-4">Practice Words</h3>
                  <div className="flex flex-wrap gap-2">
                    {practiceContent.practice_words.map((word, i) => (
                      <button
                        key={i}
                        onClick={() => speakText(word)}
                        disabled={!speechSupported}
                        className="px-3 py-2 rounded-lg bg-white/5 border border-border text-sm hover:bg-white/10 transition-colors disabled:opacity-50"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Minimal Pairs */}
                {practiceContent.minimal_pairs && practiceContent.minimal_pairs.length > 0 && (
                  <div className="chrome-card-static rounded-2xl p-6">
                    <h3 className="font-heading font-bold mb-4">Minimal Pairs</h3>
                    <div className="space-y-2">
                      {practiceContent.minimal_pairs.map((pair, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-border">
                          <button
                            onClick={() => speakText(pair.word1)}
                            disabled={!speechSupported}
                            className="flex-1 text-center hover:text-mercury transition-colors disabled:opacity-50"
                          >
                            {pair.word1}
                          </button>
                          <span className="text-muted-foreground">vs</span>
                          <button
                            onClick={() => speakText(pair.word2)}
                            disabled={!speechSupported}
                            className="flex-1 text-center hover:text-mercury transition-colors disabled:opacity-50"
                          >
                            {pair.word2}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                <div className="chrome-card-static rounded-2xl p-6">
                  <h3 className="font-heading font-bold mb-4">Tips</h3>
                  <ul className="space-y-2">
                    {practiceContent.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-mercury">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common Mistakes */}
                <div className="chrome-card-static rounded-2xl p-6">
                  <h3 className="font-heading font-bold mb-4">Common Mistakes</h3>
                  <ul className="space-y-2">
                    {practiceContent.common_mistakes.map((mistake, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-red-400">⚠</span>
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Session Complete Summary */}
      {showSessionComplete && selectedPhoneme && (
        <div className="space-y-6">
          <div className="chrome-card rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8 text-emerald-400" />
            </div>
            
            <h2 className="text-2xl font-heading font-bold mb-2">Session Complete!</h2>
            <p className="text-muted-foreground mb-6">
              You practiced the {selectedPhoneme.symbol} sound with {sessionScores.length} sentences.
            </p>

            <div className="text-5xl font-light text-mercury mb-2">
              {getOverallScore().toFixed(0)}%
            </div>
            <div className="hud-label mb-8">Average Accuracy</div>

            {/* Individual Scores */}
            <div className="grid gap-2 mb-8">
              {sessionScores.map((score, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-border">
                  <span className="text-sm">Sentence {i + 1}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-mono ${
                      score.accuracy >= 80 ? "text-emerald-400" : score.accuracy >= 60 ? "text-amber-400" : "text-red-400"
                    }`}>
                      {score.accuracy}%
                    </span>
                    {score.accuracy >= 80 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={resetPractice}
                className="flex-1 h-12 rounded-xl bg-white/10 border border-border text-foreground font-mono text-xs uppercase tracking-widest"
              >
                Practice Another Sound
              </button>
              <button
                onClick={completeSession}
                disabled={isSavingSession}
                className="flex-1 h-12 rounded-xl btn-mercury flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSavingSession ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save & Finish"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Phonetics;
