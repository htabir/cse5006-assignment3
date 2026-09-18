// Auth state comes from the server (GET /api/auth/me), never from anything stored in the browser.
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '@/lib/api';

export interface AuthUser {
  id: string;
  login: string;
  name: string | null;
  avatar_url: string | null;
}

type AuthState =
  | { status: 'loading'; user: null }
  | { status: 'authenticated'; user: AuthUser }
  | { status: 'anonymous'; user: null };

type AuthContextValue = AuthState & { logout: () => Promise<void> };

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading', user: null });

  useEffect(() => {
    let cancelled = false;
    api<AuthUser>('/api/auth/me')
      .then((user) => !cancelled && setState({ status: 'authenticated', user }))
      .catch(() => !cancelled && setState({ status: 'anonymous', user: null }));
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(async () => {
    await api<void>('/api/auth/logout', { method: 'POST' });
    setState({ status: 'anonymous', user: null });
  }, []);

  return <AuthContext.Provider value={{ ...state, logout }}>{children}</AuthContext.Provider>;
}

// oxlint-disable-next-line react/only-export-components -- provider and hook belong together
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
