import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CosmicBackground } from "./components/CosmicBackground";
import { CustomCursor } from "./components/CustomCursor";
import { Navigation } from "./components/Navigation";
import Index from "./pages/Index";
import Practice from "./pages/Practice";
import Roadmap from "./pages/Roadmap";
import Analytics from "./pages/Analytics";
import MockExam from "./pages/MockExam";
import CueCard from "./pages/CueCard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CosmicBackground />
        <CustomCursor />
        <Navigation />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/practice/mock-exam" element={<MockExam />} />
          <Route path="/practice/cue-card" element={<CueCard />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/analytics" element={<Analytics />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
