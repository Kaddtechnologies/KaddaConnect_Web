
"use client";

import { useMemo } from 'react';
import { useUserData } from '@/contexts/user-data-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, parseISO } from 'date-fns';
import { ListChecks, Sparkles, CalendarCheck2 } from 'lucide-react';

export default function AnsweredPrayersList() {
  const { userPrayers } = useUserData();

  const answeredPrayers = useMemo(() => {
    return userPrayers
      .filter(prayer => prayer.isAnswered)
      .sort((a, b) => {
        // Sort by answeredAt date, most recent first
        const dateA = a.answeredAt ? new Date(a.answeredAt).getTime() : 0;
        const dateB = b.answeredAt ? new Date(b.answeredAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [userPrayers]);

  if (answeredPrayers.length === 0) {
    return (
      <Card className="shadow-lg col-span-1 md:col-span-3 rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-headline flex items-center">
            <ListChecks className="h-6 w-6 mr-2 text-primary" /> Answered Prayers Journal
          </CardTitle>
          <CardDescription>Reflect on God's faithfulness. No answered prayers logged yet.</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[150px] flex items-center justify-center bg-muted/30 rounded-b-xl">
          <div className="text-center text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-3 text-primary/50" />
            <p className="font-semibold">Your journal of answered prayers will appear here.</p>
            <p className="text-sm">Mark prayers as answered in the "My Prayers" tab.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg col-span-1 md:col-span-3 rounded-xl">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center">
          <ListChecks className="h-6 w-6 mr-2 text-primary" /> Answered Prayers Journal
        </CardTitle>
        <CardDescription>Reflect on God's faithfulness through your answered prayers.</CardDescription>
      </CardHeader>
      <ScrollArea className="max-h-[400px]"> {/* Adjust max height as needed */}
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {answeredPrayers.map(prayer => (
              <li key={prayer.id} className="p-4 hover:bg-muted/20 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-foreground">{prayer.title}</h4>
                  <Badge variant="secondary" className="text-xs capitalize bg-green-500/20 text-green-300 border-green-500/30">
                    {prayer.category}
                  </Badge>
                </div>
                {prayer.answeredAt && (
                  <p className="text-xs text-muted-foreground flex items-center mb-2">
                    <CalendarCheck2 className="h-3.5 w-3.5 mr-1.5 text-green-400" />
                    Answered on: {format(parseISO(prayer.answeredAt), 'MMMM d, yyyy')}
                  </p>
                )}
                {prayer.answerDescription && (
                  <p className="text-sm text-muted-foreground italic bg-muted/30 p-2 rounded-md">
                    "{prayer.answerDescription}"
                  </p>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </ScrollArea>
       {/* Add a small footer if there are many items to indicate scrollability if not obvious */}
      {answeredPrayers.length > 3 && (
        <CardContent className="p-2 text-center text-xs text-muted-foreground border-t border-border">
            Scroll to see all answered prayers.
        </CardContent>
      )}
    </Card>
  );
}
