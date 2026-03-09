import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { packages } from "@/lib/content";

export const metadata: Metadata = {
  title: "Packages",
  description: "Discover value-packed wellness bundles and signature spa experiences.",
};

export default function PackagesPage() {
  return (
    <>
      <section className="section-shell pt-10">
        <div className="rounded-3xl border border-brand-olive/30 bg-brand-charcoal p-8 text-brand-ivory md:p-12">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-sage">Spa Packages</p>
          <h1 className="mt-3 max-w-4xl text-5xl leading-tight md:text-6xl">Curated Rituals for Deeper Restoration</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-brand-ivory/80">
            Choose from package plans designed for quick reset, glow treatment, or complete luxury
            retreat sessions.
          </p>
        </div>
      </section>

      <section className="section-shell mt-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {packages.map((pack) => (
            <article key={pack.name} className="overflow-hidden rounded-3xl border border-brand-olive/25 bg-brand-ivory shadow-sm">
              <div className="relative h-56">
                <Image src={pack.image} alt={pack.name} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
              </div>
              <div className="p-7">
                <h2 className="text-4xl text-brand-charcoal">{pack.name}</h2>
                <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-brand-olive">
                  <span>{pack.duration}</span>
                  <span>{pack.price}</span>
                </div>

                <ul className="mt-5 space-y-2 text-sm text-brand-charcoal/80">
                  {pack.includes.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>

                <p className="mt-5 text-xs uppercase tracking-[0.12em] text-brand-olive">Ideal for: {pack.idealFor}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell mt-14 pb-2">
        <div className="rounded-3xl border border-brand-olive/25 bg-brand-charcoal p-8 text-brand-ivory md:p-10">
          <h2 className="text-4xl">Need a Custom Package?</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-brand-ivory/80">
            If you are planning a bridal prep, birthday, couples session, or corporate wellness day,
            our team can create a treatment combination that matches your goals and budget.
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
