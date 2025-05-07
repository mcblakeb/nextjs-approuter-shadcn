'use client';

import { AddRetroColumn } from '@/components/ui/retro-column';
import { RetroSlugResponse } from '@/lib/retro';
import { NewUser } from '@/lib/schema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useCallback, useEffect } from 'react';
import { getCardsGroupingAiResponse } from '@/lib/rag';
import { getRetroNotesByIdAction } from '@/lib/retroActions';

interface ColumnsProps {
  initialRetro: RetroSlugResponse;
  user: NewUser;
}

type SortOption = 'date' | 'likes' | 'author';

export default function Columns({ initialRetro, user }: ColumnsProps) {
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortedNotes, setSortedNotes] = useState(initialRetro.notes);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const notes = await getRetroNotesByIdAction(initialRetro.retro.id!);
      const grouping = await getCardsGroupingAiResponse(
        notes.map((note) => ({
          id: note.id,
          guid: note.guid,
          content: note.content,
          category: note.category || '', // Ensure category is never null
          categoryId: note.categoryId,
          createdAt: note.createdAt,
          retroId: note.retroId,
          userId: note.userId,
          user: { id: note.userId, name: '' },
        }))
      );

      console.log(grouping);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const sortNotes = useCallback(
    (notes: any[]) => {
      return [...notes].sort((a, b) => {
        switch (sortBy) {
          case 'likes':
            return (b.likes || 0) - (a.likes || 0);
          case 'author':
            return a.user.name.localeCompare(b.user.name);
          case 'date':
          default:
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }
      });
    },
    [sortBy]
  );

  useEffect(() => {
    setSortedNotes(sortNotes(initialRetro.notes));
  }, [sortBy, initialRetro.notes, sortNotes]);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {/* Sort Controls */}
      <div className="flex flex-col items-end p-4 border-b">
        <div className="w-[180px]">
          <label className="text-xs text-gray-500 mb-1 pl-0.5 block">
            Sort
          </label>
          <Select
            value={sortBy}
            onValueChange={(value: SortOption) => setSortBy(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date Created</SelectItem>
              <SelectItem value="likes">Number of Likes</SelectItem>
              <SelectItem value="author">Created By</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Columns */}
      <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">
        <AddRetroColumn
          user={user}
          retroSlugResponse={initialRetro}
          columnId={0}
          headerText="The Good"
          items={sortedNotes.filter((note) => note.categoryId === 0)}
        />
        <AddRetroColumn
          user={user}
          retroSlugResponse={initialRetro}
          columnId={1}
          headerText="To Improve"
          items={sortedNotes.filter((note) => note.categoryId === 1)}
        />
        <AddRetroColumn
          user={user}
          retroSlugResponse={initialRetro}
          columnId={2}
          headerText="Action Items"
          items={sortedNotes.filter((note) => note.categoryId === 2)}
        />
        <AddRetroColumn
          user={user}
          retroSlugResponse={initialRetro}
          columnId={3}
          headerText="Summary"
          items={sortedNotes.filter((note) => note.categoryId === 3)}
          aiSummary={true}
          onGenerateSummary={handleGenerateSummary}
          isGeneratingSummary={isGeneratingSummary}
        />
      </div>
    </div>
  );
}
