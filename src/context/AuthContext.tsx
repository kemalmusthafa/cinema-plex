import { createContext, useContext, useState, useEffect, type ReactNode  } from 'react';
import authService from '../services/authService';
import type { User } from '../types';


interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  handleAuthCallback: (requestToken: string) => Promise<User>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const currentUser = authService.getUser();
      setUser(currentUser);
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async () => {
    return authService.login();
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const handleAuthCallback = async (requestToken: string) => {
    const newUser = await authService.handleAuthCallback(requestToken);
    setUser(newUser);
    return newUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        handleAuthCallback
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};