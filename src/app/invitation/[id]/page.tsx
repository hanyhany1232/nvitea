"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  Calendar,
  MapPin,
  Clock,
  Share2,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface OrderData {
  id: string;
  customer_name: string;
  event_type: string;
  event_date: string;
  event_time: string | null;
  venue: string | null;
  groom_name: string | null;
  bride_name: string | null;
  invitation_message: string | null;
  invitation_url: string | null;
}

const eventEmojis: Record<string, string> = {
  Wedding: "💍",
  Engagement: "💎",
  Birthday: "🎂",
  Graduation: "🎓",
  "Baby Shower": "👶",
  Corporate: "🏢",
  Private: "✨",
};

export default function InvitationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/rsvp/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order as OrderData);
        }
      } catch {
        // Order not found
      }
      setLoading(false);
    }
    loadOrder();
  }, [id]);

  const handleShare = () => {
    const url = `${window.location.origin}/invitation/${id}`;
    const text = encodeURIComponent(
      "You're invited! Open your invitation here:"
    );
    window.open(
      `https://wa.me/?text=${text}%20${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const handleShareRsvp = () => {
    const url = `${window.location.origin}/rsvp/${id}`;
    const text = encodeURIComponent(
      "You're invited! View the invitation and RSVP:"
    );
    window.open(
      `https://wa.me/?text=${text}%20${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-dark">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gradient-dark px-4">
        <Sparkles size={48} className="text-accent/30 mb-4" />
        <h1 className="font-heading text-2xl text-text-light mb-2">
          Invitation Not Found
        </h1>
        <p className="text-text-muted mb-6">
          This invitation may have been removed or the link is incorrect.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-accent text-white rounded-full hover:bg-accent-dark transition-colors"
        >
          Go Home
        </Link>
      </div>
    );
  }

  const emoji = eventEmojis[order.event_type] || "✨";
  const formattedDate = new Date(order.event_date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen gradient-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <div className="glass rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <span className="text-5xl mb-4 block">{emoji}</span>
            <p className="text-accent text-sm font-medium uppercase tracking-widest mb-2">
              You&apos;re Invited
            </p>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-light mb-2">
              {order.event_type}
            </h1>

            {order.groom_name && order.bride_name && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="my-6"
              >
                <p className="font-heading text-2xl sm:text-3xl text-accent">
                  {order.groom_name}
                </p>
                <Heart
                  size={24}
                  className="text-accent mx-auto my-2 fill-accent/30"
                />
                <p className="font-heading text-2xl sm:text-3xl text-accent">
                  {order.bride_name}
                </p>
              </motion.div>
            )}

            {!order.groom_name && (
              <p className="text-lg text-text-muted mt-2 mb-4">
                Hosted by {order.customer_name}
              </p>
            )}
          </motion.div>

          {order.invitation_message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="my-6 py-4 border-y border-accent/20"
            >
              <p className="text-text-muted italic leading-relaxed">
                &quot;{order.invitation_message}&quot;
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3 my-8"
          >
            <div className="flex items-center justify-center gap-3 text-text-muted">
              <Calendar size={18} className="text-accent" />
              <span>{formattedDate}</span>
            </div>
            {order.event_time && (
              <div className="flex items-center justify-center gap-3 text-text-muted">
                <Clock size={18} className="text-accent" />
                <span>{order.event_time}</span>
              </div>
            )}
            {order.venue && (
              <div className="flex items-center justify-center gap-3 text-text-muted">
                <MapPin size={18} className="text-accent" />
                <span>{order.venue}</span>
              </div>
            )}
          </motion.div>

          {order.invitation_url && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-6"
            >
              <a
                href={order.invitation_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent/10 text-accent rounded-full hover:bg-accent/20 transition-colors"
              >
                <ExternalLink size={16} />
                View Full Invitation
              </a>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            <Link
              href={`/rsvp/${id}`}
              className="block w-full py-3.5 bg-accent text-white font-medium rounded-full hover:bg-accent-dark transition-colors"
            >
              RSVP Now
            </Link>

            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600/10 text-green-400 rounded-full hover:bg-green-600/20 transition-colors text-sm"
              >
                <Share2 size={14} />
                Share Invitation
              </button>
              <button
                onClick={handleShareRsvp}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent/10 text-accent rounded-full hover:bg-accent/20 transition-colors text-sm"
              >
                <Share2 size={14} />
                Share with RSVP
              </button>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xs text-text-muted/50 mt-6"
          >
            Powered by Invitea
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
