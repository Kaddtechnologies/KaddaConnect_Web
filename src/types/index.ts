

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

export interface ChatMessage { // This is for the main app chat
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string; 
  status?: 'loading' | 'error'; 
}

export interface ChatConversation { // This is for the main app chat
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

// Type for Sermon Search Tool Output
export interface SermonSummaryForTool {
  id: string;
  title: string;
  speaker: string;
  date: string; // ISO string date
  summary?: string;
  topics?: string[];
}

// --- Types for Phase 3: Groups & Gamification ---

export interface InterestGroup {
  id: string;
  name: string;
  description: string;
  category: 'Hobbies' | 'Ministries' | 'Careers' | 'Support' | 'Other';
  memberCount: number; // Denormalized for quick display, or calculated
  createdBy: string; // userId of creator
  createdAt: string; // ISO string date
  // For actual implementation, you'd likely have a subcollection for members in Firestore
  members?: string[]; // Array of userIds (for mock data)
  groupChatId?: string; // Link to a chat collection in Firestore
  // events, media galleries would be separate collections linked by groupId
  coverImageUrl?: string;
  dataAiHint?: string;
}

export interface GroupMember { // More detailed than just userId if needed for roles
  userId: string;
  groupId: string;
  role: 'admin' | 'member';
  joinedAt: string; // ISO string date
}

export interface GroupChatMessage {
  id: string;
  groupId: string;
  userId: string;
  userName: string; // Denormalized for display
  userAvatar?: string; // Denormalized for display
  text: string;
  timestamp: string; // ISO string date
  // reactions, etc.
}

export interface GroupEvent {
  id: string;
  groupId: string;
  title: string;
  description: string;
  startTime: string; // ISO string date
  endTime?: string; // ISO string date
  location?: string;
  createdBy: string; // userId
}

export interface GroupMediaItem {
  id: string;
  groupId: string;
  userId: string; // Uploader
  type: 'image' | 'video';
  url: string; // Firebase Storage URL
  caption?: string;
  uploadedAt: string; // ISO string date
}

export interface UserBadge {
  id: string; // e.g., 'prayer-warrior', 'connector'
  name: string;
  description: string;
  isAchieved: boolean;
  dateAchieved?: string; // ISO string date
  icon?: string; // Lucide icon name or path to custom icon
  progress?: number; // Optional: 0-100 for badges with progress
}

// For tracking streaks
export interface UserStreak {
  userId: string;
  type: 'prayer' | 'post' | 'comment'; // Can be expanded
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string; // ISO string date
}


    