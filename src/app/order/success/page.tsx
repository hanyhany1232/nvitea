"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Home, Share2 } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="pt-20 sm:pt-24">
      <section className="min-h-[70vh] flex items-center justify-center bg-cream py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-8">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">
            Payment Successful!
          </h1>
          <p className="text-text-muted text-lg mb-2">
            Your payment has been confirmed. We&apos;ll start working on your
            invitation right away.
          </p>
          {orderId && (
            <p className="text-sm text-text-muted mb-8">
              Order ID: <span className="font-mono text-primary">{orderId}</span>
            </p>
          )}
          <p className="text-text-muted mb-8">
            You&apos;ll receive your digital invitation via WhatsApp and email
            within 24 hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-full hover:bg-accent-dark transition-colors"
            >
              <Home size={18} />
              Back to Home
            </Link>
            <a
              href={`https://wa.me/966500000000?text=Hi! I just placed order ${orderId || ""}. Looking forward to my invitation!`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              <Share2 size={18} />
              Contact on WhatsApp
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
