"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { categories } from "@/lib/data";
import { ArrowRight } from "lucide-react";

export function Categories() {
  return (
    <section id="categories" className="py-20 sm:py-28 gradient-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-text-light">
            Invitations For Every Occasion
          </h2>
          <p className="mt-4 text-text-muted max-w-2xl mx-auto text-lg">
            From intimate gatherings to grand celebrations, we have the perfect
            digital invitation for your event.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/designs/${category.id}`}
                className="block glass-card rounded-2xl p-6 sm:p-8 hover:bg-white/12 transition-all duration-300 group h-full"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-heading text-lg sm:text-xl font-semibold text-text-light group-hover:text-accent transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-text-muted mt-1">
                  {category.nameAr}
                </p>
                <p className="text-sm text-text-muted mt-3 hidden sm:block">
                  {category.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-accent text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
