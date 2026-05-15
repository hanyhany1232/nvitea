"use client";

import { useState } from "react";
import jsPDF from "jspdf";

type Tone = "professional" | "friendly" | "enthusiastic";
type Language = "english" | "french";

const FREE_LIMIT = 1;
const STORAGE_KEY = "covercraft_uses";
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

function getUses(): number {
  if (typeof window === "undefined") return 0;
  try {
    return Number(window.localStorage.getItem(STORAGE_KEY) ?? "0");
  } catch {
    return 0;
  }
}

function bumpUses(): number {
  const next = getUses() + 1;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(next));
  } catch {
    // ignore
  }
  return next;
}

function downloadPDF(text: string, filename: string) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const margin = 56;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const usable = pageWidth - margin * 2;
  doc.setFont("times", "normal");
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(text, usable);
  let y = margin;
  const lineHeight = 16;
  lines.forEach((line: string) => {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  });
  doc.save(filename);
}

function downloadTXT(text: string, filename: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function Header() {
  return (
    <header className="w-full bg-white/80 backdrop-blur border-b border-slate-200/70 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 text-slate-900">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center text-white font-bold">
            C
          </div>
          <span className="font-bold text-lg tracking-tight">
            CoverCraft <span className="text-brand-600">AI</span>
          </span>
        </a>
        <nav className="flex items-center gap-4 text-sm">
          <a
            href="#how"
            className="text-slate-600 hover:text-slate-900 hidden sm:inline"
          >
            How it works
          </a>
          <a
            href="#pricing"
            className="text-slate-600 hover:text-slate-900 hidden sm:inline"
          >
            Pricing
          </a>
          <a href="#generator" className="btn-primary py-2 px-3 text-sm">
            Start free
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section
      id="top"
      className="max-w-6xl mx-auto px-6 pt-16 pb-12 grid md:grid-cols-2 gap-12 items-center"
    >
      <div>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold uppercase tracking-wide">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
          Powered by DeepSeek
        </span>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Land more interviews with cover letters that
          <span className="text-brand-600"> actually fit the job.</span>
        </h1>
        <p className="mt-5 text-slate-600 text-lg leading-relaxed">
          Paste the job description, paste your CV, and get a tailored,
          ATS-friendly cover letter in under 20 seconds. No fluff. No &ldquo;I
          am writing to express my interest.&rdquo; Just letters that get read.
        </p>
        <div className="mt-7 flex items-center gap-3 flex-wrap">
          <a href="#generator" className="btn-primary">
            Generate my cover letter
          </a>
          <a href="#how" className="btn-secondary">
            See how it works
          </a>
        </div>
        <div className="mt-6 flex items-center gap-6 text-sm text-slate-500 flex-wrap">
          <div>✓ First letter free</div>
          <div>✓ No signup needed</div>
          <div>✓ PDF + TXT export</div>
        </div>
      </div>
      <div className="relative">
        <div className="card p-6 rotate-1">
          <div className="text-xs text-slate-400 uppercase tracking-wide mb-3">
            Cover Letter • Software Engineer
          </div>
          <div className="space-y-2 text-sm text-slate-700 leading-relaxed">
            <p>Dear Hiring Manager,</p>
            <p>
              I noticed your team is rebuilding the checkout flow on Stripe —
              that&rsquo;s exactly the kind of work I shipped last year at
              Atlas, cutting our payment failure rate by 38%…
            </p>
            <p className="text-slate-400">[generated in 18 seconds]</p>
          </div>
        </div>
        <div className="absolute -bottom-6 -left-6 card p-4 -rotate-2 hidden md:block">
          <div className="text-xs text-slate-500">Match score</div>
          <div className="text-2xl font-bold text-emerald-600">94%</div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "1",
      t: "Paste the job description",
      d: "Copy from LinkedIn, Indeed, or anywhere. We extract the role, company, and what they want.",
    },
    {
      n: "2",
      t: "Paste your CV",
      d: "Plain text from your résumé. We pick the most relevant experience and skills.",
    },
    {
      n: "3",
      t: "Get a tailored letter",
      d: "Edit if you want, download as PDF or copy to clipboard. Done.",
    },
  ];
  return (
    <section id="how" className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-slate-900 text-center">
        Three steps. Twenty seconds.
      </h2>
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {steps.map((s) => (
          <div key={s.n} className="card p-6">
            <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 grid place-items-center font-bold">
              {s.n}
            </div>
            <h3 className="mt-4 font-semibold text-slate-900">{s.t}</h3>
            <p className="mt-2 text-slate-600 text-sm leading-relaxed">
              {s.d}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Generator() {
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [language, setLanguage] = useState<Language>("english");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uses, setUses] = useState<number>(() =>
    typeof window === "undefined" ? 0 : getUses(),
  );

  const limitReached = uses >= FREE_LIMIT;
  const canSubmit =
    !loading &&
    jobDescription.trim().length > 30 &&
    resume.trim().length > 30;

  async function generate() {
    setError("");
    setOutput("");
    if (DEMO_MODE) {
      setError(
        "This is a public demo — the generator is disabled. Deploy your own copy on Vercel with your DeepSeek API key to enable generation. See the GitHub README for the one-click deploy link.",
      );
      return;
    }
    if (limitReached) {
      setError(
        `You've used your ${FREE_LIMIT} free generation. Upgrade below for unlimited letters.`,
      );
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_description: jobDescription,
          resume,
          tone,
          language,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          detail?: string;
        };
        throw new Error(data.detail || `Request failed (${res.status})`);
      }
      const data = (await res.json()) as { cover_letter?: string };
      setOutput(data.cover_letter || "");
      const next = bumpUses();
      setUses(next);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const remaining = Math.max(FREE_LIMIT - uses, 0);

  return (
    <section id="generator" className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">
          Generate your cover letter
        </h2>
        <p className="mt-2 text-slate-600">
          {remaining > 0
            ? `You have ${remaining} free generation left.`
            : "You've used your free generation. Upgrade for unlimited."}
        </p>
      </div>

      <div className="mt-10 grid lg:grid-cols-2 gap-6">
        <div className="card p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Job description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={9}
              placeholder="Paste the full job posting here — title, company, responsibilities, requirements…"
              className="w-full rounded-lg border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none p-3 text-sm font-mono leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Your CV / résumé (plain text)
            </label>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              rows={9}
              placeholder="Paste your résumé — experience, skills, education, projects…"
              className="w-full rounded-lg border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none p-3 text-sm font-mono leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                className="w-full rounded-lg border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none p-2.5 text-sm bg-white"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="enthusiastic">Enthusiastic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full rounded-lg border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none p-2.5 text-sm bg-white"
              >
                <option value="english">English</option>
                <option value="french">French</option>
              </select>
            </div>
          </div>

          <button
            onClick={generate}
            disabled={!canSubmit}
            className="btn-primary w-full"
          >
            {loading ? "Generating…" : "Generate cover letter"}
          </button>

          {error && (
            <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-3">
              {error}
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
            <h3 className="font-semibold text-slate-900">Your cover letter</h3>
            {output && (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => navigator.clipboard.writeText(output)}
                  className="btn-secondary py-1.5 px-3 text-xs"
                >
                  Copy
                </button>
                <button
                  onClick={() => downloadTXT(output, "cover-letter.txt")}
                  className="btn-secondary py-1.5 px-3 text-xs"
                >
                  .txt
                </button>
                <button
                  onClick={() => downloadPDF(output, "cover-letter.pdf")}
                  className="btn-secondary py-1.5 px-3 text-xs"
                >
                  PDF
                </button>
              </div>
            )}
          </div>
          <textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            rows={22}
            placeholder={
              loading
                ? "Crafting your letter…"
                : "Your generated letter will appear here. You can edit it before downloading."
            }
            className="w-full rounded-lg border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none p-3 text-sm leading-relaxed font-serif"
          />
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      desc: "Try it once.",
      features: [
        "1 cover letter",
        "PDF & TXT export",
        "All tones & languages",
      ],
      cta: "Start free",
      href: "#generator",
      featured: false,
    },
    {
      name: "Pro",
      price: "$9",
      sub: "/ month",
      desc: "For active job seekers.",
      features: [
        "Unlimited cover letters",
        "Match score & keyword tips",
        "PDF, TXT, DOCX export",
        "Priority generation",
      ],
      cta: "Go Pro",
      href: "#",
      featured: true,
    },
    {
      name: "Lifetime",
      price: "$49",
      sub: "one-time",
      desc: "Pay once, keep forever.",
      features: [
        "Everything in Pro",
        "Lifetime access",
        "New features as we ship them",
      ],
      cta: "Get lifetime",
      href: "#",
      featured: false,
    },
  ];
  return (
    <section id="pricing" className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-slate-900 text-center">
        Simple pricing.
      </h2>
      <p className="text-slate-600 text-center mt-2">
        Pay once for the job hunt, not every month forever.
      </p>
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`card p-6 ${
              t.featured ? "ring-2 ring-brand-500 shadow-lg relative" : ""
            }`}
          >
            {t.featured && (
              <div className="absolute -top-3 right-4 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
            )}
            <h3 className="font-semibold text-slate-900">{t.name}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900">
                {t.price}
              </span>
              {t.sub && <span className="text-slate-500 text-sm">{t.sub}</span>}
            </div>
            <p className="mt-1 text-slate-600 text-sm">{t.desc}</p>
            <ul className="mt-5 space-y-2 text-sm text-slate-700">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href={t.href}
              className={`mt-6 block text-center ${
                t.featured ? "btn-primary" : "btn-secondary"
              }`}
            >
              {t.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200/70 bg-white/60 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <div>© {new Date().getFullYear()} CoverCraft AI</div>
        <div className="flex gap-5">
          <a href="#how" className="hover:text-slate-800">
            How it works
          </a>
          <a href="#pricing" className="hover:text-slate-800">
            Pricing
          </a>
          <a href="mailto:hello@covercraft.ai" className="hover:text-slate-800">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Generator />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
