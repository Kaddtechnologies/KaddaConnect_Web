
"use client";
import SignupForm from '@/components/auth/signup-form';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignupPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/home');
    }
  }, [user, isLoading, router]);

  if (isLoading || (!isLoading && user)) { // Show loading or if user is already logged in (and redirecting)
     return (
        <div className="flex h-screen items-center justify-center bg-background">
            <p>Loading...</p>
        </div>
     );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <SignupForm />
    </div>
  );
}
