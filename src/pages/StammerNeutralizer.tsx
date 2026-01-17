import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mic, Square, Play, RotateCcw, Volume2, VolumeX, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useApiKey } from "@/hooks/useApiKey";
import { useAuth } from "@/hooks/useAuth";
import { useSessionManager } from "@/hooks/useSessionManager";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PracticePhrase {
  id: number;
  text: string;
  difficulty: "easy" | "medium" | "hard";
  focusArea: string;
}

interface AttemptResult {
  phraseId: number;
  transcript: string;
  fluencyScore: number;
  hesitationCount: number;
  fillerWords: string[];
  feedback: string;
}

const practicePhases: PracticePhrase[] = [
  { id: 1, text: "The weather today is absolutely beautiful.", difficulty: "easy", focusArea: "Smooth flow" },
  { id: 2, text: "I believe that education is the foundation of success.", difficulty: "easy", focusArea: "Confidence building" },
  { id: 3, text: "Furthermore, the implementation of sustainable practices requires comprehensive planning.", difficulty: "medium", focusArea: "Complex sentences" },
  { id: 4, text: "In my opinion, the advantages significantly outweigh the disadvantages.", difficulty: "medium", focusArea: "Opinion expression" },
  { id: 5, text: "Nevertheless, it is essential to consider multiple perspectives before reaching a conclusion.", difficulty: "hard", focusArea: "Transitional fluency" },
  { id: 6, text: "The unprecedented technological advancements have revolutionized contemporary communication methods.", difficulty: "hard", focusArea: "Complex vocabulary" },
];

const fillerWordsList = ["um", "uh", "er", "ah", "like", "you know", "basically", "actually", "so", "well"];

const StammerNeutralizer = () => {
  const navigate = useNavigate();
  const { hasApiKey, isLoading: isApiKeyLoading } = useApiKey();
  const { user } = useAuth();
  const { saveSession } = useSessionManager();
  
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [attempts, setAttempts] = useState<AttemptResult[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const currentPhrase = practicePhases[currentPhase];

  const speakPhrase = useCallback(() => {
    if (!synthRef.current || !currentPhrase) return;
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(currentPhrase.text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  }, [currentPhrase]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const detectFillerWords = (text: string): string[] => {
    const lowerText = text.toLowerCase();
    const found: string[] = [];
    
    fillerWordsList.forEach(filler => {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        found.push(...matches.map(() => filler));
      }
    });
    
    return found;
  };

  const countHesitations = (text: string): number => {
    // Count pauses indicated by multiple periods, long spaces, or repeated words
    const pausePatterns = /\.{2,}|,{2,}|\s{3,}/g;
    const pauseMatches = text.match(pausePatterns) || [];
    
    // Count repeated words (stuttering pattern)
    const words = text.toLowerCase().split(/\s+/);
    let repetitions = 0;
    for (let i = 1; i < words.length; i++) {
      if (words[i] === words[i - 1] && words[i].length > 2) {
        repetitions++;
      }
    }
    
    return pauseMatches.length + repetitions;
  };

  const calculateFluencyScore = (transcript: string, targetText: string, fillerCount: number, hesitationCount: number): number => {
    // Base score from word coverage
    const targetWords = targetText.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const spokenWords = transcript.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    
    let matchedWords = 0;
    targetWords.forEach(targetWord => {
      if (spokenWords.some(spoken => 
        spoken.includes(targetWord) || targetWord.includes(spoken) ||
        (spoken.length > 3 && targetWord.length > 3 && 
         (spoken.substring(0, 4) === targetWord.substring(0, 4)))
      )) {
        matchedWords++;
      }
    });
    
    const coverageScore = targetWords.length > 0 ? (matchedWords / targetWords.length) * 100 : 0;
    
    // Penalties
    const fillerPenalty = fillerCount * 5;
    const hesitationPenalty = hesitationCount * 8;
    
    const finalScore = Math.max(0, Math.min(100, coverageScore - fillerPenalty - hesitationPenalty));
    return Math.round(finalScore);
  };

  const generateFeedback = async (transcript: string, targetText: string, fluencyScore: number, fillerWords: string[], hesitationCount: number): Promise<string> => {
    if (!hasApiKey) {
      // Generate basic feedback without AI
      if (fluencyScore >= 80) {
        return "Excellent fluency! Your speech was smooth and natural. Keep up the great work!";
      } else if (fluencyScore >= 60) {
        let feedback = "Good attempt! ";
        if (fillerWords.length > 0) {
          feedback += `Try to reduce filler words like "${fillerWords.slice(0, 2).join('", "')}". `;
        }
        if (hesitationCount > 0) {
          feedback += "Practice maintaining a steady pace without hesitations.";
        }
        return feedback;
      } else {
        return "Keep practicing! Focus on speaking at a comfortable pace and avoid rushing. Listen to the target phrase again and try to match the rhythm.";
      }
    }

    try {
      const { data, error } = await supabase.functions.invoke('analyze-speech', {
        body: {
          transcript,
          targetText,
          mode: 'stammer',
          fluencyScore,
          fillerWords,
          hesitationCount
        }
      });

      if (error) throw error;
      return data?.feedback || "Great effort! Continue practicing for improved fluency.";
    } catch (error) {
      console.error("Error generating AI feedback:", error);
      return fluencyScore >= 70 
        ? "Good fluency! Continue practicing to build more confidence."
        : "Keep practicing! Focus on smooth, continuous speech.";
    }
  };

  const startRecording = async () => {
    try {
      transcriptRef.current = "";
      
      // Setup speech recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast.error("Speech recognition not supported in this browser");
        return;
      }

      // Countdown before recording
      setCountdown(3);
      for (let i = 3; i > 0; i--) {
        setCountdown(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setCountdown(null);

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          }
        }
        if (finalTranscript) {
          transcriptRef.current = finalTranscript.trim();
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Recognition error:", event.error);
        if (event.error !== 'no-speech') {
          toast.error("Speech recognition error. Please try again.");
        }
      };

      recognitionRef.current = recognition;
      recognition.start();

      // Also start audio recording for potential future use
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      setIsRecording(true);
      toast.info("Recording started. Speak the phrase clearly!");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsProcessing(true);

    try {
      // Stop recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      // Stop media recorder
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }

      // Wait a moment for final results
      await new Promise(resolve => setTimeout(resolve, 500));

      const transcript = transcriptRef.current || "Unable to transcribe speech";
      
      // Analyze the speech
      const fillerWords = detectFillerWords(transcript);
      const hesitationCount = countHesitations(transcript);
      const fluencyScore = calculateFluencyScore(transcript, currentPhrase.text, fillerWords.length, hesitationCount);
      
      // Generate feedback
      const feedback = await generateFeedback(transcript, currentPhrase.text, fluencyScore, fillerWords, hesitationCount);

      const result: AttemptResult = {
        phraseId: currentPhrase.id,
        transcript,
        fluencyScore,
        hesitationCount,
        fillerWords,
        feedback
      };

      setAttempts(prev => [...prev, result]);

      if (fluencyScore >= 75) {
        toast.success(`Great fluency! Score: ${fluencyScore}%`);
      } else if (fluencyScore >= 50) {
        toast.info(`Good effort! Score: ${fluencyScore}%`);
      } else {
        toast.warning(`Keep practicing! Score: ${fluencyScore}%`);
      }

    } catch (error) {
      console.error("Error processing recording:", error);
      toast.error("Error processing your speech. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const nextPhrase = () => {
    if (currentPhase < practicePhases.length - 1) {
      setCurrentPhase(prev => prev + 1);
    } else {
      completeSession();
    }
  };

  const completeSession = async () => {
    setSessionComplete(true);

    if (user && attempts.length > 0) {
      try {
        const avgFluency = attempts.reduce((sum, a) => sum + a.fluencyScore, 0) / attempts.length;
        const totalFillers = attempts.reduce((sum, a) => sum + a.fillerWords.length, 0);
        const totalHesitations = attempts.reduce((sum, a) => sum + a.hesitationCount, 0);
        const overallBand = Math.min(9, Math.max(1, (avgFluency / 100) * 9));

        await saveSession({
          session_type: "stammer_neutralizer",
          transcript: attempts.map(a => `[Phrase ${a.phraseId}]: ${a.transcript}`).join("\n\n"),
          fluency_score: avgFluency / 10,
          overall_band: overallBand,
          ai_feedback: `Total filler words: ${totalFillers}. Total hesitations: ${totalHesitations}. ${attempts[attempts.length - 1]?.feedback || ""}`,
          topic: "Stammer Neutralizer Practice"
        });

        toast.success("Session saved successfully!");
      } catch (error) {
        console.error("Error saving session:", error);
      }
    }
  };

  const restartSession = () => {
    setCurrentPhase(0);
    setAttempts([]);
    setSessionComplete(false);
  };

  const currentAttempt = attempts.find(a => a.phraseId === currentPhrase?.id);
  const progress = ((currentPhase + (currentAttempt ? 1 : 0)) / practicePhases.length) * 100;

  if (isApiKeyLoading) {
    return (
      <main className="max-w-4xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-mercury" />
        </div>
      </main>
    );
  }

  if (sessionComplete) {
    const avgFluency = attempts.reduce((sum, a) => sum + a.fluencyScore, 0) / attempts.length;
    const totalFillers = attempts.reduce((sum, a) => sum + a.fillerWords.length, 0);
    
    return (
      <main className="max-w-4xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono text-xs uppercase tracking-wider">Back</span>
        </button>

        <Card className="chrome-card border-mercury/30">
          <CardHeader className="text-center pb-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-3xl font-heading">Session Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="chrome-card-static rounded-xl p-4">
                <div className="text-3xl font-bold text-mercury">{Math.round(avgFluency)}%</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Avg Fluency</div>
              </div>
              <div className="chrome-card-static rounded-xl p-4">
                <div className="text-3xl font-bold text-foreground">{attempts.length}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Phrases</div>
              </div>
              <div className="chrome-card-static rounded-xl p-4">
                <div className="text-3xl font-bold text-orange-400">{totalFillers}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Fillers</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Phrase Scores</h4>
              {attempts.map((attempt, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border">
                  <span className="text-sm truncate flex-1 mr-4">
                    {practicePhases.find(p => p.id === attempt.phraseId)?.text.substring(0, 40)}...
                  </span>
                  <span className={`font-mono text-sm font-bold ${
                    attempt.fluencyScore >= 75 ? 'text-green-500' : 
                    attempt.fluencyScore >= 50 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {attempt.fluencyScore}%
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={restartSession} variant="outline" className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Practice Again
              </Button>
              <Button onClick={() => navigate('/practice')} className="flex-1 btn-mercury">
                Back to Practice
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-mono text-xs uppercase tracking-wider">Back</span>
      </button>

      <StatusBadge label="Stammer Neutralizer Protocol" />

      <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-heading font-bold tracking-tighter leading-[0.9] text-foreground mt-6 mb-4">
        FLUENCY<br />
        <span className="text-mercury">BUILDER.</span>
      </h1>

      <p className="text-muted-foreground font-light leading-relaxed max-w-2xl mb-8">
        Practice speaking smoothly without hesitations or filler words. Listen to each phrase, then repeat it with confidence and natural flow.
      </p>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            Progress: {currentPhase + 1} / {practicePhases.length}
          </span>
          <span className="font-mono text-xs text-mercury">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Current Phrase Card */}
      <Card className="chrome-card border-mercury/20 mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full ${
              currentPhrase.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
              currentPhrase.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {currentPhrase.difficulty}
            </span>
            <span className="text-xs text-muted-foreground">{currentPhrase.focusArea}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 rounded-xl bg-card/50 border border-border">
            <p className="text-xl md:text-2xl font-light leading-relaxed text-center">
              "{currentPhrase.text}"
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={isSpeaking ? stopSpeaking : speakPhrase}
              variant="outline"
              className="gap-2"
              disabled={isRecording || isProcessing}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              {isSpeaking ? "Stop" : "Listen"}
            </Button>

            {countdown !== null ? (
              <div className="w-32 h-14 rounded-full bg-mercury/20 flex items-center justify-center">
                <span className="text-3xl font-bold text-mercury">{countdown}</span>
              </div>
            ) : isRecording ? (
              <Button
                onClick={stopRecording}
                className="gap-2 bg-red-500 hover:bg-red-600 text-white h-14 px-8"
              >
                <Square className="w-4 h-4" />
                Stop Recording
              </Button>
            ) : (
              <Button
                onClick={startRecording}
                className="gap-2 btn-mercury h-14 px-8"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
                {isProcessing ? "Processing..." : "Start Speaking"}
              </Button>
            )}
          </div>

          {/* Current Attempt Feedback */}
          {currentAttempt && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Your Result</span>
                <span className={`text-2xl font-bold ${
                  currentAttempt.fluencyScore >= 75 ? 'text-green-500' :
                  currentAttempt.fluencyScore >= 50 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {currentAttempt.fluencyScore}%
                </span>
              </div>

              <div className="p-4 rounded-lg bg-card/30 border border-border">
                <p className="text-sm text-muted-foreground mb-2">Your speech:</p>
                <p className="text-foreground">"{currentAttempt.transcript}"</p>
              </div>

              {currentAttempt.fillerWords.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-orange-400" />
                  <span className="text-muted-foreground">Filler words detected:</span>
                  <span className="text-orange-400">{currentAttempt.fillerWords.join(", ")}</span>
                </div>
              )}

              <p className="text-sm text-muted-foreground italic">{currentAttempt.feedback}</p>

              <Button onClick={nextPhrase} className="w-full btn-mercury mt-4">
                {currentPhase < practicePhases.length - 1 ? (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Next Phrase
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Session
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="chrome-card-static">
        <CardContent className="p-6">
          <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-4">Fluency Tips</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <span className="text-foreground">Breathe</span> - Take a breath before speaking to calm your nerves</li>
            <li>• <span className="text-foreground">Pace yourself</span> - Speaking too fast increases stammering</li>
            <li>• <span className="text-foreground">Pause, don't fill</span> - Replace "um" and "uh" with brief silences</li>
            <li>• <span className="text-foreground">Visualize</span> - Picture the words before saying them</li>
          </ul>
        </CardContent>
      </Card>
    </main>
  );
};

export default StammerNeutralizer;
