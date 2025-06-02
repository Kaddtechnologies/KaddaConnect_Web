
"use client";

import type { Article } from '@/types';
import { useUserData } from '@/contexts/user-data-context';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, CalendarDays } from 'lucide-react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  onReadMore: (article: Article) => void; // For opening detail view/modal
}

export default function ArticleCard({ article, onReadMore }: ArticleCardProps) {
  const { toggleFavoriteArticle, isArticleFavorited } = useUserData();
  const isFavorited = isArticleFavorited(article.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking heart
    toggleFavoriteArticle(article.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Basic share functionality (e.g., copy link or use Web Share API)
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href, // Placeholder URL
      }).catch(console.error);
    } else {
      alert('Share functionality not available on this browser.');
    }
  };

  return (
    <Card 
      onClick={() => onReadMore(article)}
      className="cursor-pointer group flex flex-col h-full rounded-xl bg-white/10 backdrop-blur-md shadow-lg hover:shadow-xl transition-shadow text-white overflow-hidden border border-white/20"
    >
      {article.imageUrl && (
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.title}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={article.dataAiHint || "article illustration"}
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      )}
      <CardHeader className={cn("p-4", article.imageUrl && "pt-2")}>
        <div className="flex flex-wrap gap-1 mb-2">
            {article.categories.slice(0, 2).map(category => (
                <Badge key={category} variant="secondary" className="text-xs bg-white/20 text-white border-none backdrop-blur-sm">
                    {category}
                </Badge>
            ))}
        </div>
        <CardTitle className="text-lg font-headline group-hover:text-primary-foreground/80 transition-colors">{article.title}</CardTitle>
        <div className="flex items-center text-xs text-white/70 mt-1">
          <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
          <span>{format(parseISO(article.publishDate), 'MMM d, yyyy')}</span>
          {article.authorName && <span className="mx-1.5">•</span>}
          {article.authorName && <span>By {article.authorName}</span>}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-sm text-white/80 line-clamp-3">{article.summary}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t border-white/20">
        <Button 
            variant="ghost" 
            size="sm" 
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={handleFavorite}
        >
          <Heart className={cn("h-4 w-4 mr-1.5", isFavorited ? "fill-red-500 text-red-500" : "text-white/70")} />
          {isFavorited ? 'Favorited' : 'Favorite'}
        </Button>
        <Button variant="link" size="sm" className="text-white/70 hover:text-white p-0">
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
}
