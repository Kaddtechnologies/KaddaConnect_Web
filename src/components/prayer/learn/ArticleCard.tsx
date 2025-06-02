
"use client";

import type { Article } from '@/types';
import { useUserData } from '@/contexts/user-data-context';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Share2, CalendarDays } from 'lucide-react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface ArticleCardProps {
  article: Article;
  onReadMore: (article: Article) => void;
}

export default function ArticleCard({ article, onReadMore }: ArticleCardProps) {
  const { toggleFavoriteArticle, isArticleFavorited } = useUserData();
  const isFavorited = isArticleFavorited(article.id);
  const { toast } = useToast();

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteArticle(article.id);
    toast({
      title: isFavorited ? "Removed from Favorites" : "Added to Favorites",
      description: `"${article.title}" ${isFavorited ? 'removed from' : 'added to'} your favorites.`,
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href, 
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(`${article.title}: ${article.summary} (Read more at ${window.location.href})`).then(() => {
        toast({ title: "Copied to clipboard!", description: "Article link copied." });
      }).catch((err) => {
        toast({ title: "Copy failed", description: "Could not copy article link.", variant: "destructive" });
      });
    }
  };

  return (
    <Card 
      onClick={() => onReadMore(article)}
      className={cn(
        "cursor-pointer group flex flex-col h-full rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden",
        "bg-card text-card-foreground border border-border/70", // Adjusted for dark theme
        "hover:border-primary/50"
      )}
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
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        </div>
      )}
      <CardHeader className={cn("p-4", article.imageUrl && "pt-3 relative z-10", article.imageUrl && "mt-[-40px]")}> {/* Adjust to overlay title on image slightly */}
        {article.imageUrl && (
           <div className="flex flex-wrap gap-1 mb-1.5">
            {article.categories.slice(0, 2).map(category => (
                <Badge key={category} variant="secondary" className="text-xs bg-black/40 text-white/90 border-white/30 backdrop-blur-sm shadow-md">
                    {category}
                </Badge>
            ))}
          </div>
        )}
        <CardTitle className={cn("text-lg font-headline group-hover:text-primary transition-colors", article.imageUrl ? "text-white" : "text-card-foreground")}>{article.title}</CardTitle>
        {!article.imageUrl && (
            <div className="flex flex-wrap gap-1 mt-1.5">
                {article.categories.slice(0, 2).map(category => (
                    <Badge key={category} variant="outline" className="text-xs">
                        {category}
                    </Badge>
                ))}
            </div>
        )}
        <div className={cn("flex items-center text-xs mt-1", article.imageUrl ? "text-white/80" : "text-muted-foreground")}>
          <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
          <span>{format(parseISO(article.publishDate), 'MMM d, yyyy')}</span>
          {article.authorName && <span className="mx-1.5">•</span>}
          {article.authorName && <span>By {article.authorName}</span>}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{article.summary}</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t border-border/70">
        <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-primary"
            onClick={handleFavorite}
        >
          <Heart className={cn("h-4 w-4 mr-1.5", isFavorited ? "fill-red-500 text-red-500" : "")} />
          {isFavorited ? 'Favorited' : 'Favorite'}
        </Button>
        <Button variant="link" size="sm" className="text-primary hover:text-primary/80 p-0">
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
}
