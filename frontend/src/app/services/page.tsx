import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore massage therapy, facials, body treatments, and wellness rituals at Annebeala Spa.",
};

export default function ServicesPage() {
  return (
    <section className="section-shell pt-16">
      <p className="text-xs uppercase tracking-[0.2em] text-brand-olive">Spa Services</p>
      <h1 className="mt-4 text-5xl text-brand-charcoal">Treatment Menu Built for Results</h1>
      <div className="gold-divider mt-6" />

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article key={service.title} className="glass-card p-6">
            <h2 className="text-2xl text-brand-charcoal">{service.title}</h2>
            <p className="mt-3 text-sm leading-6 text-brand-charcoal/75">{service.description}</p>
          </article>
        ))}
      </div>

      <Link
        href="/booking"
        className="btn-primary mt-10"
      >
        Book a Service
      </Link>
    </section>
  );
}
