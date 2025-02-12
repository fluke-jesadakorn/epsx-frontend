"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { signInWithOAuth, signInWithEmailPassword } from "@/utils/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Suspense } from "react";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const handleOAuthLogin = async (provider: "google" | "azure") => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithOAuth(provider, window.location.origin);
      if (result.success && result.redirectUrl) {
        router.push(result.redirectUrl);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEmailPasswordLogin = async (values: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithEmailPassword(
        values.email,
        values.password,
        redirectUrl
      );

      if (result.success && result.redirectUrl) {
        router.push(result.redirectUrl);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      type="login"
      loading={loading}
      error={error}
      onOAuthLogin={handleOAuthLogin}
      onSubmit={handleEmailPasswordLogin}
    />
  );
};

const LoginPageWithSuspense = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
};
export default LoginPageWithSuspense;

// TODO: Implement email/password authentication
// TODO: Add session management
// TODO: Implement forgot password flow
