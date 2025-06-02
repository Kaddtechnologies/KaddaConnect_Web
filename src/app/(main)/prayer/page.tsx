
"use client";

import PrayerRequestCard from '@/components/prayer/prayer-request-card';
import PrayerRequestForm from '@/components/prayer/prayer-request-form';
import { useUserData } from '@/contexts/user-data-context';
import { HeartHandshake } from 'lucide-react';

export default function PrayerPage() {
  const { prayerRequests } = useUserData();

  return (
    <div className="container mx-auto max-w-2xl py-0 md:py-6">
      <div className="mb-6 md:mb-8 text-center">
        <HeartHandshake className="mx-auto h-12 w-12 text-primary mb-3" />
        <h1 className="text-3xl md:text-4xl font-headline text-primary mb-2">Prayer Hub</h1>
        <p className="text-muted-foreground">Share your requests and pray for others in our community.</p>
      </div>
      
      <PrayerRequestForm />

      <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">Community Prayers</h2>
      {prayerRequests.length > 0 ? (
        <div className="space-y-4">
          {prayerRequests.map((request) => (
            <PrayerRequestCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
         <div className="text-center text-muted-foreground py-10 bg-card rounded-lg shadow">
           <p className="text-lg">No prayer requests at the moment.</p>
           <p>Feel free to submit one using the form above.</p>
         </div>
      )}
    </div>
  );
}
