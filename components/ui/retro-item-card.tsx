'use client';

import { useState, useRef, useEffect } from 'react';
import { getNameColorPredefined } from '@/lib/utils';
import { ThumbsUp, Edit, Check, X, Trash2, Sparkles } from 'lucide-react';
import CardAvatar from '@/components/ui/card-avatar';
import { useWebSocket } from './websocket-init';

import {
  deleteRetroNoteAction,
  updateRetroNoteAction,
  addRetroNoteLikeAction,
  removeRetroNoteLikeAction,
} from '@/lib/retroActions';

interface RetroItemCardProps {
  onDelete: (id: number) => void;
  item: {
    id: number;
    content: string;
    userId: number;
    categoryId: number;
    category: string;
    guid: string;
    likes?: number;
    likedBy?: number[];
    isAiGenerated?: boolean;
    user?: {
      id: number;
      name: string;
    };
  };
  user: {
    id: number;
    name: string;
  };
  retroSlugResponse: {
    retro: {
      guid: string;
    };
  };
}

interface WebSocketRetroMessage {
  type:
    | 'retro_item_updated'
    | 'retro_item_deleted'
    | 'retro_item_liked'
    | 'retro_item_unliked';
  data: {
    retroGuid: string;
    item: {
      id: number;
      content: string;
      userId: number;
      categoryId: number;
      category: string;
      likes?: number;
      likedBy?: number[];
    };
    user: {
      id: number;
      name: string;
    };
  };
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

export function RetroItemCard({
  item,
  user,
  retroSlugResponse,
  onDelete
}: RetroItemCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(item.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bgColor = getNameColorPredefined(item.user?.name || 'Anonymous');
  const { sendMessage } = useWebSocket();
  const isMine = item.userId === user.id;

  // Update internal state when content prop changes
  useEffect(() => {
    setEditedContent(item.content);
  }, [item.content]);

  const handleLikeClick = async () => {
    const isCurrentlyLiked = item.likedBy?.includes(user.id) || false;

    try {
      if (isCurrentlyLiked) {
        // Remove like if already liked
        await removeRetroNoteLikeAction({
          retroNoteId: item.id,
          userId: user.id,
        });
      } else {
        // Add like if not already liked
        await addRetroNoteLikeAction({
          retroNoteId: item.id,
          userId: user.id,
        });
      }
    } catch (error) {
      console.error('Failed to update like:', error);
      return; // Don't send WebSocket message if the like update failed
    }

    // Send WebSocket message
    const message: WebSocketRetroMessage = {
      type: isCurrentlyLiked ? 'retro_item_unliked' : 'retro_item_liked',
      data: {
        retroGuid: retroSlugResponse.retro.guid,
        item: {
          id: item.id,
          content: item.content,
          userId: user.id,
          categoryId: item.categoryId,
          category: item.category,
          likes: isCurrentlyLiked
            ? (item.likes || 0) - 1
            : (item.likes || 0) + 1,
          likedBy: isCurrentlyLiked
            ? (item.likedBy || []).filter((id) => id !== user.id)
            : [...(item.likedBy || []), user.id],
        },
        user: {
          id: user.id,
          name: user.name,
        },
      },
    };
    sendMessage(JSON.stringify(message));
  };

  const sendRetroItemDeleteMessage = () => {
    const message: WebSocketRetroMessage = {
      type: 'retro_item_deleted',
      data: {
        retroGuid: retroSlugResponse.retro.guid,
        item: {
          id: item.id,
          content: item.content,
          userId: user.id,
          categoryId: item.categoryId,
          category: item.category,
        },
        user: {
          id: user.id,
          name: user.name,
        },
      },
    };
    sendMessage(JSON.stringify(message));
  };

  const handleDeleteClick = async () => {
    onDelete(item.id);
    await deleteRetroNoteAction(item.id);
    // Send WebSocket message about the deleted item
    sendRetroItemDeleteMessage();
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const sendRetroItemUpdateMessage = (updatedContent: string) => {
    const message: WebSocketRetroMessage = {
      type: 'retro_item_updated',
      data: {
        retroGuid: retroSlugResponse.retro.guid,
        item: {
          id: item.id,
          content: updatedContent,
          userId: user.id,
          categoryId: item.categoryId,
          category: item.category,
        },
        user: {
          id: user.id,
          name: user.name,
        },
      },
    };
    sendMessage(JSON.stringify(message));
  };

  const handleSaveClick = async () => {
    if (editedContent !== item.content) {
      await updateRetroNoteAction(item.id, editedContent);
      // Send WebSocket message about the updated item
      sendRetroItemUpdateMessage(editedContent);
    }
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditedContent(item.content);
    setIsEditing(false);
  };

  return (
    <div
      className={`p-3 mb-2 rounded border relative ${
        item.isAiGenerated
          ? 'bg-white border-2 border-green-600'
          : 'bg-transparent border border-gray-200'
      }`}
    >
      {/* AI Logo for AI-generated cards */}
      {item.isAiGenerated && (
        <div className="absolute top-1 left-1">
          <Sparkles className="h-4 w-4 text-green-600" />
        </div>
      )}

      {/* Action buttons dropdown at top right - show delete for all cards, edit only for non-AI */}
      <div className="absolute top-1 right-1">
        {isMine && !isEditing && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100/50 transition-colors text-gray-500 hover:text-gray-700 cursor-pointer"
                aria-label="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {!item.isAiGenerated && (
                <DropdownMenuItem
                  onClick={handleEditClick}
                  className="cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={handleDeleteClick}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {isMine && isEditing && !item.isAiGenerated && (
          <div className="flex gap-1">
            <button
              onClick={handleSaveClick}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100/50 transition-colors text-gray-500 hover:text-green-500 cursor-pointer"
              aria-label="Save changes"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancelClick}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100/50 transition-colors text-gray-500 hover:text-red-500 cursor-pointer"
              aria-label="Cancel changes"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="flex items-start gap-2">
        {!item.isAiGenerated && (
          <CardAvatar name={item.user?.name || 'Anonymous'} bgColor={bgColor} />
        )}
        <div
          className={`flex-1 min-w-0 ${item.isAiGenerated ? 'pl-4 pr-2' : ''}`}
        >
          {isEditing && !item.isAiGenerated ? (
            <textarea
              ref={textareaRef}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80"
              rows={3}
            />
          ) : (
            <p
              className={`whitespace-pre-wrap break-words ${
                item.isAiGenerated
                  ? 'text-[13px] text-green-800 italic'
                  : 'text-sm'
              }`}
            >
              {item.content}
            </p>
          )}
          {!item.isAiGenerated && (
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={handleLikeClick}
                className={`flex items-center gap-1 text-sm ${
                  item.likedBy?.includes(user.id)
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{item.likes || 0}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
