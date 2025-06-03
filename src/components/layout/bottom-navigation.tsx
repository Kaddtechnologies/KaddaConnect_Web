
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, HeartHandshake, UserCircle, BookOpenText, MessageCircle, UsersRound, Award, CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils';

// These items might change if mobile uses an off-canvas sidebar instead
const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/groups', label: 'Groups', icon: UsersRound }, 
  { href: '/events', label: 'Events', icon: CalendarClock },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/profile', label: 'Me', icon: UserCircle },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  // If sidebar is used for mobile, this component might be deprecated or its usage conditional
  // For now, keeping it as is, but it might be removed if the new layout's mobile sidebar is sufficient.

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-t-lg md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
                           (item.href === '/home' && pathname === '/') ||
                           (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link key={item.label} href={item.href} legacyBehavior>
              <a
                className={cn(
                  'flex flex-col items-center justify-center text-xs w-full h-full px-1 py-1', 
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className={cn('h-5 w-5 mb-0.5', isActive ? 'fill-primary/20' : '')} />
                <span>{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

    
