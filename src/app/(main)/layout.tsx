
"use client";
import { useEffect, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import BottomNavigation from '@/components/layout/bottom-navigation';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { LogOut, Settings, Home, Users, HeartHandshake, UserCircle, BookOpenText, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/directory', label: 'Directory', icon: Users },
  { href: '/prayer', label: 'Prayer Hub', icon: HeartHandshake },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/resources', label: 'Resources', icon: BookOpenText },
];

function MainAppLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || (!isLoading && !user)) {
    return (
      <div className="flex flex-col h-screen">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </header>
        <div className="flex flex-1 flex-col items-center justify-center bg-background p-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin lucide lucide-loader-circle mb-4"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          <p className="text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Desktop Header */}
      <header className="sticky top-0 z-40 hidden md:flex h-16 items-center gap-4 border-b bg-card px-6">
        <Link href="/home" className="flex items-center gap-2 font-semibold text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2"/><path d="M14 22v-4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v4"/><path d="M18 22V5l-6-3-6 3v17"/><path d="M12 7v5"/><path d="M10 9h4"/></svg>
          <span className="font-headline">KaddaConnect</span>
        </Link>
        <nav className="flex-1_hidden md:flex flex-row items-center gap-5 text-sm font-medium ml-6">
          {navItems.map(item => (
            <Link
              key={item.label}
              href={item.href}
              className={`transition-colors hover:text-foreground ${pathname === item.href ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={user?.profilePictureUrl} alt={user?.displayName} data-ai-hint="profile person" />
                  <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.displayName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-grow pb-20 md:pb-0 md:pt-0">
        {/* Mobile Header (placeholder, actual content driven by pages) */}
        <div className="md:hidden sticky top-0 z-30 flex items-center justify-between h-16 bg-card px-4 border-b">
            <Link href="/home" className="flex items-center gap-2 font-semibold text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2"/><path d="M14 22v-4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v4"/><path d="M18 22V5l-6-3-6 3v17"/><path d="M12 7v5"/><path d="M10 9h4"/></svg>
              <span className="font-headline">KaddaConnect</span>
            </Link>
            <Avatar>
              <AvatarImage src={user?.profilePictureUrl} alt={user?.displayName} data-ai-hint="profile person" />
              <AvatarFallback>{user?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
        </div>
        <div className="p-4 md:p-6">{children}</div>
      </main>
      <BottomNavigation />
    </div>
  );
}


export default function MainAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex flex-col h-screen">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </header>
        <div className="flex flex-1 flex-col items-center justify-center bg-background p-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin lucide lucide-loader-circle mb-4"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          <p className="text-muted-foreground">Loading KaddaConnect...</p>
        </div>
      </div>
    }>
      <MainAppLayoutContent>{children}</MainAppLayoutContent>
    </Suspense>
  )
}
