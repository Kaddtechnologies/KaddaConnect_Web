
export interface UserProfile {
  id: string;
  email?: string; 
  displayName: string;
  profilePictureUrl: string;
  dataAiHint?: string; 
  interests: string[];
  ministry?: string;
}

export interface Post {
  id: string;
  author: Pick<UserProfile, 'id' | 'displayName' | 'profilePictureUrl'>;
  imageUrl?: string;
  dataAiHint?: string; 
  content: string;
  likes: number;
  likedByMe: boolean;
  createdAt: string; 
}

export interface Member extends UserProfile {}

// Old PrayerRequest - will be replaced by UserPrayer for the new module
export interface OldPrayerRequest {
  id: string;
  userId: string;
  userName: string;
  requestText: string;
  isPublic: boolean;
  createdAt: string; 
}

export interface DailyVerse {
  id: string;
  reference: string; 
  text: string;
  date: string; 
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string; 
  status?: 'loading' | 'error'; 
}

export interface ChatConversation {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string; // ISO string date
  updatedAt: string; // ISO string date
}


// --- New types for Prayer Module ---

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string; // Markdown or rich text
  publishDate: string; // ISO string date
  categories: string[];
  authorName?: string; // Optional: if articles have specific authors
  imageUrl?: string; // Optional: for a cover image
  dataAiHint?: string;
}

export interface UserArticleInteraction {
  userId: string;
  articleId: string;
  isFavorited: boolean;
  favoritedAt?: string; // ISO string date
}

export interface UserPrayer {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: string; // e.g., "Personal", "Family", "Health", "Guidance", "Gratitude"
  createdAt: string; // ISO string date
  lastPrayedAt: string | null; // ISO string date
  isAnswered: boolean;
  answerDescription?: string;
  answeredAt?: string; // ISO string date
  notes?: PrayerNote[]; // Embedded or linked notes
}

export interface PrayerNote {
  id: string;
  prayerId: string;
  userId: string; // Should match UserPrayer.userId
  text: string;
  createdAt: string; // ISO string date
  updatedAt?: string; // ISO string date, for when the note is edited
}

export interface PrayerSession {
  id:string;
  userId: string;
  date: string; // ISO string date
  durationMinutes?: number; // Optional
  prayerIds?: string[]; // Optional: specific prayers included in this session
  notes?: string; // General notes for the session
}

// Type for the new AnswerDetailsModal
export interface AnswerDetails {
  description: string;
}

// --- Types for Sermon Notes Module ---
export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string; // ISO string date
  scriptureReferences?: string[]; // e.g., ["John 3:16", "Psalm 23"]
  topics?: string[]; // e.g., ["Faith", "Grace", "Community"]
  youtubeUrl?: string;
  summary?: string; // Brief summary or description
  dataAiHint?: string; // For image placeholders
  coverImageUrl?: string; // For sermon card
}

export interface SermonNote {
  id: string;
  sermonId: string;
  userId: string;
  content: string; // For now, plain text or markdown. Could be rich text later.
  createdAt: string; // ISO string date
  updatedAt?: string; // ISO string date
}
