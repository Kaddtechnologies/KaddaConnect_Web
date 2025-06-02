
"use client";

import { useState } from 'react';
import { useUserData } from '@/contexts/user-data-context';
import type { PrayerNote } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquarePlus, Send, Edit3, Trash2, CalendarDays, Save, Ban, Info } from 'lucide-react';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

interface PrayerNotesProps {
  prayerId: string;
}

export default function PrayerNotes({ prayerId }: PrayerNotesProps) {
  const { getNotesForPrayer, addPrayerNote, updatePrayerNote, deletePrayerNote, currentUserProfile } = useUserData();
  const notes = getNotesForPrayer(prayerId);
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');

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

  const handleEditNote = (note: PrayerNote) => {
    setEditingNoteId(note.id);
    setEditingNoteText(note.text);
    setIsAddingNote(false); // Close new note form if open
  };

  const handleSaveEdit = () => {
    if (!editingNoteId || !editingNoteText.trim() || !currentUserProfile) {
      toast({ title: "Error", description: "Cannot save empty note.", variant: "destructive" });
      return;
    }
    updatePrayerNote(editingNoteId, editingNoteText.trim());
    setEditingNoteId(null);
    setEditingNoteText('');
    toast({ title: "Note Updated", description: "Your reflection has been updated." });
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingNoteText('');
  };

  const handleDeleteNote = (noteId: string, noteTextPreview: string) => {
    if (!currentUserProfile) return;
    const firstFewWords = noteTextPreview.split(' ').slice(0, 5).join(' ') + '...';
    if (window.confirm(`Are you sure you want to delete this note: "${firstFewWords}"?`)) {
      deletePrayerNote(noteId);
      toast({ title: "Note Deleted", description: "Your reflection has been removed.", variant: "destructive" });
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-card-foreground">Prayer Journal / Notes</h4>
        {!isAddingNote && !editingNoteId && (
          <Button variant="outline" size="sm" onClick={() => { setIsAddingNote(true); setEditingNoteId(null); }}>
            <MessageSquarePlus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        )}
      </div>

      {isAddingNote && (
        <div className="p-3 bg-muted/30 rounded-lg space-y-2 border border-primary/30">
          <Textarea
            placeholder="Add your reflection, update, or insight..."
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            rows={3}
            className="text-sm bg-card/50"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsAddingNote(false)}>Cancel</Button>
            <Button size="sm" onClick={handleAddNote} disabled={!newNoteText.trim()} className="bg-primary hover:bg-primary/90">
              <Send className="h-4 w-4 mr-2"/> Save Note
            </Button>
          </div>
        </div>
      )}

      {notes.length === 0 && !isAddingNote && (
        <div className="text-sm text-muted-foreground text-center py-6 bg-card/30 rounded-lg flex flex-col items-center gap-2">
            <Info className="h-6 w-6 text-primary/70"/>
            <span>No notes yet for this prayer.</span>
            <span>Add your first reflection!</span>
        </div>
      )}

      {notes.length > 0 && (
        <ScrollArea className="h-[200px] pr-3 -mr-3">
          <div className="space-y-3">
            {notes.map(note => (
              <div key={note.id} className={cn("p-3 bg-card border rounded-md shadow-sm", editingNoteId === note.id && "border-primary ring-1 ring-primary")}>
                {editingNoteId === note.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editingNoteText}
                      onChange={(e) => setEditingNoteText(e.target.value)}
                      rows={3}
                      className="text-sm bg-card/80"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                        <Ban className="h-3.5 w-3.5 mr-1.5"/>Cancel
                      </Button>
                      <Button size="sm" onClick={handleSaveEdit} disabled={!editingNoteText.trim()} className="bg-primary hover:bg-primary/90">
                        <Save className="h-3.5 w-3.5 mr-1.5"/>Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-card-foreground whitespace-pre-wrap">{note.text}</p>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-muted-foreground flex items-center">
                            <CalendarDays className="h-3 w-3 mr-1.5"/> 
                            {format(parseISO(note.createdAt), 'MMM d, yyyy, HH:mm')} 
                            <span className="mx-1.5">•</span> 
                            {formatDistanceToNow(parseISO(note.createdAt), { addSuffix: true })}
                            {note.updatedAt && (
                                <>
                                <span className="mx-1.5">•</span> 
                                <span className="italic">(edited {formatDistanceToNow(parseISO(note.updatedAt), { addSuffix: true })})</span>
                                </>
                            )}
                        </p>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => handleEditNote(note)}>
                            <Edit3 className="h-3.5 w-3.5"/>
                            <span className="sr-only">Edit Note</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteNote(note.id, note.text)}>
                            <Trash2 className="h-3.5 w-3.5"/>
                            <span className="sr-only">Delete Note</span>
                          </Button>
                        </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
