import { Link } from "react-router-dom";
import {
  Instagram, Facebook, Linkedin, Twitter,
  Mail, MapPin, Phone, Clock,
} from "lucide-react";

// ── NOBTY SVG wordmark — white, transparent bg ────────────────────
function NobtyWordmark() {
  return (
    <svg
      viewBox="0 0 220 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-auto"
      aria-label="NOBTY"
    >
      {/* N */}
      <text x="0" y="42" fontSize="48" fontWeight="800" fontFamily="'Arial Black', Arial, sans-serif" fill="white" letterSpacing="-1">N</text>
      {/* Clock circle replacing O */}
      <circle cx="67" cy="24" r="20" stroke="white" strokeWidth="4" fill="none" />
      {/* Clock tick marks */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
        const r = deg * Math.PI / 180;
        const isMajor = i % 3 === 0;
        const inner = isMajor ? 13 : 15;
        const outer = 17;
        return (
          <line
            key={deg}
            x1={67 + inner * Math.sin(r)}
            y1={24 - inner * Math.cos(r)}
            x2={67 + outer * Math.sin(r)}
            y2={24 - outer * Math.cos(r)}
            stroke="white"
            strokeWidth={isMajor ? 2.5 : 1.5}
            strokeLinecap="round"
          />
        );
      })}
      {/* Hour hand ~10 o'clock */}
      <line x1="67" y1="24" x2="58" y2="15" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      {/* Minute hand ~2 o'clock */}
      <line x1="67" y1="24" x2="76" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" />
      {/* Center dot */}
      <circle cx="67" cy="24" r="2" fill="white" />
      {/* BTY */}
      <text x="92" y="42" fontSize="48" fontWeight="800" fontFamily="'Arial Black', Arial, sans-serif" fill="white" letterSpacing="-1">BTY</text>
    </svg>
  );
}

const sections = [
  {
    title: "Company",
    links: [
      { name: "Home", to: "/" },
      { name: "Businesses", to: "/businesses" },
      { name: "About", to: "/about" },
      { name: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Terms & Conditions", to: "/terms" },
      { name: "Privacy Policy", to: "/privacy" },
      { name: "Cookie Policy", to: "/cookies" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", to: "/help" },
      { name: "Report an Issue", to: "/contact" },
      { name: "Business Portal", to: "/dashboard" },
    ],
  },
];

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

const contactInfo = [
  { icon: Mail, text: "support@nobty.com" },
  { icon: Phone, text: "+212 600 000 000" },
  { icon: MapPin, text: "Casablanca, Morocco" },
  { icon: Clock, text: "Mon–Fri, 9am–6pm" },
];

export default function Footer() {
  return (
    <footer
      className="text-white"
      style={{ background: "linear-gradient(135deg, #0a4abf 0%, #0939a0 55%, #072d80 100%)" }}
    >
      <div className="h-px w-full bg-white/10" />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex w-full flex-col gap-12 lg:flex-row lg:gap-16">

          {/* Left col */}
          <div className="flex w-full max-w-xs flex-col gap-5 lg:shrink-0">
            <Link to="/" className="inline-block">
              <NobtyWordmark />
            </Link>

            <p className="text-[13.5px] leading-relaxed text-white/65">
              Skip the queue. Book smarter. Nobty connects you with local
              businesses so you can manage appointments without the wait.
            </p>

            <ul className="space-y-2.5">
              {contactInfo.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5 text-[13px] text-white/55">
                  <Icon size={13} strokeWidth={1.6} className="shrink-0 text-white/40" />
                  {text}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/55 transition hover:border-white/40 hover:bg-white/20 hover:text-white"
                >
                  <Icon size={15} strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid w-full grid-cols-2 gap-8 sm:grid-cols-3 lg:gap-12">
            {sections.map((section) => (
              <div key={section.title}>
                <h4 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-white/35">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.to}
                        className="text-[13.5px] text-white/60 transition hover:text-white"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-[12px] text-white/35">
            © {new Date().getFullYear()} Nobty. All rights reserved.
          </p>
          <div className="flex gap-5">
            {[
              { name: "Terms", to: "/terms" },
              { name: "Privacy", to: "/privacy" },
              { name: "Cookies", to: "/cookies" },
            ].map((l) => (
              <Link
                key={l.name}
                to={l.to}
                className="text-[12px] text-white/35 transition hover:text-white/65"
              >
                {l.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}