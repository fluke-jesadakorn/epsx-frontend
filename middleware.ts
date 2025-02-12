import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/confirmation-pending",
  "/forgot-password",
  "/reset-password",
  "/coming-soon",
];

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;

  // Debug logging for development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Middleware] Processing request for: ${url}`);
  }

  try {
    // TODO: Implement authentication check
    const isAuthenticated = false; // Replace with actual auth check

    // Allow public routes without authentication
    if (publicRoutes.includes(url)) {
      return NextResponse.next();
    }

    // Require authentication for protected routes
    if (!isAuthenticated) {
      const redirectUrl = req.nextUrl.pathname + req.nextUrl.search;
      return NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(redirectUrl)}`, req.url)
      );
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

// TODO: Future Authentication Features
// - Implement user authentication system (e.g., NextAuth.js, Auth0)
// - Add role-based access control
// - Add session management
// - Implement rate limiting
// - Add CSRF protection
// - Set up audit logging
// - Enable multi-factor authentication
// - Configure CSP headers
// - Add brute force protection
