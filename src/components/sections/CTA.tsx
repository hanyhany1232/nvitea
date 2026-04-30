"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 sm:py-28 gradient-dark relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-text-light leading-tight">
            Where Your Idea Becomes{" "}
            <span className="text-accent">An Invitation</span>
          </h2>
          <p className="mt-6 text-text-muted text-lg max-w-2xl mx-auto">
            Let&apos;s craft something that carries meaning, reflects your
            identity, and leaves a lasting impression on your guests.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/order"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white font-medium rounded-full hover:bg-accent-dark transition-all duration-200 text-lg shadow-lg shadow-accent/20"
            >
              Start Your Journey
              <ArrowRight size={20} />
            </Link>
            <a
              href="https://wa.me/966500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 glass-card text-text-light font-medium rounded-full hover:bg-white/10 transition-all duration-200 text-lg"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
