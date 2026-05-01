"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/auth/login?message=Check your email to confirm your account");
  };

  return (
    <div className="pt-20 sm:pt-24">
      <section className="gradient-dark py-12 sm:py-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-3xl sm:text-4xl font-bold text-text-light"
          >
            Create Account
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-text-muted text-lg"
          >
            Join Invitea to create beautiful invitations
          </motion.p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-cream">
        <div className="max-w-md mx-auto px-4">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6 bg-white rounded-2xl p-8 shadow-sm border border-accent/10"
          >
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                <User size={16} className="inline mr-2" />
                Full Name
              </label>
              <input
                name="fullName"
                type="text"
                required
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl bg-cream border border-accent/10 text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                <Mail size={16} className="inline mr-2" />
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl bg-cream border border-accent/10 text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                <Lock size={16} className="inline mr-2" />
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-3 rounded-xl bg-cream border border-accent/10 text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white font-medium rounded-full hover:bg-accent-dark transition-colors disabled:opacity-50"
            >
              <UserPlus size={18} />
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-text-muted">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-accent hover:underline">
                Sign In
              </Link>
            </p>
          </motion.form>
        </div>
      </section>
    </div>
  );
}
