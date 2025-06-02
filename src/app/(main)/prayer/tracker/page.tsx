
"use client";

import { BarChart3, PieChartIcon, ListChecks, TrendingUp, Award, CheckCircle as LucideCheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useUserData } from '@/contexts/user-data-context';
import { useMemo } from 'react';

const StatCard = ({ title, value, icon: Icon, description, dataAiHint }: { title: string, value: string | number, icon: React.ElementType, description?: string, dataAiHint?: string }) => (
  <Card className="shadow-lg hover:shadow-primary/20 transition-shadow rounded-xl" data-ai-hint={dataAiHint || "statistic card"}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-5 w-5 text-primary" />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-foreground">{value}</div>
      {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
    </CardContent>
  </Card>
);

const PlaceholderPieChart = () => (
  <Card className="shadow-lg col-span-1 md:col-span-2 rounded-xl">
    <CardHeader>
      <CardTitle className="text-xl font-headline">Prayer Category Distribution</CardTitle>
      <CardDescription>Visual breakdown of your prayer focus areas.</CardDescription>
    </CardHeader>
    <CardContent className="h-[300px] flex items-center justify-center bg-muted/30 rounded-b-xl">
      <div className="text-center text-muted-foreground">
        <PieChartIcon className="h-16 w-16 mx-auto mb-4 text-primary/50" />
        <p className="font-semibold">Category Pie Chart</p>
        <p className="text-sm">Coming Soon</p>
      </div>
    </CardContent>
  </Card>
);

const AnsweredPrayersList = () => (
 <Card className="shadow-lg col-span-1 md:col-span-3 rounded-xl">
    <CardHeader>
      <CardTitle className="text-xl font-headline">Answered Prayers Journal</CardTitle>
      <CardDescription>Reflect on God's faithfulness. (Expandable list coming soon)</CardDescription>
    </CardHeader>
    <CardContent className="min-h-[200px] flex items-center justify-center bg-muted/30 rounded-b-xl">
      <div className="text-center text-muted-foreground">
        <ListChecks className="h-16 w-16 mx-auto mb-4 text-primary/50" />
        <p className="font-semibold">Answered Prayers List</p>
        <p className="text-sm">Coming Soon</p>
      </div>
    </CardContent>
  </Card>
);


export default function PrayerTrackerPage() {
  const { userPrayers } = useUserData();

  const answeredPrayersCount = useMemo(() => {
    return userPrayers.filter(p => p.isAnswered).length;
  }, [userPrayers]);

  const totalPrayersCount = userPrayers.length;
  
  // Dummy data for StatCards - will be replaced with real calculations
  const stats = [
    { title: "Prayers Answered", value: answeredPrayersCount, icon: LucideCheckCircle, description: `out of ${totalPrayersCount} total`, dataAiHint: "answered prayers" },
    { title: "Current Prayer Streak", value: "0 days", icon: TrendingUp, description: "Feature coming soon!", dataAiHint: "prayer streak" },
    { title: "Total Prayers Logged", value: totalPrayersCount, icon: Award, description: "Keep adding more!", dataAiHint: "total prayers" },
  ];


  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map(stat => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} description={stat.description} dataAiHint={stat.dataAiHint} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <PlaceholderPieChart />
        <Card className="shadow-lg col-span-1 rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl font-headline">Prayer Timeline</CardTitle>
            <CardDescription>Visualize your prayer journey over time.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/30 rounded-b-xl">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-primary/50" />
              <p className="font-semibold">Prayer Activity Timeline</p>
              <p className="text-sm">Coming Soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AnsweredPrayersList />

       <div className="text-center py-10 bg-card/30 rounded-lg shadow-inner mt-10">
        <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg text-muted-foreground">More detailed prayer analytics are on the way!</p>
        <p className="text-sm text-muted-foreground">Soon you'll be able to see trends, session history, and more insights.</p>
      </div>
    </div>
  );
}

// Note: The dummy CheckCircle from before is removed as we import LucideCheckCircle.
// If a global CheckCircle component was intended for other purposes, it should be reviewed.
// For now, assuming Lucide is preferred.
