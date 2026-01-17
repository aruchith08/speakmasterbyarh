import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Mic, 
  FileText, 
  Headphones, 
  MessageSquare, 
  Sparkles, 
  Target, 
  BarChart3, 
  Play,
  Clock,
  Zap,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  AudioWaveform,
  Volume2
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface GuideSection {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  steps: string[];
  tips: string[];
  outcome: string;
}

const guideSections: GuideSection[] = [
  {
    id: "getting-started",
    icon: <Play className="w-5 h-5" />,
    title: "Getting Started",
    subtitle: "First Steps",
    description: "Welcome to SPEAKMASTER. Here's how to begin your IELTS speaking mastery journey.",
    steps: [
      "Create your account or sign in with existing credentials",
      "Navigate to the Command Center (Dashboard) - your home base",
      "Review your current metrics in the Vocalizer Card",
      "Select a Training Protocol to begin practicing",
      "Track your progress in the Analytics section"
    ],
    tips: [
      "Start with the Cue Protocol for a gentle introduction",
      "Practice daily to maintain your streak and build consistency",
      "Review AI feedback after each session to identify improvement areas"
    ],
    outcome: "You'll have a personalized dashboard tracking your progress toward your target band score."
  },
  {
    id: "neural-voice",
    icon: <Mic className="w-5 h-5" />,
    title: "Neural Voice",
    subtitle: "Live Mock Exam",
    description: "Full-length IELTS speaking simulation with AI examiner. Experience real exam conditions with bi-directional voice conversation.",
    steps: [
      "Click 'Initialize Neural Voice Protocol' to start",
      "Select your Examiner Type: Professional (strict), Encourager (supportive), or Academic (challenging)",
      "Choose Acoustic Profile: Silent Room, Café Ambience, or Exam Hall",
      "Speak naturally when the AI examiner asks questions",
      "Complete all three parts: Introduction, Cue Card, and Discussion",
      "Review your comprehensive analysis after the exam"
    ],
    tips: [
      "Start with 'Encourager' mode to build confidence before trying 'Academic'",
      "Use 'Café Ambience' to simulate real-world distractions",
      "Speak for the full time allocated - avoid short answers"
    ],
    outcome: "Receive band scores for Fluency, Lexical Resource, Grammar, and Pronunciation with detailed AI feedback."
  },
  {
    id: "cue-protocol",
    icon: <FileText className="w-5 h-5" />,
    title: "Cue Protocol",
    subtitle: "Part 2 Practice",
    description: "Master the 2-minute long turn with timed preparation and diagnostic analysis. Practice the cue card section intensively.",
    steps: [
      "Click 'Start Cue Protocol' to receive a random topic card",
      "Use the 60-second preparation time to make notes",
      "When the timer starts, speak for 1-2 minutes on the topic",
      "Cover all bullet points on the cue card",
      "Review your live transcription and AI analysis"
    ],
    tips: [
      "Structure your answer: Introduction, Main Points, Conclusion",
      "Use the bullet points as a framework, not a script",
      "Practice extending your answers with examples and details"
    ],
    outcome: "Detailed breakdown of your response structure, vocabulary usage, and coherence with improvement suggestions."
  },
  {
    id: "phonetic-drill",
    icon: <Headphones className="w-5 h-5" />,
    title: "Phonetic Drill",
    subtitle: "Read Aloud",
    description: "Precision pronunciation training with phonetic comparison and accuracy scoring. Perfect your spoken English clarity.",
    steps: [
      "View the text passage displayed on screen",
      "Click the microphone button to start recording",
      "Read the passage aloud clearly and naturally",
      "Stop recording when finished",
      "Review phonetic analysis highlighting problem areas"
    ],
    tips: [
      "Focus on problematic sounds specific to your native language",
      "Record yourself multiple times to track improvement",
      "Pay attention to word stress and sentence intonation"
    ],
    outcome: "Phonetic accuracy score with highlighted mispronunciations and correct pronunciation guides."
  },
  {
    id: "phonetics-practice",
    icon: <AudioWaveform className="w-5 h-5" />,
    title: "Phonetics Practice",
    subtitle: "Sound Mastery",
    description: "Target specific English phonemes with AI-powered pronunciation drills. Perfect individual sounds that are challenging for non-native speakers.",
    steps: [
      "Navigate to Skill Forge (Micro Drills) from the Dashboard",
      "Select 'Phonetics Practice' from the available drills",
      "Choose a phoneme category (e.g., TH Sounds, R & L Sounds, Vowels, Diphthongs)",
      "Select a specific phoneme to practice (e.g., /θ/, /r/, /æ/)",
      "Click 'Listen' to hear the AI read the practice sentence",
      "Click 'Record' to record yourself saying the sentence",
      "Click 'Analyze Pronunciation' to get AI feedback on your accuracy",
      "Review your accuracy score and detailed feedback",
      "Try again or move to the next sentence",
      "Complete all sentences and save your session"
    ],
    tips: [
      "Start with sounds that don't exist in your native language",
      "Use the 'Listen' button multiple times before recording",
      "Practice minimal pairs to distinguish similar sounds (e.g., 'think' vs 'sink')",
      "Focus on mouth position and tongue placement as described in the tips",
      "Use the practice words section to warm up before full sentences",
      "Pay attention to the 'Common Mistakes' section to avoid typical errors"
    ],
    outcome: "Improved pronunciation accuracy for specific challenging sounds with targeted practice and immediate AI feedback. Sessions are saved to track your progress over time."
  },
  {
    id: "abstract-core",
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Abstract Core",
    subtitle: "Part 3 Discussion",
    description: "High-level reasoning practice for IELTS Part 3. Develop sophisticated responses to abstract questions.",
    steps: [
      "Receive an abstract discussion question",
      "Formulate your response considering multiple perspectives",
      "Record your answer using the microphone",
      "View AI-generated vocabulary boosters and rephrasing suggestions",
      "Practice incorporating advanced vocabulary into your responses"
    ],
    tips: [
      "Use phrases like 'On one hand... on the other hand' for balanced answers",
      "Support your opinions with examples and reasoning",
      "Practice speculating about future trends and hypotheticals"
    ],
    outcome: "Enhanced vocabulary suggestions and sophisticated rephrasing options to elevate your responses."
  },
  {
    id: "skill-forge",
    icon: <Sparkles className="w-5 h-5" />,
    title: "Skill Forge",
    subtitle: "Micro Drills",
    description: "Targeted exercises for specific skill improvement. Master idioms, perfect intonation patterns, and practice phonetics.",
    steps: [
      "Choose from Idiom Master, Intonation Mirroring, or Phonetics Practice",
      "For Idioms: Learn contextual usage and practice in sentences",
      "For Intonation: Listen to native patterns and mirror them",
      "For Phonetics: Select specific sounds to practice with AI feedback",
      "Complete multiple short exercises for rapid improvement",
      "Track your drill completion and accuracy scores"
    ],
    tips: [
      "Practice idioms in context, not in isolation",
      "Record and compare your intonation to the native speaker",
      "Do micro drills daily for consistent improvement",
      "Focus on one phoneme category at a time for best results"
    ],
    outcome: "Improved natural expression through idiom usage, native-like intonation patterns, and precise pronunciation."
  },
  {
    id: "journey-map",
    icon: <Target className="w-5 h-5" />,
    title: "Journey Map",
    subtitle: "Learning Roadmap",
    description: "Gamified progression from Band 5 to Band 9. Follow a structured path with AI-generated tutorials and practice.",
    steps: [
      "View your current position on the band progression map",
      "Unlock lessons by completing prerequisites",
      "Complete Theory lessons for knowledge building",
      "Practice with applied exercises for each skill",
      "Earn XP and badges as you progress"
    ],
    tips: [
      "Complete lessons in order for optimal skill building",
      "Return to earlier lessons if you're struggling with advanced concepts",
      "Aim for at least one lesson completion per day"
    ],
    outcome: "Structured progression toward your target band score with clear milestones and achievements."
  },
  {
    id: "analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Data Telemetry",
    subtitle: "Analytics Dashboard",
    description: "Comprehensive performance tracking with activity heatmaps, score trends, and weakness detection.",
    steps: [
      "Navigate to Analytics from the main menu",
      "View your activity heatmap showing practice consistency",
      "Check score trends over time for each skill area",
      "Identify weaknesses highlighted by the AI analysis",
      "Use insights to focus your practice sessions"
    ],
    tips: [
      "Check analytics weekly to track your progress patterns",
      "Focus practice on areas with declining scores",
      "Celebrate improvements to maintain motivation"
    ],
    outcome: "Data-driven insights to optimize your practice strategy and accelerate improvement."
  },
  {
    id: "stammer-neutralizer",
    icon: <Volume2 className="w-5 h-5" />,
    title: "Stammer Shield",
    subtitle: "Fluency Builder",
    description: "Neutralize hesitations, filler words, and stammering patterns. Build smooth, confident speech through progressive phrase practice.",
    steps: [
      "Navigate to 'Stammer Shield' from the Dashboard or Practice page",
      "Click 'Listen' to hear the AI read the target phrase clearly",
      "Click 'Start Speaking' to begin recording after a 3-second countdown",
      "Speak the phrase smoothly and confidently without hesitations",
      "Click 'Stop Recording' when you've finished speaking",
      "Review your fluency score, detected filler words, and AI feedback",
      "Click 'Next Phrase' to continue through all 6 practice phrases",
      "Complete all phrases to see your session summary and save progress"
    ],
    tips: [
      "Breathe deeply before speaking to calm nerves and reduce stammering",
      "Speak at a comfortable pace - rushing increases hesitations",
      "Replace filler words like 'um' and 'uh' with brief pauses instead",
      "Visualize the sentence in your mind before saying it aloud",
      "Practice the easier phrases until you achieve 80%+ before moving to harder ones",
      "Listen to the phrase multiple times to internalize the rhythm and flow"
    ],
    outcome: "Reduced filler words and hesitations with improved speech fluency. Sessions are saved to track your progress over time with average fluency scores."
  }
];

const Tutorial = () => {
  const navigate = useNavigate();

  return (
    <main className="max-w-6xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-mono text-xs uppercase tracking-wider">Back</span>
      </button>

      {/* Hero Section */}
      <div className="mb-16">
        <StatusBadge label="Documentation Protocol" />
        
        <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-heading font-bold tracking-tighter leading-[0.9] text-foreground mt-8 mb-6">
          USER<br />
          <span className="text-mercury">GUIDE.</span>
        </h1>
        
        <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
          Complete documentation for the SPEAKMASTER neural interface. Learn how to maximize your IELTS speaking preparation with our advanced training protocols.
        </p>
      </div>

      {/* Quick Navigation */}
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="font-heading text-lg font-bold tracking-tight">Quick Navigation</h2>
          <div className="flex-1 h-px bg-border" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {guideSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="chrome-glass p-4 rounded-xl hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="text-mercury group-hover:scale-110 transition-transform">
                  {section.icon}
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {section.subtitle}
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {section.title}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Detailed Guide Sections */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-heading text-lg font-bold tracking-tight">Feature Documentation</h2>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">
            Expand to Learn
          </span>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {guideSections.map((section, index) => (
            <AccordionItem
              key={section.id}
              value={section.id}
              id={section.id}
              className="chrome-glass rounded-xl border-0 overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-10 h-10 rounded-lg bg-mercury/10 flex items-center justify-center text-mercury">
                    {section.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-heading text-lg font-bold text-foreground">
                        {section.title}
                      </h3>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-mercury px-2 py-0.5 rounded bg-mercury/10">
                        {section.subtitle}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {section.description}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-6 pb-6">
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  {/* How to Use */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-mercury" />
                      <h4 className="font-mono text-xs uppercase tracking-wider text-foreground">
                        How to Use
                      </h4>
                    </div>
                    <ol className="space-y-2">
                      {section.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex gap-3 text-sm text-muted-foreground">
                          <span className="font-mono text-[10px] text-mercury mt-0.5">
                            {String(stepIndex + 1).padStart(2, '0')}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Tips & Outcome */}
                  <div className="space-y-6">
                    {/* Pro Tips */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-400" />
                        <h4 className="font-mono text-xs uppercase tracking-wider text-foreground">
                          Pro Tips
                        </h4>
                      </div>
                      <ul className="space-y-2">
                        {section.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex gap-2 text-sm text-muted-foreground">
                            <span className="text-amber-400">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Expected Outcome */}
                    <div className="chrome-glass-subtle p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <h4 className="font-mono text-xs uppercase tracking-wider text-foreground">
                          Expected Outcome
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {section.outcome}
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Tips for Success */}
      <section className="mt-16">
        <div className="chrome-glass rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-mercury/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-mercury" />
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              Tips for Success
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-mercury" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-foreground">
                  Consistency
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Practice daily, even if only for 15 minutes. Regular practice builds muscle memory for fluent speech patterns.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-mercury" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-foreground">
                  Focus Areas
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Use Analytics to identify weaknesses. Spend 60% of practice time on weak areas and 40% maintaining strengths.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-mercury" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-foreground">
                  AI Feedback
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Review AI feedback after every session. Implement suggestions in your next practice for continuous improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground">
            SPEAKMASTER_DOCS_V1.1
          </span>
          <button
            onClick={() => navigate('/')}
            className="btn-mercury h-10 px-6 rounded-full text-sm"
          >
            Return to Command Center
          </button>
        </div>
      </footer>
    </main>
  );
};

export default Tutorial;
