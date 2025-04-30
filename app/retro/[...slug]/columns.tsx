'use client';

import { AddRetroColumn } from '@/components/ui/retro-column';
import { useWebSocket } from '@/components/ui/websocket-init';
import { RetroSlugResponse } from '@/lib/retro';
import { NewUser } from '@/lib/schema';

interface ColumnsProps {
  initialRetro: RetroSlugResponse;
  user: NewUser;
}

export default function Columns({ initialRetro, user }: ColumnsProps) {
  const { sendMessage, isConnected } = useWebSocket();

  const handleSendMessage = () => {
    if (isConnected) {
      sendMessage('Your message here');
    }
  };

  return (
    <>
      <AddRetroColumn
        user={user}
        retroSlugResponse={initialRetro}
        columnId={0}
        headerText="The Good"
        items={initialRetro.notes.filter((note) => note.categoryId === 0)}
      />
      <AddRetroColumn
        user={user}
        retroSlugResponse={initialRetro}
        columnId={1}
        headerText="To Improve"
        items={initialRetro.notes.filter((note) => note.categoryId === 1)}
      />
      <AddRetroColumn
        user={user}
        retroSlugResponse={initialRetro}
        columnId={2}
        headerText="Action Items"
        items={initialRetro.notes.filter((note) => note.categoryId === 2)}
      />
      <AddRetroColumn
        user={user}
        retroSlugResponse={initialRetro}
        columnId={3}
        headerText="Summary"
        items={initialRetro.notes.filter((note) => note.categoryId === 3)}
        aiSummary={true}
      />
    </>
  );
}
