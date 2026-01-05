import { useState } from "react";
import { Key, ExternalLink, Eye, EyeOff, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApiKey } from "@/hooks/useApiKey";

interface ApiKeySetupProps {
  onComplete?: () => void;
  isUpdateMode?: boolean;
}

export const ApiKeySetup = ({ onComplete, isUpdateMode = false }: ApiKeySetupProps) => {
  const { saveApiKey, updateApiKey } = useApiKey();
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsSubmitting(true);
    const success = isUpdateMode 
      ? updateApiKey(apiKey)
      : saveApiKey(apiKey);
    
    if (success) {
      setApiKey("");
      onComplete?.();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4">
        <div className="chrome-glass rounded-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Key className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-heading font-bold tracking-tight">
              {isUpdateMode ? "Update API Key" : "Connect Your AI"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isUpdateMode 
                ? "Enter your new Groq API key to continue using AI features"
                : "Enter your Groq API key to unlock AI-powered speech analysis and content generation"
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                placeholder="gsk_xxxxxxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10 font-mono text-sm bg-background/50"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 btn-mercury"
              disabled={!apiKey.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isUpdateMode ? "Updating..." : "Connecting..."}
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {isUpdateMode ? "Update API Key" : "Connect API Key"}
                </>
              )}
            </Button>
          </form>

          {/* Help */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">
              Don't have a Groq API key?
            </p>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
            >
              <span>Get your free API key from Groq</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-xs font-medium text-foreground">Free Tier</p>
              <p className="text-[10px] text-muted-foreground mt-1">Generous limits</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <p className="text-xs font-medium text-foreground">Llama 3.3 70B</p>
              <p className="text-[10px] text-muted-foreground mt-1">Powerful AI</p>
            </div>
          </div>

          {isUpdateMode && (
            <button
              type="button"
              onClick={onComplete}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
