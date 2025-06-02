
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
  oldPrayerRequests: OldPrayerRequest[]; // Keep for now if any part of app still uses it, or phase out
  dailyVerse: DailyVerse | null;
  currentUserProfile: UserProfile | null;
  addPost: (content: string, imageUrl?: string) => void;
  toggleLikePost: (postId: string) => void;
  addOldPrayerRequest: (requestText: string) => void; // To be replaced
  updateUserProfile: (updatedProfileData: Partial<UserProfile>) => void;
  getMemberById: (id: string) => Member | undefined;

  // New Prayer Module Data
  articles: Article[];
  userArticleInteractions: UserArticleInteraction[];
  userPrayers: UserPrayer[];
  prayerNotes: PrayerNote[];
  prayerSessions: PrayerSession[];

  // New Prayer Module Functions
  toggleFavoriteArticle: (articleId: string) => void;
  isArticleFavorited: (articleId: string) => boolean;
  
  addUserPrayer: (prayerData: Omit<UserPrayer, 'id' | 'userId' | 'createdAt' | 'lastPrayedAt' | 'isAnswered' | 'answeredAt' | 'answerDescription'>) => void;
  updateUserPrayer: (prayerId: string, updates: Partial<UserPrayer>) => void;
  deleteUserPrayer: (prayerId: string) => void;
  markPrayerAsPrayed: (prayerId: string) => void;
  markPrayerAsAnswered: (prayerId: string, answerDetails?: { description?: string; date?: string }) => void;
  addPrayerNote: (prayerId: string, noteText: string) => void;
  // getPrayerNotes: (prayerId: string) => PrayerNote[];
  // addPrayerSession: (sessionData: Omit<PrayerSession, 'id' | 'userId'>) => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser } = useAuth();
  
  // Existing state
  const [posts, setPosts] = useState<Post[]>(placeholderPosts);
  const [members, setMembers] = useState<Member[]>(placeholderMembers);
  const [oldPrayerRequests, setOldPrayerRequests] = useState<OldPrayerRequest[]>(placeholderOldPrayerRequests);
  const [dailyVerse, setDailyVerse] = useState<DailyVerse | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);

  // New Prayer Module State
  const [articles, setArticles] = useState<Article[]>(placeholderArticles);
  const [userArticleInteractions, setUserArticleInteractions] = useState<UserArticleInteraction[]>(placeholderUserArticleInteractions);
  const [userPrayers, setUserPrayers] = useState<UserPrayer[]>(placeholderUserPrayers);
  const [prayerNotes, setPrayerNotes] = useState<PrayerNote[]>(placeholderPrayerNotes);
  const [prayerSessions, setPrayerSessions] = useState<PrayerSession[]>(placeholderPrayerSessions);

  useEffect(() => {
    if (authUser) {
      const profile = members.find(m => m.id === authUser.id);
      if (profile) {
        setCurrentUserProfile(profile);
      } else {
        const newMemberProfile: Member = {
            ...authUser,
            ministry: authUser.ministry || 'General Member',
            interests: authUser.interests || [],
            profilePictureUrl: authUser.profilePictureUrl || 'https://placehold.co/100x100.png',
        };
        setMembers(prev => [...prev, newMemberProfile]);
        setCurrentUserProfile(newMemberProfile);
      }
      // Filter data specific to current user for new prayer module
      setUserArticleInteractions(prev => placeholderUserArticleInteractions.filter(interaction => interaction.userId === authUser.id));
      setUserPrayers(prev => placeholderUserPrayers.filter(prayer => prayer.userId === authUser.id));
      setPrayerNotes(prev => placeholderPrayerNotes.filter(note => note.userId === authUser.id));
      setPrayerSessions(prev => placeholderPrayerSessions.filter(session => session.userId === authUser.id));

    } else {
      setCurrentUserProfile(null);
      // Clear user-specific data on logout
      setUserArticleInteractions([]);
      setUserPrayers([]);
      setPrayerNotes([]);
      setPrayerSessions([]);
    }
  }, [authUser, members]); // Removed other state dependencies to avoid re-filtering on every change

  useEffect(() => {
    const fetchDailyVerse = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); 
      setDailyVerse(placeholderDailyVerse);
    };
    fetchDailyVerse();
  }, []);


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

  // To be replaced by new prayer system
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

  // --- New Prayer Module Functions ---

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
    setUserPrayers(prev => [newUserPrayer, ...prev]);
  };

  const updateUserPrayer = (prayerId: string, updates: Partial<UserPrayer>) => {
    if (!currentUserProfile) return;
    setUserPrayers(prev => prev.map(p => p.id === prayerId && p.userId === currentUserProfile.id ? { ...p, ...updates } : p));
  };

  const deleteUserPrayer = (prayerId: string) => {
    if (!currentUserProfile) return;
    setUserPrayers(prev => prev.filter(p => !(p.id === prayerId && p.userId === currentUserProfile.id)));
    setPrayerNotes(prev => prev.filter(note => note.prayerId !== prayerId)); // Also delete associated notes
  };

  const markPrayerAsPrayed = (prayerId: string) => {
    if (!currentUserProfile) return;
    setUserPrayers(prev => prev.map(p => p.id === prayerId && p.userId === currentUserProfile.id ? { ...p, lastPrayedAt: new Date().toISOString() } : p));
  };
  
  const markPrayerAsAnswered = (prayerId: string, answerDetails?: { description?: string; date?: string }) => {
    if (!currentUserProfile) return;
    setUserPrayers(prev => prev.map(p => p.id === prayerId && p.userId === currentUserProfile.id ? { 
      ...p, 
      isAnswered: true, 
      answeredAt: answerDetails?.date || new Date().toISOString(),
      answerDescription: answerDetails?.description || p.answerDescription 
    } : p));
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
      posts, members, oldPrayerRequests, dailyVerse, currentUserProfile, 
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
