"use client";

import { useState } from "react";
import { NewUser } from "@/lib/schema";
import { RetroSlugResponse, UserRetroResponse } from "@/lib/retro";
import Topbar from "@/components/ui/topbar";
import { RetroList } from "@/components/ui/retro-list";
import { AddRetroColumn } from "@/components/ui/retro-column";
import WebSocketInit from "@/components/ui/websocket-init";

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

  return (
    <>
      <WebSocketInit slug={slug} />
      <div className="flex flex-col h-screen text-gray-900">
        <Topbar />
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/5 bg-gray-100 p-4">
            <RetroList retros={allRetros} slug={currentRetro.retro.slug} />
          </div>

          <AddRetroColumn
            user={user}
            retroSlugResponse={currentRetro}
            columnId={0}
            headerText="The Good"
            items={currentRetro.notes.filter((note) => note.categoryId === 0)}
          />
          <AddRetroColumn
            user={user}
            retroSlugResponse={currentRetro}
            columnId={1}
            headerText="To Improve"
            items={currentRetro.notes.filter((note) => note.categoryId === 1)}
          />
          <AddRetroColumn
            user={user}
            retroSlugResponse={currentRetro}
            columnId={2}
            headerText="Action Items"
            items={currentRetro.notes.filter((note) => note.categoryId === 2)}
          />
          <AddRetroColumn
            user={user}
            retroSlugResponse={currentRetro}
            columnId={3}
            headerText="Summary"
            items={currentRetro.notes.filter((note) => note.categoryId === 3)}
            aiSummary={true}
          />
        </div>
      </div>
    </>
  );
}
