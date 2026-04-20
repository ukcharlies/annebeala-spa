"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/packages", label: "Packages" },
  { href: "/locations", label: "Locations" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-brand-olive/30 bg-brand-ivory/95 backdrop-blur">
      <div className="section-shell flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3 text-brand-charcoal">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border border-brand-olive/40">
            <Image
              src="/PHOTO-2026-03-01-11-52-35.jpg"
              alt="Annebeala Spa logo"
              fill
              priority
              sizes="48px"
              className="object-cover object-top"
            />
          </div>
          <div className="leading-tight">
            <p className="text-lg font-semibold">Annebeala Spa</p>
            <p className="text-[0.62rem] uppercase tracking-[0.24em] text-brand-olive">
              Beauty & Wellness
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-md border border-brand-olive/40 px-3 py-2 text-sm text-brand-charcoal md:hidden"
          aria-label="Toggle navigation menu"
        >
          Menu
        </button>

        <nav className="hidden items-center gap-6 text-sm uppercase tracking-wide text-brand-charcoal md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-brand-olive"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/booking"
            className="rounded-full bg-brand-forest px-5 py-2 text-xs font-semibold text-brand-ivory transition hover:bg-brand-sage hover:text-brand-charcoal"
          >
            Book Now
          </Link>
        </nav>
      </div>

      {open ? (
        <nav className="section-shell border-t border-brand-olive/40 pb-4 md:hidden">
          <ul className="flex flex-col gap-3 pt-4 text-sm uppercase tracking-wide text-brand-charcoal">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/booking"
                onClick={() => setOpen(false)}
                className="inline-flex rounded-full bg-brand-forest px-5 py-2 text-xs font-semibold text-brand-ivory"
              >
                Book Now
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
