
"use client";

import Image from 'next/image';
import type { Member } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Sparkles, Mail, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MemberCardProps {
  member: Member;
}

export default function MemberCard({ member }: MemberCardProps) {
  return (
    <Card className="shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/10 to-accent/10">
        <Avatar className="w-24 h-24 border-4 border-card mb-3">
          <AvatarImage src={member.profilePictureUrl} alt={member.displayName} data-ai-hint={member.dataAiHint || "profile person"}/>
          <AvatarFallback className="text-3xl">{member.displayName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl font-headline text-center">{member.displayName}</CardTitle>
        {member.ministry && (
          <p className="text-sm text-primary flex items-center mt-1">
            <Briefcase className="w-4 h-4 mr-1.5" />
            {member.ministry}
          </p>
        )}
      </CardHeader>
      <CardContent className="p-6 space-y-3">
        {member.interests && member.interests.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1.5 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-accent" />
              Interests
            </h4>
            <div className="flex flex-wrap gap-2">
              {member.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {/* Placeholder contact info */}
        <div className="space-y-1 pt-2">
           <p className="text-sm text-muted-foreground flex items-center">
            <Mail className="w-4 h-4 mr-2 text-gray-400" />
            {member.email || 'Contact info not available'}
          </p>
           {/* <p className="text-sm text-muted-foreground flex items-center">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            (555) 123-4567
          </p> */}
        </div>
      </CardContent>
    </Card>
  );
}
