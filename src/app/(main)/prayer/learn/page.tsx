
"use client";

import { useState } from 'react';
import { useUserData } from '@/contexts/user-data-context';
import ArticleCard from '@/components/prayer/learn/ArticleCard';
import CategoryChips from '@/components/prayer/learn/CategoryChips';
import SearchBar from '@/components/prayer/learn/SearchBar';
import type { Article } from '@/types';
import { Input } from '@/components/ui/input';
import { Search, ListFilter, BookOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function LearnPrayerPage() {
  const { articles } = useUserData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const allCategories = Array.from(new Set(articles.flatMap(article => article.categories)));

  const filteredArticles = articles.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = 
      selectedCategories.length === 0 || 
      selectedCategories.some(cat => article.categories.includes(cat));
    return matchesSearch && matchesCategory;
  });

  const handleReadMore = (article: Article) => {
    setSelectedArticle(article);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search articles by title or summary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 text-base rounded-lg shadow-sm bg-card text-card-foreground"
          />
        </div>
        {/* CategoryChips can be integrated here if needed, for now using simple filter text */}
         <div className="text-sm text-muted-foreground flex items-center">
            <ListFilter className="h-4 w-4 mr-2"/>
            Filters coming soon. Currently showing all articles.
        </div>
      </div>
      
      {/* Placeholder for CategoryChips and SearchBar components if they become more complex */}
      {/* <CategoryChips categories={allCategories} selectedCategories={selectedCategories} onToggleCategory={handleToggleCategory} /> */}
      {/* <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} /> */}

      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <ArticleCard key={article.id} article={article} onReadMore={handleReadMore} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No articles found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
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
              <div className="prose prose-sm md:prose-base max-w-none text-card-foreground py-4" dangerouslySetInnerHTML={{ __html: selectedArticle.content.replace(/\\n/g, '<br/>').replace(/\n/g, '<br/>')  }}>
                {/* Content is rendered using dangerouslySetInnerHTML, assuming markdown is pre-processed to HTML or simple text with line breaks */}
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
