'use client';

import { useState, useRef, useEffect, createContext, useContext } from 'react';

interface WebSocketContextType {
  sendMessage: (message: string) => void;
  isConnected: boolean;
  addMessageHandler: (handler: (message: any) => void) => void;
  removeMessageHandler: (handler: (message: any) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export default function WebSocketInit({
  retroGuid,
  children,
}: {
  retroGuid: string;
  children: React.ReactNode;
}) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messageHandlersRef = useRef<((message: any) => void)[]>([]);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const sendMessage = (message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    } else {
      console.warn('WebSocket is not connected');
    }
  };

  const addMessageHandler = (handler: (message: any) => void) => {
    messageHandlersRef.current.push(handler);
  };

  const removeMessageHandler = (handler: (message: any) => void) => {
    messageHandlersRef.current = messageHandlersRef.current.filter(
      (h) => h !== handler
    );
  };

  const closeConnection = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setIsConnected(false);
    }
  };

  useEffect(() => {
    openConnection();
  }, [retroGuid]);

  const openConnection = () => {
    closeConnection(); // Close any existing connection

    const ws = new WebSocket(
      `ws://localhost:3333?retroGuid=${encodeURIComponent(retroGuid)}`
    );
    wsRef.current = ws;

    // Make WebSocket instance accessible globally
    (window as any).ws = ws;

    ws.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    });

    ws.addEventListener('open', () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
    });

    ws.addEventListener('close', () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
      // Remove WebSocket instance when connection is closed
      (window as any).ws = null;
    });

    ws.addEventListener('message', (msg: MessageEvent<string>) => {
      console.log('Received message:', msg.data);
      try {
        const parsedMessage = JSON.parse(msg.data);
        // Call all registered message handlers
        messageHandlersRef.current.forEach((handler) => handler(parsedMessage));
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
  };

  return (
    <WebSocketContext.Provider
      value={{
        sendMessage,
        isConnected,
        addMessageHandler,
        removeMessageHandler,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}
