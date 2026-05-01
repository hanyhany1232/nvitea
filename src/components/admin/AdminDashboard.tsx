"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon,
  Copy,
} from "lucide-react";
import { updateOrderStatus } from "@/lib/actions/orders";
import { signOut } from "@/lib/actions/auth";

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  event_type: string;
  event_date: string;
  event_time: string | null;
  venue: string | null;
  groom_name: string | null;
  bride_name: string | null;
  design_preference: string | null;
  invitation_message: string | null;
  additional_notes: string | null;
  amount: number;
  status: string;
  payment_status: string;
  invitation_url: string | null;
  created_at: string;
}

interface Rsvp {
  id: string;
  order_id: string;
  guest_name: string;
  attending: string;
  guest_count: number;
  message: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const paymentColors: Record<string, string> = {
  unpaid: "bg-red-100 text-red-800",
  paid: "bg-green-100 text-green-800",
  refunded: "bg-gray-100 text-gray-800",
};

export default function AdminDashboard({
  orders: initialOrders,
  rsvps,
}: {
  orders: Order[];
  rsvps: Rsvp[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  const stats = {
    total: orders.length,
    revenue: orders
      .filter((o) => o.payment_status === "paid")
      .reduce((sum, o) => sum + o.amount, 0),
    pending: orders.filter((o) => o.status === "pending").length,
    rsvps: rsvps.filter((r) => r.attending === "yes").length,
  };

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
  };

  const getRsvpsForOrder = (orderId: string) =>
    rsvps.filter((r) => r.order_id === orderId);

  const copyRsvpLink = (orderId: string) => {
    const url = `${window.location.origin}/rsvp/${orderId}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="pt-20 sm:pt-24 min-h-screen bg-cream">
      <section className="gradient-dark py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-heading text-3xl font-bold text-text-light">
              Admin Dashboard
            </h1>
            <form action={signOut}>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-text-muted hover:text-text-light transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              icon={Package}
              label="Total Orders"
              value={stats.total}
            />
            <StatCard
              icon={DollarSign}
              label="Revenue (SAR)"
              value={stats.revenue}
            />
            <StatCard
              icon={Clock}
              label="Pending"
              value={stats.pending}
            />
            <StatCard
              icon={Users}
              label="RSVPs (Yes)"
              value={stats.rsvps}
            />
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {["all", "pending", "paid", "in_progress", "completed", "cancelled"].map(
              (f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === f
                      ? "bg-accent text-white"
                      : "bg-white text-primary border border-accent/20 hover:bg-accent/5"
                  }`}
                >
                  {f === "all" ? "All" : f.replace("_", " ")}
                  {f !== "all" && (
                    <span className="ml-1">
                      ({orders.filter((o) => o.status === f).length})
                    </span>
                  )}
                </button>
              )
            )}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <Package size={48} className="mx-auto text-text-muted/30 mb-4" />
              <p className="text-text-muted">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const orderRsvps = getRsvpsForOrder(order.id);
                const isExpanded = expandedOrder === order.id;

                return (
                  <motion.div
                    key={order.id}
                    layout
                    className="bg-white rounded-2xl border border-accent/10 shadow-sm overflow-hidden"
                  >
                    <div
                      className="p-4 sm:p-6 cursor-pointer flex items-start sm:items-center justify-between gap-4"
                      onClick={() =>
                        setExpandedOrder(isExpanded ? null : order.id)
                      }
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-medium text-primary truncate">
                            {order.customer_name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                          >
                            {order.status}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${paymentColors[order.payment_status]}`}
                          >
                            {order.payment_status}
                          </span>
                        </div>
                        <p className="text-sm text-text-muted">
                          {order.event_type} · {order.event_date} · SAR{" "}
                          {order.amount}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {orderRsvps.length > 0 && (
                          <span className="text-xs text-accent font-medium">
                            {orderRsvps.length} RSVPs
                          </span>
                        )}
                        {isExpanded ? (
                          <ChevronUp size={18} className="text-text-muted" />
                        ) : (
                          <ChevronDown size={18} className="text-text-muted" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-t border-accent/10 p-4 sm:p-6 space-y-6"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-text-muted">Email</p>
                            <p className="text-primary">{order.customer_email}</p>
                          </div>
                          <div>
                            <p className="text-text-muted">Phone</p>
                            <p className="text-primary">{order.customer_phone}</p>
                          </div>
                          {order.venue && (
                            <div>
                              <p className="text-text-muted">Venue</p>
                              <p className="text-primary">{order.venue}</p>
                            </div>
                          )}
                          {order.event_time && (
                            <div>
                              <p className="text-text-muted">Time</p>
                              <p className="text-primary">{order.event_time}</p>
                            </div>
                          )}
                          {order.groom_name && (
                            <div>
                              <p className="text-text-muted">Groom</p>
                              <p className="text-primary">{order.groom_name}</p>
                            </div>
                          )}
                          {order.bride_name && (
                            <div>
                              <p className="text-text-muted">Bride</p>
                              <p className="text-primary">{order.bride_name}</p>
                            </div>
                          )}
                          {order.design_preference && (
                            <div>
                              <p className="text-text-muted">Design Pref.</p>
                              <p className="text-primary">
                                {order.design_preference}
                              </p>
                            </div>
                          )}
                          {order.invitation_message && (
                            <div className="sm:col-span-2">
                              <p className="text-text-muted">Message</p>
                              <p className="text-primary italic">
                                &quot;{order.invitation_message}&quot;
                              </p>
                            </div>
                          )}
                          {order.additional_notes && (
                            <div className="sm:col-span-2">
                              <p className="text-text-muted">Notes</p>
                              <p className="text-primary">{order.additional_notes}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <p className="w-full text-sm font-medium text-primary mb-1">
                            Update Status:
                          </p>
                          {["pending", "paid", "in_progress", "completed", "cancelled"].map(
                            (s) => (
                              <button
                                key={s}
                                onClick={() => handleStatusUpdate(order.id, s)}
                                disabled={order.status === s}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                  order.status === s
                                    ? "bg-accent text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                              >
                                {s.replace("_", " ")}
                              </button>
                            )
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => copyRsvpLink(order.id)}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm bg-accent/10 text-accent rounded-full hover:bg-accent/20 transition-colors"
                          >
                            <Copy size={14} />
                            Copy RSVP Link
                          </button>
                          <a
                            href={`/rsvp/${order.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2 text-sm bg-accent/10 text-accent rounded-full hover:bg-accent/20 transition-colors"
                          >
                            <Eye size={14} />
                            Preview RSVP Page
                          </a>
                          <a
                            href={`https://wa.me/${order.customer_phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-4 py-2 text-sm bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
                          >
                            <LinkIcon size={14} />
                            WhatsApp
                          </a>
                        </div>

                        {orderRsvps.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-primary mb-3">
                              RSVP Responses ({orderRsvps.length})
                            </h4>
                            <div className="space-y-2">
                              {orderRsvps.map((rsvp) => (
                                <div
                                  key={rsvp.id}
                                  className="flex items-start justify-between p-3 rounded-xl bg-cream text-sm"
                                >
                                  <div>
                                    <p className="font-medium text-primary">
                                      {rsvp.guest_name}
                                    </p>
                                    {rsvp.message && (
                                      <p className="text-text-muted text-xs mt-1">
                                        &quot;{rsvp.message}&quot;
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-text-muted">
                                      {rsvp.guest_count} guest(s)
                                    </span>
                                    {rsvp.attending === "yes" ? (
                                      <CheckCircle
                                        size={16}
                                        className="text-green-600"
                                      />
                                    ) : rsvp.attending === "no" ? (
                                      <XCircle
                                        size={16}
                                        className="text-red-500"
                                      />
                                    ) : (
                                      <Clock
                                        size={16}
                                        className="text-yellow-500"
                                      />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
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

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="glass rounded-xl p-4 sm:p-6">
      <Icon size={24} className="text-accent mb-2" />
      <p className="text-2xl sm:text-3xl font-bold text-text-light">{value}</p>
      <p className="text-sm text-text-muted">{label}</p>
    </div>
  );
}
