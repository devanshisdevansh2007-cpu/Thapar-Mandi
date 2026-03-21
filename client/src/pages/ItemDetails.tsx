import { useParams, Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { useItem } from "@/hooks/use-items";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, ShieldCheck, Tag, Loader2, User as UserIcon } from "lucide-react";
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

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(item.price);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto py-6">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-foreground/70 hover:text-primary font-semibold mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl overflow-hidden glass-card aspect-square lg:aspect-[4/5]"
          >
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <h1 className="text-4xl font-bold mb-4">{item.title}</h1>
            <div className="text-3xl font-bold text-primary mb-6">
              {formattedPrice}
            </div>

            <p className="mb-6">{item.description}</p>

            {/* Seller */}
            <div className="mt-auto glass-card p-6 rounded-3xl">
              {isOwner ? (
                <div className="text-center">
                  <h3 className="font-bold mb-2">This is your listing</h3>
                  <Link href="/my-listings">Manage</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="font-bold">Seller: {seller?.name}</p>

                  {/* ✅ ONLY CHAT */}
                  <button
                    onClick={startChat}
                    className="w-full border-2 border-primary text-primary font-bold py-3 rounded-xl"
                  >
                    💬 Message Seller
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
