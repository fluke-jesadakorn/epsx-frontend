import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { hasFeaturePermission, defaultRoles } from "@/constants/roles";
import { createClient } from "@supabase/supabase-js";

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/confirmation-pending",
  "/forgot-password",
  "/reset-password",
  "/coming-soon",
];

// Initialize roles on first run
async function initializeRoles() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    // Check if roles already exist
    const { data: existingRoles } = await supabase
      .from("roles")
      .select("id")
      .in(
        "id",
        defaultRoles.map((role) => role.id)
      );

    if (!existingRoles || existingRoles.length === 0) {
      // Insert default roles without permissions
      const { error } = await supabase
        .from("roles")
        .insert(defaultRoles.map(({ permissions, ...role }) => role));

      if (error) throw error;
      console.log("Default roles initialized successfully");
    }
  } catch (error) {
    console.error("Error initializing roles:", error);
  }
}

// Run role initialization on first middleware call
let rolesInitialized = false;

export async function middleware(req: NextRequest) {
  // Initialize roles on first run
  if (!rolesInitialized) {
    await initializeRoles();
    rolesInitialized = true;
  }

  const url = req.nextUrl.pathname;

  // Redirect only main application routes to coming soon page in development mode
  if (
    process.env.NODE_ENV === "development" &&
    !url.startsWith("/_next") &&
    !url.startsWith("/static") &&
    !url.startsWith("/api") &&
    !url.startsWith("/coming-soon") &&
    url !== "/coming-soon" &&
    url !== "/favicon.ico"
  ) {
    return NextResponse.rewrite(new URL("/coming-soon", req.url));
  }


  // Create Supabase client with cookie handling
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            req.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: req,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Debug logging for development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Middleware] Processing request for: ${url}`);
  }

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Log authentication state for debugging
    if (process.env.NODE_ENV === "development") {
      console.log(`[Middleware] Auth state:`, {
        authenticated: !!user,
        error: authError?.message,
      });
    }

    // Allow public routes without session
    if (publicRoutes.includes(url)) {
      if (user && (url.startsWith("/login") || url.startsWith("/register"))) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    // Require authenticated user for protected routes
    if (authError || !user) {
      const redirectUrl = req.nextUrl.pathname + req.nextUrl.search;
      return NextResponse.redirect(
        new URL(`/login?redirect=${encodeURIComponent(redirectUrl)}`, req.url)
      );
    }

    // Get user's role from metadata
    const userRoleId = user.user_metadata?.role;
    const userRole = defaultRoles.find((role) => role.id === userRoleId);

    // Check feature permissions for the requested route
    const routePermission = Object.entries(featurePermissionsMap).find(
      ([route]) => url.startsWith(route)
    )?.[1];

    if (
      routePermission &&
      !hasFeaturePermission(
        userRole,
        routePermission.feature,
        routePermission.permission
      )
    ) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
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

// Map routes to required features and permissions
const featurePermissionsMap: Record<
  string,
  { feature: string; permission: "read" | "write" | "manage" }
> = {
  "/admin": { feature: "settings", permission: "manage" },
  "/settings": { feature: "settings", permission: "read" },
  "/developer": { feature: "settings", permission: "manage" },
  "/services": { feature: "services", permission: "read" },
  "/ranking": { feature: "projects", permission: "read" },
  "/news": { feature: "projects", permission: "read" },
};

// TODO: Add more sophisticated route protection
// For future features:
// - Implement hierarchical role-based access control with inheritance
// - Add session expiration handling with automatic token refresh
// - Implement rate limiting based on IP and user ID
// - Add CSRF protection for sensitive operations
// - Implement audit logging for security events
// - Add support for multi-factor authentication
// - Implement content security policy (CSP) headers
// - Add brute force protection for authentication endpoints
