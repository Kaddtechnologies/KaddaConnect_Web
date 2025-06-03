
// src/app/(main)/achievements/page.tsx
"use client";

import { Award, CheckCircle, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress'; // Assuming Progress component exists
import { useUserData } from '@/contexts/user-data-context';
import type { UserBadge } from '@/types'; // Assuming UserBadge type

// Placeholder Badge Card component
const BadgeCard = ({ badge }: { badge: UserBadge }) => (
  <Card className="flex flex-col items-center p-4 text-center shadow-md hover:shadow-lg transition-shadow">
    <div className={`p-3 rounded-full mb-3 ${badge.isAchieved ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}>
      {badge.isAchieved ? <CheckCircle className="h-8 w-8" /> : <Award className="h-8 w-8" />}
    </div>
    <CardTitle className="text-md font-semibold">{badge.name}</CardTitle>
    <CardDescription className="text-xs mt-1">{badge.description}</CardDescription>
    {badge.progress !== undefined && badge.progress < 100 && (
      <div className="w-full mt-2">
        <Progress value={badge.progress} className="h-2" />
        <p className="text-xs text-muted-foreground mt-1">{badge.progress}% complete</p>
      </div>
    )}
  </Card>
);

export default function AchievementsPage() {
  // const { userBadges, overallProgress } = useUserData(); // To be implemented
  const { currentUserProfile } = useUserData();

  // Placeholder data
  const userBadges: UserBadge[] = [
    { id: 'badge1', name: 'Prayer Warrior', description: 'Prayed for 7 consecutive days.', isAchieved: true, dateAchieved: new Date().toISOString(), icon: 'ShieldCheck' },
    { id: 'badge2', name: 'Community Connector', description: 'Joined 3 interest groups.', isAchieved: false, progress: 33, icon: 'Users' },
    { id: 'badge3', name: 'Engagement Streak', description: 'Posted or commented daily for 5 days.', isAchieved: true, dateAchieved: new Date(Date.now() - 86400000 * 2).toISOString(), icon: 'Zap' },
    { id: 'badge4', name: 'First Steps', description: 'Completed your profile.', isAchieved: true, dateAchieved: new Date(Date.now() - 86400000 * 10).toISOString(), icon: 'Footprints' },
    { id: 'badge5', name: 'Sermon Scholar', description: 'Took notes on 5 sermons.', isAchieved: false, progress: 60, icon: 'BookOpen' },
  ];
  const overallProgress = userBadges.filter(b => b.isAchieved).length / userBadges.length * 100;

  if (!currentUserProfile) {
    return <p>Loading achievements...</p>;
  }

  return (
    <div className="container mx-auto max-w-3xl py-0 md:py-6">
      <div className="mb-6 md:mb-8 text-center">
        <Award className="mx-auto h-12 w-12 text-primary mb-3" />
        <h1 className="text-3xl md:text-4xl font-headline text-primary mb-2">Your Achievements</h1>
        <p className="text-muted-foreground">Track your progress and celebrate your milestones in the community!</p>
      </div>

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>You've unlocked {userBadges.filter(b => b.isAchieved).length} of {userBadges.length} badges.</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="w-full h-4" />
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold text-foreground mb-4">My Badges</h2>
      {userBadges.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {userBadges.map(badge => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-card rounded-lg">
          <Zap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No badges earned yet.</h3>
          <p className="text-muted-foreground">Keep engaging with the community to unlock achievements!</p>
        </div>
      )}
    </div>
  );
}

    