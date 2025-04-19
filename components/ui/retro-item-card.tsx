"use client";

import { useState, useRef } from "react";
import { getNameColorPredefined } from "@/lib/utils";
import { ThumbsUp, Edit, Check, X } from "lucide-react";
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

export function RetroItemCard({
  content,
  noteId,
  userName = "Anonymous",
  isAISummary = false,
  isMine = false,
  onDelete,
  onUpdate,
}: RetroItemCardProps) {
  const [showFullName, setShowFullName] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const avatarRef = useRef<HTMLDivElement>(null);
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
      {/* Action buttons at top right */}
      <div className="absolute top-1 right-1 flex gap-1">
        {isMine && !isEditing && (
          <>
            <button
              onClick={handleEditClick}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-blue-500"
              aria-label="Edit this item"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-300 bg-gray-100 transition-colors text-gray-500 hover:text-red-500"
              aria-label="Delete this item"
            >
              <span className="text-base font-bold leading-none">×</span>
            </button>
          </>
        )}
        {isMine && isEditing && (
          <>
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
          </>
        )}
      </div>

      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full p-2 pr-8 pb-6 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
          rows={2}
        />
      ) : (
        <p
          className="pr-8 pb-6 whitespace-pre-wrap cursor-text"
          onClick={isMine ? handleEditClick : undefined}
        >
          {content}
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

      {/* User avatar with left-positioned tooltip */}
      <div className="absolute bottom-1 right-1">
        <div
          ref={avatarRef}
          className="relative"
          onMouseEnter={() => setShowFullName(true)}
          onMouseLeave={() => setShowFullName(false)}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs cursor-pointer"
            style={{ backgroundColor: bgColor }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>

          {showFullName && (
            <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 z-50 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap shadow-lg">
              {userName}
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-gray-800" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
