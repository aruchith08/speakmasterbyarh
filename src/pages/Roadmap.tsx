import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Lock, CheckCircle2, Circle, ChevronRight, MessageSquare, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { useRealtimeStats } from "@/hooks/useRealtimeStats";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  type: "tutorial" | "interactive";
  xpRequired: number;
}

interface Level {
  band: number;
  title: string;
  description: string;
  skillArea: string;
  lessons: Lesson[];
}

const roadmapData: Level[] = [
  {
    band: 5,
    title: "Foundation",
    description: "Build your speaking fundamentals",
    skillArea: "foundation",
    lessons: [
      { id: "5-1", title: "Basic Fluency Patterns", type: "tutorial", xpRequired: 0 },
      { id: "5-2", title: "Simple Sentence Structures", type: "tutorial", xpRequired: 25 },
      { id: "5-3", title: "Common Topic Vocabulary", type: "interactive", xpRequired: 50 },
      { id: "5-4", title: "Basic Pronunciation", type: "interactive", xpRequired: 75 },
    ],
  },
  {
    band: 6,
    title: "Development",
    description: "Expand your linguistic range",
    skillArea: "development",
    lessons: [
      { id: "6-1", title: "Complex Sentences", type: "tutorial", xpRequired: 100 },
      { id: "6-2", title: "Topic Development", type: "tutorial", xpRequired: 150 },
      { id: "6-3", title: "Idiomatic Expressions", type: "interactive", xpRequired: 200 },
      { id: "6-4", title: "Intonation Patterns", type: "interactive", xpRequired: 250 },
    ],
  },
  {
    band: 7,
    title: "Proficiency",
    description: "Master advanced speaking skills",
    skillArea: "proficiency",
    lessons: [
      { id: "7-1", title: "Abstract Reasoning", type: "tutorial", xpRequired: 300 },
      { id: "7-2", title: "Sophisticated Vocabulary", type: "tutorial", xpRequired: 375 },
      { id: "7-3", title: "Discourse Markers", type: "interactive", xpRequired: 450 },
      { id: "7-4", title: "Natural Hesitation", type: "interactive", xpRequired: 525 },
    ],
  },
  {
    band: 8,
    title: "Excellence",
    description: "Achieve near-native fluency",
    skillArea: "excellence",
    lessons: [
      { id: "8-1", title: "Nuanced Expression", type: "tutorial", xpRequired: 600 },
      { id: "8-2", title: "Academic Register", type: "tutorial", xpRequired: 700 },
      { id: "8-3", title: "Complex Argumentation", type: "interactive", xpRequired: 800 },
      { id: "8-4", title: "Prosodic Excellence", type: "interactive", xpRequired: 900 },
    ],
  },
  {
    band: 9,
    title: "Mastery",
    description: "Expert-level speaking mastery",
    skillArea: "mastery",
    lessons: [
      { id: "9-1", title: "Sophisticated Discourse", type: "tutorial", xpRequired: 1000 },
      { id: "9-2", title: "Native Idiom Usage", type: "tutorial", xpRequired: 1150 },
      { id: "9-3", title: "Perfect Pronunciation", type: "interactive", xpRequired: 1300 },
      { id: "9-4", title: "Complete Fluency", type: "interactive", xpRequired: 1500 },
    ],
  },
];

const Roadmap = () => {
  const { user } = useAuth();
  const { stats, learningProgress, updateLearningProgress, isLoading } = useRealtimeStats();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [practiceInput, setPracticeInput] = useState("");

  // Calculate total XP from all skill areas
  const totalXp = learningProgress.reduce((sum, p) => sum + p.xpPoints, 0);
  
  // Also award XP based on sessions completed (10 XP per session)
  const sessionXp = stats.sessionsCompleted * 10;
  const effectiveXp = totalXp + sessionXp;

  const getLessonStatus = (lesson: Lesson): "completed" | "current" | "locked" => {
    if (effectiveXp >= lesson.xpRequired + 25) return "completed";
    if (effectiveXp >= lesson.xpRequired) return "current";
    return "locked";
  };

  const getStatusIcon = (status: "completed" | "current" | "locked") => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case "current":
        return <Circle className="w-5 h-5 text-foreground animate-pulse" />;
      case "locked":
        return <Lock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const handleLessonComplete = async () => {
    if (!selectedLesson || !user) return;

    // Award 25 XP for completing a lesson
    await updateLearningProgress("general", 25);
    toast.success("Lesson completed! +25 XP");
    setSelectedLesson(null);
    setPracticeInput("");
  };

  if (!user) {
    return (
      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
        <div className="text-center py-20">
          <h2 className="text-2xl font-heading font-bold mb-4">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to track your learning journey.
          </p>
          <Link
            to="/auth"
            className="btn-mercury h-12 px-8 rounded-xl inline-flex items-center justify-center"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-mercury" />
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
      {/* Header */}
      <div className="mb-12 md:mb-16">
        <StatusBadge label="Learning Journey Active" />
        
        <h1 className="text-[clamp(2rem,5vw,4rem)] font-heading font-bold tracking-tighter leading-[0.9] text-foreground mt-8 mb-6">
          THE<br />
          <span className="text-mercury">JOURNEY.</span>
        </h1>
        
        <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
          A structured path from Band 5 to Band 9 mastery. Each level unlocks progressively as you complete lessons and practice sessions.
        </p>

        {/* XP Progress */}
        <div className="mt-6 chrome-card-static rounded-xl p-4 inline-block">
          <div className="flex items-center gap-4">
            <div>
              <div className="hud-label mb-1">Total XP</div>
              <div className="text-2xl font-bold text-mercury">{effectiveXp}</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="hud-label mb-1">Sessions</div>
              <div className="text-2xl font-bold text-foreground">{stats.sessionsCompleted}</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <div className="hud-label mb-1">Streak</div>
              <div className="text-2xl font-bold text-foreground">{stats.streak} days</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Roadmap Column */}
        <div className="lg:col-span-7">
          <div className="space-y-4">
            {roadmapData.map((level) => {
              const levelProgress = level.lessons.filter(l => getLessonStatus(l) === "completed").length;
              const isLevelComplete = levelProgress === level.lessons.length;
              
              return (
                <div
                  key={level.band}
                  className="chrome-card-static rounded-2xl overflow-hidden"
                >
                  {/* Level Header */}
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${isLevelComplete ? 'bg-green-500/20' : 'bg-white/5'} border border-border flex items-center justify-center`}>
                          <span className={`font-heading font-bold text-lg ${isLevelComplete ? 'text-green-400' : ''}`}>
                            {level.band}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-lg">{level.title}</h3>
                          <p className="text-sm text-muted-foreground">{level.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-[9px] text-muted-foreground uppercase">
                          Band {level.band}
                        </div>
                        <div className="font-mono text-xs text-foreground">
                          {levelProgress}/{level.lessons.length}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lessons */}
                  <div className="divide-y divide-border">
                    {level.lessons.map((lesson) => {
                      const status = getLessonStatus(lesson);
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => status !== "locked" && setSelectedLesson(lesson)}
                          disabled={status === "locked"}
                          className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                            status === "locked"
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-white/5"
                          } ${selectedLesson?.id === lesson.id ? "bg-white/5" : ""}`}
                        >
                          <div className="flex items-center gap-4">
                            {getStatusIcon(status)}
                            <div>
                              <span className="text-sm text-foreground">{lesson.title}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-mono text-[9px] text-muted-foreground uppercase">
                                  {lesson.type}
                                </span>
                                <span className="font-mono text-[9px] text-mercury">
                                  {lesson.xpRequired} XP required
                                </span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lesson Detail / Practice Terminal */}
        <div className="lg:col-span-5">
          <div className="chrome-card-static rounded-2xl p-6 sticky top-8">
            {selectedLesson ? (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {selectedLesson.type === "tutorial" ? "Tutorial Mode" : "Interactive Mode"}
                  </span>
                </div>

                <h3 className="font-heading text-xl font-bold mb-4">{selectedLesson.title}</h3>

                {selectedLesson.type === "tutorial" ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-border">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        This lesson covers key concepts and strategies for mastering this skill. 
                        Complete practice sessions to earn XP and unlock more lessons.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-border">
                      <div className="hud-label mb-2">Tip</div>
                      <p className="text-sm text-foreground">
                        Practice regularly to build your XP. Each practice session earns you 10 XP, 
                        and completing lessons earns 25 XP!
                      </p>
                    </div>
                    <button 
                      onClick={handleLessonComplete}
                      className="btn-mercury w-full h-12 rounded-xl"
                    >
                      Complete Lesson (+25 XP)
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-border">
                      <p className="text-sm text-muted-foreground mb-4">
                        Practice this skill with immediate feedback. Type your response below.
                      </p>
                      <textarea
                        value={practiceInput}
                        onChange={(e) => setPracticeInput(e.target.value)}
                        placeholder="Enter your practice response..."
                        className="w-full h-32 bg-transparent border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 resize-none"
                      />
                    </div>
                    <button 
                      onClick={handleLessonComplete}
                      disabled={!practiceInput.trim()}
                      className="btn-mercury w-full h-12 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Submit & Complete (+25 XP)
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center mx-auto mb-4">
                  <Circle className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-2">Select a Lesson</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose a lesson from the roadmap to view details and begin practice.
                </p>
                <div className="p-4 rounded-xl bg-white/5 border border-border text-left">
                  <div className="hud-label mb-2">How to Progress</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Complete practice sessions: +10 XP each</li>
                    <li>• Complete lessons: +25 XP each</li>
                    <li>• Lessons unlock as you earn XP</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Roadmap;
