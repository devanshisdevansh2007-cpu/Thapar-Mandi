import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function AdminPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/items")
      .then(res => res.json())
      .then(setItems);

    fetch("/api/admin/users")
      .then(res => res.json())
      .then(setUsers);
  }, []);

  if (user?.role !== "admin") {
    return <div>Not allowed</div>;
  }

  const deleteItem = async (id: number) => {
    await fetch(`/api/admin/item/${id}`, { method: "DELETE" });
    setItems(items.filter(i => i.id !== id));
  };

  const blockUser = async (id: number) => {
    await fetch(`/api/admin/block-user/${id}`, { method: "POST" });
    alert("User blocked");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* ITEMS */}
      <h2 className="text-xl font-bold mb-2">Items</h2>
      {items.map(item => (
        <div key={item.id} className="border p-3 mb-2 rounded">
          <p>{item.title}</p>
          <p>Seller: {item.seller?.name}</p>

          <button onClick={() => deleteItem(item.id)}>🗑 Delete</button>
          <button onClick={() => blockUser(item.sellerId)}>🚫 Block Seller</button>
        </div>
      ))}

      {/* USERS */}
      <h2 className="text-xl font-bold mt-6 mb-2">Users</h2>
      {users.map(u => (
        <div key={u.id} className="border p-3 mb-2 rounded">
          <p>{u.name}</p>
          <button onClick={() => blockUser(u.id)}>🚫 Block</button>
        </div>
      ))}
    </div>
  );
}
