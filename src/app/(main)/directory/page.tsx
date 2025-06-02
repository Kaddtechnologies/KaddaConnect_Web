
"use client";

import { useState, useMemo } from 'react';
import MemberCard from '@/components/directory/member-card';
import { useUserData } from '@/contexts/user-data-context';
import { Input } from '@/components/ui/input';
import { Search, Users } from 'lucide-react';

export default function DirectoryPage() {
  const { members } = useUserData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = useMemo(() => {
    if (!searchTerm) return members;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return members.filter(
      (member) =>
        member.displayName.toLowerCase().includes(lowerSearchTerm) ||
        (member.ministry && member.ministry.toLowerCase().includes(lowerSearchTerm)) ||
        member.interests.some(interest => interest.toLowerCase().includes(lowerSearchTerm))
    );
  }, [members, searchTerm]);

  return (
    <div className="container mx-auto max-w-4xl py-0 md:py-6">
      <div className="mb-6 md:mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-headline text-primary mb-2">Member Directory</h1>
        <p className="text-muted-foreground">Find and connect with members of our community.</p>
      </div>
      
      <div className="relative mb-6 md:mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, ministry, or interest..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-3 text-base rounded-lg shadow-sm focus:ring-2 focus:ring-primary"
        />
      </div>

      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No members found</h3>
          <p className="text-muted-foreground">Try adjusting your search term or check back later.</p>
        </div>
      )}
    </div>
  );
}
