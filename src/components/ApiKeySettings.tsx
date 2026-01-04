import { useState } from "react";
import { Key, Trash2, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApiKey } from "@/hooks/useApiKey";
import { ApiKeySetup } from "./ApiKeySetup";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ApiKeySettingsProps {
  onClose?: () => void;
}

export const ApiKeySettings = ({ onClose }: ApiKeySettingsProps) => {
  const { hasApiKey, deleteApiKey } = useApiKey();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteApiKey();
    } finally {
      setIsDeleting(false);
    }
  };

  if (showUpdateModal) {
    return <ApiKeySetup isUpdateMode onComplete={() => setShowUpdateModal(false)} />;
  }

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
              API Key Settings
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage your Groq API key for AI features
            </p>
          </div>

          {/* Status */}
          <div className="p-4 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${hasApiKey ? 'bg-green-500' : 'bg-red-500'}`} />
                <div>
                  <p className="text-sm font-medium">
                    {hasApiKey ? "API Key Connected" : "No API Key"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {hasApiKey ? "Your Groq API key is active" : "Add an API key to use AI features"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => setShowUpdateModal(true)}
              className="w-full h-12"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {hasApiKey ? "Update API Key" : "Add API Key"}
            </Button>

            {hasApiKey && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full h-12"
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove API Key
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove API Key?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove your Groq API key. You won't be able to use AI features until you add a new key.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {/* Help Link */}
          <div className="pt-4 border-t border-border">
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
            >
              <span>Manage keys on Groq Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
