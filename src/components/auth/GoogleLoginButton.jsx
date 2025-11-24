
"use client";
import React from "react";

export default function GoogleLoginButton({ className = "", children }) {
  const handleClick = () => {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BASEURL || "http://localhost:9000/api";
    const callback = `${window.location.origin}/auth/success`;
    window.location.href = `${base}/auth/google?redirect_uri=${encodeURIComponent(callback)}`;
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children || "Continue with Google"}
    </button>
  );
}