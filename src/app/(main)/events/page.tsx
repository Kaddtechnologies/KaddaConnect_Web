
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useUserData } from '@/contexts/user-data-context';
import type { AppEvent } from '@/types';
import EventCard from '@/components/events/EventCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, PlusCircle, Filter, CalendarClock, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const eventCategories: AppEvent['category'][] = ['Worship', 'Community', 'Workshop', 'Outreach', 'Youth', 'Other'];

export default function EventsPage() {
  const { appEvents, isLoading: dataLoading } = useUserData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AppEvent['category'] | 'all'>('all');
  const [pageLoading, setPageLoading] = useState(true);
  
  useEffect(() => {
    if(!dataLoading) {
        setPageLoading(false);
    }
  }, [dataLoading]);

  const filteredEvents = useMemo(() => {
    let events = [...appEvents].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()); // Sort by soonest first

    if (selectedCategory !== 'all') {
      events = events.filter(event => event.category === selectedCategory);
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      events = events.filter(event =>
        event.title.toLowerCase().includes(lowerSearchTerm) ||
        event.description.toLowerCase().includes(lowerSearchTerm) ||
        event.location.toLowerCase().includes(lowerSearchTerm) ||
        event.organizerInfo.name.toLowerCase().includes(lowerSearchTerm)
      );
    }
    return events;
  }, [appEvents, searchTerm, selectedCategory]);

  const handleCreateEvent = () => {
    // Placeholder for future create event modal/page
    alert("Create Event functionality coming soon!");
  };
  
  if (pageLoading) {
    return (
      <div className="container mx-auto  py-8 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading events...</p>
      </div>
    );
  }


  return (
    <div className="container mx-auto  py-0 md:py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-headline text-primary mb-2 flex items-center">
            <CalendarClock className="h-8 w-8 mr-3 text-primary/80" /> Upcoming Events
          </h1>
          <p className="text-muted-foreground">Discover what's happening in our community.</p>
        </div>
        <Button onClick={handleCreateEvent} className="w-full md:w-auto bg-primary hover:bg-primary/90">
          <PlusCircle className="h-5 w-5 mr-2" /> Create New Event
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 md:mb-8">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events by title, description, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 text-base rounded-lg shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground hidden sm:block"/>
            <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as AppEvent['category'] | 'all')}
            >
                <SelectTrigger className="w-full md:w-auto rounded-lg shadow-sm text-base py-3">
                <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {eventCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
                </SelectContent>
            </Select>
        </div>
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card/50 rounded-xl shadow-inner">
          <CalendarClock className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
          <h3 className="text-2xl font-semibold text-foreground mb-3">No Events Found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            There are no events matching your current search or filter. Try adjusting your criteria or check back later!
          </p>
        </div>
      )}
    </div>
  );
}
