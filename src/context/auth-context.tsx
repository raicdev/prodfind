"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authClient } from "@/lib/auth-client";

type AuthContextType = {
  session: ReturnType<typeof authClient.useSession>["data"] | null;
  isPending: boolean;
  error: ReturnType<typeof authClient.useSession>["error"] | null;
  signIn: typeof authClient.signIn & {
    twoFactor: typeof authClient.twoFactor;
  };
  signUp: typeof authClient.signUp;
  signOut: typeof authClient.signOut;
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
        signIn: {
          ...authClient.signIn,
          twoFactor: authClient.twoFactor,
        },
        signUp: authClient.signUp,
        signOut: authClient.signOut,
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
