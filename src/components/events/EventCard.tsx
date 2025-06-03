
"use client";

import type { AppEvent } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users, ArrowRight, Video } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO, isPast } from 'date-fns';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: AppEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const eventStartTime = parseISO(event.startTime);
  const eventIsPast = isPast(eventStartTime);

  return (
    <Card className={cn(
        "flex flex-col h-full rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300 overflow-hidden bg-card border border-border/70",
        eventIsPast && "opacity-70"
      )}
    >
      {event.coverImageUrl && (
        <div className="relative w-full h-40 md:h-48 group">
          <Image
            src={event.coverImageUrl}
            alt={event.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint={event.dataAiHint || "event theme"}
            className="group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
           {eventIsPast && (
             <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Badge variant="destructive" className="text-sm px-3 py-1">Past Event</Badge>
             </div>
           )}
        </div>
      )}
      <CardHeader className={cn("p-4", event.coverImageUrl && "pt-2 relative z-10", event.coverImageUrl && "mt-[-40px]")}>
        <div className="flex justify-between items-start">
            <CardTitle className={cn(
                "text-lg font-headline group-hover:text-primary transition-colors",
                event.coverImageUrl ? "text-white" : "text-card-foreground"
            )}>
            {event.title}
            </CardTitle>
            <Badge variant="secondary" className={cn("text-xs shrink-0 capitalize", event.coverImageUrl ? "bg-black/50 text-white/90 border-white/40" : "bg-accent/10 text-accent-foreground border-accent/20")}>
                {event.category}
            </Badge>
        </div>
        <div className={cn("text-xs space-y-0.5 mt-1.5", event.coverImageUrl ? "text-white/90" : "text-muted-foreground")}>
            <div className="flex items-center">
                <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                <span>{format(eventStartTime, 'MMM d, yyyy \'at\' h:mm a')}</span>
            </div>
            <div className="flex items-center">
                {event.isOnline ? <Video className="h-3.5 w-3.5 mr-1.5 text-green-400"/> : <MapPin className="h-3.5 w-3.5 mr-1.5" />}
                <span>{event.isOnline ? 'Online Event' : event.location}</span>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-1 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{event.description}</p>
      </CardContent>
      <CardFooter className="p-3 border-t border-border/70">
        <Link href={`/events/${event.id}`} passHref legacyBehavior>
          <Button variant="outline" size="sm" className="w-full hover:bg-primary/10 hover:text-primary hover:border-primary/70" disabled={eventIsPast}>
            {eventIsPast ? "View Details" : "View Event & RSVP"}
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
