
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/lib/user-role";
import {
  AuthApiError,
  getCurrentUser,
  loginUser,
  registerUser,
  type AuthUser,
} from "@/lib/auth-api";

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

interface AuthContextValue {
  user: AuthUser | null;
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  restoreError: string | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (fullName: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  loading: true,
  isAuthenticated: false,
  restoreError: null,
  login: async () => { throw new Error("Authentication unavailable"); },
  register: async () => { throw new Error("Authentication unavailable"); },
  logout: () => {},
});

const TOKEN_KEY = "nexora_auth_token";
const USER_KEY = "nexora_auth_user";

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      let token: string | null;
      try {
        localStorage.removeItem("nexora_demo_role");
        localStorage.removeItem("nexora_demo_session");
        token = localStorage.getItem(TOKEN_KEY);
        if (!token) localStorage.removeItem(USER_KEY);
      } catch {
        if (!cancelled) {
          setRestoreError("Browser storage is unavailable; authentication cannot be restored.");
          setLoading(false);
        }
        return;
      }

      if (!token) {
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        const restoredUser = await getCurrentUser(token);
        if (!cancelled) {
          setUser(restoredUser);
          setRestoreError(null);
          localStorage.setItem(USER_KEY, JSON.stringify(restoredUser));
        }
      } catch (error) {
        if (
          error instanceof AuthApiError &&
          (error.status === 401 || error.status === 403)
        ) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
        if (!cancelled) {
          setUser(null);
          setRestoreError(
            error instanceof Error
              ? error.message
              : "Unable to restore the authentication session.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginUser(email, password);
    localStorage.setItem(TOKEN_KEY, result.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    setUser(result.user);
    setRestoreError(null);
    return result.user;
  }, []);

  const register = useCallback(async (
    fullName: string,
    email: string,
    password: string,
  ) => {
    await registerUser({ full_name: fullName, email, password });
    return login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setRestoreError(null);
    router.replace("/login");
  }, [router]);

  const role = user?.role ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        isAuthenticated: user !== null,
        restoreError,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth() {
  return useContext(AuthContext);
}
