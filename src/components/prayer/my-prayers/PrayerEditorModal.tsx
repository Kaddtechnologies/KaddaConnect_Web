
"use client";

import { useState, useEffect } from 'react';
import type { UserPrayer } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Save, Ban } from 'lucide-react';

interface PrayerEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prayerData: Omit<UserPrayer, 'id' | 'userId' | 'createdAt' | 'lastPrayedAt' | 'isAnswered' | 'answeredAt' | 'answerDescription'>) => void;
  prayer: UserPrayer | null; // Pass prayer data if editing, null if adding
}

const prayerCategories = ["Personal", "Family", "Health", "Guidance", "Gratitude", "Community", "World", "Repentance", "Other"];

export default function PrayerEditorModal({ isOpen, onClose, onSave, prayer }: PrayerEditorModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (prayer) {
      setTitle(prayer.title);
      setContent(prayer.content);
      setCategory(prayer.category);
    } else {
      // Reset for new prayer
      setTitle('');
      setContent('');
      setCategory(prayerCategories[0]); // Default category
    }
  }, [prayer, isOpen]); // Re-populate form when prayer or isOpen changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category) {
      // Basic validation, consider using react-hook-form for more complex scenarios
      alert("Please fill in all fields.");
      return;
    }
    onSave({ title, content, category });
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card text-card-foreground shadow-xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">{prayer ? 'Edit Prayer' : 'Add New Prayer'}</DialogTitle>
          <DialogDescription>
            {prayer ? 'Update the details of your prayer.' : 'Share your prayer request or reflection.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="py-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prayer-title" className="text-base">Title</Label>
            <Input
              id="prayer-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Guidance for work, Healing for a friend"
              className="text-base"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prayer-content" className="text-base">Prayer / Reflection</Label>
            <Textarea
              id="prayer-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, requests, or praises..."
              rows={5}
              className="text-base min-h-[120px]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prayer-category" className="text-base">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="prayer-category" className="w-full text-base">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {prayerCategories.map(cat => (
                  <SelectItem key={cat} value={cat} className="text-base">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                <Ban className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Save className="h-4 w-4 mr-2" />
              {prayer ? 'Save Changes' : 'Add Prayer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
