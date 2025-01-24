"use client";

import { AuthForm } from "@/components/auth/AuthForm";
import { signInWithOAuth, signUpWithEmailPassword } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Suspense } from "react";

const RegisterPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOAuthLogin = async (provider: "google" | "azure") => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithOAuth(provider);
      if (result.success && result.redirectUrl) {
        window.location.href = result.redirectUrl;
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

  const handleEmailPasswordRegister = async (values: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await signUpWithEmailPassword(
        values.email,
        values.password,
        window.location.origin
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
      type="register"
      loading={loading}
      error={error}
      onOAuthLogin={handleOAuthLogin}
      onSubmit={handleEmailPasswordRegister}
    />
  );
};

const SuspendedRegisterPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <RegisterPage />
  </Suspense>
);

export default SuspendedRegisterPage;
export const runtime = 'edge';
// TODO: Implement email/password registration
// TODO: Add email verification flow
// TODO: Implement password recovery
