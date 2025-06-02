
"use client";

import type { UserPrayer } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { CalendarDays, Clock, CheckCircle, XCircle, Tag, Sparkles, AlignLeft } from 'lucide-react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import PrayerNotes from './PrayerNotes'; // Import the new component
import { cn } from '@/lib/utils';


interface PrayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayer: UserPrayer | null;
}

export default function PrayerDetailModal({ isOpen, onClose, prayer }: PrayerDetailModalProps) {
  if (!isOpen || !prayer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-card text-card-foreground shadow-xl rounded-xl max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl font-headline">{prayer.title}</DialogTitle>
          <div className="flex flex-wrap gap-2 items-center mt-1.5">
            <Badge variant="secondary" className="capitalize bg-accent/20 text-accent-foreground text-xs">
              <Tag className="h-3 w-3 mr-1.5" /> {prayer.category}
            </Badge>
            <Badge variant={prayer.isAnswered ? "default" : "outline"} className={cn("text-xs", prayer.isAnswered ? "bg-green-600 text-white border-green-600" : "border-dashed")}>
              {prayer.isAnswered ? <CheckCircle className="h-3 w-3 mr-1.5" /> : <XCircle className="h-3 w-3 mr-1.5" />}
              {prayer.isAnswered ? 'Answered' : 'Pending'}
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-1 space-y-0.5">
             <div className="flex items-center">
                <CalendarDays className="h-3.5 w-3.5 mr-1.5"/> Created: {format(parseISO(prayer.createdAt), 'MMMM d, yyyy, HH:mm')}
             </div>
            {prayer.lastPrayedAt && (
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1.5"/> Last Prayed: {formatDistanceToNow(parseISO(prayer.lastPrayedAt), { addSuffix: true })}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-grow py-4 pr-6 -mr-6"> {/* Added pr-6 and -mr-6 for scrollbar padding */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-1.5 flex items-center"><AlignLeft className="h-4 w-4 mr-1.5"/>Prayer Content</h3>
              <p className="text-base text-card-foreground whitespace-pre-wrap bg-muted/20 p-3 rounded-md">{prayer.content}</p>
            </div>

            {prayer.isAnswered && (
              <div>
                <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-1.5 flex items-center"><Sparkles className="h-4 w-4 mr-1.5 text-green-400"/>Answer Details</h3>
                <div className="bg-green-700/20 p-3 rounded-md space-y-1">
                  {prayer.answeredAt && (
                    <p className="text-xs text-green-300 flex items-center">
                        <CalendarDays className="h-3.5 w-3.5 mr-1.5"/> Answered on: {format(parseISO(prayer.answeredAt), 'MMMM d, yyyy')}
                    </p>
                  )}
                  {prayer.answerDescription && (
                    <p className="text-sm text-green-200 italic">"{prayer.answerDescription}"</p>
                  )}
                </div>
              </div>
            )}
            
            <PrayerNotes prayerId={prayer.id} />

          </div>
        </ScrollArea>

        <DialogFooter className="pt-4 border-t">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
