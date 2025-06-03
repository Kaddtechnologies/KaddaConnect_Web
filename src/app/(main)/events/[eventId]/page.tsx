
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUserData } from '@/contexts/user-data-context';
import type { AppEvent } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, MapPin, Users, Info, ArrowLeft, Loader2, Ticket, UserCheck, UserPlus, ExternalLink, Video, Building } from 'lucide-react';
import { format, parseISO, isPast } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { eventId } = params as { eventId: string };
  const { 
    getAppEventById, 
    rsvpToEvent, 
    cancelRsvpFromEvent, 
    isUserRsvpedToEvent, 
    currentUserProfile,
    isLoading: dataLoading 
  } = useUserData();
  const { toast } = useToast();

  const [event, setEvent] = useState<AppEvent | null | undefined>(undefined); 
  const [isRsvped, setIsRsvped] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (eventId && !dataLoading) {
      const foundEvent = getAppEventById(eventId);
      setEvent(foundEvent || null);
      if (foundEvent && currentUserProfile) {
        setIsRsvped(isUserRsvpedToEvent(eventId));
      }
      setPageLoading(false);
    }
  }, [eventId, getAppEventById, currentUserProfile, isUserRsvpedToEvent, dataLoading]);

  const handleRsvpToggle = () => {
    if (!currentUserProfile || !event) return;

    if (isRsvped) {
      cancelRsvpFromEvent(event.id);
      setIsRsvped(false);
      toast({ title: "RSVP Cancelled", description: `Your RSVP for "${event.title}" has been cancelled.` });
    } else {
      if (event.maxAttendees && event.rsvpCount >= event.maxAttendees) {
        toast({ title: "Event Full", description: "Sorry, this event has reached its maximum capacity.", variant: "destructive" });
        return;
      }
      rsvpToEvent(event.id);
      setIsRsvped(true);
      toast({ title: "RSVP Successful!", description: `You have RSVP'd for "${event.title}".` });
    }
    // Refresh event data to show updated RSVP count
    const updatedEvent = getAppEventById(eventId);
    setEvent(updatedEvent);
  };

  if (pageLoading || event === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto py-6 text-center">
        <h1 className="text-2xl font-semibold mb-4">Event Not Found</h1>
        <p className="text-muted-foreground mb-4">The event you are looking for does not exist or could not be loaded.</p>
        <Button onClick={() => router.push('/events')} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Events
        </Button>
      </div>
    );
  }
  
  const eventStartTime = parseISO(event.startTime);
  const eventEndTime = event.endTime ? parseISO(event.endTime) : null;
  const eventIsPast = isPast(eventStartTime);

  return (
    <div className="container mx-auto max-w-3xl py-0 md:py-6 animate-fadeIn">
      <Button onClick={() => router.push('/events')} variant="outline" size="sm" className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Events
      </Button>

      <Card className="shadow-xl rounded-xl overflow-hidden">
        {event.coverImageUrl && (
          <div className="relative w-full h-60 md:h-72 bg-muted">
            <Image src={event.coverImageUrl} alt={event.title} layout="fill" objectFit="cover" data-ai-hint={event.dataAiHint || "event banner"} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
          </div>
        )}
        <CardHeader className={cn(event.coverImageUrl && "relative z-10 pt-4 mt-[-60px] px-6")}>
          <div className="flex justify-between items-start">
            <CardTitle className={cn("text-2xl md:text-3xl font-headline", event.coverImageUrl ? "text-white" : "text-primary")}>
              {event.title}
            </CardTitle>
            <Badge variant="secondary" className={cn("text-sm shrink-0 capitalize py-1 px-3", event.coverImageUrl ? "bg-black/60 text-white/90 border-white/50 backdrop-blur-sm" : "bg-accent/10 text-accent-foreground border-accent/20")}>
                {event.category}
            </Badge>
          </div>
           {eventIsPast && (
            <Badge variant="destructive" className="mt-2 w-fit">This event has passed</Badge>
          )}
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div className="flex items-start">
              <CalendarDays className="h-5 w-5 mr-3 mt-0.5 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-card-foreground">Date & Time</p>
                <p className="text-muted-foreground">
                  {format(eventStartTime, 'eeee, MMMM d, yyyy')}
                  <br/>
                  {format(eventStartTime, 'h:mm a')} {eventEndTime ? `- ${format(eventEndTime, 'h:mm a')}` : ''}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              {event.isOnline ? <Video className="h-5 w-5 mr-3 mt-0.5 text-primary shrink-0"/> : <MapPin className="h-5 w-5 mr-3 mt-0.5 text-primary shrink-0" />}
              <div>
                <p className="font-semibold text-card-foreground">Location</p>
                {event.isOnline ? (
                    <>
                        <p className="text-muted-foreground">Online Event</p>
                        {event.meetingUrl && (
                            <Link href={event.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center">
                                Join Meeting <ExternalLink className="h-3 w-3 ml-1"/>
                            </Link>
                        )}
                    </>
                ) : (
                    <p className="text-muted-foreground">{event.location}</p>
                )}
              </div>
            </div>
            <div className="flex items-start">
              <Info className="h-5 w-5 mr-3 mt-0.5 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-card-foreground">Organizer</p>
                <p className="text-muted-foreground">
                  {event.organizerInfo.name}
                  {event.organizerInfo.contact && <span className="block text-xs">({event.organizerInfo.contact})</span>}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Users className="h-5 w-5 mr-3 mt-0.5 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-card-foreground">Attendees</p>
                <p className="text-muted-foreground">
                  {event.rsvpCount} RSVP'd
                  {event.maxAttendees && ` / ${event.maxAttendees} spots`}
                  {event.maxAttendees && event.rsvpCount >= event.maxAttendees && !isRsvped && <span className="text-destructive text-xs block">(Event Full)</span>}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">About this Event</h3>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{event.description}</p>
          </div>

          {!eventIsPast && currentUserProfile && (
            <Button 
              onClick={handleRsvpToggle} 
              className={cn(
                "w-full text-lg py-6", 
                isRsvped ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
              )}
              disabled={!isRsvped && event.maxAttendees && event.rsvpCount >= event.maxAttendees}
            >
              {isRsvped ? <UserCheck className="h-5 w-5 mr-2" /> : <UserPlus className="h-5 w-5 mr-2" />}
              {isRsvped ? 'Cancel RSVP' : (event.maxAttendees && event.rsvpCount >= event.maxAttendees ? 'Event Full' : 'RSVP Now')}
            </Button>
          )}
           {!currentUserProfile && !eventIsPast && (
             <p className="text-center text-muted-foreground text-sm">Please <Link href="/login" className="text-primary hover:underline">log in</Link> to RSVP.</p>
           )}

          <div className="space-y-2">
            <h4 className="text-md font-semibold text-card-foreground">Add to Calendar (Placeholder)</h4>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Google Calendar</Button>
                <Button variant="outline" size="sm" disabled>Apple Calendar</Button>
            </div>
             <p className="text-xs text-muted-foreground">Calendar integration coming soon.</p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
