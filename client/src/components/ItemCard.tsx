import { Link } from "wouter";
import { api } from "@shared/routes";
import { z } from "zod";
import { Tag } from "lucide-react";
import { useState } from "react";


type Item = z.infer<typeof api.items.list.responses[200]>[0];

export function ItemCard({ item }: { item: Item }) {

  // ✅ YAHAN PASTE KARNA HAI
  const [showReport, setShowReport] = useState(false);
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
  if (!reason.trim()) {
    alert("Reason is required");
    return;
  }

  await fetch("/api/reports", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reported_item_id: item.id,
      reason,
    }),
  });

  alert("Reported successfully");

  setShowReport(false);
  setReason("");
};

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(item.price);
const getTimeAgo = (date: string) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  const intervals: Record<string, number> = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const key in intervals) {
    const interval = Math.floor(seconds / intervals[key]);
    if (interval >= 1) {
      return `${interval} ${key}${interval > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};
  return (
  <>
    <Link href={`/item/${item.id}`} className="group block h-full">
      <div className="h-full glass-card overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
        <div className="aspect-[4/3] w-full relative overflow-hidden bg-white/40">
          <img 
            src={item.image || "https://images.unsplash.com/photo-1555529771-835f59bfc50c?w=800&q=80"} 
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1555529771-835f59bfc50c?w=800&q=80";
            }}
          />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1.5 shadow-sm">
            <Tag className="w-3 h-3" />
            {item.category}
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-display font-bold text-lg text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="text-foreground/70 text-sm line-clamp-2 mb-4 flex-1">
            {item.description}
          </p>
       <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/20">
  <span className="font-display font-extrabold text-xl text-primary">
    {formattedPrice}
  </span>

  <div className="text-right text-xs text-foreground/70">
    <div className="font-medium">
      {item.seller ? item.seller.name.split(" ")[0] : "Seller"}
    </div>

    {item.seller?.hostel && (
      <div className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-md inline-block">
        Hostel {item.seller.hostel}
      </div>
    )}

    <div className="text-[10px] text-foreground/60 mt-1">
      Added {getTimeAgo(item.createdAt)}
    </div>
  </div>
</div>

{/* ✅ BUTTON YAHAN AAYEGA (clean placement) */}
<button
  onClick={(e) => {
    e.preventDefault();
    setShowReport(true);
  }}
  className="text-red-500 text-xs mt-2"
>
  🚩 Report
</button>

</div>
      </div>
   </Link>

    {showReport && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded-xl w-[300px]">
      <h2 className="text-lg font-semibold mb-2">Report Item</h2>

      <textarea
        placeholder="Explain the issue..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full border p-2 rounded mb-2"
      />

      <p className="text-xs text-gray-500 mb-2">
        Admin may contact you regarding this report.
      </p>

      <div className="flex justify-end gap-2">
        <button onClick={() => setShowReport(false)}>
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}
  
</>
);
}
