
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUserData } from '@/contexts/user-data-context';
import type { Sermon, SermonNote } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarDays, User, Tag, BookOpen, Youtube, Edit2, Trash2, Save, Ban, PlusCircle, ArrowLeft, Loader2, Info } from 'lucide-react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Re-usable Note Item component
const SermonNoteItem = ({ note, onEdit, onDelete }: { note: SermonNote, onEdit: () => void, onDelete: () => void }) => (
  <div className="p-4 bg-muted/30 rounded-lg shadow-sm border border-border/50">
    <p className="text-sm text-card-foreground whitespace-pre-wrap">{note.content}</p>
    <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/30">
      <p className="text-xs text-muted-foreground">
        {format(parseISO(note.createdAt), 'MMM d, yyyy, HH:mm')}
        {note.updatedAt && ` (edited ${formatDistanceToNow(parseISO(note.updatedAt), { addSuffix: true })})`}
      </p>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={onEdit}>
          <Edit2 className="h-4 w-4" /> <span className="sr-only">Edit Note</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4" /> <span className="sr-only">Delete Note</span>
        </Button>
      </div>
    </div>
  </div>
);

// Re-usable Note Editor component
const SermonNoteEditor = ({ initialContent = '', sermonTitle, onSave, onCancel, isEditing = false }: { initialContent?: string, sermonTitle:string, onSave: (content: string) => void, onCancel?: () => void, isEditing?: boolean }) => {
  const [content, setContent] = useState(initialContent);
  
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent, sermonTitle]); // Reset content if initialContent or sermon changes

  const handleSave = () => {
    if (content.trim()) {
      onSave(content.trim());
      if (!isEditing) setContent(''); // Clear for new note after save
    }
  };

  return (
    <Card className="shadow-md rounded-xl border-primary/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-headline">{isEditing ? "Edit Note" : `Add Note for "${sermonTitle}"`}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          placeholder="Your thoughts, key points, reflections..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={isEditing ? 4 : 3}
          className="text-sm min-h-[80px] bg-card/50 focus:border-primary"
          autoFocus={isEditing}
        />
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button variant="outline" size="sm" onClick={onCancel}>
              <Ban className="h-4 w-4 mr-2" /> Cancel
            </Button>
          )}
          <Button onClick={handleSave} size="sm" disabled={!content.trim()} className="bg-primary hover:bg-primary/90">
            <Save className="h-4 w-4 mr-2" /> {isEditing ? "Save Changes" : "Add Note"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};


export default function SermonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { sermonId } = params as { sermonId: string };
  const { 
    getSermonById, 
    getNotesForSermon, 
    addSermonNote, 
    updateSermonNote, 
    deleteSermonNote, 
    currentUserProfile,
    isLoading: dataLoading 
  } = useUserData();
  const { toast } = useToast();

  const [sermon, setSermon] = useState<Sermon | null | undefined>(undefined); // undefined for loading, null if not found
  const [notes, setNotes] = useState<SermonNote[]>([]);
  const [editingNote, setEditingNote] = useState<SermonNote | null>(null);
  const [showAddNoteEditor, setShowAddNoteEditor] = useState(false);

  useEffect(() => {
    if (sermonId && !dataLoading) {
      const foundSermon = getSermonById(sermonId);
      setSermon(foundSermon || null);
      if (foundSermon && currentUserProfile) {
        setNotes(getNotesForSermon(sermonId));
      } else {
        setNotes([]);
      }
    }
  }, [sermonId, getSermonById, getNotesForSermon, currentUserProfile, dataLoading]);

  const handleAddNote = (content: string) => {
    if (!sermon) return;
    addSermonNote(sermon.id, content);
    toast({ title: "Note Added", description: "Your note has been saved." });
    setShowAddNoteEditor(false); // Hide editor after adding
    // Notes state will update via useEffect or by re-calling getNotesForSermon
    if (currentUserProfile) setNotes(getNotesForSermon(sermon.id));
  };

  const handleUpdateNote = (content: string) => {
    if (!editingNote) return;
    updateSermonNote(editingNote.id, content);
    toast({ title: "Note Updated", description: "Your note has been updated." });
    setEditingNote(null);
    if (sermon && currentUserProfile) setNotes(getNotesForSermon(sermon.id));
  };

  const handleDeleteNote = (noteId: string) => {
    if (!sermon) return;
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteSermonNote(noteId);
      toast({ title: "Note Deleted", description: "Your note has been removed.", variant: "destructive" });
      if (currentUserProfile) setNotes(getNotesForSermon(sermon.id));
    }
  };

  if (dataLoading || sermon === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading sermon details...</p>
      </div>
    );
  }

  if (!sermon) {
    return (
      <div className="container mx-auto py-6 text-center">
        <h1 className="text-2xl font-semibold mb-4">Sermon Not Found</h1>
        <p className="text-muted-foreground mb-4">The sermon you are looking for does not exist or could not be loaded.</p>
        <Button onClick={() => router.push('/resources')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Resources
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-0 md:py-6 animate-fadeIn">
      <Button onClick={() => router.push('/resources')} variant="outline" size="sm" className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Resources
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sermon Info & Video */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xl rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-headline text-primary">{sermon.title}</CardTitle>
              <div className="text-sm text-muted-foreground space-y-1 mt-1">
                <p className="flex items-center"><User className="h-4 w-4 mr-2" /> By: {sermon.speaker}</p>
                <p className="flex items-center"><CalendarDays className="h-4 w-4 mr-2" /> Date: {format(parseISO(sermon.date), 'MMMM d, yyyy')}</p>
              </div>
              {sermon.topics && sermon.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {sermon.topics.map(topic => <Badge key={topic} variant="secondary"><Tag className="h-3 w-3 mr-1"/>{topic}</Badge>)}
                </div>
              )}
            </CardHeader>
            {sermon.youtubeUrl && (
              <CardContent className="aspect-video p-0 overflow-hidden rounded-b-xl">
                <iframe
                  width="100%"
                  height="100%"
                  src={sermon.youtubeUrl.replace("watch?v=", "embed/")} // Basic embed conversion
                  title={sermon.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-b-md"
                ></iframe>
              </CardContent>
            )}
          </Card>

          {sermon.summary && (
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center"><BookOpen className="h-5 w-5 mr-2 text-primary"/> Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{sermon.summary}</p>
              </CardContent>
            </Card>
          )}

           {sermon.scriptureReferences && sermon.scriptureReferences.length > 0 && (
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center"><BookOpen className="h-5 w-5 mr-2 text-primary"/> Scripture References</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {sermon.scriptureReferences.map(ref => <li key={ref}>{ref}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Notes */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="shadow-xl rounded-xl sticky top-20"> {/* Sticky for note-taking while scrolling video */}
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-xl font-headline text-primary">My Notes</CardTitle>
              {!editingNote && !showAddNoteEditor && (
                 <Button variant="outline" size="sm" onClick={() => {setShowAddNoteEditor(true); setEditingNote(null);}}>
                    <PlusCircle className="h-4 w-4 mr-2"/> Add Note
                 </Button>
              )}
            </CardHeader>
            <CardContent>
              {editingNote ? (
                <SermonNoteEditor
                  initialContent={editingNote.content}
                  sermonTitle={sermon.title}
                  onSave={handleUpdateNote}
                  onCancel={() => setEditingNote(null)}
                  isEditing={true}
                />
              ) : showAddNoteEditor ? (
                 <SermonNoteEditor
                  sermonTitle={sermon.title}
                  onSave={handleAddNote}
                  onCancel={() => setShowAddNoteEditor(false)}
                />
              ) : null}

              {notes.length > 0 ? (
                <ScrollArea className={cn("mt-4 space-y-3", notes.length > 2 ? "h-[300px]" : "")}>
                  <div className="space-y-3 pr-3">
                  {notes.map(note => (
                    <SermonNoteItem 
                      key={note.id} 
                      note={note} 
                      onEdit={() => {setEditingNote(note); setShowAddNoteEditor(false);}}
                      onDelete={() => handleDeleteNote(note.id)}
                    />
                  ))}
                  </div>
                </ScrollArea>
              ) : (
                !editingNote && !showAddNoteEditor && (
                    <div className="text-center py-6 text-muted-foreground flex flex-col items-center gap-2 mt-2">
                        <Info className="h-8 w-8 text-primary/70"/>
                        <p>No notes taken for this sermon yet.</p>
                        <Button variant="secondary" size="sm" onClick={() => {setShowAddNoteEditor(true); setEditingNote(null);}}>
                            <PlusCircle className="h-4 w-4 mr-2"/> Start Taking Notes
                        </Button>
                    </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
