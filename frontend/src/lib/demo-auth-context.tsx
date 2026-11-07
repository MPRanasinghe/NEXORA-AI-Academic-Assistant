
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  clearDemoSession,
  getDemoRole,
  isDemoSessionActive,
  setDemoRole,
  type UserRole,
} from "@/lib/demo-user";

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

interface DemoAuthContextValue {
  /** null while hydrating, then the active role (or null = not logged in) */
  role: UserRole | null;
  /** true only during SSR (before the client has read localStorage) */
  loading: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const DemoAuthContext = createContext<DemoAuthContextValue>({
  role: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

// ---------------------------------------------------------------------------
// Helpers that run safely only in the browser
// ---------------------------------------------------------------------------

function readInitialRole(): UserRole | null {
  if (typeof window === "undefined") return null;
  if (!isDemoSessionActive()) return null;
  return getDemoRole();
}

function readInitialLoading(): boolean {
  // On the server window is undefined → loading stays true.
  // On the client we can read localStorage immediately → not loading.
  return typeof window === "undefined";
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Both lazy initializers run synchronously on the first render.
  // On the client the loading initializer returns false, so the whole
  // provider is immediately in a "ready" state without any useEffect.
  const [role, setRole] = useState<UserRole | null>(readInitialRole);
  const [loading] = useState<boolean>(readInitialLoading);

  const login = useCallback((selectedRole: UserRole) => {
    setDemoRole(selectedRole);
    setRole(selectedRole);
  }, []);

  const logout = useCallback(() => {
    clearDemoSession();
    setRole(null);
    router.push("/login");
  }, [router]);

  return (
    <DemoAuthContext.Provider value={{ role, loading, login, logout }}>
      {children}
    </DemoAuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useDemoAuth() {
  return useContext(DemoAuthContext);
}
