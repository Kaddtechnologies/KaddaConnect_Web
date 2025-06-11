
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, BookOpen, FileText, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react';
import { KJV_BOOKS } from '@/lib/bible/kjv-books';
import { fetchKJVPassage, fetchVerseTextForAI } from '@/lib/bible/api';
import type { BibleVerseAPI } from '@/types';
import { explainBibleVerse } from '@/ai/flows/bible-verse-explanation-flow';
import { useToast } from '@/hooks/use-toast';

interface BibleReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BibleReaderModal({ isOpen, onClose }: BibleReaderModalProps) {
  const [selectedBook, setSelectedBook] = useState<string>(KJV_BOOKS[0].name);
  const [availableChapters, setAvailableChapters] = useState<number[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>("1");
  
  const [passageVerses, setPassageVerses] = useState<BibleVerseAPI[]>([]);
  const [passageReference, setPassageReference] = useState<string>("");
  const [isLoadingPassage, setIsLoadingPassage] = useState(false);
  const [passageError, setPassageError] = useState<string | null>(null);

  const [verseRefForAI, setVerseRefForAI] = useState<string>("");
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isExplainingAI, setIsExplainingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const bookData = KJV_BOOKS.find(b => b.name === selectedBook);
    if (bookData) {
      setAvailableChapters(Array.from({ length: bookData.chapters }, (_, i) => i + 1));
      setSelectedChapter("1"); // Reset to chapter 1 when book changes
    }
  }, [selectedBook]);

  const handleFetchChapter = async () => {
    if (!selectedBook || !selectedChapter) {
      setPassageError("Please select a book and chapter.");
      return;
    }
    setIsLoadingPassage(true);
    setPassageError(null);
    setPassageVerses([]);
    try {
      const chapterNum = parseInt(selectedChapter, 10);
      const data = await fetchKJVPassage(selectedBook, chapterNum);
      setPassageVerses(data.verses);
      setPassageReference(data.reference);
      // Pre-fill AI input with the first verse of the chapter if it's short
      if (data.verses.length > 0) {
        const firstVerseRef = `${data.verses[0].book_name} ${data.verses[0].chapter}:${data.verses[0].verse}`;
        setVerseRefForAI(firstVerseRef);
      } else {
        setVerseRefForAI(data.reference);
      }
      setAiExplanation(null); // Clear previous explanation
    } catch (error: any) {
      setPassageError(error.message || "Failed to load chapter. Please try again.");
      toast({ title: "Error Loading Chapter", description: error.message || "Unknown error", variant: "destructive" });
    } finally {
      setIsLoadingPassage(false);
    }
  };

  const handleGetAIExplanation = async () => {
    if (!verseRefForAI.trim()) {
      setAiError("Please enter a Bible reference (e.g., John 3:16).");
      return;
    }
    setIsExplainingAI(true);
    setAiError(null);
    setAiExplanation(null);
    try {
      const verseTextToExplain = await fetchVerseTextForAI(verseRefForAI.trim());
      if (!verseTextToExplain) {
        throw new Error("Could not fetch the text for the provided reference. Please check the reference.");
      }
      const result = await explainBibleVerse({
        verseReference: verseRefForAI.trim(),
        verseText: verseTextToExplain,
        translation: "KJV",
      });
      setAiExplanation(result.explanation);
    } catch (error: any) {
      setAiError(error.message || "Failed to get AI explanation.");
      toast({ title: "AI Explanation Error", description: error.message || "Unknown error", variant: "destructive" });
    } finally {
      setIsExplainingAI(false);
    }
  };
  
  const currentBookTotalChapters = useMemo(() => {
    return KJV_BOOKS.find(b => b.name === selectedBook)?.chapters || 0;
  }, [selectedBook]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl w-[95vw] h-[90vh] flex flex-col bg-card text-card-foreground shadow-xl rounded-xl p-0">
        <DialogHeader className="p-4 sm:p-6 border-b">
          <DialogTitle className="text-2xl font-headline flex items-center">
            <BookOpen className="h-7 w-7 mr-3 text-primary" /> KJV Bible Reader
          </DialogTitle>
          <DialogDescription>
            Read the King James Version of the Bible and get AI-powered insights.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 flex-grow min-h-0">
          {/* Controls & AI Section */}
          <div className="md:col-span-1 p-4 sm:p-6 border-r flex flex-col gap-4 bg-muted/30 overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Passage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="bible-book">Book</Label>
                  <Select value={selectedBook} onValueChange={setSelectedBook}>
                    <SelectTrigger id="bible-book">
                      <SelectValue placeholder="Select a book" />
                    </SelectTrigger>
                    <SelectContent>
                      {KJV_BOOKS.map(book => (
                        <SelectItem key={book.name} value={book.name}>{book.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bible-chapter">Chapter</Label>
                  <Select value={selectedChapter} onValueChange={setSelectedChapter} disabled={availableChapters.length === 0}>
                    <SelectTrigger id="bible-chapter">
                      <SelectValue placeholder="Select a chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableChapters.map(chapNum => (
                        <SelectItem key={chapNum} value={String(chapNum)}>{chapNum}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleFetchChapter} disabled={isLoadingPassage || !selectedBook || !selectedChapter} className="w-full">
                  {isLoadingPassage && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Load Chapter
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center"><Lightbulb className="h-5 w-5 mr-2 text-yellow-400"/>AI Explanation</CardTitle>
                <CardDescription>Enter a verse or range (e.g., John 3:16 or Gen 1:1-3)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="ai-verse-ref">Verse Reference</Label>
                  <Input 
                    id="ai-verse-ref" 
                    placeholder="e.g., John 3:16" 
                    value={verseRefForAI}
                    onChange={(e) => setVerseRefForAI(e.target.value)}
                  />
                </div>
                <Button onClick={handleGetAIExplanation} disabled={isExplainingAI || !verseRefForAI.trim()} className="w-full">
                  {isExplainingAI && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Explain with AI
                </Button>
                 {aiError && <p className="text-xs text-destructive flex items-center"><AlertTriangle className="h-3 w-3 mr-1"/> {aiError}</p>}
              </CardContent>
            </Card>

            {aiExplanation && (
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-md font-semibold text-primary flex items-center"><Sparkles className="h-4 w-4 mr-2"/>AI Insight on {verseRefForAI}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[150px] text-sm text-foreground/90 whitespace-pre-wrap pr-2">
                        {aiExplanation}
                    </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Bible Text Display Section */}
          <div className="md:col-span-2 p-4 sm:p-6 flex flex-col min-h-0">
            {passageReference && !isLoadingPassage && !passageError && (
              <h3 className="text-xl font-semibold mb-3 text-primary">{passageReference}</h3>
            )}
            <ScrollArea className="flex-grow rounded-md border bg-muted/20 p-3 sm:p-4 min-h-[200px]">
              {isLoadingPassage && (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-2 text-muted-foreground">Loading passage...</p>
                </div>
              )}
              {passageError && (
                <div className="flex flex-col items-center justify-center h-full text-destructive">
                  <AlertTriangle className="h-8 w-8 mb-2" />
                  <p className="font-semibold">Error loading passage:</p>
                  <p className="text-sm">{passageError}</p>
                </div>
              )}
              {!isLoadingPassage && !passageError && passageVerses.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <FileText className="h-10 w-10 mb-3" />
                  <p>Select a book and chapter, then click "Load Chapter" to read.</p>
                </div>
              )}
              {!isLoadingPassage && passageVerses.length > 0 && (
                <div className="space-y-2 text-base sm:text-lg leading-relaxed font-serif">
                  {passageVerses.map(verse => (
                    <p key={verse.verse}>
                      <sup className="text-xs text-primary font-sans mr-1">{verse.verse}</sup>
                      {verse.text.trim()}
                    </p>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="p-4 sm:p-6 border-t mt-auto">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
