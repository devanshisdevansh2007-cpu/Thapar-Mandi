import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Store, PlusCircle, Package, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import CursorFollower from "@/components/CursorFollower";
export function Dashboard() {
  const { user, isLoading } = useAuth();
 const [, setLocation] = useLocation();
  const cardRef = useRef<HTMLDivElement>(null);

const [pos, setPos] = useState({
  x: 0,
  y: 0,
});
  const [smoothPos, setSmoothPos] = useState({
  x: 0,
  y: 0,
});

  // 🔥 IMPORTANT: useEffect redirect (not inline)
  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading]);

  useEffect(() => {
  const lerp = (start: number, end: number, t: number) =>
    start + (end - start) * t;

  const animate = () => {
    setSmoothPos((prev) => ({
      x: lerp(prev.x, pos.x, 0.07),
y: lerp(prev.y, pos.y, 0.07),
    }));

    requestAnimationFrame(animate);
  };

  animate();
}, [pos]);

  if (isLoading || !user) return null;

const [hostel, setHostel] = useState(user?.hostel || "");
  const updateHostel = async () => {
  await fetch("/api/user/hostel", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ hostel }),
  });

 window.location.reload();
};
  const handleMouseMove = (e: React.MouseEvent) => {
  const rect = cardRef.current?.getBoundingClientRect();
  if (!rect) return;

  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;

  setPos({
    x: x / 20,
    y: y / 20,
  });
};

const handleMouseLeave = () => {
  setPos({ x: 0, y: 0 });
};

  
  const actions = [
    {
      title: "Browse Marketplace",
      description: "Find books, cycles, and more",
      icon: Store,
      href: "/marketplace",
      color: "bg-white/40 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-900 dark:border dark:border-zinc-700",
      textColor: "text-primary dark:text-orange-400"
    },
    {
      title: "Sell an Item",
      description: "List something you want to sell",
      icon: PlusCircle,
      href: "/sell",
      color: "bg-primary",
      textColor: "text-primary-foreground"
    },
    {
      title: "My Listings",
      description: "Manage your active items",
      icon: Package,
      href: "/my-listings",
      color: "bg-card border border-white/40",
      textColor: "text-foreground"
    }
  ];

  return (
    <AppLayout>

      <CursorFollower />   {/* ✅ YE LINE ADD KAR */}
      
      <div className="max-w-4xl mx-auto space-y-12 py-8">
       <motion.div 
  ref={cardRef}
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
        style={{
 transform: `translate(${smoothPos.x * 2.5}px, ${smoothPos.y * 2.5}px) scale(1.04)`
}}
 className="glass-card p-8 md:p-12 rounded-3xl relative overflow-hidden transition-transform duration-200 ease-out"
>
          <div
  className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"
 style={{
  transform: `translate(${smoothPos.x * 2.5}px, ${smoothPos.y * 2.5}px)`
}}
/>
          
          <h1
  className="text-3xl md:text-5xl font-display font-extrabold text-foreground mb-4 transition-transform duration-200"
  style={{
    transform: `translate(${smoothPos.x * 1.5}px, ${smoothPos.y * 1.5}px)`
  }}
>
            Welcome back, <span className="text-primary">{user.name ? user.name.split(' ')[0] : ""}</span>! 👋
          </h1>
          <p className="text-lg text-foreground/80 font-medium max-w-xl">
            What would you like to do today? You can browse items posted by other students or list your own.
          </p>
        </motion.div>
<div className="glass-card p-6 rounded-2xl">
  <label className="text-sm font-bold text-foreground block mb-2">
    Update Your Hostel
  </label>

  <div className="flex gap-3">
    <select
      value={hostel}
      onChange={(e) => setHostel(e.target.value)}
      className="glass-input px-4 py-2 rounded-xl outline-none flex-1"
    >
      <option value="">Select Hostel</option>
      <option value="M">M</option>
      <option value="J">J</option>
      <option value="H">H</option>
      <option value="K">K</option>
      <option value="A">A</option>
      <option value="B">B</option>
      <option value="C">C</option>
      <option value="D">D</option>
      <option value="O">O</option>
      <option value="Q">Q</option>
      <option value="G">G</option>
      <option value="I">I</option>
      <option value="E">E</option>
      <option value="N">N</option>
      <option value="FRG">FRG</option>
      <option value="FRF">FRF</option>
    </select>

    <button
      onClick={updateHostel}
      className="bg-primary text-primary-foreground px-4 py-2 rounded-xl"
    >
      Update
    </button>
  </div>
</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {actions.map((action, i) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={action.href} className="block h-full">
             <div className={`h-full p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-zinc-800/50 shadow-lg ${action.color} group relative overflow-hidden`}>
                  <action.icon className={`w-10 h-10 mb-6 ${action.textColor}`} />
                  <h3 className={`text-xl font-bold font-display mb-2 ${action.textColor}`}>
                    {action.title}
                  </h3>
                  <p className={`font-medium text-gray-700 dark:text-gray-300`}>
                    {action.description}
                  </p>
                  <ArrowRight className={`absolute bottom-8 right-8 w-6 h-6 ${action.textColor} opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300`} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
  
