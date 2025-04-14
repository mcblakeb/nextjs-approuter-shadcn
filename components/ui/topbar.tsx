"use client";

import { useSession } from "next-auth/react";
import { SuperRetroLogo } from "./retro-logo";
export default function Topbar({ logoFont }: { logoFont?: string }) {
  const { data: session } = useSession();

  return (
    <div className="w-full bg-gray-100 px-6 flex justify-between items-center border-b border-gray-200 h-14">
      <div className="flex items-center h-full">
        <SuperRetroLogo
          size="md"
          primaryColor="#3f4b1c"
          className="h-[28px] w-auto"
          logoFont={logoFont}
        />
      </div>
      <div className="flex items-center gap-3">
        {session?.user?.name && (
          <span className="text-sm font-medium">{session.user.name}</span>
        )}
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
      </div>
    </div>
  );
}
