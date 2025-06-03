
import type { UserProfile, Post, Member, OldPrayerRequest, DailyVerse, Article, UserArticleInteraction, UserPrayer, PrayerNote, PrayerSession, ChatConversation, ChatMessage, Sermon, SermonNote, AppEvent, UserRsvp, InterestGroup } from '@/types';

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
    author: { id: 'user1', displayName: 'Alex Doe', profilePictureUrl: 'https://placehold.co/100x100.png' },
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
    email: 'jane@example.com',
  },
  {
    id: 'user3',
    displayName: 'Mike Johnson',
    profilePictureUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'profile person',
    interests: ['Tech', 'Youth Group'],
    ministry: 'Youth Ministry',
    email: 'mike@example.com',
  },
  {
    id: 'user4',
    displayName: 'Sarah Lee',
    profilePictureUrl: 'https://placehold.co/100x100.png',
    dataAiHint: 'profile person',
    interests: ['Cooking', 'Outreach'],
    ministry: 'Outreach Committee',
    email: 'sarah@example.com',
  },
];

export const placeholderOldPrayerRequests: OldPrayerRequest[] = [
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
  date: new Date().toISOString().split('T')[0], 
};

export const placeholderArticles: Article[] = [
  {
    id: 'article1',
    title: 'The Power of Persistent Prayer',
    summary: 'Discover how consistent prayer can transform your life and deepen your faith.',
    content: '## Understanding Persistence in Prayer\n\nPersistence in prayer is not about nagging God until He gives in. Rather, it\'s about aligning our hearts with His will and developing a steadfast faith. Jesus often taught about the importance of persistence, as seen in the parable of the persistent widow (Luke 18:1-8).\n\n### Key Aspects:\n\n*   **Faith Building**: Consistent prayer builds our trust in God.\n*   **Spiritual Discipline**: It is a vital spiritual discipline that shapes our character.\n*   **Relationship**: It deepens our relationship with God, moving beyond requests to communion.',
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    categories: ['Faith', 'Prayer Life', 'Discipline'],
    authorName: 'Pastor John',
    imageUrl: 'https://placehold.co/300x200.png',
    dataAiHint: 'prayer book',
  },
  {
    id: 'article2',
    title: 'Finding Peace in Turbulent Times',
    summary: 'Learn biblical strategies to maintain peace amidst life\'s challenges.',
    content: '## Biblical Peace\n\nPhilippians 4:6-7 tells us, "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."\n\n### Steps to Peace:\n\n1.  **Prayer & Petition**: Actively bring your worries to God.\n2.  **Thanksgiving**: Cultivate a grateful heart.\n3.  **Trust**: Rely on God\'s sovereignty and love.',
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    categories: ['Peace', 'Anxiety', 'Trust'],
    imageUrl: 'https://placehold.co/300x200.png',
    dataAiHint: 'calm nature',
  },
  {
    id: 'article3',
    title: 'The ACTS Model of Prayer',
    summary: 'A simple yet profound way to structure your prayers: Adoration, Confession, Thanksgiving, Supplication.',
    content: '## ACTS Prayer Model\n\n*   **A - Adoration**: Praising God for who He is.\n*   **C - Confession**: Acknowledging and repenting of sins.\n*   **T - Thanksgiving**: Expressing gratitude for God\'s blessings.\n*   **S - Supplication**: Presenting your needs and requests to God.',
    publishDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    categories: ['Prayer Models', 'How To Pray'],
    authorName: 'Community Elder',
  }
];

export const placeholderUserArticleInteractions: UserArticleInteraction[] = [
  { userId: 'user1', articleId: 'article1', isFavorited: true, favoritedAt: new Date().toISOString() },
];

export const placeholderUserPrayers: UserPrayer[] = [
  {
    id: 'userprayer1',
    userId: 'user1',
    title: 'Guidance for Career Path',
    content: 'Lord, please guide me as I consider new career opportunities. Show me the path You have for me and grant me wisdom to make the right decisions. Help me to use my talents for Your glory.',
    category: 'Guidance',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    lastPrayedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isAnswered: false,
    notes: [],
  },
  {
    id: 'userprayer2',
    userId: 'user1',
    title: 'Healing for Aunt Mary',
    content: 'Heavenly Father, I lift up my Aunt Mary to You and ask for Your healing touch upon her body. Bring comfort to her and our family during this time. Strengthen her and restore her to full health according to Your will.',
    category: 'Health',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    lastPrayedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isAnswered: false,
    notes: [],
  },
  {
    id: 'userprayer3',
    userId: 'user1',
    title: 'Gratitude for a new friendship',
    content: 'Thank you, Lord, for bringing a new friend into my life. I pray this friendship will be a blessing and that we can support each other in faith.',
    category: 'Gratitude',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    lastPrayedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    isAnswered: true,
    answerDescription: "Felt a real connection and shared values.",
    answeredAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
    notes: [],
  }
];

export const placeholderPrayerNotes: PrayerNote[] = [
  {
    id: 'note1',
    prayerId: 'userprayer1',
    userId: 'user1',
    text: 'Feeling more clarity today after praying. One potential opportunity seems promising.',
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(), // 50 minutes ago
  },
  {
    id: 'note2',
    prayerId: 'userprayer1',
    userId: 'user1',
    text: 'Read a relevant scripture today that really spoke to this situation.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(), // 20 hours ago
  }
];

export const placeholderPrayerSessions: PrayerSession[] = [
    {
        id: 'session1',
        userId: 'user1',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // yesterday
        durationMinutes: 30,
        prayerIds: ['userprayer1', 'userprayer2'],
        notes: "Focused session, felt peace."
    },
    {
        id: 'session2',
        userId: 'user1',
        date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // two days ago
        durationMinutes: 15,
        prayerIds: ['userprayer2'],
        notes: "Quick prayer for Aunt Mary."
    }
];


export const placeholderChatConversations: ChatConversation[] = [
  {
    id: 'convo1',
    userId: 'user1',
    title: 'Feeling Stressed',
    messages: [
      { id: 'msg1-1', text: "I'm feeling really stressed about work lately.", sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
      { id: 'msg1-2', text: "I understand, Alex. It's common to feel overwhelmed by work. Remember Philippians 4:6-7: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.' (NIV) Take a moment to breathe and cast your cares upon Him. What specifically about work is causing stress?", sender: 'bot', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 5000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2 + 5000).toISOString(),
  },
  {
    id: 'convo2',
    userId: 'user1',
    title: 'Guidance Needed',
    messages: [
      { id: 'msg2-1', text: "I need some guidance on a big decision.", sender: 'user', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
      { id: 'msg2-2', text: "Alex, when seeking guidance, it's wise to turn to the Lord. Proverbs 3:5-6 says, 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.' (NIV) Can you tell me a bit more about the decision you're facing?", sender: 'bot', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 + 5000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 + 5000).toISOString(),
  }
];

// --- Placeholder Data for Sermon Notes Module ---
export const placeholderSermons: Sermon[] = [
  {
    id: 'sermon1',
    title: 'The Unshakeable Kingdom',
    speaker: 'Pastor Sarah Lee',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
    scriptureReferences: ['Hebrews 12:28-29'],
    topics: ['Faith', 'Kingdom of God', 'Endurance'],
    youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Example video
    summary: 'Exploring the eternal nature of God\'s kingdom and how we can live as citizens of it.',
    coverImageUrl: 'https://placehold.co/400x250.png',
    dataAiHint: 'church sermon abstract',
  },
  {
    id: 'sermon2',
    title: 'Love Your Neighbor As Yourself',
    speaker: 'Rev. Mike Johnson',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 2 weeks ago
    scriptureReferences: ['Mark 12:31', '1 Corinthians 13'],
    topics: ['Love', 'Community', 'Relationships'],
    summary: 'A deep dive into the second greatest commandment and its practical implications.',
    coverImageUrl: 'https://placehold.co/400x250.png',
    dataAiHint: 'community hands',
  },
  {
    id: 'sermon3',
    title: 'The Power of Forgiveness',
    speaker: 'Guest Speaker Dr. Emily White',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(), // 3 weeks ago
    scriptureReferences: ['Matthew 6:14-15', 'Ephesians 4:32'],
    topics: ['Forgiveness', 'Healing', 'Grace'],
    youtubeUrl: 'https://www.youtube.com/embed/rokGy0huYEA', // Another example video
    summary: 'Understanding the transformative power of both receiving and extending forgiveness.',
    coverImageUrl: 'https://placehold.co/400x250.png',
    dataAiHint: 'light forgiveness',
  }
];

export const placeholderSermonNotes: SermonNote[] = [
  {
    id: 'snote1',
    sermonId: 'sermon1',
    userId: 'user1',
    content: 'Key takeaway: Focus on eternal values, not temporary struggles. The kingdom of God is within us.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 + 3600000).toISOString(), // During sermon 1
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), // Edited a day later
  },
  {
    id: 'snote2',
    sermonId: 'sermon1',
    userId: 'user1',
    content: 'Hebrews 12:28 - "Therefore, since we are receiving a kingdom that cannot be shaken, let us be thankful, and so worship God acceptably with reverence and awe."',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 + 7200000).toISOString(), // During sermon 1
  },
  {
    id: 'snote3',
    sermonId: 'sermon2',
    userId: 'user1',
    content: 'Practical ways to love my neighbor: active listening, offering help without expecting return, praying for them.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14 + 3600000).toISOString(), // During sermon 2
  }
];

// --- Placeholder Data for Interest Groups (Phase 3) ---
export const placeholderInterestGroups: InterestGroup[] = [
  { id: 'group1', name: 'Bible Study Fellowship', description: 'Weekly discussions on scripture. We delve deep into books of the Bible, share insights, and support each other in our spiritual walk. Open to all levels of Bible knowledge.', memberCount: 15, category: 'Ministries', createdBy: 'user1', createdAt: new Date().toISOString(), members: ['user1', 'user2', 'user4'], coverImageUrl: 'https://placehold.co/400x200.png', dataAiHint: 'bible study' },
  { id: 'group2', name: 'Hiking Adventures', description: 'Exploring local trails and nature. We organize bi-weekly hikes, from easy walks to challenging treks. A great way to enjoy creation and fellowship.', memberCount: 22, category: 'Hobbies', createdBy: 'user2', createdAt: new Date().toISOString(), members: ['user2', 'user3'], coverImageUrl: 'https://placehold.co/400x200.png', dataAiHint: 'mountain landscape' },
  { id: 'group3', name: 'Tech Innovators for Christ', description: 'Discussing how technology can be used for ministry and community outreach. Brainstorming sessions, project collaborations, and tech talks.', memberCount: 8, category: 'Careers', createdBy: 'user3',createdAt: new Date().toISOString(), members: ['user3', 'user1'], coverImageUrl: 'https://placehold.co/400x200.png', dataAiHint: 'abstract tech' },
  { id: 'group4', name: 'Parents Support Circle', description: 'A safe space for parents to share experiences, offer support, and discuss parenting from a faith-based perspective. Regular virtual meetups.', memberCount: 12, category: 'Support', createdBy: 'user4', createdAt: new Date().toISOString(), members: ['user4', 'user2'], coverImageUrl: 'https://placehold.co/400x200.png', dataAiHint: 'family hands' },
];


// --- Placeholder Data for Events & RSVP (Phase 4) ---

// Helper function to get a clean Date object for calculations
const getBaseDate = () => new Date();

// Event 1: Youth Night
const event1StartTime = getBaseDate();
event1StartTime.setDate(event1StartTime.getDate() + 1); // Tomorrow
event1StartTime.setHours(19, 0, 0, 0); // 7 PM
const event1EndTime = new Date(event1StartTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

// Event 2: Saturday Morning Worship
const event2StartTime = getBaseDate();
event2StartTime.setDate(event2StartTime.getDate() + 7); // Next week
event2StartTime.setHours(10, 0, 0, 0); // 10 AM
const event2EndTime = new Date(event2StartTime.getTime() + 1.5 * 60 * 60 * 1000); // 1.5 hours later

// Event 3: Community Outreach
const event3StartTime = getBaseDate();
event3StartTime.setDate(event3StartTime.getDate() + 14); // In two weeks
event3StartTime.setHours(14, 0, 0, 0); // 2 PM
const event3EndTime = new Date(event3StartTime.getTime() + 3 * 60 * 60 * 1000); // 3 hours later

// Event 4: Online Bible Study
const event4StartTime = getBaseDate();
event4StartTime.setDate(event4StartTime.getDate() + 3); // 3 days from now
event4StartTime.setHours(20, 0, 0, 0); // 8 PM
const event4EndTime = new Date(event4StartTime.getTime() + 1 * 60 * 60 * 1000); // 1 hour later


export const placeholderAppEvents: AppEvent[] = [
  {
    id: 'event1',
    title: 'Youth Night: Game On!',
    description: 'Join us for a fun-filled evening of games, fellowship, and a short devotional. Pizza will be provided! Ages 12-18.',
    category: 'Youth',
    startTime: event1StartTime.toISOString(),
    endTime: event1EndTime.toISOString(),
    location: 'Church Community Hall',
    organizerInfo: { name: 'Youth Ministry', contact: 'youth@kaddaconnect.com' },
    coverImageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'youth games',
    rsvpCount: 12,
    maxAttendees: 50,
    isOnline: false,
  },
  {
    id: 'event2',
    title: 'Saturday Morning Worship & Prayer',
    description: 'Start your weekend with an uplifting worship session and communal prayer. All are welcome to join this special service.',
    category: 'Worship',
    startTime: event2StartTime.toISOString(),
    endTime: event2EndTime.toISOString(),
    location: 'Main Sanctuary',
    organizerInfo: { name: 'Worship Team' },
    coverImageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'worship service',
    rsvpCount: 45,
    isOnline: true,
    meetingUrl: 'https://zoom.us/j/1234567890',
  },
  {
    id: 'event3',
    title: 'Community Outreach: Park Cleanup',
    description: 'Let\'s serve our local community by helping clean up Central Park. Gloves and bags will be provided. A great opportunity to make a tangible difference.',
    category: 'Outreach',
    startTime: event3StartTime.toISOString(),
    endTime: event3EndTime.toISOString(),
    location: 'Central Park - Meet at Main Fountain',
    organizerInfo: { name: 'Outreach Committee', contact: 'outreach@kaddaconnect.com' },
    coverImageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'park cleanup volunteers',
    rsvpCount: 8,
    maxAttendees: 30,
    isOnline: false,
  },
   {
    id: 'event4',
    title: 'Online Bible Study: Book of Romans',
    description: 'Deep dive into the Book of Romans with our weekly online study group. Interactive discussions and Q&A.',
    category: 'Community',
    startTime: event4StartTime.toISOString(),
    endTime: event4EndTime.toISOString(),
    location: 'Online via Zoom',
    organizerInfo: { name: 'Adult Study Group' },
    coverImageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'bible study online',
    rsvpCount: 25,
    isOnline: true,
    meetingUrl: 'https://zoom.us/j/9876543210',
  },
];

export const placeholderUserRsvps: UserRsvp[] = [
  { eventId: 'event1', userId: 'user1', rsvpAt: new Date().toISOString() },
];

// Ensure placeholderInterestGroups is also exported if it wasn't before
// (already added in previous steps, just confirming its presence for context loading)
export { placeholderInterestGroups };

