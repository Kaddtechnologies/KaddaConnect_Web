"use client";

import { useState, useEffect } from 'react';
import type { UserProfile } from '@/types';
import { useUserData } from '@/contexts/user-data-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Camera, Save } from 'lucide-react';

export default function ProfileForm() {
  const { currentUserProfile, updateUserProfile } = useUserData();
  const [displayName, setDisplayName] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [interests, setInterests] = useState(''); // Comma-separated string
  const { toast } = useToast();

  useEffect(() => {
    if (currentUserProfile) {
      setDisplayName(currentUserProfile.displayName);
      setProfilePictureUrl(currentUserProfile.profilePictureUrl);
      setInterests(currentUserProfile.interests.join(', '));
    }
  }, [currentUserProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserProfile) return;

    const updatedProfile: Partial<UserProfile> = {
      displayName,
      profilePictureUrl,
      interests: interests.split(',').map(interest => interest.trim()).filter(Boolean),
    };
    updateUserProfile(updatedProfile);
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
  };

  if (!currentUserProfile) {
    return <p>Loading profile...</p>; // Or a skeleton loader
  }

  return (
    <Card className="w-full  mx-auto shadow-xl rounded-xl">
      <CardHeader className="w-full">
        <CardTitle className="text-2xl font-headline">Edit Your Profile</CardTitle>
        <CardDescription>Keep your community profile up to date.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} className="w-full">
        <CardContent className="w-full space-y-6">
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="w-32 h-32 border-4 border-primary shadow-md">
              <AvatarImage src={profilePictureUrl || currentUserProfile.profilePictureUrl} alt={displayName} data-ai-hint="profile avatar" />
              <AvatarFallback className="text-4xl">{displayName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Button type="button" variant="outline" size="sm" className="relative">
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
              {/* Actual file input hidden for styling, would need more complex handling for real uploads */}
              <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" 
                     onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                if (event.target?.result) {
                                    setProfilePictureUrl(event.target.result as string);
                                }
                            };
                            reader.readAsDataURL(e.target.files[0]);
                        } else {
                           // For simplicity, if no file selected or cancelled, we can use a placeholder logic.
                           // Or prompt for URL if not doing direct uploads. Here we just show how to change it conceptually.
                           const newUrl = prompt("Enter new image URL:", profilePictureUrl);
                           if (newUrl) setProfilePictureUrl(newUrl);
                        }
                     }}
              />
            </Button>
             <Input
                id="profilePictureUrl"
                type="text"
                placeholder="https://example.com/image.png"
                value={profilePictureUrl}
                onChange={(e) => setProfilePictureUrl(e.target.value)}
                className="mt-2 text-xs"
              />
               <Label htmlFor="profilePictureUrl" className="text-xs text-muted-foreground">Or paste image URL</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests">Interests</Label>
            <Textarea
              id="interests"
              placeholder="e.g., Reading, Music, Volunteering"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              rows={3}
              className="rounded-lg"
            />
            <p className="text-xs text-muted-foreground">Separate interests with a comma.</p>
          </div>
        </CardContent>
        <CardFooter className="w-full">
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
