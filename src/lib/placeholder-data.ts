
import type { UserProfile, Post, Member, PrayerRequest, DailyVerse } from '@/types';

export const placeholderUser: UserProfile = {
  id: 'user1',
  email: 'user@example.com',
  displayName: 'Alex Doe',
  profilePictureUrl: 'https://placehold.co/100x100.png',
  dataAiHint: 'profile person',
  interests: ['Reading', 'Music', 'Volunteering'],
  ministry: 'Music Ministry',
};

export const placeholderPosts: Post[] = [
  {
    id: 'post1',
    author: { id: 'user2', displayName: 'Jane Smith', profilePictureUrl: 'https://placehold.co/50x50.png' },
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'community event',
    content: 'Great turnout at the community picnic today! Thanks to everyone who came.',
    likes: 15,
    likedByMe: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 'post2',
    author: { id: 'user3', displayName: 'Mike Johnson', profilePictureUrl: 'https://placehold.co/50x50.png' },
    content: 'Just a reminder about the upcoming charity drive. Let\'s make a difference!',
    likes: 22,
    likedByMe: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: 'post3',
    author: { id: 'user1', displayName: 'Alex Doe', profilePictureUrl: 'https://placehold.co/50x50.png' },
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'church building',
    content: 'Beautiful service this morning. Feeling blessed and inspired for the week ahead!',
    likes: 30,
    likedByMe: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
];

export const placeholderMembers: Member[] = [
  { ...placeholderUser },
  {
    id: 'user2',
    displayName: 'Jane Smith',
    profilePictureUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'profile person',
    interests: ['Gardening', 'Bible Study'],
    ministry: 'Welcome Team',
  },
  {
    id: 'user3',
    displayName: 'Mike Johnson',
    profilePictureUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'profile person',
    interests: ['Tech', 'Youth Group'],
    ministry: 'Youth Ministry',
  },
  {
    id: 'user4',
    displayName: 'Sarah Lee',
    profilePictureUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'profile person',
    interests: ['Cooking', 'Outreach'],
    ministry: 'Outreach Committee',
  },
];

export const placeholderPrayerRequests: PrayerRequest[] = [
  {
    id: 'prayer1',
    userId: 'user2',
    userName: 'Jane Smith',
    requestText: 'Please pray for my family as we navigate a challenging time.',
    isPublic: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: 'prayer2',
    userId: 'user3',
    userName: 'Mike Johnson',
    requestText: 'Prayers for strength and guidance for our youth group leaders.',
    isPublic: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
  },
];

export const placeholderDailyVerse: DailyVerse = {
  id: 'verse1',
  reference: 'Proverbs 3:5-6',
  text: 'Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
  date: new Date().toISOString().split('T')[0], // Today's date
};
