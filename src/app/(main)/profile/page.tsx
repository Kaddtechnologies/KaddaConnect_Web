
"use client";

import ProfileForm from '@/components/profile/profile-form';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { UserCircle, LogOut } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push('/login'); // Redirect is also handled by layout, but good for immediate effect.
    } catch (error) {
      toast({ title: "Logout Failed", description: "Could not log out. Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-0 md:py-6">
      <div className="mb-6 md:mb-8 text-center">
        <UserCircle className="mx-auto h-12 w-12 text-primary mb-3" />
        <h1 className="text-3xl md:text-4xl font-headline text-primary mb-2">Your Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and settings.</p>
      </div>

      <ProfileForm />

      <div className="mt-8 text-center">
        <Button variant="outline" onClick={handleLogout} className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
