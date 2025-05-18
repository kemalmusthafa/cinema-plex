import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/layout/Layout";
import Loading from "../components/common/Loading";

const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { handleAuthCallback } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    const processAuth = async () => {
      const requestToken = searchParams.get("request_token");
      const denied = searchParams.get("denied");

      // Check if access was denied by user
      if (denied) {
        setError("You denied access to your TMDB account");
        setIsLoading(false);
        return;
      }

      // Check for request token
      if (!requestToken) {
        setError(
          "No request token found in URL. Authentication flow was interrupted."
        );
        setIsLoading(false);
        return;
      }

      try {
        await handleAuthCallback(requestToken);
        navigate("/", { replace: true });
      } catch (err: any) {
        console.error("Authentication error:", err);
        // Provide more specific error message based on error
        const errorMsg =
          err?.message || "Failed to authenticate with TMDB. Please try again.";
        setError(errorMsg);
        setIsLoading(false);
      }
    };

    processAuth();
  }, [searchParams, handleAuthCallback, navigate]);

  // Handle retry
  const handleRetry = () => {
    navigate("/login", { replace: true });
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        {error ? (
          <div className="bg-red-600 p-6 rounded-lg text-white text-center max-w-md">
            <h2 className="text-xl font-bold mb-4">Authentication Error</h2>
            <p>{error}</p>
            <div className="mt-6 flex space-x-4 justify-center">
              <button
                onClick={handleRetry}
                className="bg-white text-red-600 px-6 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-transparent border border-white text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Return Home
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Loading />
            <h2 className="text-xl font-bold text-white mt-4">
              Completing Authentication
            </h2>
            <p className="text-gray-400 mt-2">
              Please wait while we complete the authentication process...
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AuthCallbackPage;
