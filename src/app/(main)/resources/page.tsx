
"use client";

import { useUserData } from '@/contexts/user-data-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpenText, Share2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function ResourcesPage() {
  const { dailyVerse } = useUserData();
  const { toast } = useToast();

  const handleShareVerse = () => {
    if (dailyVerse) {
      const shareText = `"${dailyVerse.text}" - ${dailyVerse.reference}`;
      if (navigator.share) {
        navigator.share({
          title: 'Verse of the Day',
          text: shareText,
          url: window.location.href, // Or a specific URL for the verse if available
        }).catch((error) => console.error('Error sharing:', error));
      } else {
        // Fallback for browsers that don't support navigator.share
        navigator.clipboard.writeText(shareText).then(() => {
          toast({ title: "Copied to clipboard!", description: "Verse copied successfully." });
        }).catch((err) => {
          toast({ title: "Copy failed", description: "Could not copy verse.", variant: "destructive" });
        });
      }
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-0 md:py-6">
      <div className="mb-6 md:mb-8 text-center">
        <BookOpenText className="mx-auto h-12 w-12 text-primary mb-3" />
        <h1 className="text-3xl md:text-4xl font-headline text-primary mb-2">Spiritual Resources</h1>
        <p className="text-muted-foreground">Nourish your faith with daily verses, devotionals, and more.</p>
      </div>

      {dailyVerse && (
        <Card className="mb-8 shadow-xl rounded-xl bg-gradient-to-br from-primary/5 via-card to-accent/5">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">Verse of the Day</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">{new Date(dailyVerse.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <blockquote className="text-lg md:text-xl font-body italic text-foreground leading-relaxed border-l-4 border-primary pl-4 py-2">
              "{dailyVerse.text}"
            </blockquote>
            <p className="text-right text-md font-semibold text-primary/80">- {dailyVerse.reference}</p>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={handleShareVerse} className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
                <Share2 className="h-4 w-4 mr-2" />
                Share Verse
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Placeholder for Sermon Notes and Devotionals */}
      <div className="space-y-6">
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Sermon Notes</CardTitle>
            <CardDescription>Catch up on recent messages.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Sermon notes will be available here soon.</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Devotional Readings</CardTitle>
            <CardDescription>Find daily encouragement and reflection.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Devotionals will be available here soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
