
// src/app/(main)/groups/[groupId]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUserData } from '@/contexts/user-data-context';
import type { InterestGroup, UserProfile } from '@/types'; // Assuming these types
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, MessageSquare, CalendarDays, Image as ImageIcon, Settings, Edit3, UserPlus, LogOutIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

// Placeholder for group posts/chat messages
interface GroupPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: string; // ISO string
  dataAiHint?: string;
}

const GroupPostCard = ({ post }: { post: GroupPost }) => (
    <Card className="mb-4 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3 p-3">
            <Avatar className="h-9 w-9">
                <AvatarImage src={post.authorAvatar} alt={post.authorName} data-ai-hint="profile person" />
                <AvatarFallback>{post.authorName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
                <p className="text-sm font-semibold">{post.authorName}</p>
                <p className="text-xs text-muted-foreground">{new Date(post.timestamp).toLocaleString()}</p>
            </div>
        </CardHeader>
        <CardContent className="p-3 pt-0">
            <p className="text-sm">{post.content}</p>
        </CardContent>
    </Card>
);


export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { groupId } = params as { groupId: string };
  // const { getGroupById, getMembersForGroup, getPostsForGroup, addPostToGroup, joinGroup, leaveGroup, currentUserProfile } = useUserData(); // To be implemented
  const { currentUserProfile, getMemberById: getOverallMemberById } = useUserData(); // Using existing member fetch for now

  const [group, setGroup] = useState<InterestGroup | null>(null);
  const [members, setMembers] = useState<UserProfile[]>([]); // Assuming UserProfile can represent a member
  const [posts, setPosts] = useState<GroupPost[]>([]); // Placeholder for group posts
  const [newPostContent, setNewPostContent] = useState('');

  // Placeholder data
  const placeholderGroups: InterestGroup[] = [
    { id: 'group1', name: 'Bible Study Fellowship', description: 'Weekly discussions on scripture. We delve deep into books of the Bible, share insights, and support each other in our spiritual walk. Open to all levels of Bible knowledge.', memberCount: 15, category: 'Ministry', createdBy: 'user1', createdAt: new Date().toISOString(), members: ['user1', 'user2', 'user4'] },
    { id: 'group2', name: 'Hiking Adventures', description: 'Exploring local trails and nature. We organize bi-weekly hikes, from easy walks to challenging treks. A great way to enjoy creation and fellowship.', memberCount: 22, category: 'Hobbies', createdBy: 'user2', createdAt: new Date().toISOString(), members: ['user2', 'user3'] },
    { id: 'group3', name: 'Tech Innovators', description: 'Discussing new technologies and projects.', memberCount: 8, category: 'Careers', createdBy: 'user3',createdAt: new Date().toISOString(), members: ['user3', 'user1'] },
  ];

   const placeholderGroupPosts: GroupPost[] = [
    { id: 'gpost1', authorId: 'user2', authorName: 'Jane Smith', authorAvatar: 'https://placehold.co/50x50.png', content: 'Looking forward to our next Bible study on Romans!', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()},
    { id: 'gpost2', authorId: 'user1', authorName: 'Alex Doe', authorAvatar: 'https://placehold.co/50x50.png', content: 'The discussion on chapter 5 was really insightful.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString()},
  ];


  useEffect(() => {
    if (groupId) {
      const foundGroup = placeholderGroups.find(g => g.id === groupId);
      setGroup(foundGroup || null);
      if (foundGroup) {
          // Simulate fetching members - replace with actual context call
          const groupMemberProfiles = (foundGroup.members || []).map(id => getOverallMemberById(id)).filter(m => m) as UserProfile[];
          setMembers(groupMemberProfiles);
          // Simulate fetching posts - replace with actual context call
          if (groupId === "group1") { // Example: only group1 has posts for now
            setPosts(placeholderGroupPosts.map(p => ({...p, authorName: getOverallMemberById(p.authorId)?.displayName || 'Unknown', authorAvatar: getOverallMemberById(p.authorId)?.profilePictureUrl })));
          } else {
            setPosts([]);
          }
      }
    }
  }, [groupId, getOverallMemberById]);

  const handleAddPost = () => {
    if (!newPostContent.trim() || !currentUserProfile || !group) return;
    // addPostToGroup(group.id, newPostContent.trim()); // To be implemented
    const newP: GroupPost = {
        id: `gpost-${Date.now()}`,
        authorId: currentUserProfile.id,
        authorName: currentUserProfile.displayName,
        authorAvatar: currentUserProfile.profilePictureUrl,
        content: newPostContent.trim(),
        timestamp: new Date().toISOString()
    };
    setPosts(prev => [newP, ...prev]);
    setNewPostContent('');
    alert(`Post added to ${group.name} (mock): ${newPostContent.trim()}`);
  };

  const handleJoinGroup = () => {
    if (!group) return;
    // joinGroup(group.id);
    alert(`Joined group: ${group.name} (mock)`);
  };
  
  const handleLeaveGroup = () => {
    if (!group) return;
    // leaveGroup(group.id);
    alert(`Left group: ${group.name} (mock)`);
  };

  if (!group) {
    return (
      <div className="container mx-auto py-6 text-center">
        <h1 className="text-2xl font-semibold mb-4">Group Not Found</h1>
        <Button onClick={() => router.push('/groups')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Groups
        </Button>
      </div>
    );
  }

  const isMember = currentUserProfile && group.members?.includes(currentUserProfile.id);
  const isCreator = currentUserProfile && group.createdBy === currentUserProfile.id;


  return (
    <div className="container mx-auto max-w-3xl py-0 md:py-6">
      <Button onClick={() => router.push('/groups')} variant="outline" size="sm" className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Groups
      </Button>

      <Card className="mb-6 shadow-lg rounded-xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <CardTitle className="text-3xl font-headline text-primary">{group.name}</CardTitle>
              <CardDescription className="mt-1">{group.description}</CardDescription>
              <p className="text-xs text-muted-foreground mt-2">Category: {group.category} • Created by: {getOverallMemberById(group.createdBy)?.displayName || 'Unknown'}</p>
            </div>
            <div className="flex-shrink-0 space-y-2 w-full md:w-auto">
              {!isMember && (
                <Button onClick={handleJoinGroup} className="w-full bg-green-600 hover:bg-green-700">
                  <UserPlus className="h-4 w-4 mr-2" /> Join Group
                </Button>
              )}
              {isMember && !isCreator && (
                 <Button onClick={handleLeaveGroup} variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive/10">
                  <LogOutIcon className="h-4 w-4 mr-2" /> Leave Group
                </Button>
              )}
              {isCreator && (
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" /> Group Settings
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="posts"><MessageSquare className="h-4 w-4 mr-2 md:hidden"/>Posts</TabsTrigger>
          <TabsTrigger value="members"><Users className="h-4 w-4 mr-2 md:hidden"/>Members</TabsTrigger>
          <TabsTrigger value="events"><CalendarDays className="h-4 w-4 mr-2 md:hidden"/>Events</TabsTrigger>
          <TabsTrigger value="media"><ImageIcon className="h-4 w-4 mr-2 md:hidden"/>Media</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>Group Feed</CardTitle>
            </CardHeader>
            <CardContent>
              {isMember && (
                <div className="mb-6">
                  <Textarea
                    placeholder="Share something with the group..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows={3}
                    className="mb-2"
                  />
                  <Button onClick={handleAddPost} disabled={!newPostContent.trim()}>Post to Group</Button>
                </div>
              )}
              {posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map(post => <GroupPostCard key={post.id} post={post} />)}
                </div>
              ) : (
                <p className="text-muted-foreground">No posts in this group yet. {isMember ? "Be the first to share!" : "Join the group to see posts."}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Group Members ({members.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {members.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {members.map(member => (
                    <Card key={member.id} className="p-3 flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.profilePictureUrl} alt={member.displayName} data-ai-hint="profile person"/>
                        <AvatarFallback>{member.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{member.displayName}</p>
                        <p className="text-xs text-muted-foreground">{member.ministry || "Member"}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No members in this group yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Group Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Group events calendar coming soon!</p>
              {/* Placeholder for event list or calendar view */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Shared Media</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Shared media gallery coming soon!</p>
              {/* Placeholder for image/video grid */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    