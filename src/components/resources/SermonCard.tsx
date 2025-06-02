
"use client";

import type { Sermon } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, User, Tag, Youtube, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface SermonCardProps {
  sermon: Sermon;
}

export default function SermonCard({ sermon }: SermonCardProps) {
  return (
    <Card className="flex flex-col h-full rounded-xl shadow-lg hover:shadow-primary/20 transition-shadow duration-300 overflow-hidden bg-card">
      {sermon.coverImageUrl && (
        <div className="relative w-full h-40 md:h-48">
          <Image
            src={sermon.coverImageUrl}
            alt={sermon.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint={sermon.dataAiHint || "sermon theme"}
            className="group-hover:scale-105 transition-transform"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        </div>
      )}
      <CardHeader className={cn("p-4", sermon.coverImageUrl && "pt-2 relative z-10", sermon.coverImageUrl && "mt-[-30px]")}>
        <CardTitle className={cn("text-lg font-headline group-hover:text-primary transition-colors", sermon.coverImageUrl ? "text-white" : "text-card-foreground")}>
          {sermon.title}
        </CardTitle>
        <div className={cn("text-xs space-y-0.5 mt-1", sermon.coverImageUrl ? "text-white/90" : "text-muted-foreground")}>
            <div className="flex items-center">
                <User className="h-3.5 w-3.5 mr-1.5" />
                <span>{sermon.speaker}</span>
            </div>
            <div className="flex items-center">
                <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                <span>{format(parseISO(sermon.date), 'MMMM d, yyyy')}</span>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-1 flex-grow">
        {sermon.summary && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{sermon.summary}</p>
        )}
        {sermon.topics && sermon.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {sermon.topics.slice(0,3).map(topic => (
              <Badge key={topic} variant="secondary" className="text-xs bg-accent/10 text-accent-foreground border-accent/20">
                {topic}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-3 border-t border-border/70">
        <Link href={`/resources/sermons/${sermon.id}`} passHref legacyBehavior>
          <Button variant="outline" size="sm" className="w-full hover:bg-primary/10 hover:text-primary hover:border-primary/70">
            {sermon.youtubeUrl && <Youtube className="h-4 w-4 mr-2 text-red-500" />}
            View Sermon & Notes
            <ArrowRight className="h-4 w-4 ml-auto" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
