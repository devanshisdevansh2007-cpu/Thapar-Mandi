import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
export default function ChatPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
const { user } = useAuth();
  const fetchMessages = async () => {
    const res = await fetch(`/api/chat/${chatId}`);
    const data = await res.json();
    setMessages(data);
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    await fetch("/api/chat/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatId,
        message: text,
      }),
    });

    setText("");
    fetchMessages();
  };

  useEffect(() => {
  fetchMessages();

  // mark messages as read
  fetch(`/api/chat/${chatId}/read`, {
    method: "POST",
  });

  const interval = setInterval(fetchMessages, 2000);

  return () => clearInterval(interval);
}, [chatId]);
useEffect(() => {
  const el = document.getElementById("chat-container");
  if (el) el.scrollTop = el.scrollHeight;
}, [messages]);
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Chat</h2>

    <div
  id="chat-container"
  className="border rounded-lg p-4 h-[400px] overflow-y-auto mb-4 flex flex-col gap-2"
>
  {messages.map((msg) => {
    const isMine = msg.sender_id === user?.id;

    return (
      <div
        key={msg.id}
        className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${
          isMine
            ? "self-end bg-primary text-primary-foreground"
            : "self-start bg-gray-200 dark:bg-gray-700"
        }`}
      >
        {msg.message}
      </div>
    );
  })}
</div>

      <div className="flex gap-2">
        <input
  value={text}
  onChange={(e) => setText(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") sendMessage();
  }}
  className="flex-1 border rounded px-3 py-2"
  placeholder="Type a message..."
/>

        <button
          onClick={sendMessage}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
