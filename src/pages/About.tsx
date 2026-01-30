import { ArrowLeft, Mic, Brain, Target, Trophy, BookOpen, BarChart3, Users, Zap, Shield, Globe, Clock, Heart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CosmicBackground } from "@/components/CosmicBackground";
import speakmasterBanner from "@/assets/speakmaster-banner.png";

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Mic,
      title: "Real-time Speech Recognition",
      description: "Advanced Web Speech API integration for accurate transcription and instant feedback on your speaking."
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Groq AI analyzes your responses for fluency, grammar, pronunciation, and lexical resource using IELTS criteria."
    },
    {
      icon: Target,
      title: "Band Score Tracking",
      description: "Get detailed band scores for each criterion and track your progress toward your target score."
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Unlock badges and achievements as you practice, building motivation through gamification."
    },
    {
      icon: BookOpen,
      title: "Vocabulary Bank",
      description: "Save words from AI feedback with spaced repetition review to expand your lexical range."
    },
    {
      icon: BarChart3,
      title: "Session History",
      description: "Review past sessions with full transcripts, scores, and AI feedback to track improvement."
    }
  ];

  const practiceModules = [
    {
      title: "Mock Exam",
      description: "Full IELTS speaking test simulation with all three parts.",
      icon: Users
    },
    {
      title: "Cue Card (Part 2)",
      description: "Practice 2-minute monologues with real topic cards and AI scoring.",
      icon: BookOpen
    },
    {
      title: "Discussion (Part 3)",
      description: "Engage with abstract discussion questions on various topics.",
      icon: Brain
    },
    {
      title: "Read Aloud",
      description: "Improve pronunciation and fluency by reading passages aloud.",
      icon: Mic
    },
    {
      title: "Idioms Master",
      description: "Learn and practice using idiomatic expressions naturally.",
      icon: Zap
    },
    {
      title: "Intonation Lab",
      description: "Perfect your stress patterns and intonation for natural speech.",
      icon: Globe
    },
    {
      title: "Stammer Neutralizer",
      description: "Techniques to reduce hesitation and improve speech flow.",
      icon: Shield
    }
  ];

  const techStack = [
    "React 18 with TypeScript",
    "Tailwind CSS with custom Mercury design system",
    "Supabase for authentication and database",
    "Groq AI (llama-3.3-70b-versatile) for speech analysis",
    "Web Speech API for real-time transcription",
    "Framer Motion for animations"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <CosmicBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
        {/* Banner */}
        <div className="mb-8 rounded-2xl overflow-hidden border border-border/50 max-h-[40vh]">
          <img 
            src={speakmasterBanner} 
            alt="SpeakMaster by ARH" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-mono font-bold bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
              About SpeakMaster
            </h1>
            <p className="text-muted-foreground font-mono text-sm">Your AI-Powered IELTS Speaking Coach</p>
          </div>
        </div>

        {/* Hero Section */}
        <div className="backdrop-blur-xl bg-card/30 border border-border/50 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-mono font-semibold">What is SpeakMaster?</h2>
              <p className="text-muted-foreground text-sm font-mono">Version 1.0</p>
            </div>
          </div>
          <p className="text-muted-foreground font-mono leading-relaxed">
            SpeakMaster is a comprehensive IELTS speaking practice application designed to help you achieve your target band score. 
            Using advanced AI technology and real-time speech recognition, it provides personalized feedback on your speaking performance, 
            helping you identify strengths and areas for improvement across all four IELTS speaking criteria: Fluency & Coherence, 
            Lexical Resource, Grammatical Range & Accuracy, and Pronunciation.
          </p>
        </div>

        {/* Key Features */}
        <div className="mb-8">
          <h2 className="text-xl font-mono font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="backdrop-blur-xl bg-card/30 border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-mono font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm font-mono">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Modules */}
        <div className="mb-8">
          <h2 className="text-xl font-mono font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Practice Modules
          </h2>
          <div className="backdrop-blur-xl bg-card/30 border border-border/50 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {practiceModules.map((module, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/20 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <module.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-mono font-medium text-sm">{module.title}</h3>
                    <p className="text-muted-foreground text-xs font-mono">{module.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-8">
          <h2 className="text-xl font-mono font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            How It Works
          </h2>
          <div className="backdrop-blur-xl bg-card/30 border border-border/50 rounded-2xl p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 font-mono font-bold text-primary">1</div>
                <div>
                  <h3 className="font-mono font-medium">Set Up Your API Key</h3>
                  <p className="text-muted-foreground text-sm font-mono">Get a free Groq API key and configure it in the app settings.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 font-mono font-bold text-primary">2</div>
                <div>
                  <h3 className="font-mono font-medium">Choose a Practice Module</h3>
                  <p className="text-muted-foreground text-sm font-mono">Select from 7 different practice types based on your needs.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 font-mono font-bold text-primary">3</div>
                <div>
                  <h3 className="font-mono font-medium">Speak and Get Feedback</h3>
                  <p className="text-muted-foreground text-sm font-mono">Practice speaking while AI transcribes and analyzes your response in real-time.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 font-mono font-bold text-primary">4</div>
                <div>
                  <h3 className="font-mono font-medium">Review and Improve</h3>
                  <p className="text-muted-foreground text-sm font-mono">Get detailed band scores, AI feedback, and vocabulary suggestions to track your progress.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-8">
          <h2 className="text-xl font-mono font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Technology
          </h2>
          <div className="backdrop-blur-xl bg-card/30 border border-border/50 rounded-2xl p-6">
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, index) => (
                <span 
                  key={index}
                  className="px-3 py-1.5 bg-muted/30 border border-border/50 rounded-lg text-xs font-mono text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Creator */}
        <div className="mb-8">
          <h2 className="text-xl font-mono font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Meet the Creator
          </h2>
          <div className="backdrop-blur-xl bg-card/30 border border-border/50 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="font-mono font-semibold text-lg mb-1">Alokam Ruchith</h3>
                <p className="text-primary/80 font-mono text-sm mb-3">AI/ML Engineer</p>
                <p className="text-muted-foreground font-mono text-sm leading-relaxed">
                  An aspiring engineer passionate about contributing to society through advancements in AI and ML. 
                  Driven by a desire to help people, this application represents a thoughtful initiative to empower 
                  individuals in improving their English communication skills using the power of AI technology.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Credits */}
        <div className="backdrop-blur-xl bg-card/30 border border-border/50 rounded-2xl p-6 text-center">
          <p className="text-muted-foreground font-mono text-sm mb-2 flex items-center justify-center gap-1">
            Built with <Heart className="w-4 h-4 text-primary fill-primary/30" /> for IELTS aspirants worldwide
          </p>
          <p className="text-muted-foreground/60 font-mono text-xs">
            © 2025 SpeakMaster. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
