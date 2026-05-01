"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { featuredDesigns } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import { DesignCard } from "@/components/ui/DesignCard";

export function FeaturedDesigns() {
  return (
    <section className="py-20 sm:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12"
        >
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
              Featured Designs
            </h2>
            <p className="mt-4 text-text-muted max-w-xl text-lg">
              Handpicked designs that our clients love the most.
            </p>
          </div>
          <Link
            href="/designs"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-accent font-medium hover:gap-3 transition-all"
          >
            View All Designs
            <ArrowRight size={18} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredDesigns.slice(0, 6).map((design, index) => (
            <motion.div
              key={design.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <DesignCard design={design} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
