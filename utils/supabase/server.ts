"use server";

import {
  createServerClient as Create,
  type CookieOptions,
} from "@supabase/ssr";
import { cookies } from "next/headers";

import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function createServerClient(cookieStore?: ReadonlyRequestCookies) {
  const store = cookieStore || (await cookies());
  return Create(
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
}