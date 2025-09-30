"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  const messages = {
    OAuthSignin: "Error in OAuth sign in.",
    OAuthCallback: "Error in OAuth callback.",
    OAuthCreateAccount: "Could not create account.",
    OAuthAccountNotLinked: "Account already linked with another login method.",
    CredentialsSignin: "Invalid credentials.",
    default: "Something went wrong. Please try again.",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
      <p className="mt-2 text-gray-700">{messages[error] ?? messages.default}</p>
      <button
        onClick={() => router.push("/login")}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Back to Login
      </button>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
