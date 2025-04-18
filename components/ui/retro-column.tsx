"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import { RetroItemCard } from "./retro-item-card";
import { NewUser, Retro, RetroNote } from "@/lib/schema";
import { createRetroNoteAction } from "@/lib/retroActions";
import { RetroSlugResponse } from "@/lib/retro";

interface AddRetroColumnProps {
  headerText?: string;
  aiSummary?: boolean;
  items?: any[];
  columnId: number;
  user: NewUser;
  retro: RetroSlugResponse;
}

export function AddRetroColumn({
  headerText = "Retro",
  aiSummary = false,
  columnId,
  user,
  retro,
  items = [],
}: AddRetroColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newRetroItemText, setNewRetroItemText] = useState("");
  const [retroItems, setRetroItems] = useState<any[]>(items || []);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (newRetroItemText.trim()) {
      const newItem = {
        id: Date.now(),
        content: newRetroItemText,
        userId: user.id,
        createdAt: new Date(),
        retroId: retro.retro.id,
        categoryId: columnId,
        category: headerText,
        user: {
          name: user.name,
          id: user.id,
        },
      };
      setRetroItems([...retroItems, newItem]);
      setNewRetroItemText("");
      setIsAdding(false);

      await createRetroNoteAction({
        retroId: retro.retro.id!,
        content: newRetroItemText,
        userId: user.id!,
        category: headerText,
        categoryId: columnId,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleCancel = () => {
    setNewRetroItemText("");
    setIsAdding(false);
  };

  const handleGenerateSummary = () => {
    setIsGeneratingSummary(true);
    // Simulate AI summary generation
    setTimeout(() => {
      const summary = generateAISummary(retroItems);
      const aiSummaryNote = {
        id: Date.now(), // Generate a unique ID (replace with actual logic if needed)
        content: `AI Summary: ${summary}`,
        userId: 0,
        createdAt: new Date(),
        retroId: 1, // Replace with actual retro ID if available
        categoryId: columnId,
        category: headerText,
      };
      setRetroItems([...retroItems, aiSummaryNote]);
      setIsGeneratingSummary(false);
    }, 1500);
  };

  const generateAISummary = (items: RetroNote[]): string => {
    if (items.length === 0) return "No items to summarize";
    const positives = items.filter(
      (item) =>
        item.content.toLowerCase().includes("good") ||
        item.content.toLowerCase().includes("positive")
    ).length;

    const improvements = items.filter(
      (item) =>
        item.content.toLowerCase().includes("improve") ||
        item.content.toLowerCase().includes("negative")
    ).length;

    return `Key insights: ${positives} positive notes, ${improvements} areas for improvement`;
  };

  return (
    <div className="w-1/5 p-4 bg-gray-50 flex flex-col">
      {/* Header with optional AI button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">{headerText}</h2>
        {aiSummary && (
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-800"
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isGeneratingSummary ? "Generating..." : ""}
          </Button>
        )}
      </div>

      {/* Existing retro items */}
      <div className="flex-1 overflow-y-auto">
        {retroItems
          .filter((item) => item.categoryId === columnId)
          .map((item, index) => (
            <RetroItemCard
              key={index}
              content={item.content}
              noteId={item.id}
              isMine={item.userId === user.id}
              onDelete={() => {
                setRetroItems((prev) =>
                  prev.filter((retroItem) => retroItem.id !== item.id)
                );
              }}
              userName={item.user.name}
              isAISummary={item.content.startsWith("AI Summary:")}
            />
          ))}
      </div>

      {/* Add new retro section */}
      <div className="mt-auto pt-4">
        {isAdding ? (
          <div className="space-y-3">
            <Input
              value={newRetroItemText}
              onChange={(e) => setNewRetroItemText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a new retro item..."
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="flex-1"
                disabled={!newRetroItemText.trim()}
              >
                Save
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={handleAddClick} className="w-full" variant="ghost">
            <PlusIcon className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
