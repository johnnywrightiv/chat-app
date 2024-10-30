// src/app/components/Chat.tsx
"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

if (!process.env.NEXT_PUBLIC_SOCKET_URL) {
  throw new Error("NEXT_PUBLIC_SOCKET_URL is not defined");
}

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    socket.on("connect", () => {
      setConnected(true);
      setError(null);
      console.log("Connected to server");
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
      setError("Failed to connect to chat server");
      setConnected(false);
    });

    socket.on("message", (message: string) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("message");
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("message", message);
      setMessage("");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="bg-white shadow rounded-lg p-4">
        {error ? (
          <div className="text-red-500 mb-2">{error}</div>
        ) : connected ? (
          <div className="text-green-500 mb-2">Connected to chat server</div>
        ) : (
          <div className="text-yellow-500 mb-2">Connecting to chat server...</div>
        )}
        <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded">
          {messages.map((msg, i) => (
            <div key={i} className="mb-2 p-2 bg-blue-100 rounded">
              {msg}
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border rounded p-2"
            placeholder="Type a message..."
            disabled={!connected}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={!connected}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
