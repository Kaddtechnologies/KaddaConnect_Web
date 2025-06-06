
"use client";

import type { Post, Member, OldPrayerRequest, UserProfile, DailyVerse, Article, UserArticleInteraction, UserPrayer, PrayerNote, PrayerSession, ChatMessage, ChatConversation, Sermon, SermonNote, InterestGroup, UserBadge, AppEvent, UserRsvp } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { 
  placeholderPosts, 
  placeholderMembers, 
  placeholderOldPrayerRequests, 
  placeholderDailyVerse,
  placeholderArticles,
  placeholderUserArticleInteractions,
  placeholderUserPrayers, 
  placeholderPrayerNotes,
  placeholderPrayerSessions,
  placeholderChatConversations,
  placeholderSermons,
  placeholderSermonNotes,
  placeholderInterestGroups, // Added for Phase 3
  placeholderAppEvents, // Added for Phase 4
  placeholderUserRsvps // Added for Phase 4
} from '@/lib/placeholder-data';
import { useAuth } from './auth-context';

interface UserDataContextType {
  // Existing data
  posts: Post[];
  members: Member[];
  oldPrayerRequests: OldPrayerRequest[];
  dailyVerse: DailyVerse | null;
  currentUserProfile: UserProfile | null;
  isLoading: boolean; 
  addPost: (content: string, imageUrl?: string, dataAiHint?: string) => void;
  toggleLikePost: (postId: string) => void;
  addOldPrayerRequest: (requestText: string) => void;
  updateUserProfile: (updatedProfileData: Partial<UserProfile>) => void;
  getMemberById: (id: string) => Member | undefined;

  // Prayer Module Data
  articles: Article[];
  userArticleInteractions: UserArticleInteraction[];
  userPrayers: UserPrayer[];
  prayerNotes: PrayerNote[]; // These are for UserPrayers (personal prayer journal)
  prayerSessions: PrayerSession[];

  // Prayer Module Functions
  toggleFavoriteArticle: (articleId: string) => void;
  isArticleFavorited: (articleId: string) => boolean;
  
  addUserPrayer: (prayerData: Omit<UserPrayer, 'id' | 'userId' | 'createdAt' | 'lastPrayedAt' | 'isAnswered' | 'answeredAt' | 'answerDescription' | 'notes'>) => void;
  updateUserPrayer: (prayerId: string, updates: Partial<Omit<UserPrayer, 'id' | 'userId' | 'createdAt' | 'notes'>>) => void;
  deleteUserPrayer: (prayerId: string) => void;
  markPrayerAsPrayed: (prayerId: string) => void;
  markPrayerAsAnswered: (prayerId: string, answerDetails?: { description?: string; date?: string }) => void;
  
  addPrayerNote: (prayerId: string, noteText: string) => void;
  updatePrayerNote: (noteId: string, newText: string) => void;
  deletePrayerNote: (noteId: string) => void;
  getNotesForPrayer: (prayerId: string) => PrayerNote[];

  // Chat Module Data & Functions
  chatConversations: ChatConversation[];
  activeChatConversationId: string | null;
  setActiveChatConversationId: (conversationId: string | null) => void;
  getActiveConversation: () => ChatConversation | undefined;
  saveNewChatConversation: (messages: ChatMessage[], title?: string, existingConvoId?: string | null) => string; 
  addMessageToChatConversation: (conversationId: string, message: ChatMessage) => void;
  deleteChatConversation: (conversationId: string) => void;
  renameChatConversation: (conversationId: string, newTitle: string) => void;

  // Sermon & Sermon Notes Module Data & Functions
  sermons: Sermon[];
  userSermonNotes: SermonNote[]; // These are notes users take on public sermons
  getSermonById: (sermonId: string) => Sermon | undefined;
  addSermon: (sermonData: Omit<Sermon, 'id'>) => void;
  updateSermon: (sermonId: string, updates: Partial<Sermon>) => void;
  getNotesForSermon: (sermonId: string) => SermonNote[];
  addSermonNote: (sermonId: string, content: string) => void;
  updateSermonNote: (noteId: string, content: string) => void;
  deleteSermonNote: (noteId: string) => void;

  // Phase 3: Groups & Gamification
  interestGroups: InterestGroup[];
  userBadges: UserBadge[]; // Placeholder for now
  getGroupById: (groupId: string) => InterestGroup | undefined;
  // More group/gamification functions to be added

  // Phase 4: Events & RSVP
  appEvents: AppEvent[];
  userRsvps: UserRsvp[];
  getAppEventById: (eventId: string) => AppEvent | undefined;
  rsvpToEvent: (eventId: string) => void;
  cancelRsvpFromEvent: (eventId: string) => void;
  isUserRsvpedToEvent: (eventId: string) => boolean;
  // More event functions to be added (e.g., create event)
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
  
  const [chatConversations, setChatConversations] = useState<ChatConversation[]>([]);
  const [activeChatConversationId, setActiveChatConversationIdState] = useState<string | null>(null);

  const [sermons, setSermonsState] = useState<Sermon[]>([]);
  const [userSermonNotes, setUserSermonNotes] = useState<SermonNote[]>([]);

  // Phase 3 State
  const [interestGroups, setInterestGroups] = useState<InterestGroup[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]); // Initialize with placeholder if needed

  // Phase 4 State
  const [appEvents, setAppEvents] = useState<AppEvent[]>([]);
  const [userRsvps, setUserRsvps] = useState<UserRsvp[]>([]);


  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300)); 

      setPosts(placeholderPosts);
      setMembers(placeholderMembers); 
      setOldPrayerRequests(placeholderOldPrayerRequests);
      setDailyVerse(placeholderDailyVerse);
      setArticles(placeholderArticles);
      setSermonsState(placeholderSermons.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setInterestGroups(placeholderInterestGroups); // Load Phase 3 data
      setAppEvents(placeholderAppEvents); // Load Phase 4 data
      
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
        }
        setCurrentUserProfile(profile);

        setUserArticleInteractions(placeholderUserArticleInteractions.filter(interaction => interaction.userId === authUser.id));
        setUserPrayers(placeholderUserPrayers.filter(prayer => prayer.userId === authUser.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setPrayerNotes(placeholderPrayerNotes.filter(note => note.userId === authUser.id).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setPrayerSessions(placeholderPrayerSessions.filter(session => session.userId === authUser.id));
        setChatConversations(placeholderChatConversations.filter(convo => convo.userId === authUser.id).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
        setUserSermonNotes(placeholderSermonNotes.filter(note => note.userId === authUser.id).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setUserRsvps(placeholderUserRsvps.filter(rsvp => rsvp.userId === authUser.id)); // Load user-specific RSVPs
        
        // Placeholder for user badges - can be expanded
        setUserBadges([
            { id: 'badge1', name: 'Prayer Warrior', description: 'Prayed for 7 consecutive days.', isAchieved: true, dateAchieved: new Date().toISOString(), icon: 'ShieldCheck' },
            { id: 'badge2', name: 'Community Connector', description: 'Joined 3 interest groups.', isAchieved: false, progress: 33, icon: 'Users' },
        ]);

        setActiveChatConversationIdState(null);

      } else {
        setCurrentUserProfile(null);
        setUserArticleInteractions([]);
        setUserPrayers([]);
        setPrayerNotes([]);
        setPrayerSessions([]);
        setChatConversations([]);
        setUserSermonNotes([]);
        setInterestGroups([]);
        setUserBadges([]);
        setAppEvents([]);
        setUserRsvps([]);
        setActiveChatConversationIdState(null);
      }
      setIsLoading(false);
    };

    if (!authLoading) {
      loadInitialData();
    }
  }, [authUser, authLoading]);

  const addPost = (content: string, imageUrl?: string, dataAiHint?: string) => {
    if (!currentUserProfile) return;
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: { 
        id: currentUserProfile.id, 
        displayName: currentUserProfile.displayName, 
        profilePictureUrl: currentUserProfile.profilePictureUrl 
      },
      content,
      imageUrl: imageUrl || (content.length < 50 ? undefined : `https://placehold.co/600x400.png?text=${encodeURIComponent(content.substring(0,20))}`), // Placeholder image if long content
      dataAiHint: dataAiHint || "social post",
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

  const addUserPrayer = (prayerData: Omit<UserPrayer, 'id' | 'userId' | 'createdAt' | 'lastPrayedAt' | 'isAnswered' | 'answeredAt' | 'answerDescription' | 'notes'>) => {
    if (!currentUserProfile) return;
    const newUserPrayer: UserPrayer = {
      ...prayerData,
      id: `userprayer-${Date.now()}`,
      userId: currentUserProfile.id,
      createdAt: new Date().toISOString(),
      lastPrayedAt: null,
      isAnswered: false,
      notes: [], 
    };
    setUserPrayers(prev => [newUserPrayer, ...prev].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const updateUserPrayer = (prayerId: string, updates: Partial<Omit<UserPrayer, 'id' | 'userId' | 'createdAt' | 'notes'>>) => {
    if (!currentUserProfile) return;
    setUserPrayers(prev => prev.map(p => p.id === prayerId && p.userId === currentUserProfile.id ? { ...p, ...updates } : p)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const deleteUserPrayer = (prayerId: string) => {
    if (!currentUserProfile) return;
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
  
  const getNotesForPrayer = useCallback((prayerId: string): PrayerNote[] => {
    if (!currentUserProfile) return [];
    return prayerNotes.filter(note => note.prayerId === prayerId && note.userId === currentUserProfile.id)
                      .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [prayerNotes, currentUserProfile]);

  const setActiveChatConversationId = (conversationId: string | null) => {
    setActiveChatConversationIdState(conversationId);
  };

  const getActiveConversation = useCallback((): ChatConversation | undefined => {
    if (!activeChatConversationId) return undefined;
    return chatConversations.find(convo => convo.id === activeChatConversationId);
  }, [chatConversations, activeChatConversationId]);

  const saveNewChatConversation = (messagesToSave: ChatMessage[], title?: string, existingConvoId: string | null = null): string => {
    if (!currentUserProfile) throw new Error("User not authenticated");

    if (existingConvoId) {
      setChatConversations(prev =>
        prev.map(convo =>
          convo.id === existingConvoId
            ? { ...convo, messages: messagesToSave, title: title || convo.title, updatedAt: new Date().toISOString() }
            : convo
        ).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      );
      return existingConvoId;
    } else {
      const conversationTitle = title || (messagesToSave.find(m => m.sender === 'user')?.text.substring(0, 40) + "...") || "New Chat";
      const newConversation: ChatConversation = {
        id: `chatconvo-${Date.now()}`,
        userId: currentUserProfile.id,
        title: conversationTitle,
        messages: messagesToSave,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setChatConversations(prev => [newConversation, ...prev].sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
      setActiveChatConversationIdState(newConversation.id);
      return newConversation.id;
    }
  };

  const addMessageToChatConversation = (conversationId: string, message: ChatMessage) => {
    setChatConversations(prev =>
      prev.map(convo =>
        convo.id === conversationId
          ? { ...convo, messages: [...convo.messages, message], updatedAt: new Date().toISOString() }
          : convo
      ).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    );
  };
  
  const deleteChatConversation = (conversationId: string) => {
    setChatConversations(prev => prev.filter(convo => convo.id !== conversationId));
    if (activeChatConversationId === conversationId) {
      setActiveChatConversationIdState(null); 
    }
  };

  const renameChatConversation = (conversationId: string, newTitle: string) => {
    setChatConversations(prev =>
      prev.map(convo =>
        convo.id === conversationId ? { ...convo, title: newTitle, updatedAt: new Date().toISOString() } : convo
      ).sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    );
  };

  // Sermon & Sermon Notes Module Functions
  const getSermonById = useCallback((sermonId: string): Sermon | undefined => {
    return sermons.find(s => s.id === sermonId);
  }, [sermons]);
  
  const addSermon = (sermonData: Omit<Sermon, 'id'>) => {
    const newSermon: Sermon = {
      ...sermonData,
      id: `sermon-${Date.now()}`,
    };
    setSermonsState(prev => [newSermon, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };
  
  const updateSermon = (sermonId: string, updates: Partial<Sermon>) => {
    if (!currentUserProfile) return;
    setSermonsState(prevSermons =>
      prevSermons.map(s => (s.id === sermonId ? { ...s, ...updates } : s))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  };

  const getNotesForSermon = useCallback((sermonId: string): SermonNote[] => {
    if (!currentUserProfile) return [];
    return userSermonNotes
      .filter(note => note.sermonId === sermonId && note.userId === currentUserProfile.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [userSermonNotes, currentUserProfile]);

  const addSermonNote = (sermonId: string, content: string) => {
    if (!currentUserProfile) return;
    const newSermonNote: SermonNote = {
      id: `snote-${Date.now()}`,
      sermonId,
      userId: currentUserProfile.id,
      content,
      createdAt: new Date().toISOString(),
    };
    setUserSermonNotes(prev => [newSermonNote, ...prev].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  const updateSermonNote = (noteId: string, content: string) => {
    if (!currentUserProfile) return;
    setUserSermonNotes(prev =>
      prev.map(note =>
        note.id === noteId && note.userId === currentUserProfile.id
          ? { ...note, content, updatedAt: new Date().toISOString() }
          : note
      ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    );
  };

  const deleteSermonNote = (noteId: string) => {
    if (!currentUserProfile) return;
    setUserSermonNotes(prev =>
      prev.filter(note => !(note.id === noteId && note.userId === currentUserProfile.id))
    );
  };

  // Phase 3: Groups Functions
  const getGroupById = useCallback((groupId: string): InterestGroup | undefined => {
      return interestGroups.find(g => g.id === groupId);
  }, [interestGroups]);

  // Phase 4: Events & RSVP Functions
  const getAppEventById = useCallback((eventId: string): AppEvent | undefined => {
    return appEvents.find(event => event.id === eventId);
  }, [appEvents]);

  const rsvpToEvent = (eventId: string) => {
    if (!currentUserProfile) return;
    const event = appEvents.find(e => e.id === eventId);
    if (!event) return;

    // Check if already RSVP'd
    if (userRsvps.some(rsvp => rsvp.eventId === eventId && rsvp.userId === currentUserProfile.id)) return;
    
    // Check max attendees
    if (event.maxAttendees && event.rsvpCount >= event.maxAttendees) {
        // Handle full event - maybe a toast message
        console.warn("Event is full");
        return;
    }

    setAppEvents(prev => prev.map(e => e.id === eventId ? { ...e, rsvpCount: e.rsvpCount + 1 } : e));
    setUserRsvps(prev => [...prev, { eventId, userId: currentUserProfile.id, rsvpAt: new Date().toISOString() }]);
  };

  const cancelRsvpFromEvent = (eventId: string) => {
    if (!currentUserProfile) return;
    // Check if actually RSVP'd
    if (!userRsvps.some(rsvp => rsvp.eventId === eventId && rsvp.userId === currentUserProfile.id)) return;

    setAppEvents(prev => prev.map(e => e.id === eventId ? { ...e, rsvpCount: Math.max(0, e.rsvpCount - 1) } : e));
    setUserRsvps(prev => prev.filter(rsvp => !(rsvp.eventId === eventId && rsvp.userId === currentUserProfile.id)));
  };
  
  const isUserRsvpedToEvent = useCallback((eventId: string): boolean => {
    if (!currentUserProfile) return false;
    return userRsvps.some(rsvp => rsvp.eventId === eventId && rsvp.userId === currentUserProfile.id);
  }, [userRsvps, currentUserProfile]);


  return (
    <UserDataContext.Provider value={{ 
      posts, members, oldPrayerRequests, dailyVerse, currentUserProfile, isLoading,
      addPost, toggleLikePost, addOldPrayerRequest, updateUserProfile, getMemberById,
      articles, userArticleInteractions, userPrayers, prayerNotes, prayerSessions,
      toggleFavoriteArticle, isArticleFavorited,
      addUserPrayer, updateUserPrayer, deleteUserPrayer, markPrayerAsPrayed, markPrayerAsAnswered, 
      addPrayerNote, updatePrayerNote, deletePrayerNote, getNotesForPrayer,
      chatConversations, activeChatConversationId, setActiveChatConversationId,
      getActiveConversation, saveNewChatConversation, addMessageToChatConversation,
      deleteChatConversation, renameChatConversation,
      sermons, userSermonNotes, getSermonById, addSermon, updateSermon, getNotesForSermon,
      addSermonNote, updateSermonNote, deleteSermonNote,
      interestGroups, userBadges, getGroupById, // Phase 3
      appEvents, userRsvps, getAppEventById, rsvpToEvent, cancelRsvpFromEvent, isUserRsvpedToEvent // Phase 4
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

