
"use client";

import type { Post, Member, PrayerRequest, UserProfile, DailyVerse } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { placeholderPosts, placeholderMembers, placeholderPrayerRequests, placeholderDailyVerse } from '@/lib/placeholder-data';
import { useAuth } from './auth-context';

interface UserDataContextType {
  posts: Post[];
  members: Member[];
  prayerRequests: PrayerRequest[];
  dailyVerse: DailyVerse | null;
  currentUserProfile: UserProfile | null;
  addPost: (content: string, imageUrl?: string) => void;
  toggleLikePost: (postId: string) => void;
  addPrayerRequest: (requestText: string) => void;
  updateUserProfile: (updatedProfileData: Partial<UserProfile>) => void;
  getMemberById: (id: string) => Member | undefined;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>(placeholderPosts);
  const [members, setMembers] = useState<Member[]>(placeholderMembers);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(placeholderPrayerRequests);
  const [dailyVerse, setDailyVerse] = useState<DailyVerse | null>(placeholderDailyVerse);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (authUser) {
      const profile = members.find(m => m.id === authUser.id);
      if (profile) {
        setCurrentUserProfile(profile);
      } else {
        // If user from auth doesn't exist in members, add them (e.g., after signup)
        const newMemberProfile: Member = {
            ...authUser,
            ministry: authUser.ministry || 'General Member',
            interests: authUser.interests || [],
            profilePictureUrl: authUser.profilePictureUrl || 'https://placehold.co/100x100.png',
        };
        setMembers(prev => [...prev, newMemberProfile]);
        setCurrentUserProfile(newMemberProfile);
      }
    } else {
      setCurrentUserProfile(null);
    }
  }, [authUser, members]);


  const addPost = (content: string, imageUrl?: string) => {
    if (!currentUserProfile) return;
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: { 
        id: currentUserProfile.id, 
        displayName: currentUserProfile.displayName, 
        profilePictureUrl: currentUserProfile.profilePictureUrl 
      },
      content,
      imageUrl,
      likes: 0,
      likedByMe: false,
      createdAt: new Date().toISOString(),
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const toggleLikePost = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, likes: post.likedByMe ? post.likes - 1 : post.likes + 1, likedByMe: !post.likedByMe }
          : post
      )
    );
  };

  const addPrayerRequest = (requestText: string) => {
    if (!currentUserProfile) return;
    const newPrayerRequest: PrayerRequest = {
      id: `prayer-${Date.now()}`,
      userId: currentUserProfile.id,
      userName: currentUserProfile.displayName,
      requestText,
      isPublic: true,
      createdAt: new Date().toISOString(),
    };
    setPrayerRequests(prevRequests => [newPrayerRequest, ...prevRequests]);
  };

  const updateUserProfile = (updatedProfileData: Partial<UserProfile>) => {
    if (!currentUserProfile) return;
    const updatedProfile = { ...currentUserProfile, ...updatedProfileData };
    setCurrentUserProfile(updatedProfile);
    setMembers(prevMembers => 
      prevMembers.map(member => member.id === currentUserProfile.id ? updatedProfile : member)
    );
    // Also update author info in posts if display name or picture changed
    if (updatedProfileData.displayName || updatedProfileData.profilePictureUrl) {
        setPosts(prevPosts => prevPosts.map(p => {
            if (p.author.id === currentUserProfile.id) {
                return {
                    ...p,
                    author: {
                        ...p.author,
                        displayName: updatedProfile.displayName,
                        profilePictureUrl: updatedProfile.profilePictureUrl
                    }
                };
            }
            return p;
        }));
    }
  };
  
  const getMemberById = (id: string) => {
    return members.find(member => member.id === id);
  };

  return (
    <UserDataContext.Provider value={{ posts, members, prayerRequests, dailyVerse, currentUserProfile, addPost, toggleLikePost, addPrayerRequest, updateUserProfile, getMemberById }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
