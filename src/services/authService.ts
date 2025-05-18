import type { AuthResponse, User } from '../types';
import { fetchDataV3 } from './api';

const LOCAL_STORAGE_KEY = 'cinema_plex_auth';

// Get authentication token
export const getRequestToken = async (): Promise<string> => {
  try {
    const data = await fetchDataV3('/authentication/token/new');
    
    if (!data.success || !data.request_token) {
      throw new Error(`Failed to get request token: ${JSON.stringify(data)}`);
    }
    
    return data.request_token;
  } catch (error) {
    console.error('Error getting request token:', error);
    throw error;
  }
};

// Create a new authenticated session with TMDB
export const createSession = async (requestToken: string): Promise<string> => {
  try {
    const data = await fetchDataV3('/authentication/session/new', {
      method: 'POST',
      body: JSON.stringify({ request_token: requestToken })
    }) as AuthResponse;
    
    if (data.success && data.session_id) {
      return data.session_id;
    } else {
      throw new Error(`Failed to create session: ${JSON.stringify(data)}`);
    }
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

// Get account details
export const getAccountDetails = async (sessionId: string): Promise<User> => {
  try {
    const data = await fetchDataV3('/account', {
      params: {
        session_id: sessionId
      }
    });
    
    return {
      id: data.id,
      username: data.username,
      session_id: sessionId
    };
  } catch (error) {
    console.error('Error getting account details:', error);
    throw error;
  }
};

// Login with redirect
export const login = async (): Promise<void> => {
  try {
    const requestToken = await getRequestToken();
    // Redirect to TMDB authentication page with correct URL format
    window.location.href = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${encodeURIComponent(window.location.origin + '/auth-callback')}`;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Handle TMDB authentication callback
export const handleAuthCallback = async (requestToken: string): Promise<User> => {
  try {
    const sessionId = await createSession(requestToken);
    const userDetails = await getAccountDetails(sessionId);
    
    // Save to local storage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userDetails));
    
    return userDetails;
  } catch (error) {
    console.error('Auth callback error:', error);
    throw error;
  }
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  return !!getUser();
};

// Get current user
export const getUser = (): User | null => {
  const userData = localStorage.getItem(LOCAL_STORAGE_KEY);
  return userData ? JSON.parse(userData) : null;
};

// Log out
export const logout = async (): Promise<void> => {
  const user = getUser();
  
  if (user && user.session_id) {
    try {
      await fetchDataV3('/authentication/session', {
        method: 'DELETE',
        body: JSON.stringify({ session_id: user.session_id })
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
  
  // Remove from local storage
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};

export default {
  login,
  logout,
  handleAuthCallback,
  isLoggedIn,
  getUser
};