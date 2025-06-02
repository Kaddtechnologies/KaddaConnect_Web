
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useUserData } from '@/contexts/user-data-context';
import ArticleCard from '@/components/prayer/learn/ArticleCard';
import CategoryChips from '@/components/prayer/learn/CategoryChips';
import SearchBar from '@/components/prayer/learn/SearchBar';
import type { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Filter, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function LearnPrayerPage() {
  const { articles: allArticles, isLoading: dataLoading } = useUserData(); // Assuming isLoading is available
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Page specific loading

  useEffect(() => {
    if (!dataLoading) {
      setIsLoading(false);
    }
  }, [dataLoading]);
  
  const allCategories = useMemo(() => {
    if (!allArticles) return [];
    return Array.from(new Set(allArticles.flatMap(article => article.categories)));
  }, [allArticles]);

  const filteredArticles = useMemo(() => {
    if (!allArticles) return [];
    return allArticles.filter(article => {
      const matchesSearch = 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.authorName && article.authorName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = 
        selectedCategories.length === 0 || 
        selectedCategories.some(cat => article.categories.includes(cat));
      return matchesSearch && matchesCategory;
    });
  }, [allArticles, searchTerm, selectedCategories]);

  const handleReadMore = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleToggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading articles...</p>
      </div>
    );
  }


  return (
    <div className="animate-fadeIn">
      <div className="mb-6 space-y-4">
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm}
          placeholder="Search articles by title, summary, or author..."
        />
        {allCategories.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Filter className="h-4 w-4 mr-2"/>
              <span>Filter by Category:</span>
            </div>
            <CategoryChips 
              categories={allCategories} 
              selectedCategories={selectedCategories} 
              onToggleCategory={handleToggleCategory} 
            />
          </div>
        )}
      </div>
      
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <ArticleCard key={article.id} article={article} onReadMore={handleReadMore} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card/50 rounded-xl shadow-inner">
          <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
          <h3 className="text-2xl font-semibold text-foreground mb-3">No articles found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Try adjusting your search or filter criteria, or check back later for new content.
          </p>
        </div>
      )}

      {selectedArticle && (
        <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
          <DialogContent className="sm:max-w-2xl bg-card text-card-foreground max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline">{selectedArticle.title}</DialogTitle>
              <DialogDescription>
                Published on {new Date(selectedArticle.publishDate).toLocaleDateString()}
                {selectedArticle.authorName && ` by ${selectedArticle.authorName}`}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-grow pr-6 -mr-6">
              <div 
                className="prose prose-sm md:prose-base max-w-none text-card-foreground py-4 prose-headings:text-card-foreground prose-strong:text-card-foreground prose-a:text-primary hover:prose-a:text-primary/80" 
                dangerouslySetInnerHTML={{ __html: selectedArticle.content.replace(/\\n/g, '<br/>').replace(/\n/g, '<br/>') }}
              >
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button onClick={() => setSelectedArticle(null)} variant="outline">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
