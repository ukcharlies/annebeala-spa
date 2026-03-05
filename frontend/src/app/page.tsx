import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { packages, reviews, services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Luxury spa and wellness experiences in Lagos with massage, facials, and restorative rituals.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Spa",
  name: "Annebeala Spa",
  image: "https://annebealaspa.com/og-image.jpg",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lagos",
    addressCountry: "NG",
  },
  url: "https://annebealaspa.com",
  telephone: "+2348000000000",
  sameAs: ["https://www.instagram.com/annebeala_spa?igsh=MW1icHh1dnUxOGVtYQ=="],
  priceRange: "$$",
};

export default function Home() {
  return (
    <>
      <section className="section-shell pt-16">
        <div className="overflow-hidden rounded-3xl border border-brand-olive/35 bg-brand-charcoal p-8 md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-[1.4fr,0.6fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-sage">Lagos Luxury Wellness</p>
              <h1 className="mt-4 max-w-3xl text-5xl leading-tight text-brand-ivory md:text-6xl">
                A Premium Spa Experience Designed Around Calm, Care, and Results.
              </h1>
              <div className="gold-divider mt-6" />
              <p className="mt-6 max-w-2xl text-base text-brand-ivory/80">
                Annebeala Spa blends therapeutic treatments with elegant ambience to help you
                recharge, glow, and return to your routine restored.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/booking"
                  className="rounded-full bg-brand-forest px-6 py-3 text-xs font-semibold uppercase tracking-wide text-brand-ivory transition hover:bg-brand-sage hover:text-brand-charcoal"
                >
                  Book a Session
                </Link>
                <Link
                  href="/services"
                  className="rounded-full border border-brand-sage/70 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-brand-ivory"
                >
                  Explore Services
                </Link>
              </div>
            </div>
            <div className="mx-auto w-full max-w-56">
              <div className="rounded-2xl border border-brand-sage/50 bg-brand-forest/90 p-3 shadow-lg">
                <div className="relative h-60 overflow-hidden rounded-xl">
                  <Image
                    src="/PHOTO-2026-03-01-11-52-35.jpg"
                    alt="Annebeala Spa brand logo"
                    fill
                    priority
                    sizes="224px"
                    className="object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell mt-14 grid gap-6 md:grid-cols-3">
        {services.slice(0, 3).map((service) => (
          <article key={service.title} className="glass-card p-6">
            <h2 className="text-2xl text-brand-charcoal">{service.title}</h2>
            <p className="mt-3 text-sm text-brand-charcoal/75">{service.description}</p>
          </article>
        ))}
      </section>

      <section className="section-shell mt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-olive">Curated Packages</p>
            <h2 className="mt-3 text-4xl text-brand-charcoal">Wellness Plans That Sell Themselves</h2>
          </div>
          <Link href="/packages" className="text-sm uppercase tracking-wide text-brand-olive underline">
            View all
          </Link>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {packages.map((pack) => (
            <article key={pack.name} className="glass-card p-6">
              <h3 className="text-2xl text-brand-charcoal">{pack.name}</h3>
              <p className="mt-2 text-xs uppercase tracking-wider text-brand-olive">{pack.duration}</p>
              <p className="mt-3 text-sm text-brand-charcoal/75">{pack.includes}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell mt-14">
        <div className="glass-card p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-olive">Client Love</p>
          <h2 className="mt-3 text-4xl text-brand-charcoal">Trusted by Returning Guests</h2>
          <p className="mt-4 max-w-3xl text-base text-brand-charcoal/80">“{reviews[0].quote}”</p>
          <p className="mt-2 text-sm uppercase tracking-wide text-brand-olive">{reviews[0].name}</p>
          <Link href="/reviews" className="mt-5 inline-block text-sm text-brand-charcoal underline">
            Read more reviews
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
