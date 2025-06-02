
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
  updatePrayerNote: (noteId: string, newText: string) => void;
  deletePrayerNote: (noteId: string) => void;
  getNotesForPrayer: (prayerId: string) => PrayerNote[];
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
      // Simulate fetching data
      // In a real app, this would be an API call to Firestore
      await new Promise(resolve => setTimeout(resolve, 300)); 

      setPosts(placeholderPosts);
      setMembers(placeholderMembers); 
      setOldPrayerRequests(placeholderOldPrayerRequests);
      setDailyVerse(placeholderDailyVerse);
      setArticles(placeholderArticles);
      
      if (authUser) {
        let profile = placeholderMembers.find(m => m.id === authUser.id);
        // If user profile doesn't exist in members, create one from authUser
        if (!profile) {
            // This scenario might happen if a user signs up and placeholderMembers isn't updated
            // Or if authUser has info not in the generic members list.
            profile = {
                ...authUser, // Spread authUser to get id, displayName, email
                ministry: authUser.ministry || 'General Member', // Default if not present
                interests: authUser.interests || [], // Default if not present
                profilePictureUrl: authUser.profilePictureUrl || `https://placehold.co/100x100.png?text=${authUser.displayName.charAt(0)}`,
                dataAiHint: 'profile person'
            };
            // Optionally add this newly created profile to the main members list if desired
            // setMembers(prev => [...prev, profile!]); 
        }
        setCurrentUserProfile(profile); // Set the detailed profile

        // Filter data specific to the logged-in user
        setUserArticleInteractions(placeholderUserArticleInteractions.filter(interaction => interaction.userId === authUser.id));
        setUserPrayers(placeholderUserPrayers.filter(prayer => prayer.userId === authUser.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setPrayerNotes(placeholderPrayerNotes.filter(note => note.userId === authUser.id).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setPrayerSessions(placeholderPrayerSessions.filter(session => session.userId === authUser.id));
      } else {
        // No authenticated user, clear user-specific data
        setCurrentUserProfile(null);
        setUserArticleInteractions([]);
        setUserPrayers([]);
        setPrayerNotes([]);
        setPrayerSessions([]);
      }
      setIsLoading(false);
    };

    if (!authLoading) { // Only load data if auth state is resolved
      loadInitialData();
    }
  }, [authUser, authLoading]); // Depend on authUser and authLoading


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
    // If display name or profile picture changed, update posts by this author
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

  // --- Prayer Module Functions ---

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
      // If no existing interaction, create a new one and mark as favorited
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
    // Also delete associated notes when deleting a prayer
    setPrayerNotes(prev => prev.filter(note => !(note.prayerId === prayerId && note.userId === currentUserProfile.id)));
    setUserPrayers(prev => prev.filter(p => !(p.id === prayerId && p.userId === currentUserProfile.id)));
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
          // Clear description if unmarking, or use provided/default if marking
          answerDescription: newAnsweredState ? (answerDetails?.description || (isCurrentlyAnswered ? undefined : "Answered!")) : undefined, 
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
    setPrayerNotes(prev => [newNote, ...prev].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };
  
  const updatePrayerNote = (noteId: string, newText: string) => {
    if (!currentUserProfile) return;
    setPrayerNotes(prev => 
      prev.map(note => 
        note.id === noteId && note.userId === currentUserProfile.id 
        ? { ...note, text: newText, updatedAt: new Date().toISOString() } 
        : note
      ).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    );
  };

  const deletePrayerNote = (noteId: string) => {
    if (!currentUserProfile) return;
    setPrayerNotes(prev => 
      prev.filter(note => !(note.id === noteId && note.userId === currentUserProfile.id))
    );
  };
  
  const getNotesForPrayer = (prayerId: string): PrayerNote[] => {
    if (!currentUserProfile) return [];
    // Ensure notes are sorted by creation date, most recent first
    return prayerNotes.filter(note => note.prayerId === prayerId && note.userId === currentUserProfile.id)
                      .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };


  return (
    <UserDataContext.Provider value={{ 
      posts, members, oldPrayerRequests, dailyVerse, currentUserProfile, isLoading,
      addPost, toggleLikePost, addOldPrayerRequest, updateUserProfile, getMemberById,
      articles, userArticleInteractions, userPrayers, prayerNotes, prayerSessions,
      toggleFavoriteArticle, isArticleFavorited,
      addUserPrayer, updateUserPrayer, deleteUserPrayer, markPrayerAsPrayed, markPrayerAsAnswered, 
      addPrayerNote, updatePrayerNote, deletePrayerNote, getNotesForPrayer
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
