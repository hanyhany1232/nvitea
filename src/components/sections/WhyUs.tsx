"use client";

import { motion } from "framer-motion";
import {
  Palette,
  Smartphone,
  Clock,
  Shield,
  MessageCircle,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Handcrafted Designs",
    description:
      "Each invitation is uniquely designed by our team — not a generic template.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First",
    description:
      "Optimized for WhatsApp sharing. Every invitation looks perfect on any phone.",
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    description:
      "Receive your personalized invitation within 24-48 hours after confirming details.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Pay securely via Stripe or bank transfer. Your data is always protected.",
  },
  {
    icon: MessageCircle,
    title: "Built-in RSVP",
    description:
      "Guests can confirm attendance directly from the invitation link. Track responses easily.",
  },
  {
    icon: Sparkles,
    title: "Custom Requests",
    description:
      "Need something unique? Our design team creates fully custom invitations just for you.",
  },
];

export function WhyUs() {
  return (
    <section className="py-20 sm:py-28 bg-cream-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
            Why Choose Invitea?
          </h2>
          <p className="mt-4 text-text-muted max-w-2xl mx-auto text-lg">
            We craft digital invitations that carry meaning, reflect your
            identity, and leave a lasting impression.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 group border border-accent/5"
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                <feature.icon
                  size={28}
                  className="text-accent group-hover:text-white transition-colors duration-300"
                />
              </div>
              <h3 className="font-heading text-xl font-semibold text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
