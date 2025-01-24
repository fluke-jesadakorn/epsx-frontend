import { Button, Result } from 'antd';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@/utils/supabase/server';

export default async function UnauthorizedPage() {
  const supabase = await createServerClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is logged in, redirect to home
  if (user) {
    redirect('/');
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Link href="/login">
            <Button type="primary">Login</Button>
          </Link>
        }
      />
    </div>
  );
}
