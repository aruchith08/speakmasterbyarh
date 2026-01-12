import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface ApiKeyContextType {
  hasApiKey: boolean;
  isLoading: boolean;
  saveApiKey: (apiKey: string) => Promise<boolean>;
  updateApiKey: (apiKey: string) => Promise<boolean>;
  deleteApiKey: () => Promise<boolean>;
  refreshApiKeyStatus: () => Promise<void>;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider = ({ children }: { children: ReactNode }) => {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const checkApiKeyStatus = useCallback(async () => {
    if (!user) {
      setHasApiKey(false);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_api_keys')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking API key status:", error);
        setHasApiKey(false);
      } else {
        setHasApiKey(!!data);
      }
    } catch (error) {
      console.error("Error checking API key status:", error);
      setHasApiKey(false);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    checkApiKeyStatus();
  }, [checkApiKeyStatus]);

  const refreshApiKeyStatus = useCallback(async () => {
    await checkApiKeyStatus();
  }, [checkApiKeyStatus]);

  const saveApiKey = useCallback(async (apiKey: string): Promise<boolean> => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return false;
    }

    if (!user) {
      toast.error("You must be logged in to save an API key");
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_api_keys')
        .insert({
          user_id: user.id,
          groq_api_key: apiKey.trim()
        });

      if (error) {
        console.error("Error saving API key:", error);
        toast.error("Failed to save API key");
        return false;
      }

      setHasApiKey(true);
      toast.success("API key saved successfully!");
      return true;
    } catch (error) {
      console.error("Error saving API key:", error);
      toast.error("Failed to save API key");
      return false;
    }
  }, [user]);

  const updateApiKey = useCallback(async (apiKey: string): Promise<boolean> => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return false;
    }

    if (!user) {
      toast.error("You must be logged in to update your API key");
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_api_keys')
        .update({ groq_api_key: apiKey.trim(), updated_at: new Date().toISOString() })
        .eq('user_id', user.id);

      if (error) {
        console.error("Error updating API key:", error);
        toast.error("Failed to update API key");
        return false;
      }

      toast.success("API key updated successfully!");
      return true;
    } catch (error) {
      console.error("Error updating API key:", error);
      toast.error("Failed to update API key");
      return false;
    }
  }, [user]);

  const deleteApiKey = useCallback(async (): Promise<boolean> => {
    if (!user) {
      toast.error("You must be logged in to delete your API key");
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_api_keys')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error("Error deleting API key:", error);
        toast.error("Failed to remove API key");
        return false;
      }

      setHasApiKey(false);
      toast.success("API key removed successfully!");
      return true;
    } catch (error) {
      console.error("Error deleting API key:", error);
      toast.error("Failed to remove API key");
      return false;
    }
  }, [user]);

  return (
    <ApiKeyContext.Provider value={{ hasApiKey, isLoading, saveApiKey, updateApiKey, deleteApiKey, refreshApiKeyStatus }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error("useApiKey must be used within an ApiKeyProvider");
  }
  return context;
};
