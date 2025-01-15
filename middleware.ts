import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/utils/supabase/server";

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/confirmation-pending",
  "/forgot-password",
  "/reset-password",
];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;
  const supabase = await createServerClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Allow public routes without session
    if (publicRoutes.includes(url)) {
      // If user is logged in and tries to access auth pages, redirect to home
      if (
        session &&
        (url.startsWith("/login") || url.startsWith("/register"))
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    // Require session for protected routes
    if (!session) {
      // Store the requested URL for redirect after login
      const redirectUrl = req.nextUrl.pathname + req.nextUrl.search;
      return NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(redirectUrl)}`, req.url)
      );
    }

    // Refresh session if needed
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: "/((?!api|_next|static|favicon.ico).*)",
};

// TODO: Add more sophisticated route protection
// For future features:
// - Role-based access control
// - Session expiration handling
// - Rate limiting
