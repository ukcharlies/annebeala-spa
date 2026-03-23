import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { packageMenu } from "@/lib/content";

export const metadata: Metadata = {
  title: "Spa Packages in Lagos | Annebeala Spa",
  description:
    "Birthday, couples, friendship, and individual spa packages with full pricing at Annebeala Spa Lagos.",
  alternates: {
    canonical: "/packages",
  },
};

export default function PackagesPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="section-shell pt-10">
        <div className="rounded-3xl border border-brand-olive/30 bg-brand-charcoal p-8 text-brand-ivory md:p-12">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">
            Spa Packages
          </p>
          <h1 className="mt-3 max-w-4xl text-5xl leading-tight md:text-6xl">
            Celebrate, Bond, and Glow — Pick Your Package
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-brand-ivory/80">
            Whether it is your birthday, a date, a girls&apos; day out, or a solo
            reset — we have a package that fits the occasion and your budget.
          </p>
        </div>
      </section>

      {/* ── Quick Nav ── */}
      <section className="section-shell mt-10">
        <div className="flex flex-wrap gap-3">
          {packageMenu.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="rounded-full border border-brand-olive/40 bg-brand-ivory px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-charcoal transition hover:border-brand-forest hover:bg-brand-forest hover:text-brand-ivory"
            >
              {cat.title}
            </a>
          ))}
        </div>
      </section>

      {/* ── Package Categories ── */}
      <section className="section-shell mt-12 space-y-20">
        {packageMenu.map((category) => (
          <div key={category.id} id={category.id} className="scroll-mt-24">
            {/* Category header */}
            <div className="grid items-center gap-6 lg:grid-cols-[1fr,0.85fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-brand-olive">
                  {category.id.replace(/-/g, " ")} package
                </p>
                <h2 className="mt-2 text-4xl text-brand-charcoal md:text-5xl">
                  {category.title}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-brand-charcoal/75">
                  {category.tagline}
                </p>
              </div>
              <div className="relative h-56 overflow-hidden rounded-2xl border border-brand-olive/25 lg:h-64">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Package cards */}
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {category.packages.map((pkg) => (
                <article
                  key={pkg.name}
                  className="flex flex-col overflow-hidden rounded-2xl border border-brand-olive/25 bg-brand-ivory shadow-sm"
                >
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-2xl text-brand-charcoal">{pkg.name}</h3>

                    <ul className="mt-4 flex-1 space-y-2">
                      {pkg.includes.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-brand-charcoal/80"
                        >
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-forest" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex items-center justify-between border-t border-brand-olive/20 pt-4">
                      <span className="text-2xl font-semibold text-brand-charcoal">
                        {pkg.price}
                      </span>
                      <Link
                        href="/booking"
                        className="rounded-full bg-brand-forest px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-wide text-brand-ivory transition hover:bg-brand-sage hover:text-brand-charcoal"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── Custom Package CTA ── */}
      <section className="section-shell mt-14 pb-2">
        <div className="rounded-3xl border border-brand-olive/25 bg-brand-charcoal p-8 text-brand-ivory md:p-10">
          <h2 className="text-4xl">Need a Custom Package?</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-brand-ivory/80">
            Planning a bridal prep, corporate wellness day, or a unique celebration?
            Our team can create a treatment combination that matches your goals and
            budget.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-secondary-dark">
              Request Custom Package
            </Link>
            <Link href="/booking" className="btn-primary">
              Start Booking
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
