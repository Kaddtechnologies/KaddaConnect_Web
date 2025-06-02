
"use client";

// Placeholder component - actual filtering logic might be in the parent page
// or this component could be made more interactive.

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CategoryChipsProps {
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
}

export default function CategoryChips({ categories, selectedCategories, onToggleCategory }: CategoryChipsProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categories.map(category => (
        <Badge
          key={category}
          variant={selectedCategories.includes(category) ? "default" : "secondary"}
          onClick={() => onToggleCategory(category)}
          className={cn(
            "cursor-pointer transition-all",
            selectedCategories.includes(category) 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
}
