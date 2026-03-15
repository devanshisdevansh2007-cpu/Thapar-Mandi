import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function MessagesPage() {
  const [chats, setChats] = useState<any[]>([]);
  const [, navigate] = useLocation();

  const fetchChats = async () => {
    const res = await fetch("/api/chat/user/me");
    const data = await res.json();
    setChats(data);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Messages</h2>

      {chats.length === 0 && <p>No chats yet</p>}

      {chats.map((chat) => (
        <div
          key={chat.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/messages/${chat.id}`)}
        >
          Chat #{chat.id}
        </div>
      ))}
    </div>
  );
}
