// src/features/auth/OAuthHandler.jsx
"use client"; // <-- this is required

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // app dir router

const OAuthHandler = () => {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const userData = params.get("user");

        if (token && userData) {
          localStorage.setItem("accessToken", token);
          const user = JSON.parse(decodeURIComponent(userData));
          localStorage.setItem("user", JSON.stringify(user));
          window.dispatchEvent(new Event("authChange"));
          router.replace("/"); // navigate to home
        } else {
          router.replace("/auth/login");
        }
      } catch (error) {
        console.error("OAuth handling error:", error);
        router.replace("/auth/login?error=oauth_failed");
      }
    };

    handleOAuthCallback();
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e518e] mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default OAuthHandler;
