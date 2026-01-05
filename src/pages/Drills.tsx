import { useNavigate } from "react-router-dom";
import { BookOpen, Music, ArrowLeft, AudioWaveform } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

const Drills = () => {
  const navigate = useNavigate();

  const drills = [
    {
      id: "idioms",
      title: "Idiom Master",
      subtitle: "Academic Expressions",
      description: "Daily rotation of academic idioms with contextual examples and practice sentences.",
      icon: <BookOpen className="w-6 h-6" />,
      path: "/practice/drills/idioms",
    },
    {
      id: "intonation",
      title: "Intonation Mirroring",
      subtitle: "Prosodic Training",
      description: "Shadow model sentences to master pitch, rhythm, and prosodic accuracy.",
      icon: <Music className="w-6 h-6" />,
      path: "/practice/drills/intonation",
    },
    {
      id: "phonetics",
      title: "Phonetics Practice",
      subtitle: "Sound Mastery",
      description: "Target specific phonemes with AI-powered pronunciation drills and feedback.",
      icon: <AudioWaveform className="w-6 h-6" />,
      path: "/practice/drills/phonetics",
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
      {/* Back Button */}
      <button
        onClick={() => navigate("/practice")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-mono text-xs uppercase tracking-widest">Back to Practice</span>
      </button>

      {/* Header */}
      <div className="mb-12">
        <StatusBadge label="Micro Drill Protocol" />
        <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tighter mt-6 mb-4">
          SKILL <span className="text-mercury">FORGE</span>
        </h1>
        <p className="text-muted-foreground max-w-lg">
          Targeted micro-drills designed to sharpen specific speaking sub-skills. 
          Master the nuances that elevate your band score.
        </p>
      </div>

      {/* Drills Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drills.map((drill) => (
          <button
            key={drill.id}
            onClick={() => navigate(drill.path)}
            className="group relative p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-sm text-left transition-all duration-300 hover:border-mercury/50 hover:bg-card/50"
          >
            {/* Icon */}
            <div className="w-14 h-14 rounded-xl bg-mercury/10 border border-mercury/20 flex items-center justify-center mb-6 group-hover:bg-mercury/20 transition-colors">
              <div className="text-mercury">{drill.icon}</div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-mercury">
                {drill.subtitle}
              </span>
              <h3 className="text-xl font-heading font-semibold text-foreground">
                {drill.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {drill.description}
              </p>
            </div>

            {/* Hover Arrow */}
            <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                className="w-5 h-5 text-mercury"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Coming Soon Section */}
      <div className="mt-12 p-6 rounded-xl border border-dashed border-border/50 bg-card/10">
        <p className="text-center text-sm text-muted-foreground">
          <span className="text-mercury">More drills coming soon:</span> Fluency Fillers, Cohesion Markers
        </p>
      </div>
    </main>
  );
};

export default Drills;
