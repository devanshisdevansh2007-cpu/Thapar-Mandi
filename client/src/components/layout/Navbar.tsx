import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Store, PlusCircle, LogOut, Package, Menu, X, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Logged out successfully" });
    } catch (e) {
      toast({ title: "Logout failed", variant: "destructive" });
    }
  };
useEffect(() => {
  const fetchUnread = async () => {
    try {
      const res = await fetch("/api/chat/user/me");
      const data = await res.json();

      const total = data.reduce(
        (sum: number, chat: any) => sum + (chat.unread_count || 0),
        0
      );

      setUnreadTotal(total);
    } catch (err) {
      console.error("Unread fetch error", err);
    }
  };

  fetchUnread();

  const interval = setInterval(fetchUnread, 5000);
  return () => clearInterval(interval);
}, []);
 const navItems = [
  { label: "Marketplace", href: "/marketplace", icon: Store },
  { label: "Sell Item", href: "/sell", icon: PlusCircle },
  { label: "My Listings", href: "/my-listings", icon: Package },
  { label: "Messages", href: "/messages", icon: MessageCircle },
];

  return (
    <nav className="sticky top-0 z-50 w-full glass-card border-b-0 rounded-none shadow-sm px-4 md:px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl group-hover:scale-105 transition-transform">
            <Store className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl md:text-2xl text-foreground tracking-tight">
            Thapar Mandi
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              {navItems.map((item) => {
                const isActive = location === item.href;
                return (
                 <Link
  key={item.href}
  href={item.href}
  className={`relative flex items-center gap-2 text-sm font-semibold transition-colors hover:text-primary ${
    isActive ? "text-primary" : "text-foreground/80"
  }`}
>
  <item.icon className="w-4 h-4" />
  {item.label}

  {item.label === "Messages" && unreadTotal > 0 && (
    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
      {unreadTotal > 9 ? "9+" : unreadTotal}
    </span>
  )}
</Link>
                );
              })}
              <div className="h-6 w-px bg-white/30 mx-2" />
              <div className="flex items-center gap-3 bg-white/20 px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-foreground">
                  {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-foreground/70 hover:text-destructive transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 active:translate-y-0 transition-all"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-card rounded-b-2xl border-t border-white/20 p-4 flex flex-col gap-4 shadow-xl">
          {user ? (
            <>
              <div className="pb-3 border-b border-white/20 px-2 text-sm font-medium">
                Signed in as {user.name}
              </div>
              {navItems.map((item) => (
                <Link
  key={item.href}
  href={item.href}
  className="relative flex items-center gap-3 px-2 py-2 text-foreground/80 font-medium hover:text-primary"
  onClick={() => setIsMobileMenuOpen(false)}
>
  <item.icon className="w-5 h-5" />
  {item.label}

  {item.label === "Messages" && unreadTotal > 0 && (
    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
      {unreadTotal > 9 ? "9+" : unreadTotal}
    </span>
  )}
</Link>
              ))}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-2 py-2 text-destructive font-medium"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                className="w-full text-center py-3 rounded-xl bg-white/40 font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="w-full text-center py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
