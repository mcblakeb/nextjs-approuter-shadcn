import { NewUser } from '@/lib/schema';
import { RetroSlugResponse, UserRetroResponse } from '@/lib/retro';
import Topbar from '@/components/ui/topbar';
import { RetroList } from '@/components/ui/retro-list';
import Columns from './columns';
import { WebSocketWrapper } from '@/components/ui/websocket-wrapper';

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
  return (
    <WebSocketWrapper retroGuid={initialRetro.retro.guid}>
      <div className="flex flex-col h-screen text-gray-900">
        <Topbar />
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/5 bg-gray-100 p-4">
            <RetroList retros={allRetros} slug={initialRetro.retro.slug} />
          </div>
          <Columns initialRetro={initialRetro} user={user} />
        </div>
      </div>
    </WebSocketWrapper>
  );
}
