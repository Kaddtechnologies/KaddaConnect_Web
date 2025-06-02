
"use client";

import { useState, useEffect } from 'react';
import { useUserData } from '@/contexts/user-data-context';
import { Button } from '@/components/ui/button';
import { PlusCircle, ListChecks, Edit2, Trash2, Sparkles, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import type { UserPrayer } from '@/types';
import PrayerCard from '@/components/prayer/my-prayers/PrayerCard';
import PrayerEditorModal from '@/components/prayer/my-prayers/PrayerEditorModal';
import { useToast } from "@/hooks/use-toast";

export default function MyPrayersPage() {
  const { userPrayers, addUserPrayer, updateUserPrayer, deleteUserPrayer, markPrayerAsPrayed, markPrayerAsAnswered, isLoading: dataLoading } = useUserData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState<UserPrayer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!dataLoading) {
      setIsLoading(false);
    }
  }, [dataLoading]);

  const openAddModal = () => {
    setEditingPrayer(null);
    setIsModalOpen(true);
  };

  const openEditModal = (prayer: UserPrayer) => {
    setEditingPrayer(prayer);
    setIsModalOpen(true);
  };

  const handleSavePrayer = (prayerData: Omit<UserPrayer, 'id' | 'userId' | 'createdAt' | 'lastPrayedAt'>) => {
    if (editingPrayer) {
      updateUserPrayer(editingPrayer.id, prayerData);
      toast({ title: "Prayer Updated", description: `"${prayerData.title}" has been updated.` });
    } else {
      addUserPrayer(prayerData);
      toast({ title: "Prayer Added", description: `"${prayerData.title}" has been added to your list.` });
    }
    setIsModalOpen(false);
    setEditingPrayer(null);
  };

  const handleDeletePrayer = (prayerId: string, prayerTitle: string) => {
     if (window.confirm(`Are you sure you want to delete the prayer "${prayerTitle}"? This action cannot be undone.`)) {
      deleteUserPrayer(prayerId);
      toast({ title: "Prayer Deleted", description: `"${prayerTitle}" has been removed.`, variant: "destructive" });
    }
  };

  const handleMarkAsPrayed = (prayerId: string, prayerTitle: string) => {
    markPrayerAsPrayed(prayerId);
    toast({ title: "Prayed!", description: `You prayed for "${prayerTitle}".` });
  };

  const handleToggleAnswered = (prayer: UserPrayer) => {
    const newAnsweredState = !prayer.isAnswered;
    // For simplicity, this example doesn't prompt for answer details here.
    // A more complete solution might open a small modal or inline form for `answerDescription`.
    markPrayerAsAnswered(prayer.id, { description: newAnsweredState ? (prayer.answerDescription || "Answered!") : undefined });
    toast({ 
      title: newAnsweredState ? "Prayer Answered!" : "Marked as Unanswered", 
      description: `"${prayer.title}" marked as ${newAnsweredState ? 'answered' : 'not yet answered'}.` 
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your prayers...</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground">My Prayer List</h2>
        <Button onClick={openAddModal} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-shadow">
          <PlusCircle className="h-5 w-5 mr-2" />
          Add New Prayer
        </Button>
      </div>

      {userPrayers.length === 0 ? (
        <div className="text-center py-16 bg-card/50 rounded-xl shadow-inner">
          <ListChecks className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
          <h3 className="text-2xl font-semibold text-foreground mb-3">Your prayer list is empty.</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Start by adding a prayer request, a goal, or something you're thankful for. Let this be your sacred space for communion.
          </p>
          <Button onClick={openAddModal} variant="outline" className="mt-6 text-lg py-3 px-6">
             <Sparkles className="h-5 w-5 mr-2 text-accent"/>
             Add Your First Prayer
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {userPrayers.map(prayer => (
            <PrayerCard 
              key={prayer.id} 
              prayer={prayer}
              onEdit={() => openEditModal(prayer)}
              onDelete={() => handleDeletePrayer(prayer.id, prayer.title)}
              onMarkAsPrayed={() => handleMarkAsPrayed(prayer.id, prayer.title)}
              onToggleAnswered={() => handleToggleAnswered(prayer)}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <PrayerEditorModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setEditingPrayer(null); }}
          onSave={handleSavePrayer}
          prayer={editingPrayer}
        />
      )}
    </div>
  );
}
