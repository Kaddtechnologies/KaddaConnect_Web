export interface UserProfile {
  id: string;
  email?: string; // Added for auth
  displayName: string;
  profilePictureUrl: string;
  interests: string[];
  ministry?: string;
}

export interface Post {
  id: string;
  author: Pick<UserProfile, 'id' | 'displayName' | 'profilePictureUrl'>;
  imageUrl?: string;
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
