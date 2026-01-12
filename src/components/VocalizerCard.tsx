import { StreamBar } from "./StreamBar";

interface VocalizerCardProps {
  score: number;
  fluency: number;
  lexical: number;
  resonance: number;
}

export const VocalizerCard = ({ score, fluency, lexical, resonance }: VocalizerCardProps) => {
  // Handle zero/null values gracefully
  const displayScore = score > 0 ? score.toFixed(2) : "—";
  const displayFluency = fluency > 0 ? (fluency >= 90 ? "Active" : `${fluency}%`) : "—";
  const displayLexical = lexical > 0 ? `${lexical.toFixed(1)}%` : "—";
  const displayResonance = resonance > 0 ? (resonance >= 85 ? "Peak" : `${resonance}%`) : "—";
  
  const hasData = score > 0 || fluency > 0 || lexical > 0 || resonance > 0;

  return (
    <div className="chrome-card rounded-[40px] p-8 md:p-10 relative overflow-hidden">
      {/* Internal Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px] rounded-full" />

      <div className="flex justify-between items-start mb-12 md:mb-16">
        <div>
          <div className="hud-label mb-2">Vocal_Clarity</div>
          <div className="text-6xl md:text-7xl font-light text-foreground tracking-tighter">
            {displayScore}
          </div>
          {!hasData && (
            <p className="text-xs text-muted-foreground mt-2">Complete a session to see your scores</p>
          )}
        </div>
        <div className="w-12 h-12 border border-border rounded-xl flex items-center justify-center">
          <div className={`w-1.5 h-6 bg-foreground ${hasData ? 'animate-pulse' : 'opacity-30'}`} />
        </div>
      </div>

      <div className="space-y-6 md:space-y-8">
        <StreamBar
          label="Phonetic Flow"
          value={displayFluency}
          percentage={fluency || 0}
        />
        <StreamBar
          label="Lexical Mesh"
          value={displayLexical}
          percentage={lexical || 0}
          delay="-0.5s"
        />
        <StreamBar
          label="Resonance"
          value={displayResonance}
          percentage={resonance || 0}
          delay="-1.2s"
        />
      </div>

      <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-border flex justify-between">
        <div className="font-mono text-[9px] text-muted-foreground">PROTOCOL_V8.4</div>
        <div className="font-mono text-[9px] text-muted-foreground">{hasData ? "ACTIVE_SESSION" : "AWAITING_DATA"}</div>
      </div>
    </div>
  );
};
