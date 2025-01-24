'use server';

import { createServerClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();
  const supabase = await createServerClient(cookieStore);
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Logout error:', error.message);
    throw error;
  }
  
  redirect('/login');
}
