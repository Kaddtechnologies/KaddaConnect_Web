
"use client";

import { useState } from 'react';
import { useUserData } from '@/contexts/user-data-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Send } from 'lucide-react';

export default function PrayerRequestForm() {
  const { addPrayerRequest, currentUserProfile } = useUserData();
  const [requestText, setRequestText] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) {
      toast({ title: "Error", description: "Prayer request cannot be empty.", variant: "destructive" });
      return;
    }
    if (!currentUserProfile) {
      toast({ title: "Error", description: "You must be logged in to submit a prayer request.", variant: "destructive" });
      return;
    }
    addPrayerRequest(requestText.trim());
    setRequestText('');
    toast({ title: "Success", description: "Your prayer request has been submitted." });
  };

  return (
    <Card className="mb-6 shadow-xl rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Share a Prayer Request</CardTitle>
        <CardDescription>Your requests are valued. Share openly or keep it general.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Enter your prayer request here..."
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
            rows={4}
            className="rounded-lg border-border focus:ring-primary"
          />
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={!currentUserProfile || !requestText.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Submit Request
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
