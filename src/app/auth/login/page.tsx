"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

function LoginForm() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
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

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
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
            Welcome Back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-text-muted text-lg"
          >
            Sign in to manage your invitations
          </motion.p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-cream">
        <div className="max-w-md mx-auto px-4">
          {message && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
              {message}
            </div>
          )}

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
                placeholder="Your password"
                className="w-full px-4 py-3 rounded-xl bg-cream border border-accent/10 text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white font-medium rounded-full hover:bg-accent-dark transition-colors disabled:opacity-50"
            >
              <LogIn size={18} />
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-center text-sm text-text-muted">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-accent hover:underline">
                Sign Up
              </Link>
            </p>
          </motion.form>
        </div>
      </section>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
