
"use client";

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
    <div className="flex flex-wrap gap-2">
      {categories.map(category => (
        <Badge
          key={category}
          variant={selectedCategories.includes(category) ? "default" : "secondary"}
          onClick={() => onToggleCategory(category)}
          className={cn(
            "cursor-pointer transition-all px-3 py-1.5 text-sm rounded-full shadow-sm",
            selectedCategories.includes(category) 
              ? "bg-primary text-primary-foreground hover:bg-primary/90" 
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
}
