
"use client";

import { useState } from 'react';
import { useUserData } from '@/contexts/user-data-context';
import type { PrayerNote } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquarePlus, Send, Edit3, Trash2, CalendarDays } from 'lucide-react';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

interface PrayerNotesProps {
  prayerId: string;
}

export default function PrayerNotes({ prayerId }: PrayerNotesProps) {
  const { getNotesForPrayer, addPrayerNote, currentUserProfile } = useUserData();
  const notes = getNotesForPrayer(prayerId);
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const { toast } = useToast();

  const handleAddNote = () => {
    if (!newNoteText.trim() || !currentUserProfile) {
      toast({ title: "Error", description: "Note cannot be empty and you must be logged in.", variant: "destructive" });
      return;
    }
    addPrayerNote(prayerId, newNoteText.trim());
    setNewNoteText('');
    setIsAddingNote(false);
    toast({ title: "Note Added", description: "Your reflection has been saved." });
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-card-foreground">Prayer Journal / Notes</h4>
        {!isAddingNote && (
          <Button variant="outline" size="sm" onClick={() => setIsAddingNote(true)}>
            <MessageSquarePlus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        )}
      </div>

      {isAddingNote && (
        <div className="p-3 bg-muted/30 rounded-lg space-y-2">
          <Textarea
            placeholder="Add your reflection, update, or insight related to this prayer..."
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            rows={3}
            className="text-sm"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsAddingNote(false)}>Cancel</Button>
            <Button size="sm" onClick={handleAddNote} disabled={!newNoteText.trim()}>
              <Send className="h-4 w-4 mr-2"/> Save Note
            </Button>
          </div>
        </div>
      )}

      {notes.length === 0 && !isAddingNote && (
        <p className="text-sm text-muted-foreground text-center py-4">No notes yet for this prayer. Add your first reflection!</p>
      )}

      {notes.length > 0 && (
        <ScrollArea className="h-[200px] pr-3 -mr-3"> {/* Max height for scrollability */}
          <div className="space-y-3">
            {notes.map(note => (
              <div key={note.id} className="p-3 bg-card border rounded-md shadow-sm">
                <p className="text-sm text-card-foreground whitespace-pre-wrap">{note.text}</p>
                <p className="text-xs text-muted-foreground mt-2 flex items-center">
                  <CalendarDays className="h-3 w-3 mr-1.5"/> 
                  {format(parseISO(note.createdAt), 'MMM d, yyyy, HH:mm')} 
                  <span className="mx-1.5">•</span> 
                  {formatDistanceToNow(parseISO(note.createdAt), { addSuffix: true })}
                </p>
                {/* Placeholder for edit/delete note functionality if needed later */}
                {/* 
                <div className="flex gap-2 mt-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary"> <Edit3 className="h-3.5 w-3.5"/> </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive"> <Trash2 className="h-3.5 w-3.5"/> </Button>
                </div>
                */}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
