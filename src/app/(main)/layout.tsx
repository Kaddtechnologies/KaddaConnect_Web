
"use client";
import { useEffect, Suspense, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import BottomNavigation from '@/components/layout/bottom-navigation'; 
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { 
  LogOut, Settings, Home, Users, HeartHandshake, UserCircle, BookOpenText, MessageCircle, Sun, Moon, UsersRound, Award, Menu as MenuIcon, X, PanelLeft, CalendarClock 
} from 'lucide-react';
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
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  useSidebar,
  SidebarRail
} from "@/components/ui/sidebar"; 

const mainNavItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/prayer', label: 'Prayer Hub', icon: HeartHandshake },
  { href: '/resources', label: 'Resources', icon: BookOpenText },
  { href: '/groups', label: 'Groups', icon: UsersRound }, 
  { href: '/events', label: 'Events', icon: CalendarClock },
  { href: '/directory', label: 'Directory', icon: Users },
  { href: '/achievements', label: 'Achievements', icon: Award }, 
];

function MobileSidebarMenuItem({ href, label, icon: Icon }: { href: string, label: string, icon: React.ElementType }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar(); 

  const handleClick = () => {
    setOpenMobile(false); 
  };

  return (
    <SidebarMenuItem>
      <Link href={href} passHref legacyBehavior>
        <SidebarMenuButton 
          isActive={pathname.startsWith(href)} 
          className="justify-start"
          onClick={handleClick} 
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );
}


function MainAppLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const sidebarContext = useSidebar(); 

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const storedTheme = localStorage.getItem('kaddaconnect-theme');
    if (storedTheme) {
      const newTheme = storedTheme === 'dark';
      setIsDarkTheme(newTheme);
      document.documentElement.classList.toggle('dark', newTheme);
      document.documentElement.classList.toggle('light', !newTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkTheme(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
      document.documentElement.classList.toggle('light', !prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newThemeIsDark = !isDarkTheme;
    setIsDarkTheme(newThemeIsDark);
    localStorage.setItem('kaddaconnect-theme', newThemeIsDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newThemeIsDark);
    document.documentElement.classList.toggle('light', !newThemeIsDark);
  };

  if (isLoading || (!isLoading && !user)) {
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6 w-full">
                <Skeleton className="h-8 w-32 bg-muted" />
                <Skeleton className="h-8 w-8 rounded-full bg-muted" />
            </header>
            <div className="absolute inset-0 flex flex-1 flex-col items-center justify-center p-6 pt-16">
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
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar collapsible="icon" className="hidden md:flex md:flex-col border-r border-border"> 
          <SidebarRail />
          <SidebarHeader className="p-2 h-16 flex items-center justify-between">
             <Link href="/home" className="flex items-center gap-2 font-semibold text-primary px-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 group-data-[state=collapsed]:hidden"><path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2"/><path d="M14 22v-4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v4"/><path d="M18 22V5l-6-3-6 3v17"/><path d="M12 7v5"/><path d="M10 9h4"/></svg>
                <span className="font-headline text-xl group-data-[state=collapsed]:hidden">KaddaConnect</span>
             </Link>
             <SidebarTrigger className="group-data-[state=expanded]:hidden h-8 w-8" /> 
          </SidebarHeader>
          <SidebarContent className="flex-grow p-2">
            <SidebarMenu>
              {mainNavItems.map(item => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton 
                        isActive={pathname.startsWith(item.href)} 
                        tooltip={{ children: item.label, side: 'right', align: 'center' }}
                        className="justify-start"
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[state=collapsed]:hidden">{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-2 mt-auto border-t border-border">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" className="w-full justify-start group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-0 group-data-[state=collapsed]:aspect-square p-2 h-auto">
                        <Avatar className="h-9 w-9 group-data-[state=collapsed]:h-7 group-data-[state=collapsed]:w-7">
                            <AvatarImage src={user?.profilePictureUrl || `https://placehold.co/80x80.png?text=${user?.displayName?.charAt(0)}`} alt={user?.displayName || 'User'} data-ai-hint="profile person" />
                            <AvatarFallback className="bg-muted text-muted-foreground">{user?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="ml-2 text-left group-data-[state=collapsed]:hidden">
                            <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                            <p className="text-xs leading-none text-muted-foreground truncate max-w-[100px]">{user?.email}</p>
                        </div>
                   </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="top" className="w-56 mb-1 ml-1">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled className="cursor-not-allowed">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings (soon)
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
               <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="rounded-full mt-2 w-full justify-start group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:px-0 group-data-[state=collapsed]:aspect-square p-2 h-auto">
                {isDarkTheme ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="ml-2 group-data-[state=collapsed]:hidden">Toggle Theme</span>
              </Button>
          </SidebarFooter>
        </Sidebar>

         <SidebarInset className="flex flex-col flex-1"> 
          <header className="sticky top-0 z-30 flex md:hidden h-16 items-center justify-between bg-card px-4 border-b border-border">
              <SidebarTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-foreground">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SidebarTrigger>
              <Link href="/home" className="flex items-center gap-2 font-semibold text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2"/><path d="M14 22v-4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v4"/><path d="M18 22V5l-6-3-6 3v17"/><path d="M12 7v5"/><path d="M10 9h4"/></svg>
                <span className="font-headline text-lg">KaddaConnect</span>
              </Link>
              <Link href="/profile">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.profilePictureUrl || `https://placehold.co/80x80.png?text=${user?.displayName?.charAt(0)}`} alt={user?.displayName || 'User'} data-ai-hint="profile person" />
                    <AvatarFallback className="bg-muted text-muted-foreground">{user?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
              </Link>
          </header>
          
          <Sidebar side="left" collapsible="offcanvas" className="md:hidden"> 
            <SidebarHeader className="p-2 h-16 flex items-center justify-between">
                <Link href="/home" className="flex items-center gap-2 font-semibold text-primary px-2" onClick={() => sidebarContext?.setOpenMobile(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2"/><path d="M14 22v-4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v4"/><path d="M18 22V5l-6-3-6 3v17"/><path d="M12 7v5"/><path d="M10 9h4"/></svg>
                  <span className="font-headline text-xl">KaddaConnect</span>
                </Link>
                <SidebarTrigger asChild>
                    <Button variant="ghost" size="icon">
                         <X className="h-6 w-6"/> 
                         <span className="sr-only">Close menu</span>
                    </Button>
                </SidebarTrigger>
            </SidebarHeader>
            <SidebarContent className="flex-grow p-2">
              <SidebarMenu>
                {mainNavItems.map(item => (
                  <MobileSidebarMenuItem key={`mobile-${item.label}`} href={item.href} label={item.label} icon={item.icon} />
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-2 mt-auto border-t border-border">
                <Button variant="ghost" onClick={() => { toggleTheme(); sidebarContext?.setOpenMobile(false); }} aria-label="Toggle theme" className="w-full justify-start p-2 h-auto">
                    {isDarkTheme ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    <span className="ml-2">Toggle Theme</span>
                </Button>
                 <Button variant="ghost" onClick={() => { handleLogout(); sidebarContext?.setOpenMobile(false); }} className="w-full justify-start p-2 h-auto text-destructive hover:text-destructive">
                    <LogOut className="h-5 w-5" />
                    <span className="ml-2">Logout</span>
                </Button>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-grow">
            <div className="h-full">{children}</div>
          </main>
          <BottomNavigation /> 
        </SidebarInset>
      </div>
  );
}

export default function MainAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}> 
      <Suspense fallback={
        <div className="flex min-h-screen bg-background text-foreground">
          <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6 w-full">
            <Skeleton className="h-8 w-32 bg-muted" />
            <Skeleton className="h-8 w-8 rounded-full bg-muted" />
          </header>
          <div className="absolute inset-0 flex flex-1 flex-col items-center justify-center p-6 pt-16">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin lucide lucide-loader-circle mb-4"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            <p className="text-muted-foreground">Loading KaddaConnect...</p>
          </div>
        </div>
      }>
        <MainAppLayoutContent>{children}</MainAppLayoutContent>
      </Suspense>
    </SidebarProvider>
  )
}

    
