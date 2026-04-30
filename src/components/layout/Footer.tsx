import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  services: [
    { label: "Wedding Invitations", href: "/designs/wedding" },
    { label: "Engagement Invitations", href: "/designs/engagement" },
    { label: "Birthday Invitations", href: "/designs/birthday" },
    { label: "Graduation Invitations", href: "/designs/graduation" },
    { label: "Custom Design", href: "/order" },
  ],
  company: [
    { label: "About Us", href: "/#about" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/#contact" },
  ],
};

export function Footer() {
  return (
    <footer className="gradient-dark text-text-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Image
              src="/images/logo.png"
              alt="Invitea"
              width={160}
              height={55}
              className="h-14 w-auto mb-4 brightness-150"
            />
            <p className="text-text-muted text-sm leading-relaxed mt-4">
              Elegant digital invitations crafted with care. Share your special
              moments beautifully through WhatsApp and beyond.
            </p>
            <div className="flex gap-4 mt-6">
              <SocialLink href="https://instagram.com" label="Instagram">
                <InstagramIcon />
              </SocialLink>
              <SocialLink href="https://twitter.com" label="Twitter">
                <TwitterIcon />
              </SocialLink>
              <SocialLink href="mailto:hello@invitea.com" label="Email">
                <Mail size={18} />
              </SocialLink>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-accent">
              Our Designs
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-accent">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-accent">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-text-muted">
                <Mail size={16} className="mt-0.5 text-accent shrink-0" />
                hello@invitea.com
              </li>
              <li className="flex items-start gap-3 text-sm text-text-muted">
                <Phone size={16} className="mt-0.5 text-accent shrink-0" />
                +966 50 000 0000
              </li>
              <li className="flex items-start gap-3 text-sm text-text-muted">
                <MapPin size={16} className="mt-0.5 text-accent shrink-0" />
                Saudi Arabia
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-text-muted text-sm">
            All Rights Reserved - &copy;INVITEA. {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
    >
      {children}
    </a>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}
