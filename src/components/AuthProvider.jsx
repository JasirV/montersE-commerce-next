"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

function SessionSync({ children }) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.accessToken) {
      localStorage.setItem("accessToken", session.accessToken);
      if (session.user) {
        localStorage.setItem("user", JSON.stringify(session.user));
      }
      window.dispatchEvent(new Event("authChange"));
    }
  }, [session]);

  return children;
}

export default function AuthProvider({ children }) {
  return (
    <SessionProvider>
      <SessionSync>
        {children}
      </SessionSync>
    </SessionProvider>
  );
}
