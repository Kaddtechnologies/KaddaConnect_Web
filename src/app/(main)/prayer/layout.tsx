
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, PenSquare, BarChart3, HeartHandshake } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'; // Assuming Tabs are available
import { cn } from '@/lib/utils';

const prayerNavItems = [
  { name: 'Learn', href: '/prayer/learn', icon: BookOpen },
  { name: 'My Prayers', href: '/prayer/my-prayers', icon: PenSquare },
  { name: 'Tracker', href: '/prayer/tracker', icon: BarChart3 },
];

export default function PrayerTabLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Determine the active tab based on the current pathname
  const getCurrentTabValue = () => {
    if (pathname.startsWith('/prayer/learn')) return 'learn';
    if (pathname.startsWith('/prayer/my-prayers')) return 'my-prayers';
    if (pathname.startsWith('/prayer/tracker')) return 'tracker';
    return 'learn'; // Default to learn
  };

  const activeTab = getCurrentTabValue();

  return (
    <div className="container mx-auto py-0 md:py-6">
      <div className="mb-6 md:mb-8 text-center">
        <HeartHandshake className="mx-auto h-12 w-12 text-primary mb-3" />
        <h1 className="text-3xl md:text-4xl font-headline text-primary mb-2">Prayer Hub</h1>
        <p className="text-muted-foreground">Learn, track, and grow in your prayer life.</p>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:block mb-6">
        <Tabs value={activeTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            {prayerNavItems.map((item) => (
              <TabsTrigger key={item.name} value={item.name.toLowerCase().replace(' ', '-')} asChild>
                <Link href={item.href} className="flex items-center justify-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {/* Mobile: Tabs are effectively handled by BottomNavigation leading to these pages.
          The layout here provides the common header. Sub-pages will render their content. */}

      {/* Content for the active tab */}
      {children}
    </div>
  );
}
