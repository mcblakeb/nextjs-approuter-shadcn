"use client";

import { useSession, signOut } from "next-auth/react";
import { SuperRetroLogo } from "./retro-logo";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Topbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGoogleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="w-full bg-gray-100 px-6 flex justify-between items-center border-b border-gray-200 h-14 relative">
      <div className="flex items-center h-full">
        <SuperRetroLogo
          size="md"
          primaryColor="#3f4b1c"
          className="h-[28px] w-auto font-bangers"
        />
      </div>

      <div className="flex items-center gap-3">
        {session?.user?.name && (
          <span className="text-sm font-medium">{session.user.name}</span>
        )}

        <div ref={dropdownRef} className="relative flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt="User profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs">
                  {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              )}
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown menu */}
          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <button
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => {
                  // Add settings navigation logic here
                  setIsOpen(false);
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
              <button
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={handleGoogleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
