import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Creates a Supabase client for middleware with proper cookie handling
 * @param request - The incoming Next.js request
 * @returns NextResponse with Supabase client and cookie handling
 */
export const createClient = (request: NextRequest) => {
  try {
    // Create an unmodified response
    let supabaseResponse = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    return supabaseResponse;
  } catch (error) {
    console.error('Middleware Supabase client creation failed:', error);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};

// Future Improvements:
// 1. Add rate limiting for authentication attempts
// 2. Implement session validation and refresh
// 3. Add support for multi-factor authentication
// 4. Implement IP-based security checks
// 5. Add audit logging for authentication events
// 6. Implement role-based access control at the middleware level
// 7. Add support for device fingerprinting
// 8. Implement session timeout handling
