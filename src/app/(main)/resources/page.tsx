
"use client";

import { useUserData } from '@/contexts/user-data-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpenText, Share2, Library, Search, Filter as FilterIcon, PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import SermonCard from '@/components/resources/SermonCard';
import SermonEditorModal from '@/components/resources/SermonEditorModal';
import type { Sermon } from '@/types';
import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge'; 
import { cn } from '@/lib/utils'; 

export default function ResourcesPage() {
  const { dailyVerse, sermons: allSermons, addSermon, isLoading: dataLoading, currentUserProfile } = useUserData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isSermonEditorOpen, setIsSermonEditorOpen] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null); // For future editing
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!dataLoading) {
      setPageLoading(false);
    }
  },[dataLoading]);

  const handleShareVerse = () => {
    if (dailyVerse) {
      const shareText = `"${dailyVerse.text}" - ${dailyVerse.reference}`;
      if (navigator.share) {
        navigator.share({
          title: 'Verse of the Day',
          text: shareText,
          url: window.location.href,
        }).catch((error) => console.error('Error sharing:', error));
      } else {
        navigator.clipboard.writeText(shareText).then(() => {
          toast({ title: "Copied to clipboard!", description: "Verse copied successfully." });
        }).catch((err) => {
          toast({ title: "Copy failed", description: "Could not copy verse.", variant: "destructive" });
        });
      }
    }
  };

  const allUniqueTopics = useMemo(() => {
    if (!allSermons) return [];
    const topicsSet = new Set<string>();
    allSermons.forEach(sermon => {
      sermon.topics?.forEach(topic => topicsSet.add(topic));
    });
    return Array.from(topicsSet).sort();
  }, [allSermons]);

  const handleToggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const filteredSermons = useMemo(() => {
    if (!allSermons) return [];
    
    let sermonsToFilter = [...allSermons].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());


    // Filter by selected topics
    if (selectedTopics.length > 0) {
      sermonsToFilter = sermonsToFilter.filter(sermon =>
        selectedTopics.every(selTopic => sermon.topics?.includes(selTopic))
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      sermonsToFilter = sermonsToFilter.filter(sermon =>
        sermon.title.toLowerCase().includes(lowerSearchTerm) ||
        sermon.speaker.toLowerCase().includes(lowerSearchTerm) ||
        (sermon.summary && sermon.summary.toLowerCase().includes(lowerSearchTerm)) ||
        (sermon.topics && sermon.topics.some(topic => topic.toLowerCase().includes(lowerSearchTerm))) ||
        (sermon.scriptureReferences && sermon.scriptureReferences.some(ref => ref.toLowerCase().includes(lowerSearchTerm)))
      );
    }
    return sermonsToFilter;
  }, [allSermons, searchTerm, selectedTopics]);

  const handleOpenSermonEditor = (sermonToEdit?: Sermon | null) => {
    setEditingSermon(sermonToEdit || null);
    setIsSermonEditorOpen(true);
  };

  const handleSaveSermon = (sermonData: Omit<Sermon, 'id'>) => {
    // For now, only adding new sermons. Editing would require an updateSermon function.
    if (!editingSermon) {
      addSermon(sermonData);
      toast({ title: "Sermon Added", description: `"${sermonData.title}" has been added.` });
    } else {
      // TODO: Implement sermon update logic
      // updateSermon(editingSermon.id, sermonData);
      toast({ title: "Sermon Updated", description: `"${sermonData.title}" has been updated.` });
    }
    setIsSermonEditorOpen(false);
    setEditingSermon(null);
  };
  
  if (pageLoading) {
     return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading resources...</div>;
  }


  return (
    <div className="container mx-auto max-w-3xl py-0 md:py-6">
      <div className="mb-6 md:mb-8 text-center">
        <BookOpenText className="mx-auto h-12 w-12 text-primary mb-3" />
        <h1 className="text-3xl md:text-4xl font-headline text-primary mb-2">Spiritual Resources</h1>
        <p className="text-muted-foreground">Nourish your faith with daily verses, devotionals, and sermon notes.</p>
      </div>

      {dailyVerse && (
        <Card className="mb-8 shadow-xl rounded-xl bg-gradient-to-br from-primary/5 via-card to-accent/5">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">Verse of the Day</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">{new Date(dailyVerse.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <blockquote className="text-lg md:text-xl font-body italic text-foreground leading-relaxed border-l-4 border-primary pl-4 py-2">
              "{dailyVerse.text}"
            </blockquote>
            <p className="text-right text-md font-semibold text-primary/80">- {dailyVerse.reference}</p>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={handleShareVerse} className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
                <Share2 className="h-4 w-4 mr-2" />
                Share Verse
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-8 shadow-xl rounded-xl">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-headline text-primary flex items-center">
              <Library className="h-7 w-7 mr-3" />
              Sermon Archive
            </CardTitle>
            <CardDescription>Explore past sermons and take notes.</CardDescription>
          </div>
          {currentUserProfile && ( // Only show if user is logged in, adjust based on admin roles if needed
            <Button onClick={() => handleOpenSermonEditor()} variant="outline" className="text-primary border-primary hover:bg-primary/10">
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Sermon
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search sermons by title, speaker, topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-3 text-base rounded-lg shadow-sm"
            />
          </div>
          {allUniqueTopics.length > 0 && (
            <div className="mb-6 space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <FilterIcon className="h-4 w-4 mr-2"/>
                <span>Filter by Topic:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allUniqueTopics.map(topic => (
                  <Badge
                    key={topic}
                    variant={selectedTopics.includes(topic) ? "default" : "secondary"}
                    onClick={() => handleToggleTopic(topic)}
                    className={cn(
                      "cursor-pointer transition-all px-3 py-1.5 text-sm rounded-full shadow-sm",
                      selectedTopics.includes(topic) 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {filteredSermons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {filteredSermons.map(sermon => (
                <SermonCard key={sermon.id} sermon={sermon} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No sermons found matching your search or filter criteria.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-headline">Devotional Readings</CardTitle>
          <CardDescription>Find daily encouragement and reflection.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Devotionals will be available here soon.</p>
        </CardContent>
      </Card>

      {isSermonEditorOpen && (
        <SermonEditorModal
          isOpen={isSermonEditorOpen}
          onClose={() => { setIsSermonEditorOpen(false); setEditingSermon(null); }}
          onSave={handleSaveSermon}
          sermon={editingSermon}
        />
      )}
    </div>
  );
}
    
