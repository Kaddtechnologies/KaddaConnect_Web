
"use client";

import type { PrayerRequest } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { useUserData } from '@/contexts/user-data-context'; // To get user avatar

interface PrayerRequestCardProps {
  request: PrayerRequest;
}

export default function PrayerRequestCard({ request }: PrayerRequestCardProps) {
  const { getMemberById } = useUserData();
  const user = getMemberById(request.userId);

  return (
    <Card className="mb-4 shadow-lg rounded-xl">
      <CardHeader className="flex flex-row items-center gap-3 p-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.profilePictureUrl} alt={request.userName} data-ai-hint="profile person" />
          <AvatarFallback>{request.userName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-base font-semibold">{request.userName}</CardTitle>
          <CardDescription className="text-xs">
            {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-foreground whitespace-pre-wrap">{request.requestText}</p>
      </CardContent>
    </Card>
  );
}
