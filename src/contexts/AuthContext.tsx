import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AuthState, User, DEFAULT_USERS } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_CREDENTIALS = {
  admin: { email: 'admin@workledger.com', password: 'admin123' },
  user: { email: 'user@workledger.com', password: 'user123' },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useLocalStorage<AuthState>('workledger_auth', {
    user: null,
    isAuthenticated: false,
  });

  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check demo credentials
      if (
        email === DEMO_CREDENTIALS.admin.email &&
        password === DEMO_CREDENTIALS.admin.password
      ) {
        const adminUser = DEFAULT_USERS.find((u) => u.role === 'admin')!;
        setAuthState({ user: adminUser, isAuthenticated: true });
        return { success: true };
      }

      if (
        email === DEMO_CREDENTIALS.user.email &&
        password === DEMO_CREDENTIALS.user.password
      ) {
        const regularUser = DEFAULT_USERS.find((u) => u.role === 'user')!;
        setAuthState({ user: regularUser, isAuthenticated: true });
        return { success: true };
      }

      return { success: false, error: 'Invalid email or password' };
    },
    [setAuthState]
  );

  const logout = useCallback(() => {
    setAuthState({ user: null, isAuthenticated: false });
  }, [setAuthState]);

  const isAdmin = useMemo(() => authState.user?.role === 'admin', [authState.user]);

  const value = useMemo(
    () => ({
      ...authState,
      login,
      logout,
      isAdmin,
    }),
    [authState, login, logout, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { DEMO_CREDENTIALS };
