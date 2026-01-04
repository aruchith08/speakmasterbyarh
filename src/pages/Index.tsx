import Dashboard from "./Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { useApiKey } from "@/hooks/useApiKey";
import { ApiKeySetup } from "@/components/ApiKeySetup";

const Index = () => {
  const { user } = useAuth();
  const { hasApiKey, isLoading } = useApiKey();

  // Show API key setup modal for logged-in users without an API key
  const showApiKeySetup = user && !isLoading && !hasApiKey;

  return (
    <>
      <Dashboard />
      {showApiKeySetup && <ApiKeySetup />}
    </>
  );
};

export default Index;
