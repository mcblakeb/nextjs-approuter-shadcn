import { useState, useRef } from 'react';

export default function CardAvatar(props: { bgColor: string; name: string }) {
  const [showFullName, setShowFullName] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  return (
    <div className="absolute bottom-1 right-1">
      <div
        ref={avatarRef}
        className="relative"
        onMouseEnter={() => setShowFullName(true)}
        onMouseLeave={() => setShowFullName(false)}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs cursor-pointer"
          style={{ backgroundColor: props.bgColor }}
        >
          {props.name.charAt(0).toUpperCase()}
        </div>

        {showFullName && (
          <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 z-50 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap shadow-lg">
            {props.name}
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-gray-800" />
          </div>
        )}
      </div>
    </div>
  );
}
