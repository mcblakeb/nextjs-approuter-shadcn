'use client';

import { useWebSocket } from './websocket-init';

export function WebSocketClient({ children }: { children: React.ReactNode }) {
  const { isConnected } = useWebSocket();

  return (
    <div>
      {children}
      <div className="text-xs text-gray-500">
        Status: {isConnected ? 'Connected' : 'Disconnected'}
      </div>
    </div>
  );
}
