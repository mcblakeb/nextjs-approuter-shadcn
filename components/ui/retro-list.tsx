"use client";

import { Button } from "@/components/ui/button";
import CreateModal from "@/components/ui/create-modal";
import { UserRetroResponse } from "@/lib/retro";

interface RetroListProps {
  retros: UserRetroResponse;
}

export function RetroList({ retros }: RetroListProps) {
  const handleRetroClick = (slug: string) => {
    console.log(`Opening retro: ${slug}`);
    // router.push(`/retro/${slug}`);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Retro list header */}
      <h2 className="font-semibold mb-4 text-lg px-2">My Retros</h2>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {retros.map((retroItem) => (
            <li key={retroItem.retro.slug}>
              <Button
                variant="ghost"
                onClick={() => handleRetroClick(retroItem.retro.slug)}
                className="w-full justify-start hover:bg-gray-200 cursor-pointer"
              >
                {retroItem.retro.name}
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* Create button */}
      <div className="pt-4 border-t border-gray-200">
        <CreateModal />
      </div>
    </div>
  );
}
