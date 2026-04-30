"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "500+", label: "Invitations Delivered" },
  { value: "7+", label: "Event Categories" },
  { value: "50+", label: "Unique Designs" },
  { value: "24h", label: "Average Delivery" },
];

export function Stats() {
  return (
    <section className="py-16 bg-cream border-y border-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-accent font-heading">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base text-text-muted mt-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
