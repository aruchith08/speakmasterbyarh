import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, Sparkles, BookOpen, CheckCircle2 } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { useSessionManager } from "@/hooks/useSessionManager";

interface Idiom {
  expression: string;
  meaning: string;
  example: string;
  context: string;
}

const Idioms = () => {
  const { generatePersonalizedContent } = useSessionManager();
  const [idioms, setIdioms] = useState<Idiom[]>([
    {
      expression: "To be on the same page",
      meaning: "To have the same understanding or opinion about something",
      example: "Before we start the project, let's make sure we're all on the same page about our objectives.",
      context: "Use in discussions about agreement, collaboration, or shared understanding"
    },
    {
      expression: "The bottom line",
      meaning: "The most important point or the final result",
      example: "We've discussed many factors, but the bottom line is that we need to reduce costs.",
      context: "Use when emphasizing the key takeaway or conclusion"
    },
    {
      expression: "To play devil's advocate",
      meaning: "To argue against something for the sake of debate or to test an idea",
      example: "Let me play devil's advocate here – what if the plan doesn't work as expected?",
      context: "Use when presenting counterarguments in discussions"
    }
  ]);
  const [learnedIdioms, setLearnedIdioms] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIdiom, setSelectedIdiom] = useState<Idiom | null>(null);

  const handleRefresh = async () => {
    setIsLoading(true);
    const content = await generatePersonalizedContent("idiom");
    if (content?.idioms) {
      setIdioms(content.idioms);
    }
    setIsLoading(false);
  };

  const handleMarkLearned = (expression: string) => {
    setLearnedIdioms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(expression)) {
        newSet.delete(expression);
      } else {
        newSet.add(expression);
      }
      return newSet;
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
        <StatusBadge label="Daily Vocabulary Boost" />
        
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-heading font-bold tracking-tighter leading-[0.9] text-foreground mt-8 mb-4">
          IDIOM<br />
          <span className="text-mercury">MASTER.</span>
        </h1>
        
        <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
          Learn academic idioms and expressions to enhance your speaking. Updated daily with new phrases.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <div className="chrome-card-static rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-heading font-bold">Today's Expressions</h3>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                <span className="font-mono text-[9px] uppercase">Refresh</span>
              </button>
            </div>

            <div className="space-y-4">
              {idioms.map((idiom, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedIdiom(idiom)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all ${
                    selectedIdiom?.expression === idiom.expression
                      ? "bg-white/10 border-foreground/50"
                      : "bg-white/5 border-border hover:border-foreground/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-heading text-lg font-bold text-foreground">
                          "{idiom.expression}"
                        </span>
                        {learnedIdioms.has(idiom.expression) && (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {idiom.meaning}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkLearned(idiom.expression);
                      }}
                      className={`px-3 py-1 rounded-lg font-mono text-[9px] uppercase tracking-widest transition-colors ${
                        learnedIdioms.has(idiom.expression)
                          ? "bg-green-500/20 text-green-400"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10"
                      }`}
                    >
                      {learnedIdioms.has(idiom.expression) ? "Learned" : "Mark"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-muted-foreground uppercase">
                  Progress: {learnedIdioms.size}/{idioms.length} learned
                </span>
                <div className="flex gap-1">
                  {idioms.map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-1 rounded-full ${
                        learnedIdioms.has(idioms[i].expression)
                          ? "bg-green-400"
                          : "bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-5">
          <div className="chrome-card-static rounded-2xl p-6 sticky top-8">
            {selectedIdiom ? (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-heading font-bold">Expression Details</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="hud-label mb-2">Expression</div>
                    <p className="text-xl font-heading font-bold text-foreground">
                      "{selectedIdiom.expression}"
                    </p>
                  </div>

                  <div>
                    <div className="hud-label mb-2">Meaning</div>
                    <p className="text-sm text-muted-foreground">
                      {selectedIdiom.meaning}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-border">
                    <div className="hud-label mb-2">Example Usage</div>
                    <p className="text-sm text-foreground italic">
                      "{selectedIdiom.example}"
                    </p>
                  </div>

                  <div>
                    <div className="hud-label mb-2">When to Use</div>
                    <p className="text-sm text-muted-foreground">
                      {selectedIdiom.context}
                    </p>
                  </div>

                  <button
                    onClick={() => handleMarkLearned(selectedIdiom.expression)}
                    className={`w-full h-12 rounded-xl font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-colors ${
                      learnedIdioms.has(selectedIdiom.expression)
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "btn-mercury"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {learnedIdioms.has(selectedIdiom.expression) ? "Learned!" : "Mark as Learned"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-2">Select an Expression</h3>
                <p className="text-sm text-muted-foreground">
                  Click on an idiom to see detailed usage and examples
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Idioms;
