import { StreamBar } from "./StreamBar";

interface VocalizerCardProps {
  score: number;
  fluency: number;
  lexical: number;
  resonance: number;
}

export const VocalizerCard = ({ score, fluency, lexical, resonance }: VocalizerCardProps) => {
  return (
    <div className="chrome-card rounded-[40px] p-8 md:p-10 relative overflow-hidden">
      {/* Internal Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px] rounded-full" />

      <div className="flex justify-between items-start mb-12 md:mb-16">
        <div>
          <div className="hud-label mb-2">Vocal_Clarity</div>
          <div className="text-6xl md:text-7xl font-light text-foreground tracking-tighter">
            {score.toFixed(2)}
          </div>
        </div>
        <div className="w-12 h-12 border border-border rounded-xl flex items-center justify-center">
          <div className="w-1.5 h-6 bg-foreground animate-pulse" />
        </div>
      </div>

      <div className="space-y-6 md:space-y-8">
        <StreamBar
          label="Phonetic Flow"
          value={fluency >= 90 ? "Active" : `${fluency}%`}
          percentage={fluency}
        />
        <StreamBar
          label="Lexical Mesh"
          value={`${lexical.toFixed(1)}%`}
          percentage={lexical}
          delay="-0.5s"
        />
        <StreamBar
          label="Resonance"
          value={resonance >= 85 ? "Peak" : `${resonance}%`}
          percentage={resonance}
          delay="-1.2s"
        />
      </div>

      <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-border flex justify-between">
        <div className="font-mono text-[9px] text-muted-foreground">PROTOCOL_V8.4</div>
        <div className="font-mono text-[9px] text-muted-foreground">STABLE_ORBIT</div>
      </div>
    </div>
  );
};
