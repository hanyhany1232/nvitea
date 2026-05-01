"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle,
  CreditCard,
  Eye,
  Share2,
  Plus,
  ArrowRight,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Order {
  id: string;
  event_type: string;
  event_date: string;
  event_time: string | null;
  venue: string | null;
  groom_name: string | null;
  bride_name: string | null;
  design_preference: string | null;
  amount: number;
  status: string;
  payment_status: string;
  invitation_url: string | null;
  created_at: string;
}

const statusConfig: Record<
  string,
  { icon: React.ComponentType<{ size?: number; className?: string }>; color: string; label: string }
> = {
  pending: { icon: Clock, color: "text-yellow-600 bg-yellow-50", label: "Pending" },
  paid: { icon: CreditCard, color: "text-blue-600 bg-blue-50", label: "Paid" },
  in_progress: { icon: Package, color: "text-purple-600 bg-purple-50", label: "In Progress" },
  completed: { icon: CheckCircle, color: "text-green-600 bg-green-50", label: "Completed" },
  cancelled: { icon: Package, color: "text-red-600 bg-red-50", label: "Cancelled" },
};

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth/login";
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      setUserName(profile?.full_name || user.email || "");

      const { data: userOrders } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setOrders(userOrders || []);
      setLoading(false);
    }
    load();
  }, []);

  const handleShare = (orderId: string) => {
    const url = `${window.location.origin}/rsvp/${orderId}`;
    const text = encodeURIComponent(
      "You're invited! Open your invitation and RSVP here:"
    );
    window.open(`https://wa.me/?text=${text}%20${encodeURIComponent(url)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream pt-20">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-24 min-h-screen bg-cream">
      <section className="gradient-dark py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-light">
                Welcome back, {userName.split(" ")[0]}
              </h1>
              <p className="text-text-muted mt-1">
                {orders.length} order{orders.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Link
              href="/order"
              className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-full hover:bg-accent-dark transition-colors"
            >
              <Plus size={16} />
              New Order
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Package size={56} className="mx-auto text-accent/20 mb-4" />
              <h2 className="font-heading text-xl font-semibold text-primary mb-2">
                No orders yet
              </h2>
              <p className="text-text-muted mb-6">
                Browse our designs and create your first digital invitation
              </p>
              <Link
                href="/designs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-medium rounded-full hover:bg-accent-dark transition-colors"
              >
                Browse Designs
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => {
                const config = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = config.icon;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl border border-accent/10 shadow-sm p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-primary">
                            {order.event_type}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
                          >
                            <StatusIcon size={12} />
                            {config.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
                          <span>{order.event_date}</span>
                          {order.venue && <span>{order.venue}</span>}
                          {order.design_preference && (
                            <span>{order.design_preference}</span>
                          )}
                          <span>SAR {order.amount}</span>
                        </div>
                        {order.groom_name && order.bride_name && (
                          <p className="text-sm text-accent mt-1">
                            {order.groom_name} & {order.bride_name}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {order.status === "completed" && (
                          <>
                            <Link
                              href={`/invitation/${order.id}`}
                              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-accent/10 text-accent rounded-full hover:bg-accent/20 transition-colors"
                            >
                              <Eye size={14} />
                              View
                            </Link>
                            <button
                              onClick={() => handleShare(order.id)}
                              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
                            >
                              <Share2 size={14} />
                              Share
                            </button>
                          </>
                        )}
                        <Link
                          href={`/rsvp/${order.id}`}
                          className="flex items-center gap-1.5 px-4 py-2 text-sm bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <Users size={14} />
                          RSVPs
                        </Link>
                      </div>
                    </div>

                    {order.payment_status === "unpaid" && (
                      <div className="mt-4 pt-4 border-t border-accent/10">
                        <Link
                          href={`/order?pay=${order.id}`}
                          className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-dark transition-colors"
                        >
                          <CreditCard size={14} />
                          Complete Payment — SAR {order.amount}
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
