
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function AuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        router.replace("/");
        return;
      }

      const decoded = jwtDecode(token);
      const user = {
        id: decoded.sub || decoded.id || decoded._id || "",
        name: decoded.name || "",
        email: decoded.email || "",
        picture: decoded.picture || decoded.image || null,
        provider: "google",
      };

      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("authChange"));
      router.replace("/");
    } catch {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-sm text-gray-600">Signing you in...</div>
    </div>
  );
}