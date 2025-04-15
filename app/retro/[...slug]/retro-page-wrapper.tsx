'use client';

import { useEffect, useState } from 'react';
import { NewUser } from '@/lib/schema';
import { RetroSlugResponse, UserRetroResponse } from '@/lib/retro';
import Topbar from '@/components/ui/topbar';
import { RetroList } from '@/components/ui/retro-list';
import { AddRetroColumn } from '@/components/ui/retro-column';

interface RetroPageWrapperProps {
  initialRetro: RetroSlugResponse;
  allRetros: UserRetroResponse;
  user: NewUser;
  slug: string;
}

export function RetroPageWrapper({
  initialRetro,
  allRetros,
  user,
  slug,
}: RetroPageWrapperProps) {
  const [currentRetro, setCurrentRetro] = useState(initialRetro);
  //const [ws, setWs] = useState<WebSocket | null>(null);

  //   useEffect(() => {
  //     // Establish WebSocket connection
  //     const prot ocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  //     const socket = new WebSocket(
  //       `${protocol}//${window.location.host}/api/retros/${slug}/ws`
  //     );

  //     socket.onopen = () => {
  //       console.log('WebSocket connected');
  //       setWs(socket);
  //     };

  //     socket.onmessage = (event) => {
  //       const data = JSON.parse(event.data);

  //       if (data.type === 'note_added') {
  //         // Log the notification to console
  //         console.log(`[${data.username}] added a new note: ${data.content}`);
  //       }
  //     };

  //     socket.onclose = () => {
  //       console.log('WebSocket disconnected');
  //       setWs(null);
  //     };

  //     socket.onerror = (error) => {
  //       console.error('WebSocket error:', error);
  //     };

  //     return () => {
  //       if (socket.readyState === WebSocket.OPEN) {
  //         socket.close();
  //       }
  //     };
  //   }, [slug]);

  return (
    <div className="flex flex-col h-screen text-gray-900">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/5 bg-gray-100 p-4">
          <RetroList retros={allRetros} slug={currentRetro.retro.slug} />
        </div>

        <AddRetroColumn
          user={user}
          retro={currentRetro}
          columnId={0}
          headerText="The Good"
          items={currentRetro.notes.filter((note) => note.categoryId === 0)}
        />
        <AddRetroColumn
          user={user}
          retro={currentRetro}
          columnId={1}
          headerText="To Improve"
          items={currentRetro.notes.filter((note) => note.categoryId === 1)}
        />
        <AddRetroColumn
          user={user}
          retro={currentRetro}
          columnId={2}
          headerText="Action Items"
          items={currentRetro.notes.filter((note) => note.categoryId === 2)}
        />
        <AddRetroColumn
          user={user}
          retro={currentRetro}
          columnId={3}
          headerText="Summary"
          items={currentRetro.notes.filter((note) => note.categoryId === 3)}
          aiSummary={true}
        />
      </div>
    </div>
  );
}
