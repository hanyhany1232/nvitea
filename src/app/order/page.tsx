"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { categories, getDesignById } from "@/lib/data";
import Link from "next/link";
import {
  Send,
  CheckCircle,
  User,
  Calendar,
  MapPin,
  MessageSquare,
  Palette,
} from "lucide-react";

function OrderForm() {
  const searchParams = useSearchParams();
  const designId = searchParams.get("design");
  const selectedDesign = designId ? getDesignById(designId) : null;

  const [formState, setFormState] = useState<"idle" | "submitting" | "success">(
    "idle"
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: selectedDesign?.category || "",
    eventDate: "",
    eventTime: "",
    venue: "",
    groomName: "",
    brideName: "",
    message: "",
    designPreference: selectedDesign?.name || "",
    additionalNotes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setFormState("success");
  };

  if (formState === "success") {
    return (
      <div className="pt-20 sm:pt-24">
        <section className="min-h-[70vh] flex items-center justify-center bg-cream py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto px-4"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-primary mb-4">
              Order Submitted!
            </h2>
            <p className="text-text-muted text-lg">
              Thank you for your order! We&apos;ll review your details and get
              back to you within 24 hours via WhatsApp or email with a preview
              of your invitation.
            </p>
            <Link
              href="/"
              className="inline-block mt-8 px-8 py-3 bg-accent text-white rounded-full hover:bg-accent-dark transition-colors"
            >
              Back to Home
            </Link>
          </motion.div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-24">
      <section className="gradient-dark py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-3xl sm:text-4xl font-bold text-text-light"
          >
            {selectedDesign
              ? `Order "${selectedDesign.name}" Design`
              : "Order Your Invitation"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-text-muted text-lg"
          >
            Fill in your event details and we&apos;ll create a stunning digital
            invitation for you.
          </motion.p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-cream">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <FormSection title="Your Information" icon={User}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
              </div>
              <FormField
                label="Phone / WhatsApp"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+966 5X XXX XXXX"
              />
            </FormSection>

            <FormSection title="Event Details" icon={Calendar}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Event Type *
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white border border-accent/10 text-primary focus:outline-none focus:ring-2 focus:ring-accent/30"
                  >
                    <option value="">Select event type</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <FormField
                  label="Event Date"
                  name="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Event Time"
                  name="eventTime"
                  type="time"
                  value={formData.eventTime}
                  onChange={handleChange}
                />
                <FormField
                  label="Venue / Location"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="Event location"
                  icon={MapPin}
                />
              </div>
            </FormSection>

            <FormSection title="Names (for Wedding/Engagement)" icon={MessageSquare}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Groom's Name"
                  name="groomName"
                  value={formData.groomName}
                  onChange={handleChange}
                  placeholder="Groom's full name"
                />
                <FormField
                  label="Bride's Name"
                  name="brideName"
                  value={formData.brideName}
                  onChange={handleChange}
                  placeholder="Bride's full name"
                />
              </div>
            </FormSection>

            <FormSection title="Design & Message" icon={Palette}>
              <FormField
                label="Design Preference"
                name="designPreference"
                value={formData.designPreference}
                onChange={handleChange}
                placeholder="e.g., Royal Gold, Blush Floral, or describe your preference"
              />
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Invitation Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="The message you want on the invitation..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-accent/10 text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any special requests, color preferences, or additional details..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-accent/10 text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
                />
              </div>
            </FormSection>

            <button
              type="submit"
              disabled={formState === "submitting"}
              className="w-full py-4 bg-accent text-white font-medium rounded-full text-lg hover:bg-accent-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
            >
              {formState === "submitting" ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Submit Order
                </>
              )}
            </button>

            <p className="text-center text-sm text-text-muted">
              After submitting, we&apos;ll contact you via WhatsApp within 24
              hours with a preview and payment details.
            </p>
          </motion.form>
        </div>
      </section>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-20 sm:pt-24 min-h-screen flex items-center justify-center bg-cream">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      }
    >
      <OrderForm />
    </Suspense>
  );
}

function FormSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-accent/5 shadow-sm space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Icon size={20} className="text-accent" />
        </div>
        <h3 className="font-heading text-xl font-semibold text-primary">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  placeholder,
  icon: Icon,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-primary mb-2">
        {label} {required && "*"}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
          />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={`w-full ${Icon ? "pl-11" : "px-4"} pr-4 py-3 rounded-xl bg-white border border-accent/10 text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all`}
        />
      </div>
    </div>
  );
}
