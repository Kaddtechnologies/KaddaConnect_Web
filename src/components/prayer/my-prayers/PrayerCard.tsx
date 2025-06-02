
"use client";

import type { UserPrayer } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, CheckCircle, XCircle, Clock, CalendarDays, MessageSquare, Sparkles } from 'lucide-react';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface PrayerCardProps {
  prayer: UserPrayer;
  onEdit: () => void;
  onDelete: () => void;
  onMarkAsPrayed: () => void;
  onToggleAnswered: () => void;
}

export default function PrayerCard({ prayer, onEdit, onDelete, onMarkAsPrayed, onToggleAnswered }: PrayerCardProps) {
  return (
    <Card className={cn(
        "flex flex-col h-full shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-primary/20",
        prayer.isAnswered ? "bg-green-800/10 border-green-500/30" : "bg-card border-border"
      )}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-headline mb-1 leading-tight">{prayer.title}</CardTitle>
            <Badge 
              variant={prayer.isAnswered ? "default" : "secondary"} 
              className={cn(
                "text-xs shrink-0 capitalize", 
                prayer.isAnswered ? "bg-green-600 text-white" : "bg-accent/20 text-accent-foreground"
              )}
            >
              {prayer.category}
            </Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground flex items-center">
          <CalendarDays className="h-3 w-3 mr-1.5" />
          Created: {format(parseISO(prayer.createdAt), 'MMM d, yyyy')}
        </CardDescription>
         {prayer.lastPrayedAt && (
          <CardDescription className="text-xs text-muted-foreground flex items-center mt-0.5">
            <Clock className="h-3 w-3 mr-1.5" />
            Last prayed: {formatDistanceToNow(parseISO(prayer.lastPrayedAt), { addSuffix: true })}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-wrap">{prayer.content}</p>
        {prayer.isAnswered && (
            <div className="mt-3 pt-3 border-t border-green-500/30">
                <p className="text-sm font-semibold text-green-400 flex items-center mb-1">
                    <Sparkles className="h-4 w-4 mr-1.5 text-green-500 fill-green-500/30"/> 
                    Answered {prayer.answeredAt ? `on ${format(parseISO(prayer.answeredAt), 'MMM d, yyyy')}` : ''}
                </p>
                {prayer.answerDescription && <p className="text-xs text-green-200/80 italic line-clamp-3">{prayer.answerDescription}</p>}
            </div>
        )}
      </CardContent>
      <CardFooter className="p-3 border-t border-border/70 bg-card/50 flex flex-col gap-2 items-stretch">
        <Button onClick={onMarkAsPrayed} variant="outline" size="sm" className="w-full hover:bg-primary/10 hover:text-primary">
          <MessageSquare className="h-4 w-4 mr-2" /> Pray Now
        </Button>
        <div className="grid grid-cols-3 gap-2">
          <Button onClick={onEdit} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Edit2 className="h-4 w-4 mr-1 md:mr-2" /><span className="hidden md:inline">Edit</span>
          </Button>
          <Button onClick={onToggleAnswered} variant="ghost" size="sm" className={cn("hover:text-foreground", prayer.isAnswered ? "text-yellow-400 hover:text-yellow-300" : "text-green-500 hover:text-green-400")}>
            {prayer.isAnswered ? <XCircle className="h-4 w-4 mr-1 md:mr-2" /> : <CheckCircle className="h-4 w-4 mr-1 md:mr-2" />}
            <span className="hidden md:inline">{prayer.isAnswered ? 'Unmark' : 'Answered'}</span>
          </Button>
          <Button onClick={onDelete} variant="ghost" size="sm" className="text-destructive/70 hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-1 md:mr-2" /><span className="hidden md:inline">Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
