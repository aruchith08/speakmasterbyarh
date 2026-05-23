import Dashboard from "./Dashboard";
import Landing from "./Landing";
import { useAuth } from "@/hooks/useAuth";
import { useApiKey } from "@/hooks/useApiKey";
import { ApiKeySetup } from "@/components/ApiKeySetup";

const Index = () => {
  const { user, loading } = useAuth();
  const { hasApiKey, isLoading } = useApiKey();

  if (loading) return null;

  if (!user) return <Landing />;

  const showApiKeySetup = !isLoading && !hasApiKey;

  return (
    <>
      <Dashboard />
      {showApiKeySetup && <ApiKeySetup />}
    </>
  );
};

export default Index;
