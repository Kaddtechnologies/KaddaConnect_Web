
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useUserData } from '@/contexts/user-data-context';
import type { UserProfile, Post as UserPostType } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import PostCard from '@/components/home/post-card';
import { CalendarDays, Edit3, Image as ImageIcon, Link2, Loader2, Mail, MapPin, MessageCircle, Plus, Rss, UserCheck, UserPlus, Users, Settings } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { userId } = params as { userId: string };
  
  const { user: loggedInUser } = useAuth();
  const { getMemberById, posts: allPosts, toggleLikePost } = useUserData();
  
  const [profileUser, setProfileUser] = useState<UserProfile | null | undefined>(undefined);
  const [userPosts, setUserPosts] = useState<UserPostType[]>([]);

  useEffect(() => {
    if (userId) {
      const user = getMemberById(userId);
      setProfileUser(user);
      if (user) {
        const postsByUser = allPosts.filter(post => post.author.id === user.id)
                                   .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setUserPosts(postsByUser);
      }
    }
  }, [userId, getMemberById, allPosts]);

  const isOwnProfile = loggedInUser?.id === profileUser?.id;

  if (profileUser === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (profileUser === null) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-semibold">User Not Found</h1>
        <p className="text-muted-foreground">The profile you are looking for does not exist.</p>
        <Button onClick={() => router.push('/home')} className="mt-4">Go to Home</Button>
      </div>
    );
  }
  
  const formattedJoinDate = profileUser.joinDate ? format(parseISO(profileUser.joinDate), 'MMMM yyyy') : 'N/A';

  return (
    <div className="bg-background min-h-screen">
      {/* Cover Image Section */}
      <div className="relative h-48 md:h-64 lg:h-80 w-full bg-muted shadow-inner">
        {profileUser.coverImageUrl ? (
          <Image
            src={profileUser.coverImageUrl}
            alt={`${profileUser.displayName}'s cover photo`}
            layout="fill"
            objectFit="cover"
            data-ai-hint={profileUser.dataAiHintCover || "profile cover"}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30"></div>
        )}
        <div className="absolute inset-0 bg-black/30"></div> {/* Gradient overlay for text contrast */}
      </div>

      {/* Profile Header Section */}
      <div className="container mx-auto max-w-5xl px-4">
        <div className="relative -mt-16 md:-mt-24 flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6 pb-6 border-b border-border">
          <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background bg-muted shadow-lg text-4xl">
            <AvatarImage src={profileUser.profilePictureUrl} alt={profileUser.displayName} data-ai-hint={profileUser.dataAiHint || "profile person"}/>
            <AvatarFallback>{profileUser.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-grow text-center md:text-left pt-4 md:pt-0">
            <h1 className="text-3xl md:text-4xl font-headline text-foreground">{profileUser.displayName}</h1>
            {profileUser.ministry && <p className="text-md text-primary">{profileUser.ministry}</p>}
            {profileUser.bio && <p className="text-sm text-muted-foreground mt-1 hidden md:block max-w-xl">{profileUser.bio}</p>}
          </div>
          <div className="flex-shrink-0 flex gap-2 pt-4 md:pt-0">
            {isOwnProfile ? (
              <Link href="/profile" passHref legacyBehavior>
                <Button variant="outline"><Edit3 className="mr-2 h-4 w-4" /> Edit Profile</Button>
              </Link>
            ) : (
              <>
                <Button variant="default" className="bg-primary hover:bg-primary/90"><UserPlus className="mr-2 h-4 w-4" /> Follow</Button>
                <Button variant="outline"><MessageCircle className="mr-2 h-4 w-4" /> Message</Button>
              </>
            )}
          </div>
        </div>
         {profileUser.bio && <p className="text-sm text-muted-foreground mt-4 md:hidden text-center">{profileUser.bio}</p>}
      </div>
      
      {/* Tabs Section */}
      <div className="container mx-auto max-w-5xl px-4 mt-0 md:mt-6">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 sticky top-16 md:top-0 z-20 bg-background/80 backdrop-blur-sm py-2">
            <TabsTrigger value="posts" className="text-sm"><Rss className="mr-1.5 h-4 w-4" />Posts ({userPosts.length})</TabsTrigger>
            <TabsTrigger value="about" className="text-sm"><ImageIcon className="mr-1.5 h-4 w-4" />About</TabsTrigger>
            <TabsTrigger value="photos" className="text-sm" disabled><ImageIcon className="mr-1.5 h-4 w-4" />Photos</TabsTrigger>
            <TabsTrigger value="connections" className="text-sm" disabled><Users className="mr-1.5 h-4 w-4" />Connections</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="min-h-[400px]">
            {userPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {userPosts.map(post => (
                  <PostCard key={post.id} post={post} onLike={toggleLikePost} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12 shadow-none border-dashed">
                <CardContent>
                  <Rss className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold">No Posts Yet</h3>
                  <p className="text-muted-foreground">{profileUser.displayName} hasn't shared any posts.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="about" className="max-w-3xl mx-auto">
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="font-headline text-primary">About {profileUser.displayName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {profileUser.bio && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Bio</h4>
                    <p className="text-muted-foreground whitespace-pre-line">{profileUser.bio}</p>
                  </div>
                )}
                 {profileUser.ministry && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Ministry / Role</h4>
                    <p className="text-muted-foreground">{profileUser.ministry}</p>
                  </div>
                )}
                {profileUser.interests && profileUser.interests.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {profileUser.interests.map(interest => (
                        <Badge key={interest} variant="secondary" className="bg-accent/10 text-accent-foreground border-accent/20">{interest}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {profileUser.joinDate && (
                   <div>
                    <h4 className="font-semibold text-foreground mb-1">Joined</h4>
                    <p className="text-muted-foreground flex items-center"><CalendarDays className="mr-2 h-4 w-4"/> Joined in {formattedJoinDate}</p>
                  </div>
                )}
                {profileUser.email && (
                   <div>
                    <h4 className="font-semibold text-foreground mb-1">Contact</h4>
                    <p className="text-muted-foreground flex items-center"><Mail className="mr-2 h-4 w-4"/> {profileUser.email} (Privacy settings may apply)</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos">
             <Card className="text-center py-12 shadow-none border-dashed">
                <CardContent>
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold">Photo Gallery Coming Soon</h3>
                  <p className="text-muted-foreground">{profileUser.displayName}'s shared photos will appear here.</p>
                </CardContent>
              </Card>
          </TabsContent>
          <TabsContent value="connections">
             <Card className="text-center py-12 shadow-none border-dashed">
                <CardContent>
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold">Connections Feature Coming Soon</h3>
                  <p className="text-muted-foreground">View {profileUser.displayName}'s connections and mutual friends.</p>
                </CardContent>
              </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
