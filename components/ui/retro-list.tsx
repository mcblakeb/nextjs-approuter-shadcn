'use client';

import { Button } from '@/components/ui/button';
import CreateModal from '@/components/ui/create-modal';
import { UserRetroResponse } from '@/lib/retro';
import Link from 'next/link';

interface RetroListProps {
  retros: UserRetroResponse;
  slug: string; // Current active retro slug
}

export function RetroList({ retros, slug }: RetroListProps) {
  // sort retros by createdAt date
  retros = retros.sort((a, b) => {
    return (
      new Date(b.retro.createdAt || new Date()).getTime() -
      new Date(a.retro.createdAt || new Date()).getTime()
    );
  });

  return (
    <div className="w-full h-full flex flex-col">
      {/* Retro list header */}
      <h2 className="font-semibold mb-20 md:mb-4 text-lg px-2">My Retros</h2>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {retros.map((retroItem) => (
            <li key={retroItem.retro.slug}>
              {retroItem.retro.slug === slug ? (
                // Current active retro (not a link)
                <div className="flex w-full justify-start bg-blue-100 py-2 px-3 rounded-md text-left">
                  <span className="whitespace-normal break-words font-medium text-blue-800">
                    {retroItem.retro.name}
                  </span>
                </div>
              ) : (
                // Other retros (links)
                <Link
                  href={`/retro/${retroItem.retro.slug}`}
                  className="flex w-full justify-start hover:bg-gray-200 cursor-pointer py-2 px-3 rounded-md text-left transition-colors"
                >
                  <span className="whitespace-normal break-words">
                    {retroItem.retro.name}
                  </span>
                </Link>
              )}
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
