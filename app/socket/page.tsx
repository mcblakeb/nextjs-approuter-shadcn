"use client"; // This must be a Client Component

import { useState, useRef, useEffect } from "react";

export default function WebSocketPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  // Clean up WebSocket connection on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const showMessage = (message: string) => {
    setMessages((prev) => [...prev, message]);
  };

  const closeConnection = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const openConnection = () => {
    closeConnection(); // Close any existing connection

    const ws = new WebSocket(
      "ws://express-server-production-a111.up.railway.app"
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

  const sendMessage = () => {
    const val = inputValue.trim();

    if (!val) {
      return;
    } else if (!wsRef.current) {
      showMessage("No WebSocket connection");
      return;
    }

    wsRef.current.send(val);
    showMessage(`Sent "${val}"`);
    setInputValue("");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">WebSocket Test:</h1>
      <div className="flex gap-2 mb-4">
        <button
          onClick={openConnection}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Open Connection
        </button>
        <button
          onClick={closeConnection}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Close Connection
        </button>
      </div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border p-2 flex-grow rounded"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Send message
        </button>
      </div>
      <pre className="bg-gray-100 p-4 rounded min-h-40 max-h-96 overflow-auto">
        {messages.join("\n")}
      </pre>
    </div>
  );
}
