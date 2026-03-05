import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Annebeala Spa, our wellness philosophy, and our commitment to premium client care.",
};

export default function AboutPage() {
  return (
    <section className="section-shell pt-16">
      <div className="glass-card p-8 md:p-12">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-olive">About Annebeala Spa</p>
        <h1 className="mt-4 text-5xl text-brand-charcoal">Luxury Wellness, Crafted with Intention</h1>
        <div className="gold-divider mt-6" />
        <p className="mt-6 max-w-3xl text-base leading-7 text-brand-charcoal/80">
          Annebeala Spa was founded to create an elevated yet welcoming sanctuary where people can
          recover from stress and invest in whole-body wellness. Our treatments combine proven
          therapeutic methods with a hospitality standard that makes every visit feel personal.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <article className="rounded-xl border border-brand-champagne bg-white/70 p-5">
            <h2 className="text-2xl text-brand-charcoal">Our Mission</h2>
            <p className="mt-3 text-sm text-brand-charcoal/75">
              Deliver measurable relaxation and skin-health results in a calm, luxurious setting.
            </p>
          </article>
          <article className="rounded-xl border border-brand-champagne bg-white/70 p-5">
            <h2 className="text-2xl text-brand-charcoal">Our Standard</h2>
            <p className="mt-3 text-sm text-brand-charcoal/75">
              Professional therapists, strict hygiene, and service consistency across every treatment.
            </p>
          </article>
          <article className="rounded-xl border border-brand-champagne bg-white/70 p-5">
            <h2 className="text-2xl text-brand-charcoal">Our Promise</h2>
            <p className="mt-3 text-sm text-brand-charcoal/75">
              Every guest leaves more balanced, confident, and prepared for daily life.
            </p>
          </article>
        </div>

        <Link
          href="/booking"
          className="btn-primary mt-10"
        >
          Start Your Wellness Plan
        </Link>
      </div>
    </section>
  );
}
