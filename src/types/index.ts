
export interface UserProfile {
  id: string;
  email?: string; // Added for auth
  displayName: string;
  profilePictureUrl: string;
  dataAiHint?: string; // For member card images
  interests: string[];
  ministry?: string;
}

export interface Post {
  id: string;
  author: Pick<UserProfile, 'id' | 'displayName' | 'profilePictureUrl'>;
  imageUrl?: string;
  dataAiHint?: string; // For post images
  content: string;
  likes: number;
  likedByMe: boolean;
  createdAt: string; // Using string for simplicity with mock data
}

export interface Member extends UserProfile {}

export interface PrayerRequest {
  id: string;
  userId: string;
  userName: string;
  requestText: string;
  isPublic: boolean;
  createdAt: string; // Using string for simplicity
}

export interface DailyVerse {
  id: string;
  reference: string; // e.g., "John 3:16"
  text: string;
  date: string; // ISO string date for when this verse is "daily"
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string; // ISO string date
  status?: 'loading' | 'error'; // Optional status for bot messages
}
