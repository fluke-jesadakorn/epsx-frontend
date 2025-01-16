"use server";

import { createServerClient } from "@/utils/supabase/server";

export type AuthResponse = {
  success: boolean;
  error?: string;
  redirectUrl?: string;
};

export async function getSession() {
  const supabase = await createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  // Return a plain object with only the necessary session data
  return {
    user: {
      id: session.user?.id,
      email: session.user?.email,
      role: session.user?.role,
    },
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
  };
}

export async function signInWithOAuth(
  provider: "google" | "azure",
  redirectOrigin?: string
): Promise<AuthResponse> {
  const supabase = await createServerClient();

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectOrigin
          ? `${redirectOrigin}/auth/callback`
          : undefined,
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (!data.url) {
      return {
        success: false,
        error: "No redirect URL returned",
      };
    }

    return {
      success: true,
      redirectUrl: data.url,
    };
  } catch (error) {
    console.error("Error signing in with OAuth:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function signInWithEmailPassword(
  email: string,
  password: string,
  redirectUrl?: string
): Promise<AuthResponse> {
  const supabase = await createServerClient();

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Return plain object without any class instances
    const response: AuthResponse = {
      success: true,
      redirectUrl: redirectUrl || "/",
    };
    return response;
  } catch (error) {
    console.error("Error signing in with email and password:", error);
    const errorMessage = "An unexpected error occurred";

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function signUpWithEmailPassword(
  email: string,
  password: string,
  redirectOrigin?: string
): Promise<AuthResponse> {
  const supabase = await createServerClient();

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectOrigin
          ? `${redirectOrigin}/auth/callback`
          : undefined,
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      redirectUrl: "/confirmation-pending",
    };
  } catch (error) {
    console.error("Error signing up with email and password:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function signOut(): Promise<AuthResponse> {
  const supabase = await createServerClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // TODO: Consider adding redirect handling at the component level
    // instead of in the auth service for better flexibility
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error signing out:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}