
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUserData } from '@/contexts/user-data-context';
import type { Sermon, SermonNote, ChatMessage as SermonChatMessage } from '@/types'; // Renamed ChatMessage to avoid conflict
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, User, Tag, BookOpen, Youtube, Edit2, Trash2, Save, Ban, PlusCircle, ArrowLeft, Loader2, Info, Sparkles, MessageSquare, Send as SendIcon, Bot } from 'lucide-react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import Link from 'next/link';

import { askSermonChatbot } from '@/ai/flows/sermon-contextual-chat-flow';
import { generateSermonSummary } from '@/ai/flows/sermon-analysis-flow';

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
  }, [initialContent, sermonTitle]);

  const handleSave = () => {
    if (content.trim()) {
      onSave(content.trim());
      if (!isEditing) setContent(''); 
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
    updateSermon,
    currentUserProfile,
    isLoading: dataLoading 
  } = useUserData();
  const { toast } = useToast();

  const [sermon, setSermon] = useState<Sermon | null | undefined>(undefined); 
  const [notes, setNotes] = useState<SermonNote[]>([]);
  const [editingNote, setEditingNote] = useState<SermonNote | null>(null);
  const [showAddNoteEditor, setShowAddNoteEditor] = useState(false);
  const [isSermonChatOpen, setIsSermonChatOpen] = useState(false);
  const [sermonChatMessages, setSermonChatMessages] = useState<SermonChatMessage[]>([]);
  const [sermonChatInput, setSermonChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const sermonChatScrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sermonId && !dataLoading) {
      const foundSermon = getSermonById(sermonId);
      setSermon(foundSermon || null);
      if (foundSermon && currentUserProfile) {
        setNotes(getNotesForSermon(sermonId));
      } else {
        setNotes([]);
      }
      setSermonChatMessages([]); // Reset chat when sermon changes
    }
  }, [sermonId, getSermonById, getNotesForSermon, currentUserProfile, dataLoading]);

  useEffect(() => {
    if (sermonChatScrollRef.current) {
        const viewport = sermonChatScrollRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [sermonChatMessages]);

  const handleAddNote = (content: string) => {
    if (!sermon) return;
    addSermonNote(sermon.id, content);
    toast({ title: "Note Added", description: "Your note has been saved." });
    setShowAddNoteEditor(false); 
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

  const handleSermonChatSend = async () => {
    if (!sermonChatInput.trim() || !currentUserProfile || !sermon) return;

    const userMessage: SermonChatMessage = {
      id: `sermon-chat-user-${Date.now()}`,
      text: sermonChatInput.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setSermonChatMessages(prev => [...prev, userMessage]);
    const currentInput = sermonChatInput.trim();
    setSermonChatInput('');
    setIsChatLoading(true);

    const botLoadingMessage: SermonChatMessage = {
        id: `sermon-chat-bot-loading-${Date.now()}`,
        text: "Thinking...",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        status: 'loading'
    };
    setSermonChatMessages(prev => [...prev, botLoadingMessage]);

    try {
      const concatenatedNotes = notes.map(n => n.content).join("\n\n---\n\n");
      const historyForFlow = sermonChatMessages.filter(m => m.id !== botLoadingMessage.id).map(msg => ({ // Exclude the loading message itself
        sender: msg.sender,
        text: msg.text,
      }));
      
      const response = await askSermonChatbot({
        sermonTitle: sermon.title,
        sermonScriptures: sermon.scriptureReferences || [],
        sermonNotesContent: concatenatedNotes,
        userMessage: currentInput,
        chatHistory: historyForFlow.slice(0,-1), // History before current user message
        userName: currentUserProfile.displayName.split(' ')[0] || 'Friend',
      });

      const botMessage: SermonChatMessage = {
        id: `sermon-chat-bot-${Date.now()}`,
        text: response.response,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setSermonChatMessages(prev => prev.filter(m => m.id !== botLoadingMessage.id).concat(botMessage));

    } catch (error) {
      console.error("Sermon chat error:", error);
      const errorBotMessage: SermonChatMessage = {
        id: `sermon-chat-bot-error-${Date.now()}`,
        text: "Sorry, I had trouble responding. Please try again.",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        status: 'error',
      };
      setSermonChatMessages(prev => prev.filter(m => m.id !== botLoadingMessage.id).concat(errorBotMessage));
      toast({ title: "Chat Error", description: "Could not get response from AI.", variant: "destructive" });
    } finally {
      setIsChatLoading(false);
    }
  };
  
  const handleGenerateSummary = async () => {
    if (!sermon || !sermon.title || !sermon.scriptureReferences?.length || notes.length === 0 || !currentUserProfile) {
      toast({ title: "Cannot Generate Summary", description: "Title, scriptures, and at least one note are required to generate a summary.", variant: "destructive"});
      return;
    }
    setIsSummaryLoading(true);
    try {
      const concatenatedNotes = notes.map(n => n.content).join("\n\n");
      const result = await generateSermonSummary({
        sermonTitle: sermon.title,
        sermonScriptures: sermon.scriptureReferences,
        sermonNotesContent: concatenatedNotes,
      });
      updateSermon(sermon.id, { summary: result.generatedSummary });
      // Manually update local sermon state so UI reflects change immediately
      setSermon(prevSermon => prevSermon ? { ...prevSermon, summary: result.generatedSummary } : null);
      toast({ title: "Summary Generated!", description: "The sermon summary has been updated."});
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({ title: "Summary Generation Failed", description: "Could not generate summary.", variant: "destructive" });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const canGenerateSummary = sermon && sermon.title && sermon.scriptureReferences && sermon.scriptureReferences.length > 0 && notes.length > 0;

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
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xl rounded-xl">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl md:text-3xl font-headline text-primary">{sermon.title}</CardTitle>
                <Sheet open={isSermonChatOpen} onOpenChange={setIsSermonChatOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="shrink-0">
                      <MessageSquare className="h-4 w-4 mr-2"/> Chat about this Sermon
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
                    <SheetHeader className="p-4 border-b">
                      <SheetTitle className="text-lg truncate">Chat: {sermon.title}</SheetTitle>
                    </SheetHeader>
                    <ScrollArea ref={sermonChatScrollRef} className="flex-grow p-4 space-y-4 bg-muted/20">
                      {sermonChatMessages.length === 0 && (
                        <div className="text-center text-muted-foreground py-10">
                          <MessageSquare className="h-12 w-12 mx-auto mb-3 text-primary/50"/>
                          <p>Start the conversation about this sermon.</p>
                        </div>
                      )}
                      {sermonChatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {msg.sender === 'bot' && (
                            <Avatar className="h-8 w-8 self-start border shadow-sm bg-primary/10 text-primary">
                              <AvatarFallback><Bot className="h-4 w-4"/></AvatarFallback>
                            </Avatar>
                          )}
                          <div
                            className={`max-w-[80%] rounded-xl px-3 py-2 shadow-md ${
                              msg.sender === 'user'
                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                : 'bg-card border rounded-bl-none'
                            }`}
                          >
                            {msg.status === 'loading' && <Loader2 className="h-4 w-4 animate-spin my-0.5 text-muted-foreground" />}
                            {msg.status === 'error' && <p className="text-destructive-foreground flex items-center text-sm"><Info className="h-4 w-4 mr-1.5"/> {msg.text}</p>}
                            {msg.status !== 'loading' && msg.status !== 'error' && <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}
                             <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/80'}`}>
                                {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                            </p>
                          </div>
                          {msg.sender === 'user' && currentUserProfile && (
                             <Avatar className="h-8 w-8 self-start border shadow-sm">
                              <AvatarImage src={currentUserProfile.profilePictureUrl} alt={currentUserProfile.displayName} data-ai-hint="profile person"/>
                              <AvatarFallback>{currentUserProfile.displayName.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                    </ScrollArea>
                    <div className="p-4 border-t bg-card">
                      <form
                        onSubmit={(e) => { e.preventDefault(); handleSermonChatSend(); }}
                        className="flex items-center gap-2"
                      >
                        <Input
                          placeholder="Ask about the sermon..."
                          value={sermonChatInput}
                          onChange={(e) => setSermonChatInput(e.target.value)}
                          disabled={isChatLoading}
                          className="flex-grow"
                        />
                        <Button type="submit" size="icon" disabled={isChatLoading || !sermonChatInput.trim()}>
                           {isChatLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendIcon className="h-5 w-5" />}
                        </Button>
                      </form>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
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
                  src={sermon.youtubeUrl.replace("watch?v=", "embed/")}
                  title={sermon.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-b-md"
                ></iframe>
              </CardContent>
            )}
          </Card>

          <Card className="shadow-lg rounded-xl">
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-xl font-headline flex items-center"><BookOpen className="h-5 w-5 mr-2 text-primary"/> Summary</CardTitle>
               <Button 
                  onClick={handleGenerateSummary} 
                  disabled={!canGenerateSummary || isSummaryLoading}
                  variant="outline"
                  size="sm"
                >
                  {isSummaryLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <Sparkles className="h-4 w-4 mr-2"/>}
                  {sermon.summary && !isSummaryLoading ? "Regenerate Summary" : "Generate Summary (AI)"}
               </Button>
            </CardHeader>
            <CardContent>
              {isSummaryLoading && !sermon.summary && <p className="text-muted-foreground">Generating summary...</p> }
              {sermon.summary ? (
                <p className="text-muted-foreground whitespace-pre-wrap">{sermon.summary}</p>
              ) : (
                !isSummaryLoading && <p className="text-muted-foreground italic">No summary available. You can generate one with AI if title, scriptures, and notes are present.</p>
              )}
            </CardContent>
          </Card>

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

        <div className="lg:col-span-1 space-y-4">
          <Card className="shadow-xl rounded-xl sticky top-20">
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

