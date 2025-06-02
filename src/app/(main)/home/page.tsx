
"use client";

import PostCard from '@/components/home/post-card';
import { useUserData } from '@/contexts/user-data-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ImagePlus, Send } from 'lucide-react';

export default function HomePage() {
  const { posts, toggleLikePost, addPost, currentUserProfile } = useUserData();
  const [newPostContent, setNewPostContent] = useState('');
  // In a real app, imageUrl would be handled by file upload.
  // For simplicity, we'll omit image uploads from the "create post" form.

  const handleCreatePost = () => {
    if (newPostContent.trim() && currentUserProfile) {
      addPost(newPostContent.trim());
      setNewPostContent('');
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-0 md:py-6">
      {currentUserProfile && (
        <Card className="mb-6 shadow-lg rounded-xl">
          <CardContent className="p-4">
            <Textarea
              placeholder={`What's on your mind, ${currentUserProfile.displayName}?`}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="mb-2 min-h-[80px] rounded-lg border-border focus:ring-primary"
            />
            <div className="flex justify-between items-center">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <ImagePlus className="h-5 w-5" />
                <span className="sr-only">Add image</span>
              </Button>
              <Button onClick={handleCreatePost} disabled={!newPostContent.trim()} className="bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4 mr-2"/>
                Post
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="space-y-0 md:space-y-6">
        {posts.length === 0 && (
           <div className="text-center text-muted-foreground py-10">
             <h2 className="text-xl font-semibold mb-2">No posts yet!</h2>
             <p>Be the first to share something with the community.</p>
           </div>
        )}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onLike={toggleLikePost} />
        ))}
      </div>
    </div>
  );
}
