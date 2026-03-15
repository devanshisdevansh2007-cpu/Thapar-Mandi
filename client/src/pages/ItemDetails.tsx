import { useParams, Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { useItem } from "@/hooks/use-items";
import { useAuth } from "@/hooks/use-auth";
import { Phone, Copy, Check, ArrowLeft, ShieldCheck, Tag, Loader2, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
export function ItemDetails() {
  const params = useParams();
  const itemId = parseInt(params.id || "0");
  const { data: item, isLoading } = useItem(itemId);
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [showPhone, setShowPhone] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!item) {
    return (
      <AppLayout>
        <div className="text-center py-24 glass-card rounded-3xl max-w-2xl mx-auto mt-12">
          <h2 className="text-3xl font-display font-bold mb-4">Item not found</h2>
          <Link href="/marketplace" className="text-primary font-bold hover:underline">
            ← Back to Marketplace
          </Link>
        </div>
      </AppLayout>
    );
  }

  const isOwner = user?.id === item.sellerId;
  const seller = item.seller ?? null;

  const handleCopyPhone = () => {
    if (!seller) return;
    navigator.clipboard.writeText(seller.phoneNumber);
    setCopied(true);
    toast({ title: "Phone number copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };
const startChat = async () => {
  try {
    const res = await fetch("/api/chat/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itemId: item.id,
        sellerId: item.sellerId,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to create chat");
    }

    const chat = await res.json();
    navigate(`/messages/${chat.id}`);
  } catch (err) {
    console.error("Failed to start chat", err);
    toast({
      title: "Failed to start chat",
      variant: "destructive",
    });
  }
};

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(item.price);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto py-6">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-foreground/70 hover:text-primary font-semibold mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl overflow-hidden glass-card aspect-square lg:aspect-[4/5] bg-white/40 shadow-xl"
          >
            <img 
              src={item.image || "https://images.unsplash.com/photo-1555529771-835f59bfc50c?w=1000&q=80"} 
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1555529771-835f59bfc50c?w=1000&q=80";
              }}
            />
          </motion.div>

          {/* Details Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/50 text-primary font-bold text-sm shadow-sm border border-white/50">
                <Tag className="w-4 h-4" />
                {item.category}
              </span>
              <span className="text-sm font-medium text-foreground/60">
                Listed {new Date(item.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-foreground mb-4 leading-tight">
              {item.title}
            </h1>
            
            <div className="text-4xl font-display font-black text-primary mb-8">
              {formattedPrice}
            </div>

            <div className="glass-card p-6 rounded-2xl mb-8 space-y-4 shadow-sm border border-white/30">
              <h3 className="font-bold text-lg border-b border-white/20 pb-3">Description</h3>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap font-medium">
                {item.description}
              </p>
            </div>

            {/* Seller Info & Action */}
            <div className="mt-auto glass-card p-6 md:p-8 rounded-3xl shadow-xl">
              {isOwner ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-2">
                    <UserIcon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">This is your listing</h3>
                  <Link href="/my-listings" className="inline-block bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all">
                    Manage Listing
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-card rounded-full flex items-center justify-center shadow-sm border border-black/10">
                      <UserIcon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-foreground/60 uppercase tracking-wider mb-0.5">Seller</p>
                      <p className="text-lg font-bold text-foreground">{seller?.name}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary text-xs font-bold bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                      <ShieldCheck className="w-4 h-4" />
                      Verified
                    </div>
                  </div>

                  {showPhone ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-3 pt-2"
                    >
                      <div className="flex items-center justify-between bg-white/50 border-2 border-primary/30 p-4 rounded-xl shadow-sm">
                        <span className="text-2xl font-display font-bold tracking-wider text-foreground font-mono">
                          {seller?.phoneNumber}
                        </span>
                        <button 
                          onClick={handleCopyPhone}
                          data-testid="button-copy-phone"
                          className="p-3 bg-primary text-primary-foreground hover:shadow-lg text-primary-foreground rounded-xl shadow-sm transition-all hover:-translate-y-0.5"
                          title="Copy Number"
                        >
                          {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                        </button>
                      </div>
                      <p className="text-sm text-center font-medium text-foreground/70">
                        Please mention you found this on Thapar Mandi when calling.
                      </p>
                    </motion.div>
                  ) : (
  <>
    <button 
      onClick={() => setShowPhone(true)}
      data-testid="button-contact-seller"
      className="w-full bg-primary text-primary-foreground font-bold text-base py-4 px-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all flex justify-center items-center gap-3"
    >
      <Phone className="w-5 h-5" />
      Contact Seller
    </button>

    <button
      onClick={startChat}
      className="w-full border-2 border-primary text-primary font-bold text-base py-4 px-4 rounded-xl hover:bg-primary/10 transition-all flex justify-center items-center gap-3"
    >
      💬 Message Seller
    </button>
  </>
)}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
