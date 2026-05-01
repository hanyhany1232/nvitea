"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Save, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/actions/auth";

interface Profile {
  full_name: string;
  phone: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({ full_name: "", phone: "" });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth/login";
        return;
      }

      setEmail(user.email || "");

      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          phone: data.phone || "",
        });
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
      })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream pt-20">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-24 min-h-screen bg-cream">
      <section className="gradient-dark py-8 sm:py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-light">
            Your Profile
          </h1>
          <p className="text-text-muted mt-1">
            Update your personal information
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-accent/10 shadow-sm p-6 sm:p-8 space-y-6"
          >
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                <User size={16} className="text-accent" />
                Full Name
              </label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) =>
                  setProfile({ ...profile, full_name: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-accent/20 bg-cream/50 text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                <Mail size={16} className="text-accent" />
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-accent/10 bg-gray-50 text-text-muted cursor-not-allowed"
              />
              <p className="text-xs text-text-muted mt-1">
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                <Phone size={16} className="text-accent" />
                Phone Number
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-accent/20 bg-cream/50 text-primary focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                placeholder="+966 5XX XXX XXXX"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3">
                {error}
              </p>
            )}

            {saved && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-xl p-3"
              >
                <CheckCircle size={16} />
                Profile updated successfully
              </motion.p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-accent text-white font-medium rounded-full hover:bg-accent-dark transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </motion.form>

          <div className="bg-white rounded-2xl border border-accent/10 shadow-sm p-6 sm:p-8 mt-4">
            <form action={signOut}>
              <button
                type="submit"
                className="w-full py-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
