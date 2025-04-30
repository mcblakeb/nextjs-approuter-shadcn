'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles } from 'lucide-react';
import { RetroItemCard } from './retro-item-card';
import { NewUser, Retro, RetroNote } from '@/lib/schema';
import { createRetroNoteAction } from '@/lib/retroActions';
import { RetroSlugResponse } from '@/lib/retro';
import PlusIcon from '@/components/ui/plus-icon';
import { useWebSocket } from './websocket-init';

type AddRetroColumnProps = {
  headerText?: string;
  aiSummary?: boolean;
  items?: any[];
  columnId: number;
  user: NewUser;
  retroSlugResponse: RetroSlugResponse;
};

interface WebSocketRetroMessage {
  type:
    | 'retro_item_created'
    | 'retro_item_updated'
    | 'retro_item_deleted'
    | 'retro_item_liked'
    | 'retro_item_unliked';
  data: {
    retroGuid: string;
    item: {
      id: string;
      content: string;
      userId: number;
      categoryId: number;
      category: string;
      guid: string;
      likes?: number;
      likedBy?: number[];
    };
    user: {
      id: number;
      name: string;
    };
  };
}

export function AddRetroColumn({
  headerText = 'Retro',
  aiSummary = false,
  columnId,
  user,
  retroSlugResponse: retro,
  items = [],
}: AddRetroColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newRetroItemText, setNewRetroItemText] = useState('');
  const [retroItems, setRetroItems] = useState<any[]>(items || []);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const { sendMessage, addMessageHandler, removeMessageHandler } =
    useWebSocket();

  useEffect(() => {
    const handleWebSocketMessage = (message: WebSocketRetroMessage) => {
      if (
        message.type === 'retro_item_created' &&
        message.data.item.categoryId === columnId
      ) {
        // Only add the item if it belongs to this column
        const newItem = {
          ...message.data.item,
          user: message.data.user,
          createdAt: new Date().toISOString(),
          retroId: retro.retro.id,
        };

        setRetroItems((prevItems) => {
          // Check if item already exists to prevent duplicates
          if (prevItems.some((item) => item.guid === newItem.guid)) {
            return prevItems;
          }
          return [...prevItems, newItem];
        });
      } else if (
        message.type === 'retro_item_deleted' &&
        message.data.item.categoryId === columnId
      ) {
        // Remove the item from the state using the item's id since guid is not available in deletion message
        setRetroItems((prevItems) =>
          prevItems.filter(
            (item) => item.id.toString() !== message.data.item.id.toString()
          )
        );
      } else if (message.type === 'retro_item_updated') {
        // Handle updates regardless of column - items might move between columns
        setRetroItems((prevItems) => {
          const updatedItems = prevItems.filter(
            (item) => item.id.toString() !== message.data.item.id.toString()
          );

          // If the item belongs to this column after the update, add it
          if (message.data.item.categoryId === columnId) {
            const updatedItem = {
              ...message.data.item,
              user: message.data.user,
              retroId: retro.retro.id,
              // Preserve the guid if it exists in the current item
              guid: prevItems.find(
                (item) => item.id.toString() === message.data.item.id.toString()
              )?.guid,
            };
            return [...updatedItems, updatedItem];
          }

          return updatedItems;
        });
      } else if (
        message.type === 'retro_item_liked' ||
        message.type === 'retro_item_unliked'
      ) {
        // Handle like/unlike events
        setRetroItems((prevItems) => {
          return prevItems.map((item) => {
            if (item.id.toString() === message.data.item.id.toString()) {
              // Update the like count based on the event type
              const currentLikes = item.likes || 0;
              const newLikes =
                message.type === 'retro_item_liked'
                  ? currentLikes + 1
                  : Math.max(0, currentLikes - 1);

              return {
                ...item,
                likes: newLikes,
                // Track who liked the item
                likedBy:
                  message.type === 'retro_item_liked'
                    ? [...(item.likedBy || []), message.data.user.id]
                    : (item.likedBy || []).filter(
                        (id: number) => id !== message.data.user.id
                      ),
              };
            }
            return item;
          });
        });
      }
    };

    // Add the message handler
    addMessageHandler(handleWebSocketMessage);

    // Cleanup
    return () => {
      removeMessageHandler(handleWebSocketMessage);
    };
  }, [columnId, retro.retro.id, addMessageHandler, removeMessageHandler]);

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const sendRetroItemMessage = (item: any) => {
    if (!user.id) return;

    const message: WebSocketRetroMessage = {
      type: 'retro_item_created',
      data: {
        retroGuid: retro.retro.guid,
        item: {
          id: item.id,
          content: item.content,
          userId: user.id,
          categoryId: item.categoryId,
          category: item.category,
          guid: item.guid,
          likes: item.likes,
          likedBy: item.likedBy,
        },
        user: {
          id: user.id,
          name: user.name,
        },
      },
    };
    sendMessage(JSON.stringify(message));
  };

  const handleSave = async () => {
    if (newRetroItemText.trim()) {
      const newItem = {
        id: Date.now().toString(),
        content: newRetroItemText,
        userId: user.id,
        createdAt: new Date().toISOString(),
        retroId: retro.retro.id,
        categoryId: columnId,
        category: headerText,
        user: {
          id: user.id,
          name: user.name,
        },
        guid: crypto.randomUUID(),
        likes: 0,
        likedBy: [],
      };

      // Update local state first for immediate feedback
      setRetroItems((prevItems) => [...prevItems, newItem]);
      setNewRetroItemText('');
      setIsAdding(false);

      try {
        // Create the item in the database
        await createRetroNoteAction({
          retroId: retro.retro.id!,
          content: newRetroItemText,
          userId: user.id!,
          category: headerText,
          categoryId: columnId,
          guid: newItem.guid,
        });

        // Send WebSocket message about the new item
        sendRetroItemMessage(newItem);
      } catch (error) {
        console.error('Error creating retro item:', error);
        // Remove the item from local state if creation failed
        setRetroItems((prevItems) =>
          prevItems.filter((item) => item.guid !== newItem.guid)
        );
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleCancel = () => {
    setNewRetroItemText('');
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
        likes: 0,
        likedBy: [],
      };
      setRetroItems([...retroItems, aiSummaryNote]);
      setIsGeneratingSummary(false);
    }, 1500);
  };

  const generateAISummary = (items: RetroNote[]): string => {
    if (items.length === 0) return 'No items to summarize';
    const positives = items.filter(
      (item) =>
        item.content.toLowerCase().includes('good') ||
        item.content.toLowerCase().includes('positive')
    ).length;

    const improvements = items.filter(
      (item) =>
        item.content.toLowerCase().includes('improve') ||
        item.content.toLowerCase().includes('negative')
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
            {isGeneratingSummary ? 'Generating...' : ''}
          </Button>
        )}
      </div>

      {/* Existing retro items */}
      <div className="flex-1 overflow-y-auto">
        {retroItems
          .filter((item) => item.categoryId === columnId)
          .map((item) => (
            <RetroItemCard
              key={item.guid || item.id}
              content={item.content}
              noteId={item.id}
              isMine={item.userId === user.id}
              onDelete={() => {
                setRetroItems((prev) =>
                  prev.filter((retroItem) => retroItem.id !== item.id)
                );
              }}
              userName={item.user.name}
              isAISummary={item.content.startsWith('AI Summary:')}
              retroGuid={retro.retro.guid}
              categoryId={columnId}
              category={headerText}
              userId={user.id || 0}
              likes={item.likes}
              likedBy={item.likedBy}
            />
          ))}
      </div>

      {/* Add new retro item section */}
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
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1"
                disabled={!newRetroItemText.trim()}
              >
                Save
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
