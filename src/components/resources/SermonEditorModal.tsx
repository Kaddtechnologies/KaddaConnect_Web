
"use client";

import { useState, useEffect } from 'react';
import type { Sermon } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { CalendarIcon, Save, Ban, UploadCloud } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface SermonEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sermonData: Omit<Sermon, 'id'>) => void;
  sermon?: Sermon | null; // For editing existing sermon
}

export default function SermonEditorModal({ isOpen, onClose, onSave, sermon }: SermonEditorModalProps) {
  const [title, setTitle] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [scriptureRefs, setScriptureRefs] = useState('');
  const [topicsStr, setTopicsStr] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  useEffect(() => {
    if (sermon) {
      setTitle(sermon.title);
      setSpeaker(sermon.speaker);
      setDate(sermon.date ? parseISO(sermon.date) : new Date());
      setScriptureRefs(sermon.scriptureReferences?.join(', ') || '');
      setTopicsStr(sermon.topics?.join(', ') || '');
      setYoutubeUrl(sermon.youtubeUrl || '');
      setSummary(sermon.summary || '');
      setCoverImageUrl(sermon.coverImageUrl || '');
    } else {
      // Reset for new sermon
      setTitle('');
      setSpeaker('');
      setDate(new Date());
      setScriptureRefs('');
      setTopicsStr('');
      setYoutubeUrl('');
      setSummary('');
      setCoverImageUrl('');
    }
  }, [sermon, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !speaker.trim() || !date) {
      alert("Title, Speaker, and Date are required.");
      return;
    }

    const sermonData: Omit<Sermon, 'id'> = {
      title,
      speaker,
      date: date.toISOString(),
      scriptureReferences: scriptureRefs.split(',').map(s => s.trim()).filter(Boolean),
      topics: topicsStr.split(',').map(t => t.trim()).filter(Boolean),
      youtubeUrl: youtubeUrl.trim() || undefined,
      summary: summary.trim() || undefined,
      coverImageUrl: coverImageUrl.trim() || undefined,
      dataAiHint: topicsStr.split(',').map(t => t.trim()).filter(Boolean).slice(0,2).join(' ') || 'sermon theme', // Basic data-ai-hint
    };
    onSave(sermonData);
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg md:max-w-2xl bg-card text-card-foreground shadow-xl rounded-xl max-h-[90vh] flex flex-col">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-headline">{sermon ? 'Edit Sermon' : 'Add New Sermon'}</DialogTitle>
          <DialogDescription>
            {sermon ? 'Update the details of this sermon.' : 'Enter the details for the new sermon.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto py-4 px-1 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="sermon-title" className="text-base">Title*</Label>
              <Input
                id="sermon-title" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Sermon Title" className="text-base" required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sermon-speaker" className="text-base">Speaker*</Label>
              <Input
                id="sermon-speaker" value={speaker} onChange={(e) => setSpeaker(e.target.value)}
                placeholder="Speaker's Name" className="text-base" required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sermon-date" className="text-base block mb-1">Date*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal text-base",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
             <div className="space-y-1.5">
              <Label htmlFor="sermon-topics" className="text-base">Topics</Label>
              <Input
                id="sermon-topics" value={topicsStr} onChange={(e) => setTopicsStr(e.target.value)}
                placeholder="Faith, Grace, Community (comma-separated)" className="text-base"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sermon-scriptures" className="text-base">Scripture References</Label>
            <Textarea
              id="sermon-scriptures" value={scriptureRefs} onChange={(e) => setScriptureRefs(e.target.value)}
              placeholder="John 3:16, Psalm 23 (comma-separated or new lines)" rows={2} className="text-base min-h-[60px]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sermon-summary" className="text-base">Summary</Label>
            <Textarea
              id="sermon-summary" value={summary} onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief overview of the sermon" rows={3} className="text-base min-h-[80px]"
            />
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="sermon-youtube" className="text-base">YouTube URL (Optional)</Label>
              <Input
                id="sermon-youtube" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..." type="url" className="text-base"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sermon-coverimage" className="text-base">Cover Image URL (Optional)</Label>
              <Input
                id="sermon-coverimage" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://example.com/image.png" type="url" className="text-base"
              />
            </div>
          </div>
          
           {/* Placeholder for future "Generate Summary" button
            <div className="pt-2">
                <Button type="button" variant="outline" size="sm" disabled>
                    <Sparkles className="h-4 w-4 mr-2"/> Generate Summary (AI - Coming Soon)
                </Button>
            </div>
           */}

        </form>
        
        <DialogFooter className="border-t pt-4 mt-auto gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              <Ban className="h-4 w-4 mr-2" /> Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="sermonEditorForm" onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="h-4 w-4 mr-2" /> {sermon ? 'Save Changes' : 'Add Sermon'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Add to globals.css if not already there for custom scrollbars in modals
/*
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: hsl(var(--card)); 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--muted)); 
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground)); 
}
*/
