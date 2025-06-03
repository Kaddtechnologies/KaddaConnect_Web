
"use client";

import PostCard from '@/components/home/post-card';
import { useUserData } from '@/contexts/user-data-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ImagePlus, Send, RadioTower, Users, HeartHandshake } from 'lucide-react';
import Image from 'next/image';

// Hero Section Component
const HeroSection = () => (
  <div className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12 md:py-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden rounded-b-xl md:rounded-xl mb-8 shadow-lg">
    <div className="absolute inset-0 opacity-5" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/inspiration-geometry.png')"}}></div>
    <div className="relative z-10">
      <RadioTower className="mx-auto h-16 w-16 text-primary animate-pulse mb-4" />
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline text-primary mb-4">
        Welcome to KaddaConnect!
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        Your space to connect, share, grow, and find encouragement within our church community.
      </p>
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        <Button size="lg" variant="default" className="bg-primary hover:bg-primary/90 shadow-md">
          <Users className="mr-2 h-5 w-5" /> Explore Groups
        </Button>
        <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 hover:text-primary shadow-md">
          <HeartHandshake className="mr-2 h-5 w-5" /> Prayer Hub
        </Button>
      </div>
    </div>
  </div>
);


export default function HomePage() {
  const { posts, toggleLikePost, addPost, currentUserProfile } = useUserData();
  const [newPostContent, setNewPostContent] = useState('');

  const handleCreatePost = () => {
    if (newPostContent.trim() && currentUserProfile) {
      addPost(newPostContent.trim());
      setNewPostContent('');
    }
  };

  return (
    <div className="w-full"> {/* Removed container, mx-auto, max-w, py from here. Page specific padding below. */}
      <HeroSection />
      
      <div className="max-w-xl mx-auto space-y-6 px-3 md:px-0 pb-6 md:pb-12"> {/* Centered content column for feed */}
        {currentUserProfile && (
          <Card className="shadow-xl rounded-xl border border-border/70">
            <CardContent className="p-4">
              <Textarea
                placeholder={`What's on your mind, ${currentUserProfile.displayName.split(' ')[0]}?`}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="mb-3 min-h-[80px] rounded-lg border-input focus:ring-primary text-base"
              />
              <div className="flex justify-between items-center">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <ImagePlus className="h-5 w-5" />
                  <span className="sr-only">Add image</span>
                </Button>
                <Button onClick={handleCreatePost} disabled={!newPostContent.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg">
                  <Send className="h-4 w-4 mr-2"/>
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {posts.length === 0 && !currentUserProfile && ( // Show if no user (and thus no create post card) and no posts
           <div className="text-center text-muted-foreground py-10">
             <h2 className="text-xl font-semibold mb-2">Welcome to the Community Feed!</h2>
             <p>Posts from members will appear here. Log in or sign up to participate.</p>
           </div>
        )}
         {posts.length === 0 && currentUserProfile && ( // Show if user is logged in but no posts yet
           <div className="text-center text-muted-foreground py-10">
             <h2 className="text-xl font-semibold mb-2">The feed is quiet...</h2>
             <p>Be the first to share something with the community!</p>
           </div>
        )}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onLike={toggleLikePost} />
        ))}
      </div>
    </div>
  );
}
