
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page will now act as a redirect to the default "learn" tab.
// The actual tab content will be managed by the layout and sub-pages.
export default function PrayerRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/prayer/learn');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Loading Prayer Hub...</p>
    </div>
  );
}
