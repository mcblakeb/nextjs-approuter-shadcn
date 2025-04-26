"use client";

import { useState, useRef } from "react";
import { getNameColorPredefined } from "@/lib/utils";
import { ThumbsUp, Edit, Check, X, Trash2 } from "lucide-react";
import CardAvatar from "@/components/ui/card-avatar";

import {
  deleteRetroNoteAction,
  updateRetroNoteAction,
} from "@/lib/retroActions";

interface RetroItemCardProps {
  content: string;
  noteId: number;
  userName?: string;
  isAISummary?: boolean;
  isMine: boolean;
  onDelete?: () => void;
  onUpdate?: () => void;
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export function RetroItemCard({
  content,
  noteId,
  userName = "Anonymous",
  isAISummary = false,
  isMine = false,
  onDelete,
  onUpdate,
}: RetroItemCardProps) {
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bgColor = getNameColorPredefined(userName);

  const handleLikeClick = () => {
    setLikeCount(hasLiked ? likeCount - 1 : likeCount + 1);
    setHasLiked(!hasLiked);
  };

  const handleDeleteClick = async () => {
    await deleteRetroNoteAction(noteId);
    if (onDelete) onDelete();
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const handleSaveClick = async () => {
    if (editedContent !== content) {
      await updateRetroNoteAction(noteId, editedContent);
      if (onUpdate) onUpdate();
    }
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  return (
    <div
      className={`p-3 mb-2 rounded border relative ${
        isAISummary ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
      }`}
    >
      {/* Action buttons dropdown at top right */}
      <div className="absolute top-1 right-1">
        {isMine && !isEditing && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                aria-label="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleEditClick}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDeleteClick}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {isMine && isEditing && (
          <div className="flex gap-1">
            <button
              onClick={handleSaveClick}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-green-500"
              aria-label="Save changes"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={handleCancelClick}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-red-500"
              aria-label="Cancel editing"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full p-2 pr-8 pb-6 resize-none focus:outline-none"
          rows={2}
        />
      ) : (
        <p
          className="pr-8 pb-6 whitespace-pre-wrap cursor-text"
          onClick={isMine ? handleEditClick : undefined}
        >
          {editedContent}
        </p>
      )}

      {/* Like button in bottom left */}
      <div className="absolute bottom-1 left-1 flex items-center gap-1">
        <button
          onClick={handleLikeClick}
          className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${
            hasLiked ? "text-blue-500" : "text-gray-500"
          }`}
          aria-label="Like this item"
        >
          <ThumbsUp className="h-4 w-4" />
        </button>
        {likeCount > 0 && (
          <span className="text-xs text-gray-600">+{likeCount}</span>
        )}
      </div>
      <CardAvatar bgColor={bgColor} userName={userName} />
    </div>
  );
}
