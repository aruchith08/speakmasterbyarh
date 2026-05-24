import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CosmicBackground } from "./components/CosmicBackground";

import { Navigation } from "./components/Navigation";
import { SplashScreen } from "./components/SplashScreen";
import { PageTransition } from "./components/PageTransition";
import { AuthProvider } from "./hooks/useAuth";
import { ApiKeyProvider } from "./hooks/useApiKey";
import Index from "./pages/Index";
import Practice from "./pages/Practice";
import Roadmap from "./pages/Roadmap";
import Analytics from "./pages/Analytics";
import MockExam from "./pages/MockExam";
import CueCard from "./pages/CueCard";
import ReadAloud from "./pages/ReadAloud";
import Discussion from "./pages/Discussion";
import Idioms from "./pages/Idioms";
import Intonation from "./pages/Intonation";
import Phonetics from "./pages/Phonetics";
import Drills from "./pages/Drills";
import StammerNeutralizer from "./pages/StammerNeutralizer";
import Auth from "./pages/Auth";
import Tutorial from "./pages/Tutorial";
import Profile from "./pages/Profile";
import SessionHistory from "./pages/SessionHistory";
import Vocabulary from "./pages/Vocabulary";
import Achievements from "./pages/Achievements";
import About from "./pages/About";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/app" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/landing" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/practice" element={<PageTransition><Practice /></PageTransition>} />
        <Route path="/practice/mock-exam" element={<PageTransition><MockExam /></PageTransition>} />
        <Route path="/practice/cue-card" element={<PageTransition><CueCard /></PageTransition>} />
        <Route path="/practice/read-aloud" element={<PageTransition><ReadAloud /></PageTransition>} />
        <Route path="/practice/discussion" element={<PageTransition><Discussion /></PageTransition>} />
        <Route path="/practice/drills" element={<PageTransition><Drills /></PageTransition>} />
        <Route path="/practice/drills/idioms" element={<PageTransition><Idioms /></PageTransition>} />
        <Route path="/practice/drills/intonation" element={<PageTransition><Intonation /></PageTransition>} />
        <Route path="/practice/drills/phonetics" element={<PageTransition><Phonetics /></PageTransition>} />
        <Route path="/practice/stammer-neutralizer" element={<PageTransition><StammerNeutralizer /></PageTransition>} />
        <Route path="/roadmap" element={<PageTransition><Roadmap /></PageTransition>} />
        <Route path="/analytics" element={<PageTransition><Analytics /></PageTransition>} />
        <Route path="/tutorial" element={<PageTransition><Tutorial /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/session-history" element={<PageTransition><SessionHistory /></PageTransition>} />
        <Route path="/vocabulary" element={<PageTransition><Vocabulary /></PageTransition>} />
        <Route path="/achievements" element={<PageTransition><Achievements /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ApiKeyProvider>
              {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
              <CosmicBackground />
              
              <Navigation />
              <AnimatedRoutes />
            </ApiKeyProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
