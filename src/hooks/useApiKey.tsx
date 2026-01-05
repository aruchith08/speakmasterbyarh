import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { toast } from "sonner";

const API_KEY_STORAGE_KEY = "groq_api_key";

interface ApiKeyContextType {
  hasApiKey: boolean;
  isLoading: boolean;
  getApiKey: () => string | null;
  saveApiKey: (apiKey: string) => boolean;
  updateApiKey: (apiKey: string) => boolean;
  deleteApiKey: () => boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider = ({ children }: { children: ReactNode }) => {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    setHasApiKey(!!storedKey);
    setIsLoading(false);
  }, []);

  const getApiKey = useCallback((): string | null => {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  }, []);

  const saveApiKey = useCallback((apiKey: string): boolean => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return false;
    }

    try {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
      setHasApiKey(true);
      toast.success("API key saved successfully!");
      return true;
    } catch (error) {
      console.error("Error saving API key:", error);
      toast.error("Failed to save API key");
      return false;
    }
  }, []);

  const updateApiKey = useCallback((apiKey: string): boolean => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return false;
    }

    try {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
      toast.success("API key updated successfully!");
      return true;
    } catch (error) {
      console.error("Error updating API key:", error);
      toast.error("Failed to update API key");
      return false;
    }
  }, []);

  const deleteApiKey = useCallback((): boolean => {
    try {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      setHasApiKey(false);
      toast.success("API key removed successfully!");
      return true;
    } catch (error) {
      console.error("Error deleting API key:", error);
      toast.error("Failed to remove API key");
      return false;
    }
  }, []);

  return (
    <ApiKeyContext.Provider value={{ hasApiKey, isLoading, getApiKey, saveApiKey, updateApiKey, deleteApiKey }}>
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
