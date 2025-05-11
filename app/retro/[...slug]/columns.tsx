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
import { AIResponse, createAiCards } from '@/lib/ressponse-parser';

interface ColumnsProps {
  initialRetro: RetroSlugResponse;
  user: NewUser;
}

type SortOption = 'date' | 'likes' | 'author' | 'grouping';

// Function to generate a pastel color
const generatePastelColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 90%)`;
};

// Function to generate consistent colors for groups
const getGroupColors = (notes: any[]) => {
  const groupColors = new Map<string, string>();
  const groupCounts = new Map<string, number>();

  // First count how many cards are in each group
  notes.forEach((note) => {
    if (note.groupingGuid) {
      groupCounts.set(
        note.groupingGuid,
        (groupCounts.get(note.groupingGuid) || 0) + 1
      );
    }
  });

  // Only assign colors to groups with more than one card
  notes.forEach((note) => {
    if (note.groupingGuid && !groupColors.has(note.groupingGuid)) {
      const count = groupCounts.get(note.groupingGuid) || 0;
      if (count > 1) {
        const color = generatePastelColor();
        groupColors.set(note.groupingGuid, color);
      }
    }
  });
  return groupColors;
};

export default function Columns({ initialRetro, user }: ColumnsProps) {
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortedNotes, setSortedNotes] = useState(initialRetro.notes);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [groupColors] = useState(() => {
    return getGroupColors(initialRetro.notes);
  });

  // Check if there are any AI cards in the retro
  const hasAiCards = initialRetro.notes.some((note) => note.isAiGenerated);

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const notes = await getRetroNotesByIdAction(initialRetro.retro.id!);
      const grouping = await getCardsGroupingAiResponse(
        notes.map((note) => ({
          id: note.id,
          guid: note.guid,
          content: note.content,
          category: note.category || '',
          categoryId: note.categoryId,
          createdAt: note.createdAt,
          retroId: note.retroId,
          userId: note.userId,
          user: { id: note.userId, name: '' },
        }))
      );

      const groupingParsed = JSON.parse(grouping) as AIResponse;
      const parsedResponse = await createAiCards(
        groupingParsed,
        initialRetro.retro.id!,
        user.id!
      );

      const updatedNotes = await getRetroNotesByIdAction(
        initialRetro.retro.id!
      );
      const sortedNotes = [...updatedNotes]
        .sort((a, b) => {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        })
        .filter((note) => !note.isAiGenerated);

      setSortedNotes(
        sortedNotes.map((note) => ({
          ...note,
          createdAt: new Date(note.createdAt),
        }))
      );
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
          case 'grouping':
            // First sort by grouping GUID
            if (!a.groupingGuid && !b.groupingGuid) return 0;
            if (!a.groupingGuid) return 1;
            if (!b.groupingGuid) return -1;

            // If they're in the same group, put AI cards first
            if (a.groupingGuid === b.groupingGuid) {
              if (a.isAiGenerated && !b.isAiGenerated) return -1;
              if (!a.isAiGenerated && b.isAiGenerated) return 1;
            }

            return a.groupingGuid.localeCompare(b.groupingGuid);
          case 'date':
          default:
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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
            onValueChange={(value: SortOption) => {
              setSortBy(value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date Created</SelectItem>
              <SelectItem value="likes">Number of Likes</SelectItem>
              <SelectItem value="author">Created By</SelectItem>
              {hasAiCards && (
                <SelectItem value="grouping">AI Summary</SelectItem>
              )}
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
          groupColors={sortBy === 'grouping' ? groupColors : undefined}
        />
        <AddRetroColumn
          user={user}
          retroSlugResponse={initialRetro}
          columnId={1}
          headerText="To Improve"
          items={sortedNotes.filter((note) => note.categoryId === 1)}
          groupColors={sortBy === 'grouping' ? groupColors : undefined}
        />
        <AddRetroColumn
          user={user}
          retroSlugResponse={initialRetro}
          columnId={2}
          headerText="Action Items"
          items={sortedNotes.filter((note) => note.categoryId === 2)}
          groupColors={sortBy === 'grouping' ? groupColors : undefined}
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
          groupColors={sortBy === 'grouping' ? groupColors : undefined}
        />
      </div>
    </div>
  );
}
