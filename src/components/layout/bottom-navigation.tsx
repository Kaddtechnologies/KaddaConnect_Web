
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, HeartHandshake, UserCircle, BookOpenText, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/directory', label: 'Directory', icon: Users },
  { href: '/prayer', label: 'Prayer', icon: HeartHandshake },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/resources', label: 'Resources', icon: BookOpenText },
  { href: '/profile', label: 'Profile', icon: UserCircle },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-t-lg md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/home' && pathname === '/');
          // Special case for profile, as it could be /profile/edit etc.
          const isProfileActive = item.href === '/profile' && pathname.startsWith('/profile');
          const finalIsActive = isProfileActive || isActive;

          return (
            <Link key={item.label} href={item.href} legacyBehavior>
              <a
                className={cn(
                  'flex flex-col items-center justify-center text-xs w-full h-full px-1 py-1', 
                  finalIsActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className={cn('h-5 w-5 mb-0.5', finalIsActive ? 'fill-primary/20' : '')} />
                <span>{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
