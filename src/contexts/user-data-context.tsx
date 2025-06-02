
"use client";

import type { Post, Member, OldPrayerRequest, UserProfile, DailyVerse, Article, UserArticleInteraction, UserPrayer, PrayerNote, PrayerSession } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  placeholderPosts, 
  placeholderMembers, 
  placeholderOldPrayerRequests, 
  placeholderDailyVerse,
  placeholderArticles,
  placeholderUserArticleInteractions,
  placeholderUserPrayers, 
  placeholderPrayerNotes,
  placeholderPrayerSessions
} from '@/lib/placeholder-data';
import { useAuth } from './auth-context';

interface UserDataContextType {
  // Existing data
  posts: Post[];
  members: Member[];
  oldPrayerRequests: OldPrayerRequest[]; // To be phased out or kept for archival?
  dailyVerse: DailyVerse | null;
  currentUserProfile: UserProfile | null;
  isLoading: boolean; 
  addPost: (content: string, imageUrl?: string) => void;
  toggleLikePost: (postId: string) => void;
  addOldPrayerRequest: (requestText: string) => void; // To be phased out
  updateUserProfile: (updatedProfileData: Partial<UserProfile>) => void;
  getMemberById: (id: string) => Member | undefined;

  // Prayer Module Data
  articles: Article[];
  userArticleInteractions: UserArticleInteraction[];
  userPrayers: UserPrayer[];
  prayerNotes: PrayerNote[];
  prayerSessions: PrayerSession[];

  // Prayer Module Functions
  toggleFavoriteArticle: (articleId: string) => void;
  isArticleFavorited: (articleId: string) => boolean;
  
  addUserPrayer: (prayerData: Omit<UserPrayer, 'id' | 'userId' | 'createdAt' | 'lastPrayedAt' | 'isAnswered' | 'answeredAt' | 'answerDescription'>) => void;
  updateUserPrayer: (prayerId: string, updates: Partial<Omit<UserPrayer, 'id' | 'userId' | 'createdAt'>>) => void;
  deleteUserPrayer: (prayerId: string) => void;
  markPrayerAsPrayed: (prayerId: string) => void;
  markPrayerAsAnswered: (prayerId: string, answerDetails?: { description?: string; date?: string }) => void;
  addPrayerNote: (prayerId: string, noteText: string) => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [oldPrayerRequests, setOldPrayerRequests] = useState<OldPrayerRequest[]>([]);
  const [dailyVerse, setDailyVerse] = useState<DailyVerse | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);

  const [articles, setArticles] = useState<Article[]>([]);
  const [userArticleInteractions, setUserArticleInteractions] = useState<UserArticleInteraction[]>([]);
  const [userPrayers, setUserPrayers] = useState<UserPrayer[]>([]);
  const [prayerNotes, setPrayerNotes] = useState<PrayerNote[]>([]);
  const [prayerSessions, setPrayerSessions] = useState<PrayerSession[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300)); 

      setPosts(placeholderPosts);
      setMembers(placeholderMembers); 
      setOldPrayerRequests(placeholderOldPrayerRequests);
      setDailyVerse(placeholderDailyVerse);
      setArticles(placeholderArticles);
      
      if (authUser) {
        let profile = placeholderMembers.find(m => m.id === authUser.id);
        if (!profile) {
            profile = {
                ...authUser,
                ministry: authUser.ministry || 'General Member',
                interests: authUser.interests || [],
                profilePictureUrl: authUser.profilePictureUrl || `https://placehold.co/100x100.png?text=${authUser.displayName.charAt(0)}`,
                dataAiHint: 'profile person'
            };
            setMembers(prev => [...prev, profile!]); 
        }
        setCurrentUserProfile(profile);

        setUserArticleInteractions(placeholderUserArticleInteractions.filter(interaction => interaction.userId === authUser.id));
        setUserPrayers(placeholderUserPrayers.filter(prayer => prayer.userId === authUser.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setPrayerNotes(placeholderPrayerNotes.filter(note => note.userId === authUser.id));
        setPrayerSessions(placeholderPrayerSessions.filter(session => session.userId === authUser.id));
      } else {
        setCurrentUserProfile(null);
        setUserArticleInteractions([]);
        setUserPrayers([]);
        setPrayerNotes([]);
        setPrayerSessions([]);
      }
      setIsLoading(false);
    };

    if (!authLoading) { 
      loadInitialData();
    }
  }, [authUser, authLoading]);


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

  const addOldPrayerRequest = (requestText: string) => {
    if (!currentUserProfile) return;
    const newPrayerRequest: OldPrayerRequest = {
      id: `prayer-${Date.now()}`,
      userId: currentUserProfile.id,
      userName: currentUserProfile.displayName,
      requestText,
      isPublic: true,
      createdAt: new Date().toISOString(),
    };
    setOldPrayerRequests(prevRequests => [newPrayerRequest, ...prevRequests]);
  };

  const updateUserProfile = (updatedProfileData: Partial<UserProfile>) => {
    if (!currentUserProfile) return;
    const updatedProfile = { ...currentUserProfile, ...updatedProfileData };
    setCurrentUserProfile(updatedProfile);
    setMembers(prevMembers => 
      prevMembers.map(member => member.id === currentUserProfile.id ? updatedProfile : member)
    );
    if (updatedProfileData.displayName || updatedProfileData.profilePictureUrl) {
        setPosts(prevPosts => prevPosts.map(p => {
            if (p.author.id === currentUserProfile.id) {
                return { ...p, author: { ...p.author, displayName: updatedProfile.displayName, profilePictureUrl: updatedProfile.profilePictureUrl }};
            }
            return p;
        }));
    }
  };
  
  const getMemberById = (id: string) => {
    return members.find(member => member.id === id);
  };

  const toggleFavoriteArticle = (articleId: string) => {
    if (!currentUserProfile) return;
    setUserArticleInteractions(prev => {
      const existing = prev.find(fav => fav.articleId === articleId && fav.userId === currentUserProfile.id);
      if (existing) {
        return prev.map(fav => 
          fav.articleId === articleId && fav.userId === currentUserProfile.id 
          ? { ...fav, isFavorited: !fav.isFavorited, favoritedAt: !fav.isFavorited ? new Date().toISOString() : undefined } 
          : fav
        );
      }
      return [...prev, { userId: currentUserProfile.id, articleId, isFavorited: true, favoritedAt: new Date().toISOString() }];
    });
  };

  const isArticleFavorited = (articleId: string): boolean => {
    if (!currentUserProfile) return false;
    return userArticleInteractions.some(fav => fav.articleId === articleId && fav.userId === currentUserProfile.id && fav.isFavorited);
  };

  const addUserPrayer = (prayerData: Omit<UserPrayer, 'id' | 'userId' | 'createdAt' | 'lastPrayedAt' | 'isAnswered' | 'answeredAt' | 'answerDescription'>) => {
    if (!currentUserProfile) return;
    const newUserPrayer: UserPrayer = {
      ...prayerData,
      id: `userprayer-${Date.now()}`,
      userId: currentUserProfile.id,
      createdAt: new Date().toISOString(),
      lastPrayedAt: null,
      isAnswered: false,
    };
    setUserPrayers(prev => [newUserPrayer, ...prev].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const updateUserPrayer = (prayerId: string, updates: Partial<Omit<UserPrayer, 'id' | 'userId' | 'createdAt'>>) => {
    if (!currentUserProfile) return;
    setUserPrayers(prev => prev.map(p => p.id === prayerId && p.userId === currentUserProfile.id ? { ...p, ...updates } : p)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const deleteUserPrayer = (prayerId: string) => {
    if (!currentUserProfile) return;
    setUserPrayers(prev => prev.filter(p => !(p.id === prayerId && p.userId === currentUserProfile.id)));
    setPrayerNotes(prev => prev.filter(note => !(note.prayerId === prayerId && note.userId === currentUserProfile.id)));
  };

  const markPrayerAsPrayed = (prayerId: string) => {
    if (!currentUserProfile) return;
    setUserPrayers(prev => prev.map(p => p.id === prayerId && p.userId === currentUserProfile.id ? { ...p, lastPrayedAt: new Date().toISOString() } : p));
  };
  
  const markPrayerAsAnswered = (prayerId: string, answerDetails?: { description?: string; date?: string }) => {
    if (!currentUserProfile) return;
    setUserPrayers(prev => prev.map(p => {
      if (p.id === prayerId && p.userId === currentUserProfile.id) {
        const isCurrentlyAnswered = p.isAnswered;
        const newAnsweredState = !isCurrentlyAnswered;
        return { 
          ...p, 
          isAnswered: newAnsweredState,
          answeredAt: newAnsweredState ? (answerDetails?.date || new Date().toISOString()) : undefined,
          answerDescription: newAnsweredState ? (answerDetails?.description || "Answered!") : undefined,
        };
      }
      return p;
    }));
  };

  const addPrayerNote = (prayerId: string, noteText: string) => {
    if (!currentUserProfile) return;
    const newNote: PrayerNote = {
      id: `note-${Date.now()}`,
      prayerId,
      userId: currentUserProfile.id,
      text: noteText,
      createdAt: new Date().toISOString(),
    };
    setPrayerNotes(prev => [newNote, ...prev]);
  };

  return (
    <UserDataContext.Provider value={{ 
      posts, members, oldPrayerRequests, dailyVerse, currentUserProfile, isLoading,
      addPost, toggleLikePost, addOldPrayerRequest, updateUserProfile, getMemberById,
      articles, userArticleInteractions, userPrayers, prayerNotes, prayerSessions,
      toggleFavoriteArticle, isArticleFavorited,
      addUserPrayer, updateUserPrayer, deleteUserPrayer, markPrayerAsPrayed, markPrayerAsAnswered, addPrayerNote
    }}>
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

