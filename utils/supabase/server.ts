"use server";

import {
  createServerClient as Create,
  type CookieOptions,
} from "@supabase/ssr";
import { cookies } from "next/headers";
import { defaultRoles } from "@/constants/roles";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function createServerClient(cookieStore?: ReadonlyRequestCookies) {
  const store = cookieStore || (await cookies());
  const supabase = Create(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          try {
            return store.getAll();
          } catch (error) {
            console.error("Failed to get cookies:", error);
            return [];
          }
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              store.set(name, value, options);
            });
          } catch (error) {
            console.error("Failed to set cookies:", error);
          }
        },
      },
    }
  );

  // Get authenticated user data directly from Supabase Auth server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Check if user exists in users table
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userData) {
      // Create new user with default 'viewer' role
      const defaultRole = defaultRoles.find(role => role.id === 'viewer');
      await supabase
        .from('users')
        .insert([{
          id: user.id,
          email: user.email,
          role: defaultRole?.id || 'viewer'
        }]);

      // Update auth metadata with role
      await supabase.auth.updateUser({
        data: { role: defaultRole }
      });
    } else if (userData.role !== user.user_metadata?.role?.id) {
      // Sync role from users table to auth metadata
      const userRole = defaultRoles.find(role => role.id === userData.role);
      await supabase.auth.updateUser({
        data: { role: userRole }
      });
    }
  }

  return supabase;
}

// Future Improvements:
// 1. Add rate limiting for API requests
// 2. Implement audit logging for user actions
// 3. Add support for multi-tenant roles
// 4. Implement role expiration and renewal
// 5. Add support for role-based API scopes
// 6. Implement role templates for common permission sets
// 7. Add support for temporary role elevation
// 8. Implement role versioning and migration
