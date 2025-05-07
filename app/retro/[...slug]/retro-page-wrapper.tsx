'use client';

import { NewUser } from '@/lib/schema';
import { RetroSlugResponse, UserRetroResponse } from '@/lib/retro';
import Topbar from '@/components/ui/topbar';
import { RetroList } from '@/components/ui/retro-list';
import Columns from './columns';
import { WebSocketWrapper } from '@/components/ui/websocket-wrapper';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RetroPageWrapperProps {
  initialRetro: RetroSlugResponse;
  allRetros: UserRetroResponse;
  user: NewUser;
}

export function RetroPageWrapper({
  initialRetro,
  allRetros,
  user,
}: RetroPageWrapperProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <WebSocketWrapper retroGuid={initialRetro.retro.guid}>
      <div className="flex flex-col h-screen text-gray-900">
        <Topbar />
        <div className="flex flex-1 overflow-hidden relative">
          {/* Mobile sidebar toggle button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-4 z-50 md:hidden h-10 w-10 border-2 shadow-sm bg-white hover:bg-gray-50"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <ChevronRight
              className={`h-5 w-5 transition-transform ${
                isSidebarOpen ? 'rotate-180' : ''
              }`}
            />
          </Button>

          {/* Sidebar */}
          <div
            className={`fixed md:relative inset-y-0 left-0 z-40 w-64 bg-gray-100 p-4 transform transition-transform duration-200 ease-in-out ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0`}
          >
            <RetroList retros={allRetros} slug={initialRetro.retro.slug} />
          </div>

          {/* Main content */}
          <div className="flex-1">
            <Columns initialRetro={initialRetro} user={user} />
          </div>
        </div>
      </div>
    </WebSocketWrapper>
  );
}
