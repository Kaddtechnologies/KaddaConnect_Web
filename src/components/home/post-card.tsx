
"use client";

import Image from 'next/image';
import type { Post } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
}

export default function PostCard({ post, onLike }: PostCardProps) {
  return (
    <Card className="shadow-xl rounded-xl overflow-hidden border border-border/70">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Avatar className="h-10 w-10 border border-border/50">
          <AvatarImage src={post.author.profilePictureUrl} alt={post.author.displayName} data-ai-hint="profile person" />
          <AvatarFallback className="bg-muted">{post.author.displayName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5">
          <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">{post.author.displayName}</CardTitle>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {post.imageUrl && (
          <div className="relative w-full aspect-[16/9] bg-muted border-y border-border/50">
            <Image
              src={post.imageUrl}
              alt={post.dataAiHint || "Post image"}
              layout="fill"
              objectFit="cover"
              data-ai-hint={post.dataAiHint || "social post"}
            />
          </div>
        )}
        <p className="p-4 text-sm text-foreground/90">{post.content}</p>
      </CardContent>
      <CardFooter className="p-3 border-t border-border/70">
        <div className="flex justify-around w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onLike(post.id)} 
            className={cn(
              'flex items-center gap-1.5 rounded-md',
              post.likedByMe ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
            )}
          >
            <ThumbsUp className={cn('h-5 w-5', post.likedByMe ? 'fill-primary' : '')} />
            <span>{post.likes} {post.likes === 1 ? 'Like' : 'Likes'}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md">
            <MessageSquare className="h-5 w-5" />
            <span>Comment</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md">
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
