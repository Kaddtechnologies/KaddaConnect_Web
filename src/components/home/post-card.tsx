
"use client";

import Image from 'next/image';
import type { Post } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
}

export default function PostCard({ post, onLike }: PostCardProps) {
  return (
    <Card className="mb-6 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Avatar>
          <AvatarImage src={post.author.profilePictureUrl} alt={post.author.displayName} data-ai-hint="profile person" />
          <AvatarFallback>{post.author.displayName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5">
          <CardTitle className="text-base font-semibold">{post.author.displayName}</CardTitle>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {post.imageUrl && (
          <div className="relative w-full aspect-[16/9] bg-muted">
            <Image
              src={post.imageUrl}
              alt="Post image"
              layout="fill"
              objectFit="cover"
              data-ai-hint={post.dataAiHint || "social post"}
            />
          </div>
        )}
        <p className="p-4 text-sm">{post.content}</p>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="flex justify-between w-full">
          <Button variant="ghost" size="sm" onClick={() => onLike(post.id)} className={`flex items-center gap-1.5 ${post.likedByMe ? 'text-primary' : 'text-muted-foreground'}`}>
            <ThumbsUp className={cn('h-4 w-4', post.likedByMe ? 'fill-primary' : '')} />
            <span>{post.likes} {post.likes === 1 ? 'Like' : 'Likes'}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span>Comment</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-muted-foreground">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

// Helper for conditional class names
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
