import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CosmicBackground } from "./components/CosmicBackground";
import { CustomCursor } from "./components/CustomCursor";
import { Navigation } from "./components/Navigation";
import { AuthProvider } from "./hooks/useAuth";
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
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CosmicBackground />
          <CustomCursor />
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/practice/mock-exam" element={<MockExam />} />
            <Route path="/practice/cue-card" element={<CueCard />} />
            <Route path="/practice/read-aloud" element={<ReadAloud />} />
            <Route path="/practice/discussion" element={<Discussion />} />
            <Route path="/practice/drills/idioms" element={<Idioms />} />
            <Route path="/practice/drills/intonation" element={<Intonation />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
