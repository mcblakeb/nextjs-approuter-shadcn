'use client';

import WebSocketInit from './websocket-init';
import { WebSocketClient } from './websocket-client';

export function WebSocketWrapper({
  retroGuid,
  children,
}: {
  retroGuid: string;
  children: React.ReactNode;
}) {
  return (
    <WebSocketInit retroGuid={retroGuid}>
      <WebSocketClient>{children}</WebSocketClient>
    </WebSocketInit>
  );
}
