import type { Metadata } from "next";
import Link from "next/link";
import { packages } from "@/lib/content";

export const metadata: Metadata = {
  title: "Packages",
  description: "Discover value-packed wellness bundles and signature spa experiences.",
};

export default function PackagesPage() {
  return (
    <section className="section-shell pt-16">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-olive">Spa Packages</p>
      <h1 className="mt-4 text-5xl text-brand-charcoal">Curated Rituals for Deeper Restoration</h1>
      <div className="gold-divider mt-6" />

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {packages.map((pack) => (
          <article key={pack.name} className="glass-card p-6">
            <h2 className="text-3xl text-brand-charcoal">{pack.name}</h2>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-brand-olive">{pack.duration}</p>
            <p className="mt-4 text-sm text-brand-charcoal/75">{pack.includes}</p>
          </article>
        ))}
      </div>

      <Link
        href="/contact"
        className="btn-secondary mt-10"
      >
        Request Custom Package
      </Link>
    </section>
  );
}
