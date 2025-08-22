"use client";

import { createContext, useContext, ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

type SessionContextType = {
  session: any | null; // session object từ BetaAuth
  isPending: boolean;
  error: any | null;
  refetch: () => void;
};

const SessionContext = createContext<SessionContextType>({
  session: null,
  isPending: true,
  error: null,
  refetch: () => {},
});

type SessionProviderProps = {
  children: ReactNode;
};

export function SessionProvider({ children }: SessionProviderProps) {
  const { data, isPending, error, refetch } = authClient.useSession();

  return (
    <SessionContext.Provider
      value={{
        session: data,
        isPending,
        error,
        refetch,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

// Hook tiện lợi để dùng session trong component
export function useSession() {
  return useContext(SessionContext);
}
