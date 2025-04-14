"use client";

import { useState, useRef } from "react";
import { getNameColorPredefined } from "@/lib/utils";
import { ThumbsUp } from "lucide-react";

interface RetroItemCardProps {
  content: string;
  userName?: string;
  isAISummary?: boolean;
}

export function RetroItemCard({
  content,
  userName = "Anonymous",
  isAISummary = false,
}: RetroItemCardProps) {
  const [showFullName, setShowFullName] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const bgColor = getNameColorPredefined(userName);

  const handleLikeClick = () => {
    console.log("Like button clicked");
    setLikeCount(hasLiked ? likeCount - 1 : likeCount + 1);
    setHasLiked(!hasLiked);
    console.log("Like count:", likeCount);
    console.log("Has liked:", hasLiked);
  };

  return (
    <div
      className={`p-3 mb-2 rounded border relative ${
        isAISummary ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
      }`}
    >
      {/* Content with left padding to avoid thumbs-up icon */}
      <p className="pr-8 pb-6">
        {" "}
        {/* Added right and bottom padding */}
        {content}
      </p>

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
