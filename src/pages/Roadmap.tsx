import { useState } from "react";
import { Lock, CheckCircle2, Circle, ChevronRight, MessageSquare } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

interface Lesson {
  id: string;
  title: string;
  type: "tutorial" | "interactive";
  status: "completed" | "current" | "locked";
}

interface Level {
  band: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

const roadmapData: Level[] = [
  {
    band: 5,
    title: "Foundation",
    description: "Build your speaking fundamentals",
    lessons: [
      { id: "5-1", title: "Basic Fluency Patterns", type: "tutorial", status: "completed" },
      { id: "5-2", title: "Simple Sentence Structures", type: "tutorial", status: "completed" },
      { id: "5-3", title: "Common Topic Vocabulary", type: "interactive", status: "completed" },
      { id: "5-4", title: "Basic Pronunciation", type: "interactive", status: "completed" },
    ],
  },
  {
    band: 6,
    title: "Development",
    description: "Expand your linguistic range",
    lessons: [
      { id: "6-1", title: "Complex Sentences", type: "tutorial", status: "completed" },
      { id: "6-2", title: "Topic Development", type: "tutorial", status: "completed" },
      { id: "6-3", title: "Idiomatic Expressions", type: "interactive", status: "current" },
      { id: "6-4", title: "Intonation Patterns", type: "interactive", status: "locked" },
    ],
  },
  {
    band: 7,
    title: "Proficiency",
    description: "Master advanced speaking skills",
    lessons: [
      { id: "7-1", title: "Abstract Reasoning", type: "tutorial", status: "locked" },
      { id: "7-2", title: "Sophisticated Vocabulary", type: "tutorial", status: "locked" },
      { id: "7-3", title: "Discourse Markers", type: "interactive", status: "locked" },
      { id: "7-4", title: "Natural Hesitation", type: "interactive", status: "locked" },
    ],
  },
  {
    band: 8,
    title: "Excellence",
    description: "Achieve near-native fluency",
    lessons: [
      { id: "8-1", title: "Nuanced Expression", type: "tutorial", status: "locked" },
      { id: "8-2", title: "Academic Register", type: "tutorial", status: "locked" },
      { id: "8-3", title: "Complex Argumentation", type: "interactive", status: "locked" },
      { id: "8-4", title: "Prosodic Excellence", type: "interactive", status: "locked" },
    ],
  },
  {
    band: 9,
    title: "Mastery",
    description: "Expert-level speaking mastery",
    lessons: [
      { id: "9-1", title: "Sophisticated Discourse", type: "tutorial", status: "locked" },
      { id: "9-2", title: "Native Idiom Usage", type: "tutorial", status: "locked" },
      { id: "9-3", title: "Perfect Pronunciation", type: "interactive", status: "locked" },
      { id: "9-4", title: "Complete Fluency", type: "interactive", status: "locked" },
    ],
  },
];

const Roadmap = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [practiceInput, setPracticeInput] = useState("");

  const getStatusIcon = (status: Lesson["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case "current":
        return <Circle className="w-5 h-5 text-foreground animate-pulse" />;
      case "locked":
        return <Lock className="w-4 h-4 text-muted-foreground" />;
    }
  };

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
          A structured path from Band 5 to Band 9 mastery. Each level unlocks progressively as you complete lessons and demonstrate skill.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Roadmap Column */}
        <div className="lg:col-span-7">
          <div className="space-y-4">
            {roadmapData.map((level, levelIndex) => (
              <div
                key={level.band}
                className="chrome-card-static rounded-2xl overflow-hidden"
              >
                {/* Level Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-border flex items-center justify-center">
                        <span className="font-heading font-bold text-lg">{level.band}</span>
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-lg">{level.title}</h3>
                        <p className="text-sm text-muted-foreground">{level.description}</p>
                      </div>
                    </div>
                    <div className="font-mono text-[9px] text-muted-foreground uppercase">
                      Band {level.band}
                    </div>
                  </div>
                </div>

                {/* Lessons */}
                <div className="divide-y divide-border">
                  {level.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => lesson.status !== "locked" && setSelectedLesson(lesson)}
                      disabled={lesson.status === "locked"}
                      className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                        lesson.status === "locked"
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-white/5"
                      } ${selectedLesson?.id === lesson.id ? "bg-white/5" : ""}`}
                    >
                      <div className="flex items-center gap-4">
                        {getStatusIcon(lesson.status)}
                        <div>
                          <span className="text-sm text-foreground">{lesson.title}</span>
                          <span className="block font-mono text-[9px] text-muted-foreground uppercase mt-1">
                            {lesson.type}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
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
                        Content is dynamically generated by the AI Tutor based on your current level.
                      </p>
                    </div>
                    <button className="btn-mercury w-full h-12 rounded-xl">
                      Generate Lesson
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-border">
                      <p className="text-sm text-muted-foreground mb-4">
                        Practice this skill with immediate AI feedback. Type your response below.
                      </p>
                      <textarea
                        value={practiceInput}
                        onChange={(e) => setPracticeInput(e.target.value)}
                        placeholder="Enter your practice response..."
                        className="w-full h-32 bg-transparent border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50 resize-none"
                      />
                    </div>
                    <button className="btn-mercury w-full h-12 rounded-xl flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Submit for Feedback
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
                <p className="text-sm text-muted-foreground">
                  Choose a lesson from the roadmap to view details and begin practice.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Roadmap;
