import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CoverCraft AI — Tailored cover letters in 20 seconds",
  description:
    "Generate a tailored, ATS-friendly cover letter from any job description in under 20 seconds. Powered by DeepSeek.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gradient-to-b from-violet-50 to-violet-100/40">
        {children}
      </body>
    </html>
  );
}
