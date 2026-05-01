"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Calendar,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Users,
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
}

export default function RsvpPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState<"idle" | "submitting" | "success">(
    "idle"
  );
  const [error, setError] = useState("");
  const [rsvpData, setRsvpData] = useState({
    guestName: "",
    attending: "",
    guestCount: 1,
    message: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    setError("");

    try {
      const res = await fetch(`/api/rsvp/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rsvpData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit RSVP");
        setFormState("idle");
        return;
      }

      setFormState("success");
    } catch {
      setError("Something went wrong. Please try again.");
      setFormState("idle");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center px-4">
          <h1 className="font-heading text-3xl font-bold text-primary mb-4">
            Invitation Not Found
          </h1>
          <p className="text-text-muted">
            This invitation link may have expired or is invalid.
          </p>
        </div>
      </div>
    );
  }

  const eventDate = new Date(order.event_date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isWedding =
    order.event_type === "wedding" || order.event_type === "engagement";

  if (formState === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-dark py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-6">
            <CheckCircle size={40} className="text-accent" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-text-light mb-4">
            Thank You!
          </h2>
          <p className="text-text-muted text-lg">
            Your RSVP has been recorded. We look forward to seeing you!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-dark">
      <div className="max-w-lg mx-auto px-4 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-6">
            <Heart size={28} className="text-accent" />
          </div>
          <p className="text-accent text-sm uppercase tracking-widest mb-3">
            You&apos;re Invited
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-light mb-4">
            {isWedding && order.groom_name && order.bride_name
              ? `${order.groom_name} & ${order.bride_name}`
              : order.customer_name}
          </h1>
          {order.invitation_message && (
            <p className="text-text-muted text-lg italic max-w-sm mx-auto">
              &quot;{order.invitation_message}&quot;
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 sm:p-8 mb-8 space-y-4"
        >
          <div className="flex items-center gap-3 text-text-light">
            <Calendar size={20} className="text-accent" />
            <span>{eventDate}</span>
          </div>
          {order.event_time && (
            <div className="flex items-center gap-3 text-text-light">
              <Clock size={20} className="text-accent" />
              <span>{order.event_time}</span>
            </div>
          )}
          {order.venue && (
            <div className="flex items-center gap-3 text-text-light">
              <MapPin size={20} className="text-accent" />
              <span>{order.venue}</span>
            </div>
          )}
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <h2 className="font-heading text-2xl font-bold text-text-light text-center mb-2">
            RSVP
          </h2>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-light/80 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={rsvpData.guestName}
              onChange={(e) =>
                setRsvpData((prev) => ({ ...prev, guestName: e.target.value }))
              }
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-text-light placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light/80 mb-3">
              Will you attend? *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "yes", label: "Yes!", emoji: "🎉" },
                { value: "maybe", label: "Maybe", emoji: "🤔" },
                { value: "no", label: "No", emoji: "😢" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setRsvpData((prev) => ({
                      ...prev,
                      attending: opt.value,
                    }))
                  }
                  className={`py-3 rounded-xl border text-center transition-all ${
                    rsvpData.attending === opt.value
                      ? "bg-accent border-accent text-white"
                      : "bg-white/5 border-white/20 text-text-light hover:bg-white/10"
                  }`}
                >
                  <span className="text-xl block mb-1">{opt.emoji}</span>
                  <span className="text-sm">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {rsvpData.attending === "yes" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <label className="block text-sm font-medium text-text-light/80 mb-2">
                <Users size={14} className="inline mr-1" />
                Number of Guests
              </label>
              <select
                value={rsvpData.guestCount}
                onChange={(e) =>
                  setRsvpData((prev) => ({
                    ...prev,
                    guestCount: parseInt(e.target.value),
                  }))
                }
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-text-light focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n} className="bg-dark-green text-white">
                    {n} {n === 1 ? "person" : "people"}
                  </option>
                ))}
              </select>
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-light/80 mb-2">
              Leave a Message (optional)
            </label>
            <textarea
              value={rsvpData.message}
              onChange={(e) =>
                setRsvpData((prev) => ({ ...prev, message: e.target.value }))
              }
              rows={3}
              placeholder="Congratulations! Can't wait to celebrate with you..."
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-text-light placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!rsvpData.attending || formState === "submitting"}
            className="w-full py-4 bg-accent text-white font-medium rounded-full text-lg hover:bg-accent-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {formState === "submitting" ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={18} />
                Send RSVP
              </>
            )}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
