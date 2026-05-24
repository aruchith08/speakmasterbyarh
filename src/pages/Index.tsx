import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Dashboard from "./Dashboard";
import Landing from "./Landing";
import { useAuth } from "@/hooks/useAuth";
import { useApiKey } from "@/hooks/useApiKey";
import { ApiKeySetup } from "@/components/ApiKeySetup";

const LANDING_SEEN_KEY = "sm_landing_seen";

const Index = () => {
  const { user, loading } = useAuth();
  const { hasApiKey, isLoading } = useApiKey();
  const location = useLocation();

  // Decide synchronously on first render to avoid flicker.
  const [showLanding] = useState(() => {
    if (location.pathname !== "/") return false;
    if (typeof window === "undefined") return false;
    return localStorage.getItem(LANDING_SEEN_KEY) !== "1";
  });

  useEffect(() => {
    if (showLanding) {
      try {
        localStorage.setItem(LANDING_SEEN_KEY, "1");
      } catch {
        // ignore (private mode, etc.)
      }
    }
  }, [showLanding]);

  if (showLanding) return <Landing />;

  if (loading) return null;

  const showApiKeySetup = !!user && !isLoading && !hasApiKey;

  return (
    <>
      <Dashboard />
      {showApiKeySetup && <ApiKeySetup />}
    </>
  );
};

export default Index;
