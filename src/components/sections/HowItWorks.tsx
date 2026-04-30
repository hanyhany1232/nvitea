"use client";

import { motion } from "framer-motion";
import { Search, FileText, CreditCard, Share2 } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & Choose",
    description:
      "Explore our collection of elegant invitation designs. Pick the one that matches your event and style.",
  },
  {
    icon: FileText,
    title: "Submit Details",
    description:
      "Fill in your event details — names, date, time, venue, and any special message you want to include.",
  },
  {
    icon: CreditCard,
    title: "Pay & Confirm",
    description:
      "Complete your payment securely via Stripe or bank transfer. We start crafting your invitation immediately.",
  },
  {
    icon: Share2,
    title: "Receive & Share",
    description:
      "Get your personalized digital invitation link. Share it on WhatsApp and let guests RSVP online.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
            How It Works
          </h2>
          <p className="mt-4 text-text-muted max-w-2xl mx-auto text-lg">
            From choosing a design to sharing with your guests — it&apos;s simple, fast,
            and elegant.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center group"
            >
              <div className="w-20 h-20 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors duration-300">
                <step.icon size={32} className="text-accent" />
              </div>

              <div className="absolute top-10 left-[calc(50%+40px)] right-0 h-px bg-accent/20 hidden lg:block last:hidden" />

              <span className="inline-block w-8 h-8 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center mx-auto mb-4">
                {index + 1}
              </span>

              <h3 className="font-heading text-xl font-semibold text-primary mb-3">
                {step.title}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
