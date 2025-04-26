"use client";

import { useState, useRef, useEffect } from "react";

export default function WebSocketInit(params: { slug: string }) {
  const [_, setMessages] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const showMessage = (message: string) => {
    setMessages((prev) => {
      const newMessages = [...prev, message];
      console.log(newMessages);
      return newMessages;
    });
  };

  const closeConnection = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  useEffect(() => {
    openConnection();
  }, []);

  const openConnection = () => {
    closeConnection(); // Close any existing connection

    const ws = new WebSocket(
      `ws://localhost:3333?retroSlug=${encodeURIComponent(params.slug)}`
    );
    wsRef.current = ws;

    ws.addEventListener("error", () => {
      showMessage("WebSocket error");
    });

    ws.addEventListener("open", () => {
      showMessage("WebSocket connection established");
    });

    ws.addEventListener("close", () => {
      showMessage("WebSocket connection closed");
    });

    ws.addEventListener("message", (msg: MessageEvent<string>) => {
      showMessage(`Received message: ${msg.data}`);
    });
  };

  return <></>;
}
