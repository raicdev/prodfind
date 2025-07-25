"use client";

import {
  createContext,
  useContext,
  ReactNode,
} from "react";
import { authClient } from "@/lib/auth-client";

type AuthContextType = {
  session: ReturnType<typeof authClient.useSession>["data"] | null;
  isPending: boolean;
  error: ReturnType<typeof authClient.useSession>["error"] | null;
  auth: typeof authClient;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending, error } = authClient.useSession();

  return (
    <AuthContext.Provider
      value={{
        session,
        isPending,
        error,
        auth: authClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
