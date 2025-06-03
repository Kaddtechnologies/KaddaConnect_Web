
// src/app/(main)/groups/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUserData } from "@/contexts/user-data-context";
import type { InterestGroup } from "@/types"; // Assuming InterestGroup type will be defined
import { PlusCircle, Search, UsersRound } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

// Placeholder Group Card component
const GroupCard = ({ group }: { group: InterestGroup }) => (
  <Card className="shadow-md hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle className="text-xl font-headline text-primary">{group.name}</CardTitle>
      <CardDescription>{group.description.substring(0, 100)}{group.description.length > 100 ? "..." : ""}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">Members: {group.memberCount}</p>
      <p className="text-sm text-muted-foreground">Category: {group.category}</p>
    </CardContent>
    <CardFooter>
      <Link href={`/groups/${group.id}`} passHref legacyBehavior>
        <Button variant="outline" className="w-full">View Group</Button>
      </Link>
    </CardFooter>
  </Card>
);

export default function GroupsPage() {
  // const { interestGroups, createInterestGroup } = useUserData(); // To be implemented in UserDataContext
  const { currentUserProfile } = useUserData();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Placeholder data until UserDataContext is updated
  const interestGroups: InterestGroup[] = [
    { id: 'group1', name: 'Bible Study Fellowship', description: 'Weekly discussions on scripture.', memberCount: 15, category: 'Ministry', createdBy: 'user1', createdAt: new Date().toISOString() },
    { id: 'group2', name: 'Hiking Adventures', description: 'Exploring local trails and nature.', memberCount: 22, category: 'Hobbies', createdBy: 'user2', createdAt: new Date().toISOString() },
    { id: 'group3', name: 'Tech Innovators', description: 'Discussing new technologies and projects.', memberCount: 8, category: 'Careers', createdBy: 'user3', createdAt: new Date().toISOString()},
  ];

  const filteredGroups = useMemo(() => {
    if (!searchTerm) return interestGroups;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return interestGroups.filter(
      (group) =>
        group.name.toLowerCase().includes(lowerSearchTerm) ||
        group.description.toLowerCase().includes(lowerSearchTerm) ||
        group.category.toLowerCase().includes(lowerSearchTerm)
    );
  }, [interestGroups, searchTerm]);

  const handleCreateGroup = () => {
    // TODO: Implement modal for group creation
    alert("Create group functionality coming soon!");
    // const newGroupName = prompt("Enter new group name:");
    // if (newGroupName && currentUserProfile) {
    //   createInterestGroup({ name: newGroupName, description: "A new group", category: "General" });
    // }
  };

  return (
    <div className="container mx-auto max-w-4xl py-0 md:py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-headline text-primary mb-2 flex items-center">
            <UsersRound className="h-8 w-8 mr-3 text-primary/80" /> Community Groups
          </h1>
          <p className="text-muted-foreground">Connect with others who share your interests and passions.</p>
        </div>
        <Button onClick={handleCreateGroup} className="w-full md:w-auto bg-primary hover:bg-primary/90">
          <PlusCircle className="h-5 w-5 mr-2" /> Create New Group
        </Button>
      </div>

      <div className="relative mb-6 md:mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search groups by name, description, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-3 text-base rounded-lg shadow-sm"
        />
      </div>

      {filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredGroups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <UsersRound className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No groups found</h3>
          <p className="text-muted-foreground">Try adjusting your search or create the first group for an interest!</p>
        </div>
      )}
    </div>
  );
}

    