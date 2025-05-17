import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import Loading from '../components/common/Loading';

const AuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { handleAuthCallback } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processAuth = async () => {
      const requestToken = searchParams.get('request_token');
      
      if (!requestToken) {
        setError('No request token found in URL');
        return;
      }

      try {
        await handleAuthCallback(requestToken);
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Authentication error:', err);
        setError('Failed to authenticate with TMDB. Please try again.');
      }
    };

    processAuth();
  }, [searchParams, handleAuthCallback, navigate]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        {error ? (
          <div className="bg-red-600 p-6 rounded-lg text-white text-center max-w-md">
            <h2 className="text-xl font-bold mb-4">Authentication Error</h2>
            <p>{error}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 bg-white text-red-600 px-6 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              Return to Home
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Loading />
            <h2 className="text-xl font-bold text-white mt-4">Completing Authentication</h2>
            <p className="text-gray-400 mt-2">Please wait while we complete the authentication process...</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AuthCallbackPage;