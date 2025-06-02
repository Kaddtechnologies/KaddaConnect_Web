
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
import { Save, Ban } from 'lucide-react';

interface AnswerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (description: string) => void;
  prayerTitle: string;
  initialDescription?: string;
}

export default function AnswerDetailsModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  prayerTitle,
  initialDescription = ""
}: AnswerDetailsModalProps) {
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    if (isOpen) {
      setDescription(initialDescription);
    }
  }, [isOpen, initialDescription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(description);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground shadow-xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-headline">Prayer Answered: {prayerTitle}</DialogTitle>
          <DialogDescription>
            Describe how this prayer was answered. This will be visible in your prayer journal.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="answer-description" className="text-base">Answer Description</Label>
            <Textarea
              id="answer-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Received the job offer, Felt peace about the situation, Relationship restored..."
              rows={4}
              className="text-base min-h-[100px]"
            />
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
              Save Answer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
